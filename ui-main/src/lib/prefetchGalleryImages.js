import apiClient from "@/lib/apiClient";
import {
  getGenerationThumbnailUrl,
  getGenerationVideoUrl,
} from "@/lib/getGenerationMediaUrl";

/**
 * On app entry, warm lazy routes + their images first, then demo/history videos.
 * Safe to call multiple times — runs at most once per session.
 */

let didPrefetch = false;
let idleHandle = null;
let timeoutHandle = null;

const DEMO_IMAGE_PREFIX = "https://s3.hamdast.com/public/images/demo/";
const DEMO_VIDEO_PREFIX = "https://s3.hamdast.com/public/videos/demo/";

const DEMO_IMAGE_FILES = [
  "1-Anime.webp",
  "2-Anime.webp",
  "3-Anime.webp",
  "4-Anime.webp",
  "1-Realistic.webp",
  "2-Realistic.webp",
  "3-Realistic.webp",
  "4-Realistic.webp",
  "1-Watercolor.webp",
  "2-Watercolor.webp",
  "3-Watercolor.webp",
  "4-Watercolor.webp",
  "1-Cinematic.webp",
  "2-Cinematic.webp",
  "3-Cinematic.webp",
  "4-Cinematic.webp",
  "1-Minimal.webp",
  "2-Minimal.webp",
  "3-Minimal.webp",
  "4-Minimal.webp",
];

const DEMO_VIDEO_FILES = [
  "1-Anime.mp4",
  "2-Anime.mp4",
  "3-Anime.mp4",
  "4-Anime.mp4",
  "1-Pixelated.mp4",
  "2-Pixelated.mp4",
  "3-Pixelated.mp4",
  "4-Pixelated.mp4",
  "1-Cinematic.mp4",
  "2-Cinematic.mp4",
  "3-Cinematic.mp4",
  "4-Cinematic.mp4",
  "1-Minimal.mp4",
  "2-Minimal.mp4",
  "3-Minimal.mp4",
  "4-Minimal.mp4",
];

const MAX_CHARACTER_IMAGES = 80;
const IMAGE_HISTORY_LIMIT = 20;
const VIDEO_HISTORY_LIMIT = 8;
const VIDEO_CONCURRENCY = 2;
const IMAGE_LOAD_TIMEOUT_MS = 20000;
const VIDEO_LOAD_TIMEOUT_MS = 45000;

function uniqueUrls(urls) {
  return [...new Set(urls.filter((url) => typeof url === "string" && url))];
}

function warmImageCache(urls) {
  return Promise.all(
    uniqueUrls(urls).map(
      (url) =>
        new Promise((resolve) => {
          let settled = false;
          const done = () => {
            if (settled) return;
            settled = true;
            resolve();
          };

          try {
            const img = new Image();
            img.decoding = "async";
            img.onload = done;
            img.onerror = done;
            img.src = url;
            setTimeout(done, IMAGE_LOAD_TIMEOUT_MS);
          } catch {
            done();
          }
        })
    )
  );
}

function warmOneVideo(url) {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    try {
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.addEventListener("canplaythrough", done, { once: true });
      video.addEventListener("error", done, { once: true });
      video.src = url;
      video.load();
      setTimeout(done, VIDEO_LOAD_TIMEOUT_MS);
    } catch {
      done();
    }
  });
}

async function warmVideoCache(urls, concurrency = VIDEO_CONCURRENCY) {
  const queue = uniqueUrls(urls);
  if (queue.length === 0) return;

  const workerCount = Math.min(concurrency, queue.length);
  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (queue.length > 0) {
        const url = queue.shift();
        if (url) await warmOneVideo(url);
      }
    })
  );
}

function warmRouteChunks(importers) {
  return Promise.all(
    importers.map((load) =>
      load().catch(() => {
        // ignore individual chunk failures
      })
    )
  );
}

async function prefetchImageAssets() {
  await warmRouteChunks([
    () => import("@/pages/CharactersPage"),
    () => import("@/pages/image/CreateImagePage"),
    () => import("@/pages/image/ImageHistoryPage"),
    () => import("@/pages/video/CreateVideoPage"),
  ]);

  const [gptsRes, histRes] = await Promise.all([
    apiClient.get("/gpts"),
    apiClient.get(`/images/history?page=1&limit=${IMAGE_HISTORY_LIMIT}`),
  ]);

  const characterUrls = [];
  if (gptsRes.ok) {
    const categories = gptsRes.data?.categories || [];
    for (const category of categories) {
      for (const gpt of category.gpts || []) {
        if (gpt?.image) characterUrls.push(gpt.image);
      }
    }
    for (const gpt of gptsRes.data?.gpts || []) {
      if (gpt?.image) characterUrls.push(gpt.image);
    }
  }

  const historyUrls = [];
  if (histRes.ok) {
    for (const generation of histRes.data?.generations || []) {
      for (const image of generation.images || []) {
        if (image?.s3Url) historyUrls.push(image.s3Url);
      }
    }
  }

  const demoUrls = DEMO_IMAGE_FILES.map((file) => DEMO_IMAGE_PREFIX + file);

  await warmImageCache([
    ...uniqueUrls(characterUrls).slice(0, MAX_CHARACTER_IMAGES),
    ...historyUrls,
    ...demoUrls,
  ]);
}

async function prefetchVideoAssets() {
  await warmRouteChunks([
    () => import("@/pages/video/VideoPage"),
    () => import("@/pages/video/VideoHistoryPage"),
  ]);

  const demoUrls = DEMO_VIDEO_FILES.map((file) => DEMO_VIDEO_PREFIX + file);
  const historyThumbs = [];
  const historyVideos = [];

  try {
    const histRes = await apiClient.get(
      `/videos/history?page=1&limit=${VIDEO_HISTORY_LIMIT}`
    );
    if (histRes.ok) {
      for (const generation of histRes.data?.generations || []) {
        const thumb = getGenerationThumbnailUrl(generation);
        const video = getGenerationVideoUrl(generation);
        if (thumb) historyThumbs.push(thumb);
        if (video) historyVideos.push(video);
      }
    }
  } catch {
    // continue with demo videos even if history fails
  }

  await warmImageCache(historyThumbs);
  await warmVideoCache([...demoUrls, ...historyVideos]);
}

async function prefetchGalleryImages() {
  if (didPrefetch) return;
  didPrefetch = true;

  try {
    await prefetchImageAssets();
  } catch {
    // still try videos so a failed image phase does not skip the rest
  }

  try {
    await prefetchVideoAssets();
  } catch {
    // Prefetch must never affect the app; keep didPrefetch true to avoid retry storms
  }
}

/**
 * Schedule prefetch during browser idle time (falls back to a short delay).
 */
export function schedulePrefetchGalleryImages() {
  if (didPrefetch || typeof window === "undefined") return;

  const run = () => {
    idleHandle = null;
    timeoutHandle = null;
    void prefetchGalleryImages();
  };

  if (typeof window.requestIdleCallback === "function") {
    idleHandle = window.requestIdleCallback(run, { timeout: 4000 });
  } else {
    timeoutHandle = window.setTimeout(run, 2000);
  }
}

export function cancelPrefetchGalleryImages() {
  if (idleHandle != null && typeof window.cancelIdleCallback === "function") {
    window.cancelIdleCallback(idleHandle);
    idleHandle = null;
  }
  if (timeoutHandle != null) {
    window.clearTimeout(timeoutHandle);
    timeoutHandle = null;
  }
}
