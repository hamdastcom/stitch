/**
 * Turn API-relative media paths into absolute URLs for <video>/<img> src.
 */
function absolutizeMediaUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) {
    const base = String(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
    return `${base}${url}`;
  }
  return url;
}

/**
 * Best playable URL from a generation / status payload.
 * Status API returns videoUrl; history often uses videoS3Url (may be local fallback).
 */
export function getGenerationVideoUrl(generation) {
  if (!generation) return null;
  return absolutizeMediaUrl(
    generation.videoS3Url ||
      generation.videoUrl ||
      generation.url ||
      null
  );
}

export function getGenerationThumbnailUrl(generation) {
  if (!generation) return null;
  return absolutizeMediaUrl(
    generation.thumbnailS3Url || generation.thumbnailUrl || null
  );
}
