import { toast } from "react-hot-toast";

const PERSIAN_RE = /[\u0600-\u06FF]/;
const LATIN_RE = /[A-Za-z]/;

export const DEFAULT_USER_ERROR =
  "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.";

const FALLBACKS = {
  image: "در تولید تصویر مشکلی پیش آمد. لطفاً کمی بعد دوباره تلاش کنید.",
  video: "در تولید ویدیو مشکلی پیش آمد. لطفاً کمی بعد دوباره تلاش کنید.",
  chat: "ارسال پیام با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
  upload: "آپلود فایل با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
  auth: "ورود با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
  generic: DEFAULT_USER_ERROR,
};

const PRICE_MISSING_FA =
  "قیمت این تنظیمات یافت نشد. لطفاً مدل یا تنظیمات را تغییر دهید.";

const INSUFFICIENT_CREDITS_FA = "اعتبار کافی نمی باشد";

const RULES = [
  {
    test: /exhausted balance|user is locked|top up your balance|insufficient (funds|balance)|billing|fal\.ai|out of credit|quota exceeded/i,
    message:
      "در حال حاضر امکان انجام این درخواست وجود ندارد. لطفاً کمی بعد دوباره تلاش کنید.",
  },
  {
    test: /content.?policy|content checker|prohibited|not permitted|flagged|safety|moderation|سیاست‌های محتوایی|محدودیت‌های محتوایی|سیستم نظارت مسدود/i,
    message:
      "این درخواست به دلیل محدودیت‌های محتوایی قابل انجام نیست. لطفاً توضیحات را تغییر دهید و دوباره تلاش کنید.",
  },
  {
    test: /required credits not found|قیمت این تنظیمات یافت نشد/i,
    message: PRICE_MISSING_FA,
  },
  {
    test: /اعتبار کافی|insufficient credit/i,
    message: INSUFFICIENT_CREDITS_FA,
  },
  {
    test: /timeout|timed out|etimedout|headers timeout|TIMEOUT/i,
    message: "زمان پاسخ‌دهی به پایان رسید. لطفاً دوباره تلاش کنید.",
  },
  {
    test: /network|failed to fetch|econnreset|enotfound|connection|ECONNREFUSED|NETWORK/i,
    message:
      "اتصال برقرار نشد. اینترنت خود را بررسی کنید و دوباره تلاش کنید.",
  },
  {
    test: /rate limit|too many requests|429/i,
    message:
      "تعداد درخواست‌ها زیاد است. لطفاً کمی صبر کنید و دوباره تلاش کنید.",
  },
  {
    test: /unauthorized|invalid.+(api|key)|forbidden|FAL_KEY|api key/i,
    message:
      "در حال حاضر امکان انجام این درخواست وجود ندارد. لطفاً کمی بعد دوباره تلاش کنید.",
  },
  {
    test: /internal server error|unexpected|unhandled/i,
    message: "خطای سرور رخ داد. لطفاً دوباره تلاش کنید.",
  },
];

function extractText(raw) {
  if (raw == null || raw === "") return "";
  if (typeof raw === "string") return raw.trim();
  if (typeof raw === "object") {
    const nested =
      raw.message || raw.error || raw.errorMessage || raw.detail || "";
    if (typeof nested === "string") return nested.trim();
    if (nested && typeof nested === "object") return extractText(nested);
  }
  return String(raw).trim();
}

function isSafeUserMessage(text) {
  if (!text || !PERSIAN_RE.test(text)) return false;
  return !LATIN_RE.test(text);
}

export function getCreditIssue(raw) {
  const text = extractText(raw);
  if (!text) return null;
  if (text.includes("اعتبار کافی") || /insufficient credit/i.test(text)) {
    return "insufficient";
  }
  if (
    /required credits not found/i.test(text) ||
    text.includes("قیمت این تنظیمات یافت نشد")
  ) {
    return "price_missing";
  }
  return null;
}

export function toUserError(raw, fallback = FALLBACKS.generic, extras = {}) {
  const { problem, status } = extras;

  if (problem === "TIMEOUT_ERROR" || status === 408 || status === 504) {
    return "زمان پاسخ‌دهی به پایان رسید. لطفاً دوباره تلاش کنید.";
  }
  if (problem === "NETWORK_ERROR" || problem === "CONNECTION_ERROR") {
    return "اتصال برقرار نشد. اینترنت خود را بررسی کنید و دوباره تلاش کنید.";
  }
  if (problem === "CANCEL_ERROR") {
    return "درخواست لغو شد.";
  }

  const text = extractText(raw);
  if (!text) return fallback || FALLBACKS.generic;

  for (const rule of RULES) {
    if (rule.test.test(text)) return rule.message;
  }

  if (isSafeUserMessage(text)) return text;

  return fallback || FALLBACKS.generic;
}

export function toastUserError(raw, fallback, extras) {
  toast.error(toUserError(raw, fallback, extras));
}

export function toastFromApi(response, fallback) {
  toastUserError(
    response?.data,
    fallback,
    { problem: response?.problem, status: response?.status }
  );
}

export { FALLBACKS };
