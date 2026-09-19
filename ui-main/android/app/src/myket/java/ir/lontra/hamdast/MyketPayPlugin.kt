package ir.lontra.hamdast

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import ir.myket.billingclient.IabHelper
import ir.myket.billingclient.util.IabResult
import ir.myket.billingclient.util.Purchase
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Capacitor bridge around Myket IabHelper (in-app billing).
 *
 * Compiled only into the `myket` product flavor. The web layer sees the same
 * JSON shape as BazaarPay so the JS purchase flow can stay store-agnostic.
 */
@CapacitorPlugin(name = "MyketPay")
class MyketPayPlugin : Plugin() {

    private companion object {
        const val TAG = "MyketPay"
        const val MYKET_PACKAGE = "ir.mservices.market"
        const val CONNECT_TIMEOUT_MS = 20_000L
    }

    private var helper: IabHelper? = null
    private var setupDone = false
    private val purchasesByToken = mutableMapOf<String, Purchase>()

    private fun rsaPublicKey(): String {
        val fromRes = try {
            context.getString(R.string.myket_rsa_public_key).trim()
        } catch (e: Exception) {
            ""
        }
        if (fromRes.isNotEmpty()) return fromRes
        return BuildConfig.IAB_PUBLIC_KEY.trim()
    }

    private fun purchaseToJs(purchase: Purchase): JSObject = JSObject().apply {
        put("orderId", purchase.orderId)
        put("purchaseToken", purchase.token)
        put("payload", purchase.developerPayload)
        put("productId", purchase.sku)
        put("purchaseState", purchase.purchaseState)
        put("purchaseTime", purchase.purchaseTime)
        put("originalJson", purchase.originalJson)
        put("dataSignature", purchase.signature)
    }

    private fun remember(purchase: Purchase) {
        val token = purchase.token
        if (!token.isNullOrEmpty()) {
            purchasesByToken[token] = purchase
        }
    }

    private fun isUserCanceled(result: IabResult): Boolean {
        val code = result.response
        return code == IabHelper.BILLING_RESPONSE_RESULT_USER_CANCELED ||
            code == IabHelper.IABHELPER_USER_CANCELLED
    }

    /** True when the Myket app is installed and can serve billing requests. */
    @PluginMethod
    fun isAvailable(call: PluginCall) {
        val installed = try {
            context.packageManager.getPackageInfo(MYKET_PACKAGE, 0)
            true
        } catch (e: Exception) {
            false
        }

        Log.i(TAG, "isAvailable: $installed")
        call.resolve(JSObject().put("available", installed))
    }

