import { registerPlugin, Capacitor } from "@capacitor/core";

import apiClient from "./apiClient";

const MyketPay = registerPlugin("MyketPay");

/**
 * True only for the build we ship to Myket. Set VITE_DISTRIBUTION=myket
 * in `.env.myket` (see `npm run apk:myket`).
 */
export function isMyketBuild() {
  return (
    Capacitor.getPlatform() === "android" &&
    import.meta.env.VITE_DISTRIBUTION === "myket"
  );
}

/**
 * Periods that have a product registered in the Myket panel. Used if the
 * server can't be reached — deliberately excludes yearly, which has no product.
 */
const FALLBACK_PERIODS = ["monthly", "quarterly", "halfYearly"];

/**
 * Billing periods the Myket build is allowed to sell.
 *
 * @returns {Promise<string[]|null>} null when this isn't a Myket build
 */
export async function fetchMyketPeriods() {
  if (!isMyketBuild()) return null;

  try {
    const { data, ok } = await apiClient.get("/payment/myket/products");
    if (ok && data?.periods?.length) return data.periods;
    if (ok && data?.products?.length) {
      return [...new Set(data.products.map((product) => product.period))];
    }
  } catch (error) {
    console.error("fetchMyketPeriods failed:", error);
  }

  return FALLBACK_PERIODS;
}

let connectPromise = null;

function withTimeout(promise, ms, message) {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

async function ensureConnected() {
  if (!connectPromise) {
    connectPromise = MyketPay.connect().catch((error) => {
      connectPromise = null;
      throw error;
    });
  }
  return connectPromise;
}

/**
 * Full purchase round-trip: create order -> Myket payment screen -> server
 * verification -> consume.
 *
 * @param {object} args
 * @param {string} args.planSlug
 * @param {string} args.period
 * @param {() => void} [args.onReadyToPay] hide app overlay before Myket UI
 * @returns {Promise<{status: 'success'|'canceled'}>}
 * @throws {Error} with a user-displayable Persian message
 */
export async function purchasePlan({ planSlug, period, onReadyToPay }) {
  console.info("[Myket] isAvailable");
  const { available } = await withTimeout(
    MyketPay.isAvailable(),
    8000,
    "بررسی نصب مایکت زمان‌بر شد."
  );
  if (!available) {
    throw new Error("برنامه مایکت روی دستگاه شما نصب نیست.");
  }

  console.info("[Myket] connect");
  await withTimeout(
    ensureConnected(),
    22000,
    "اتصال به مایکت برقرار نشد. مایکت را باز کنید و دوباره تلاش کنید."
  );

  console.info("[Myket] create order", { planSlug, period });
  const { data: order, ok: orderOk } = await withTimeout(
    apiClient.post("/payment/myket/order", { type: planSlug, period }),
    20000,
    "ایجاد سفارش طول کشید. اتصال اینترنت و سرور را چک کنید."
  );

  if (!orderOk || !order?.productId) {
    throw new Error(order?.message || "خطا در ایجاد سفارش.");
  }

  console.info("[Myket] launch purchase", order.productId);
  onReadyToPay?.();

  const result = await MyketPay.purchase({
    productId: order.productId,
    payload: order.payload,
  });

  if (result?.status === "canceled") {
    console.info("[Myket] purchase canceled");
    return { status: "canceled" };
  }

  console.info("[Myket] verify", result?.productId || order.productId);
  await verifyAndConsume({
    purchaseToken: result.purchaseToken,
    productId: result.productId || order.productId,
    orderId: order.orderId,
    payload: result.payload,
    originalJson: result.originalJson,
    signature: result.dataSignature,
  });

  return { status: "success" };
}

async function verifyAndConsume({
  purchaseToken,
  productId,
  orderId,
  payload,
  originalJson,
  signature,
}) {
  const { data, ok } = await apiClient.post("/payment/myket/verify", {
    purchaseToken,
    productId,
    orderId,
    payload,
    originalJson,
    signature,
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
      await MyketPay.consume({ purchaseToken });
    } catch (error) {
      // Credits are already granted; a failed consume only means the product
      // stays "owned" until the next recovery pass.
      console.error("Myket consume failed:", error);
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
  if (!isMyketBuild()) return 0;

  try {
    const { available } = await MyketPay.isAvailable();
    if (!available) return 0;

    await ensureConnected();

    const { products } = await MyketPay.getPurchasedProducts();
    if (!products?.length) return 0;

    let recovered = 0;

    for (const product of products) {
      try {
        await verifyAndConsume({
          purchaseToken: product.purchaseToken,
          productId: product.productId,
          payload: product.payload,
          originalJson: product.originalJson,
          signature: product.dataSignature,
        });
        recovered += 1;
      } catch (error) {
        console.error("Recover Myket purchase failed:", product.productId, error);
      }
    }

    return recovered;
  } catch (error) {
    console.error("recoverPendingPurchases (myket) failed:", error);
    return 0;
  }
}

export default MyketPay;
