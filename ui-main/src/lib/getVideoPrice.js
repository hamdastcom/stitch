/**
 * Keep in sync with server/src/utils/credits/getVideoPrice.js
 */

import {
  getVideoModelCapabilities,
  normalizeVideoConfig,
} from "./videoModelCapabilities.js";

export { getVideoModelCapabilities, normalizeVideoConfig };

/** @deprecated use getVideoModelCapabilities */
export function getVideoModelConfig(model) {
  const caps = getVideoModelCapabilities(model);
  if (!caps) return null;
  return {
    durations: caps.durations,
    defaultDuration: caps.defaultDuration,
    defaultResolution: caps.defaultResolution ?? "1080p",
    baseDuration: caps.baseDuration,
    resolutionMultiplier: caps.resolutionMultiplier,
    aspectRatioLocked: caps.aspectRatioLocked,
    lockedAspectRatio: caps.lockedAspectRatio,
  };
}

export function getVideoPrice({ model, duration, resolution, basePrice }) {
  const caps = getVideoModelCapabilities(model);
  if (!caps) return null;

  const dbBase = Number(basePrice);
  if (!Number.isFinite(dbBase) || dbBase <= 0) return null;

  const normalized = normalizeVideoConfig(model, { duration, resolution });
  if (!normalized) return null;

  const { duration: dur, resolution: res } = normalized;

  let multiplier = 1;
  if (caps.resolutions == null) {
    multiplier = caps.resolutionMultiplier._fixed ?? 1;
  } else {
    multiplier = caps.resolutionMultiplier[res];
  }
  if (multiplier == null) return null;

  const price = Math.round(dbBase * (dur / caps.baseDuration) * multiplier);
  return price > 0 ? price : null;
}
