import apiClient from "@/lib/apiClient";
import { toUserError } from "@/lib/userError";
import { defaultAiModel } from "@/config/state";

export const HIDDEN_CHAT_SLUGS = [
  "gpt-5.5-pro",
  "gpt-5.4-pro",
  "gpt-5.1-thinking",
];

/** Normalize a DB model into the shape we persist in currentModelAtom */
export function toStoredModel(model) {
  if (!model) return null;

  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    provider: model.provider,
    type: model.type,
    price: model.price,
    description: model.description || "",
    supportsWebSearch:
      typeof model.supportsWebSearch === "boolean"
        ? model.supportsWebSearch
        : model.slug === defaultAiModel.slug,
  };
}

export function modelSupportsWebSearch(model) {
  if (typeof model?.supportsWebSearch === "boolean") {
    return model.supportsWebSearch;
  }

  return model?.slug === defaultAiModel.slug;
}

export function isDefaultChatModel(model) {
  return model?.slug === defaultAiModel.slug;
}

/** Web search is on by default only for the default (hamdast) model. */
export function isWebSearchOnByDefault(model) {
  return isDefaultChatModel(model) && modelSupportsWebSearch(model);
}

const PRESERVED_SEARCH_MODES = new Set(["image", "deep", "thinking"]);

export function applyWebSearchForSelectedModel(
  model,
  { searchMode, setWebSearchEnabled, setSearchMode },
) {
  if (!modelSupportsWebSearch(model)) {
    setWebSearchEnabled(false);
    if (searchMode === "web") setSearchMode(null);
    return;
  }

  if (isWebSearchOnByDefault(model)) {
    setWebSearchEnabled(true);
    if (!PRESERVED_SEARCH_MODES.has(searchMode)) setSearchMode("web");
    return;
  }

  setWebSearchEnabled(false);
  if (searchMode === "web") setSearchMode(null);
}

export function findModelInList(models, currentModel) {
  if (!models?.length || !currentModel) return null;

  if (currentModel.id) {
    const byId = models.find((m) => m.id === currentModel.id);
    if (byId) return byId;
  }

  if (currentModel.slug) {
    return models.find((m) => m.slug === currentModel.slug) || null;
  }

  return null;
}

const CHAT_MODELS_CACHE_KEY = "hamdast-ai-chat-models";

export function readCachedChatModels() {
  try {
    const raw = localStorage.getItem(CHAT_MODELS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCachedChatModels(models) {
  try {
    localStorage.setItem(CHAT_MODELS_CACHE_KEY, JSON.stringify(models));
  } catch {
    // quota / private mode — ignore
  }
}

export async function fetchChatModels() {
  // Bust any intermediate caches; server always reads from DB
  const { data, ok } = await apiClient.get(
    `/models?type=chat&_t=${Date.now()}`,
  );

  if (!ok) {
    return { ok: false, models: [], message: toUserError(data?.message, "خطا در بارگذاری مدل‌ها") };
  }

  const models = (data.models || []).filter(
    (m) => !HIDDEN_CHAT_SLUGS.includes(m.slug),
  );

  writeCachedChatModels(models);

  return { ok: true, models };
}

/**
 * Keep the selected model in sync with DB rows.
 * - If the cached selection still exists, refresh its fields from DB
 * - Otherwise fall back to the default model from DB
 */
export function resolveCurrentModel(models, currentModel) {
  const matched = findModelInList(models, currentModel);
  if (matched) return toStoredModel(matched);

  const fallback =
    models.find((m) => m.slug === defaultAiModel.slug) ||
    models.find((m) => m.provider?.toLowerCase() === "hamdast") ||
    models[0];

  return toStoredModel(fallback) || defaultAiModel;
}
