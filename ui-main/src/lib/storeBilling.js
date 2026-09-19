import {
  isBazaarBuild,
  purchasePlan as purchaseBazaarPlan,
  fetchBazaarPeriods,
  recoverPendingPurchases as recoverBazaarPurchases,
} from "./bazaarBilling";
import {
  isMyketBuild,
  purchasePlan as purchaseMyketPlan,
  fetchMyketPeriods,
  recoverPendingPurchases as recoverMyketPurchases,
} from "./myketBilling";

export { isBazaarBuild, isMyketBuild };

/** True for Cafebazaar or Myket store APKs — both use in-app billing. */
export function isStoreBillingBuild() {
  return isBazaarBuild() || isMyketBuild();
}

/**
 * Periods the current store build is allowed to sell.
 * @returns {Promise<string[]|null>} null outside store builds
 */
export async function fetchStorePeriods() {
  if (isMyketBuild()) return fetchMyketPeriods();
  if (isBazaarBuild()) return fetchBazaarPeriods();
  return null;
}

export async function purchasePlan(args) {
  if (isMyketBuild()) return purchaseMyketPlan(args);
  return purchaseBazaarPlan(args);
}

export async function recoverPendingPurchases() {
  if (isMyketBuild()) return recoverMyketPurchases();
  if (isBazaarBuild()) return recoverBazaarPurchases();
  return 0;
}
