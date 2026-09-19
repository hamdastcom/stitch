import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { detectPreferredTheme } from "@/lib/theme";

export const defaultAiModel = {
  slug: "hamdast",
  provider: "hamdast",
  name: "خودکار",
  price: 3,
  supportsWebSearch: true,
};

export const defaultImageModel = {
  slug: "gemini-3-pro-image",
  provider: "Google",
  name: "Nano Banana Pro",
  price: 25,
};

export const proUserDefaultAiModel = {
  slug: "gemini-2.5-flash-lite",
  provider: "Google",
  name: "Gemini 2.5 Flash Lite",
  price: 4,
};

// Model that supports web search - used when user enables web search with default model
export const webSearchCapableModel = {
  slug: "gemini-2.5-flash",
  provider: "google",
  name: "Gemini 2.5 Flash",
  price: 3,
  supportsWebSearch: true,
};

export const currentUserAtom = atomWithStorage("hamdast-ai-user", null);
// These atoms are now synced with backend Redis storage via useUserPreference hook
// Using regular atoms instead of atomWithStorage as the source of truth is now the backend
export const showOnboardingAtom = atom(true);
export const usageHintAtom = atom(true);
export const gemHintAtom = atom(true);
export const pageTitleAtom = atom("");
function readStoredChatModelSlug() {
  try {
    const raw = localStorage.getItem("hamdast-ai-model");
    if (!raw) return defaultAiModel.slug;
    return JSON.parse(raw)?.slug || defaultAiModel.slug;
  } catch {
    return defaultAiModel.slug;
  }
}

const initialWebSearchEnabled =
  readStoredChatModelSlug() === defaultAiModel.slug;

export const searchModeAtom = atom(initialWebSearchEnabled ? "web" : null);
export const showOverlayLoadingAtom = atom(false);
export const isThinkingModeAtom = atom(false);
export const isDeepResearchModeAtom = atom(false);
export const themeAtom = atomWithStorage(
  "hamdast-ai-theme",
  detectPreferredTheme(),
  undefined,
  { getOnInit: true }
);
export const showSubscriptionInvitationAtom = atomWithStorage("hamdast-ai-subscription-invitation", false);
export const currentModelAtom = atomWithStorage(
  "hamdast-ai-model",
  defaultAiModel,
  undefined,
  { getOnInit: true }
);

function readCachedChatModelsList() {
  try {
    const raw = localStorage.getItem("hamdast-ai-chat-models");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Chat models from local cache first, then refreshed from DB in the background */
export const chatModelsAtom = atom(readCachedChatModelsList());
export const currentImageModelAtom = atomWithStorage("hamdast-ai-image-model", defaultImageModel);
export const currentVideoModelAtom = atomWithStorage("hamdast-ai-video-model", {
  slug: "fal-ai/ltx-2.3/text-to-video",
  provider: "fal ai",
  name: "Ltx 2.3",
});
export const showPricingSheetAtom = atom(false);
export const pricingSheetTriggerSourceAtom = atom("unknown"); // Tracks where the pricing sheet was triggered from
export const showReachLimitPricingSheetAtom = atom(false);
export const reachLimitPricingSheetTriggerSourceAtom = atom("reach_limit"); // Tracks where the reach limit sheet was triggered from
export const showHintAlertModalAtom = atom(false);
export const hasTitleReachLimitPricingSheetAtom = atom(true);
export const webSearchEnabledAtom = atom(initialWebSearchEnabled);

// Auth bottom sheet state for web login
export const showAuthSheetAtom = atom(false);
export const authCallbacksAtom = atom({ onSuccess: null, onError: null });
