import { registerPlugin, Capacitor } from "@capacitor/core";

import apiClient from "./apiClient";

const BazaarPay = registerPlugin("BazaarPay");

/**
 * True only for the build we ship to Cafebazaar. Set VITE_DISTRIBUTION=bazaar
 * in `.env.bazaar` (see `npm run apk:bazaar`). Every other build — web, direct
 * APK — keeps using the Zibal gateway untouched.
 */
export function isBazaarBuild() {
  return (
    Capacitor.getPlatform() === "android" &&
    import.meta.env.VITE_DISTRIBUTION === "bazaar"
  );
}

/**
 * Periods that have a product registered in the Bazaar panel. Used if the
 * server can't be reached — deliberately excludes yearly, which has no product.
 */
const FALLBACK_PERIODS = ["monthly", "quarterly", "halfYearly"];

/**
 * Billing periods the Bazaar build is allowed to sell. Anything else would
 * fail with "بسته وجود ندارد" on Bazaar's payment screen.
 *
 * @returns {Promise<string[]|null>} null when this isn't a Bazaar build
 */
export async function fetchBazaarPeriods() {
  if (!isBazaarBuild()) return null;

  try {
    const { data, ok } = await apiClient.get("/payment/bazaar/products");
    if (ok && data?.periods?.length) return data.periods;
    if (ok && data?.products?.length) {
      return [...new Set(data.products.map((product) => product.period))];
    }
  } catch (error) {
    console.error("fetchBazaarPeriods failed:", error);
  }

  return FALLBACK_PERIODS;
}

let connectPromise = null;

async function ensureConnected() {
  if (!connectPromise) {
    connectPromise = BazaarPay.connect().catch((error) => {
      connectPromise = null;
      throw error;
    });
  }
  return connectPromise;
}

/**
 * Full purchase round-trip: create order -> Bazaar payment screen -> server
 * verification -> consume.
 *
 * @returns {Promise<{status: 'success'|'canceled'}>}
 * @throws {Error} with a user-displayable Persian message
 */
export async function purchasePlan({ planSlug, period }) {
  const { available } = await BazaarPay.isAvailable();
  if (!available) {
    throw new Error("برنامه کافه‌بازار روی دستگاه شما نصب نیست.");
  }

  await ensureConnected();

  const { data: order, ok: orderOk } = await apiClient.post(
    "/payment/bazaar/order",
    { type: planSlug, period }
  );

  if (!orderOk || !order?.productId) {
    throw new Error(order?.message || "خطا در ایجاد سفارش.");
  }

  const isSubscription = order.kind === "subscription";

  const result = await BazaarPay.purchase({
    productId: order.productId,
    payload: order.payload,
    subscription: isSubscription,
  });

  if (result?.status === "canceled") return { status: "canceled" };

  await verifyAndConsume({
    purchaseToken: result.purchaseToken,
    productId: result.productId || order.productId,
    orderId: order.orderId,
    payload: result.payload,
  });

  return { status: "success" };
}

async function verifyAndConsume({
  purchaseToken,
  productId,
  orderId,
  payload,
}) {
  const { data, ok } = await apiClient.post("/payment/bazaar/verify", {
    purchaseToken,
    productId,
    orderId,
    payload,
  });

  if (!ok) {
    // Purchase is paid but unverified — deliberately NOT consumed, so
    // recoverPendingPurchases() can retry on the next app launch.
    throw new Error(
      data?.message || "پرداخت انجام شد اما تایید نشد. لطفاً دوباره تلاش کنید."
    );
  }

  if (data?.consumable) {
    try {
      await BazaarPay.consume({ purchaseToken });
    } catch (error) {
      // Credits are already granted; a failed consume only means the product
      // stays "owned" until the next recovery pass.
      console.error("Bazaar consume failed:", error);
    }
  }

  return data;
}

/**
 * Re-verify purchases that were paid for but never credited (app killed
 * mid-flow, network drop, etc). Safe to call on every app start — the server
 * is idempotent per purchaseToken.
 *
 * @returns {Promise<number>} number of purchases successfully recovered
 */
export async function recoverPendingPurchases() {
  if (!isBazaarBuild()) return 0;

  try {
    const { available } = await BazaarPay.isAvailable();
    if (!available) return 0;

    await ensureConnected();

    const { products } = await BazaarPay.getPurchasedProducts();
    if (!products?.length) return 0;

    let recovered = 0;

    for (const product of products) {
      try {
        await verifyAndConsume({
          purchaseToken: product.purchaseToken,
          productId: product.productId,
          payload: product.payload,
        });
        recovered += 1;
      } catch (error) {
        console.error("Recover purchase failed:", product.productId, error);
      }
    }

    return recovered;
  } catch (error) {
    console.error("recoverPendingPurchases failed:", error);
    return 0;
  }
}

export default BazaarPay;
