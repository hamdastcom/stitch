package ir.lontra.hamdast

import android.util.Log
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import ir.cafebazaar.poolakey.Connection
import ir.cafebazaar.poolakey.ConnectionState
import ir.cafebazaar.poolakey.Payment
import ir.cafebazaar.poolakey.config.PaymentConfiguration
import ir.cafebazaar.poolakey.config.SecurityCheck
import ir.cafebazaar.poolakey.entity.PurchaseInfo
import ir.cafebazaar.poolakey.request.PurchaseRequest

/**
 * Capacitor bridge around Poolakey (Cafebazaar in-app billing).
 *
 * The web layer only ever sees plain JSON; all Bazaar-specific handling lives
 * here. Nothing in this plugin touches the existing Zibal web flow.
 */
@CapacitorPlugin(name = "BazaarPay")
class BazaarPayPlugin : Plugin() {

    private companion object {
        const val TAG = "BazaarPay"
    }

    private var payment: Payment? = null
    private var paymentConnection: Connection? = null

    private val isConnected: Boolean
        get() = paymentConnection?.getState() == ConnectionState.Connected

    private fun buildPayment(): Payment {
        payment?.let { return it }

        val rsaKey = context.getString(R.string.bazaar_rsa_public_key).trim()

        // With an empty key we fall back to Disable — Bazaar explicitly allows
        // this when the purchase is validated through their REST API, which we
        // always do on our server.
        val securityCheck =
            if (rsaKey.isEmpty()) SecurityCheck.Disable
            else SecurityCheck.Enable(rsaPublicKey = rsaKey)

        return Payment(
            context = context,
            config = PaymentConfiguration(localSecurityCheck = securityCheck)
        ).also { payment = it }
    }

    private fun purchaseInfoToJs(info: PurchaseInfo): JSObject = JSObject().apply {
        put("orderId", info.orderId)
        put("purchaseToken", info.purchaseToken)
        put("payload", info.payload)
        put("productId", info.productId)
        put("purchaseState", info.purchaseState.name)
        put("purchaseTime", info.purchaseTime)
        put("originalJson", info.originalJson)
        put("dataSignature", info.dataSignature)
    }

    /** True when the Bazaar app is installed and can serve billing requests. */
    @PluginMethod
    fun isAvailable(call: PluginCall) {
        val installed = try {
            context.packageManager.getPackageInfo("com.farsitel.bazaar", 0)
            true
        } catch (e: Exception) {
            false
        }

        call.resolve(JSObject().put("available", installed))
    }