    /** Bind to Myket's billing service. Must succeed before purchasing. */
    @PluginMethod
    fun connect(call: PluginCall) {
        if (setupDone && helper != null) {
            Log.i(TAG, "connect: already bound")
            call.resolve(JSObject().put("connected", true))
            return
        }

        activity.runOnUiThread {
            try {
                helper?.dispose()
            } catch (e: Exception) {
                Log.w(TAG, "dispose previous helper", e)
            }
            helper = null
            setupDone = false

            try {
                val rsaKey = rsaPublicKey()
                Log.i(TAG, "connect: startSetup rsaKeyLen=${rsaKey.length} market=$MYKET_PACKAGE")
                val next = IabHelper(context, rsaKey)
                // Keep IabHelper logs on in release so we can diagnose store issues.
                next.enableDebugLogging(true)
                helper = next

                val settled = AtomicBoolean(false)
                val timeout = Handler(Looper.getMainLooper())
                val timeoutRunnable = Runnable {
                    if (!settled.compareAndSet(false, true)) return@Runnable
                    setupDone = false
                    Log.e(TAG, "connect: timed out after ${CONNECT_TIMEOUT_MS}ms")
                    call.reject("اتصال به مایکت زمان‌بر شد. مایکت را باز کنید و دوباره تلاش کنید.", "CONNECTION_TIMEOUT")
                }
                timeout.postDelayed(timeoutRunnable, CONNECT_TIMEOUT_MS)

                next.startSetup { result ->
                    if (!settled.compareAndSet(false, true)) return@startSetup
                    timeout.removeCallbacks(timeoutRunnable)
                    if (result.isSuccess) {
                        setupDone = true
                        Log.i(TAG, "connect: setup ok ${result.message}")
                        call.resolve(JSObject().put("connected", true))
                    } else {
                        setupDone = false
                        Log.e(TAG, "setup failed: ${result.message}")
                        call.reject(
                            result.message ?: "اتصال به مایکت برقرار نشد",
                            "CONNECTION_FAILED"
                        )
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "connect threw", e)
                call.reject(e.message ?: "خطا در اتصال به مایکت", "CONNECTION_FAILED")
            }
        }
    }

    @PluginMethod
    fun disconnect(call: PluginCall) {
        try {
            helper?.dispose()
        } catch (e: Exception) {
            Log.w(TAG, "disconnect dispose", e)
        }
        helper = null
        setupDone = false
        purchasesByToken.clear()
        call.resolve()
    }

    /**
     * Open Myket's payment screen.
     * @param productId product SKU from the developer panel
     * @param payload   developer payload echoed back (we send "userId:orderId")
     */
    @PluginMethod
    fun purchase(call: PluginCall) {
        val productId = call.getString("productId")
        if (productId.isNullOrEmpty()) {
            call.reject("productId الزامی است", "INVALID_ARGUMENT")
            return
        }

        val payload = call.getString("payload") ?: ""
        val current = helper
        if (current == null || !setupDone) {
            call.reject("به سرویس پرداخت مایکت متصل نیستید", "NOT_CONNECTED")
            return
        }

        activity.runOnUiThread {
            val liveHelper = helper
            if (liveHelper == null) {
                call.reject("سرویس پرداخت آماده نیست", "NOT_CONNECTED")
                return@runOnUiThread
            }

            try {
                Log.i(TAG, "purchase: launch sku=$productId payloadLen=${payload.length}")
                liveHelper.launchPurchaseFlow(activity, productId, { result, purchase ->
                    if (isUserCanceled(result)) {
                        Log.i(TAG, "purchase: canceled")
                        call.resolve(JSObject().put("status", "canceled"))
                        return@launchPurchaseFlow
                    }

                    if (result.isFailure || purchase == null) {
                        Log.e(TAG, "purchase failed: ${result.message}")
                        call.reject(
                            result.message ?: "پرداخت ناموفق بود",
                            "PURCHASE_FAILED"
                        )
                        return@launchPurchaseFlow
                    }

                    remember(purchase)
                    Log.i(TAG, "purchase: success sku=${purchase.sku} tokenLen=${purchase.token?.length ?: 0}")
                    val js = purchaseToJs(purchase)
                    js.put("status", "success")
                    call.resolve(js)
                }, payload)
            } catch (e: Exception) {
                Log.e(TAG, "purchase threw", e)
                call.reject(e.message ?: "صفحه پرداخت مایکت باز نشد", "FLOW_FAILED")
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

        val current = helper
        if (current == null || !setupDone) {
            call.reject("به سرویس پرداخت مایکت متصل نیستید", "NOT_CONNECTED")
            return
        }

        val cached = purchasesByToken[purchaseToken]
        if (cached != null) {
            consumePurchase(call, current, cached)
            return
        }

        try {
            current.queryInventoryAsync(false, null) { result, inventory ->
                if (helper == null) return@queryInventoryAsync
                if (result.isFailure || inventory == null) {
                    call.reject(
                        result.message ?: "خطا در دریافت خریدها",
                        "CONSUME_FAILED"
                    )
                    return@queryInventoryAsync
                }

                @Suppress("UNCHECKED_CAST")
                val purchases = (inventory.allPurchases as? List<Purchase>).orEmpty()
                purchases.forEach { remember(it) }

                val found = purchasesByToken[purchaseToken]
                if (found == null) {
                    call.reject("خرید برای مصرف پیدا نشد", "CONSUME_FAILED")
                    return@queryInventoryAsync
                }
                consumePurchase(call, current, found)
            }
        } catch (e: Exception) {
            Log.e(TAG, "consume query threw", e)
            call.reject(e.message ?: "خطا در مصرف محصول", "CONSUME_FAILED")
        }
    }

    private fun consumePurchase(call: PluginCall, current: IabHelper, purchase: Purchase) {
        try {
            current.consumeAsync(purchase) { consumed, result ->
                if (helper == null) return@consumeAsync
                if (result.isSuccess) {
                    purchasesByToken.remove(consumed?.token)
                    call.resolve(JSObject().put("consumed", true))
                } else {
                    Log.e(TAG, "consume failed: ${result.message}")
                    call.reject(
                        result.message ?: "خطا در مصرف محصول",
                        "CONSUME_FAILED"
                    )
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "consume threw", e)
            call.reject(e.message ?: "خطا در مصرف محصول", "CONSUME_FAILED")
        }
    }

    /**
     * Purchases the user owns but that were never consumed — i.e. paid for but
     * not yet credited on our side. Used to recover interrupted flows.
     */
    @PluginMethod
    fun getPurchasedProducts(call: PluginCall) {
        val current = helper
        if (current == null || !setupDone) {
            call.reject("به سرویس پرداخت مایکت متصل نیستید", "NOT_CONNECTED")
            return
        }

        try {
            current.queryInventoryAsync(false, null) { result, inventory ->
                if (helper == null) return@queryInventoryAsync
                if (result.isFailure || inventory == null) {
                    Log.e(TAG, "query failed: ${result.message}")
                    call.reject(
                        result.message ?: "خطا در دریافت خریدها",
                        "QUERY_FAILED"
                    )
                    return@queryInventoryAsync
                }

                @Suppress("UNCHECKED_CAST")
                val purchases = (inventory.allPurchases as? List<Purchase>).orEmpty()
                val items = JSArray()
                purchases.forEach {
                    remember(it)
                    items.put(purchaseToJs(it))
                }
                call.resolve(JSObject().put("products", items))
            }
        } catch (e: Exception) {
            Log.e(TAG, "query threw", e)
            call.reject(e.message ?: "خطا در دریافت خریدها", "QUERY_FAILED")
        }
    }

    override fun handleOnDestroy() {
        try {
            helper?.dispose()
        } catch (e: Exception) {
            Log.w(TAG, "destroy dispose", e)
        }
        helper = null
        setupDone = false
        purchasesByToken.clear()
        super.handleOnDestroy()
    }
}
