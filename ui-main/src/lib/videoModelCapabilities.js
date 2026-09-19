/**
 * Keep in sync with server/src/utils/credits/videoModelCapabilities.js
 */

function normalizeModel(model) {
  return String(model || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, " ");
}

export const VIDEO_MODEL_CAPABILITIES = {
  "fal ai/wan/v2.7/text to video": {
    durations: [5, 10],
    resolutions: ["720p", "1080p"],
    aspectRatios: ["16:9", "9:16"],
    defaultDuration: 5,
    defaultResolution: "720p",
    defaultAspectRatio: "16:9",
    baseDuration: 5,
    resolutionMultiplier: { "720p": 1, "1080p": 1.5 },
  },
  "fal ai/wan 25 preview/text to video": {
    durations: [5, 10],
    resolutions: ["480p"],
    aspectRatios: ["16:9", "9:16"],
    defaultDuration: 5,
    defaultResolution: "480p",
    defaultAspectRatio: "16:9",
    baseDuration: 5,
    resolutionMultiplier: { "480p": 1 },
  },
  "fal ai/ltx 2.3/text to video/fast": {
    durations: [6, 8, 10],
    resolutions: ["1080p"],
    aspectRatios: ["16:9", "9:16"],
    defaultDuration: 6,
    defaultResolution: "1080p",
    defaultAspectRatio: "16:9",
    baseDuration: 6,
    resolutionMultiplier: { "1080p": 1 },
  },
  "fal ai/ltxv 2/text to video/fast": {
    durations: [6, 8, 10],
    resolutions: ["1080p"],
    aspectRatios: ["16:9"],
    defaultDuration: 6,
    defaultResolution: "1080p",
    defaultAspectRatio: "16:9",
    baseDuration: 6,
    resolutionMultiplier: { "1080p": 1 },
    aspectRatioLocked: true,
    lockedAspectRatio: "16:9",
  },
  "fal ai/ltx 2.3/text to video": {
    durations: [6, 8, 10],
    resolutions: ["1080p"],
    aspectRatios: ["16:9", "9:16"],
    defaultDuration: 6,
    defaultResolution: "1080p",
    defaultAspectRatio: "16:9",
    baseDuration: 6,
    resolutionMultiplier: { "1080p": 1 },
  },
  "fal ai/kling video/o3/pro/text to video": {
    durations: [5, 10],
    resolutions: null,
    aspectRatios: ["16:9", "9:16"],
    defaultDuration: 5,
    defaultResolution: null,
    defaultAspectRatio: "16:9",
    baseDuration: 5,
    resolutionMultiplier: { _fixed: 1 },
  },
  "fal ai/kling video/v2.5 turbo/pro/text to video": {
    durations: [5, 10],
    resolutions: null,
    aspectRatios: ["16:9", "9:16"],
    defaultDuration: 5,
    defaultResolution: null,
    defaultAspectRatio: "16:9",
    baseDuration: 5,
    resolutionMultiplier: { _fixed: 1 },
  },
  "fal ai/pixverse/v6/text to video": {
    durations: [5, 10],
    resolutions: ["720p", "1080p"],
    aspectRatios: ["16:9", "9:16"],
    defaultDuration: 5,
    defaultResolution: "720p",
    defaultAspectRatio: "16:9",
    baseDuration: 5,
    resolutionMultiplier: { "720p": 1, "1080p": 2 },
  },
};

export function getVideoModelCapabilities(model) {
  return VIDEO_MODEL_CAPABILITIES[normalizeModel(model)] || null;
}

export function normalizeVideoConfig(model, config = {}) {
  const caps = getVideoModelCapabilities(model);
  if (!caps) return null;

  let duration = Number(config.duration);
  if (!Number.isFinite(duration) || !caps.durations.includes(duration)) {
    duration = caps.defaultDuration;
  }

  let aspectRatio = config.aspectRatio || caps.defaultAspectRatio;
  if (caps.aspectRatioLocked && caps.lockedAspectRatio) {
    aspectRatio = caps.lockedAspectRatio;
  } else if (!caps.aspectRatios.includes(aspectRatio)) {
    aspectRatio = caps.defaultAspectRatio;
  }

  let resolution = config.resolution ?? caps.defaultResolution;
  if (caps.resolutions == null) {
    resolution = null;
  } else if (!caps.resolutions.includes(resolution)) {
    resolution = caps.defaultResolution;
  }

  return { duration, aspectRatio, resolution };
}