    /** Bind to Bazaar's billing service. Must succeed before purchasing. */
    @PluginMethod
    fun connect(call: PluginCall) {
        if (isConnected) {
            call.resolve(JSObject().put("connected", true))
            return
        }

        activity.runOnUiThread {
            try {
                paymentConnection = buildPayment().connect {
                    connectionSucceed {
                        call.resolve(JSObject().put("connected", true))
                    }
                    connectionFailed { throwable ->
                        Log.e(TAG, "connection failed", throwable)
                        call.reject(
                            throwable.message ?: "اتصال به کافه‌بازار برقرار نشد",
                            "CONNECTION_FAILED"
                        )
                    }
                    disconnected {
                        Log.w(TAG, "billing service disconnected")
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "connect threw", e)
                call.reject(e.message ?: "خطا در اتصال به کافه‌بازار", "CONNECTION_FAILED")
            }
        }
    }

    @PluginMethod
    fun disconnect(call: PluginCall) {
        paymentConnection?.disconnect()
        paymentConnection = null
        call.resolve()
    }

    /**
     * Open Bazaar's payment screen.
     * @param productId product id from the developer panel
     * @param payload   opaque string echoed back by Bazaar (we send "userId:orderId")
     * @param subscription true to use subscribeProduct instead of purchaseProduct
     */
    @PluginMethod
    fun purchase(call: PluginCall) {
        val productId = call.getString("productId")
        if (productId.isNullOrEmpty()) {
            call.reject("productId الزامی است", "INVALID_ARGUMENT")
            return
        }

        val payload = call.getString("payload") ?: ""
        val subscription = call.getBoolean("subscription", false) ?: false
        val dynamicPriceToken = call.getString("dynamicPriceToken")

        if (!isConnected) {
            call.reject("به سرویس پرداخت کافه‌بازار متصل نیستید", "NOT_CONNECTED")
            return
        }

        val request = PurchaseRequest(
            productId = productId,
            payload = payload,
            dynamicPriceToken = dynamicPriceToken
        )

        activity.runOnUiThread {
            val currentPayment = payment
            if (currentPayment == null) {
                call.reject("سرویس پرداخت آماده نیست", "NOT_CONNECTED")
                return@runOnUiThread
            }

            val callbacks: ir.cafebazaar.poolakey.callback.PurchaseCallback.() -> Unit = {
                failedToBeginFlow { throwable ->
                    Log.e(TAG, "failed to begin flow", throwable)
                    call.reject(
                        throwable.message ?: "صفحه پرداخت کافه‌بازار باز نشد",
                        "FLOW_FAILED"
                    )
                }
                purchaseSucceed { purchaseInfo ->
                    val result = purchaseInfoToJs(purchaseInfo)
                    result.put("status", "success")
                    call.resolve(result)
                }
                purchaseCanceled {
                    call.resolve(JSObject().put("status", "canceled"))
                }
                purchaseFailed { throwable ->
                    Log.e(TAG, "purchase failed", throwable)
                    call.reject(throwable.message ?: "پرداخت ناموفق بود", "PURCHASE_FAILED")
                }
            }

            if (subscription) {
                currentPayment.subscribeProduct(activity.activityResultRegistry, request, callbacks)
            } else {
                currentPayment.purchaseProduct(activity.activityResultRegistry, request, callbacks)
            }
        }
    }

    /**
     * Consume a purchased product so it can be bought again.
     * Call this ONLY after the server has verified the purchase.
     */
    @PluginMethod
    fun consume(call: PluginCall) {
        val purchaseToken = call.getString("purchaseToken")
        if (purchaseToken.isNullOrEmpty()) {
            call.reject("purchaseToken الزامی است", "INVALID_ARGUMENT")
            return
        }

        val currentPayment = payment
        if (currentPayment == null || !isConnected) {
            call.reject("به سرویس پرداخت کافه‌بازار متصل نیستید", "NOT_CONNECTED")
            return
        }

        currentPayment.consumeProduct(purchaseToken) {
            consumeSucceed {
                call.resolve(JSObject().put("consumed", true))
            }
            consumeFailed { throwable ->
                Log.e(TAG, "consume failed", throwable)
                call.reject(throwable.message ?: "خطا در مصرف محصول", "CONSUME_FAILED")
            }
        }
    }

    /**
     * Purchases the user owns but that were never consumed — i.e. paid for but
     * not yet credited on our side. Used to recover interrupted flows.
     */
    @PluginMethod
    fun getPurchasedProducts(call: PluginCall) {
        queryProducts(call, subscription = false)
    }

    @PluginMethod
    fun getSubscribedProducts(call: PluginCall) {
        queryProducts(call, subscription = true)
    }

    private fun queryProducts(call: PluginCall, subscription: Boolean) {
        val currentPayment = payment
        if (currentPayment == null || !isConnected) {
            call.reject("به سرویس پرداخت کافه‌بازار متصل نیستید", "NOT_CONNECTED")
            return
        }

        val callbacks: ir.cafebazaar.poolakey.callback.PurchaseQueryCallback.() -> Unit = {
            querySucceed { purchasedProducts ->
                val items = JSArray()
                purchasedProducts.forEach { items.put(purchaseInfoToJs(it)) }
                call.resolve(JSObject().put("products", items))
            }
            queryFailed { throwable ->
                Log.e(TAG, "query failed", throwable)
                call.reject(throwable.message ?: "خطا در دریافت خریدها", "QUERY_FAILED")
            }
        }

        if (subscription) {
            currentPayment.getSubscribedProducts(callbacks)
        } else {
            currentPayment.getPurchasedProducts(callbacks)
        }
    }

    override fun handleOnDestroy() {
        paymentConnection?.disconnect()
        paymentConnection = null
        payment = null
        super.handleOnDestroy()
    }
}
