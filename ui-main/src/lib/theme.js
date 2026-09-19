export const THEME_STORAGE_KEY = "hamdast-ai-theme";

const DARK_VALUES = new Set([
  "dark",
  "night",
  "black",
  "darkmode",
  "dark-mode",
]);
const LIGHT_VALUES = new Set([
  "light",
  "default",
  "day",
  "lightmode",
  "light-mode",
]);

export function parseThemeValue(raw) {
  if (raw == null) return null;
  const value = String(raw).toLowerCase().trim();
  if (!value) return null;
  if (DARK_VALUES.has(value)) return "dark";
  if (LIGHT_VALUES.has(value)) return "light";
  return null;
}

export function getSystemTheme() {
  try {
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch {
    // matchMedia is unavailable
  }
  return "light";
}

/**
 * Theme from the native Hamdast/Myket host, if a real bridge is present.
 * Returns null when the host cannot be read so callers can fall back.
 */
export function getHostTheme() {
  try {
    const hamdast = window.Hamdast || window.Myket;
    if (!hamdast || typeof hamdast.getTheme !== "function") return null;
    if (hamdast.__isWebStub) return null;
    return parseThemeValue(hamdast.getTheme());
  } catch {
    return null;
  }
}

export function getStoredTheme() {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return null;
    try {
      return parseThemeValue(JSON.parse(raw));
    } catch {
      return parseThemeValue(raw);
    }
  } catch {
    return null;
  }
}

export function detectPreferredTheme() {
  return getStoredTheme() || getHostTheme() || getSystemTheme();
}

export function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

export function subscribeToSystemTheme(onChange) {
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  if (!media) return () => {};

  const listener = (event) => {
    onChange(event.matches ? "dark" : "light");
  };

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }

  media.addListener(listener);
  return () => media.removeListener(listener);
}

if (typeof document !== "undefined") {
  applyTheme(detectPreferredTheme());
}
