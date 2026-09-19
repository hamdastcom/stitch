export const APP_URL = "http://app.hamdast.com/";
export const CAFE_BAZAAR_URL = "https://cafebazaar.ir/app/ir.lontra.hamdast";

export type ToolCategoryId =
  | "models"
  | "image-video"
  | "writing"
  | "organize"
  | "companion";

export type ToolCategory = {
  id: ToolCategoryId;
  label: string;
  blurb: string;
};

export type Tool = {
  slug: string;
  title: string;
  description: string;
  category: ToolCategoryId;
  icon: string;
  href: string;
  inMenu?: boolean;
  badge?: string;
};

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "models",
    label: "مدل‌های هوش مصنوعی",
    blurb: "گفتگو با قوی‌ترین مدل‌های روز، بدون فیلترشکن و با پرداخت تومانی.",
  },
  {
    id: "image-video",
    label: "تصویر و ویدیو",
    blurb: "از متن تا تصویر، لوگو و ویدیو کوتاه؛ ایده را همان لحظه ببین.",
  },
  {
    id: "writing",
    label: "نوشتار",
    blurb: "ایمیل، ترجمه، کپشن و کد را سریع بنویس یا بازنویسی کن.",
  },
  {
    id: "organize",
    label: "سازماندهی",
    blurb: "جزوه، PDF، یوتیوب و ایده‌ها را مرتب و قابل‌استفاده کن.",
  },
  {
    id: "companion",
    label: "کاراکتر و همراه",
    blurb: "با شخصیت محبوب حرف بزن یا یک همراه شخصی با لحن خودت بساز.",
  },
];

export const TOOLS: Tool[] = [
  {
    slug: "gpt-luna",
    title: "GPT Luna",
    description:
      "نسل جدید هوشمندی مکالمه؛ مدل زبانی قدرتمند و فوق‌سریع با درک عمیق زبان فارسی.",
    category: "models",
    icon: "/figma/menu/openai.svg",
    href: "/tools/models/gpt-luna",
    inMenu: true,
  },
  {
    slug: "claude-fable-5",
    title: "Claude Fable 5",
    description:
      "مدل تخصصی مهندسی نرم‌افزار برای کدنویسی چندماژوله، معماری و رفع باگ.",
    category: "models",
    icon: "/figma/menu/anthropic.svg",
    href: "/tools/models/claude-fable-5",
    inMenu: true,
  },
  {
    slug: "kimi-k3",
    title: "Kimi K3",
    description:
      "ابرمدل استدلالی چندوجهی Moonshot AI با کانتکست ۱ میلیون توکن و معماری MoE.",
    category: "models",
    icon: "/figma/menu/kimi.svg",
    href: "/tools/models/kimi-k3",
    inMenu: true,
  },
  {
    slug: "chat-gpt",
    title: "Chat GPT",
    description:
      "گفتگو، استدلال و تولید متن با مدل‌های GPT، بدون فیلترشکن و با پرداخت تومانی.",
    category: "models",
    icon: "/figma/menu/openai.svg",
    href: "/tools/models/chat-gpt",
    inMenu: true,
  },
  {
    slug: "gemini",
    title: "Gemini",
    description:
      "مدل چندوجهی گوگل برای متن، تصویر و کد؛ مناسب کار روزمره و تحقیق.",
    category: "models",
    icon: "/figma/menu/magicoon.svg",
    href: "/tools/models/gemini",
    inMenu: true,
  },
  {
    slug: "claude",
    title: "Claude",
    description:
      "مدل Anthropic برای نوشتار دقیق، کدنویسی و تحلیل سندهای طولانی.",
    category: "models",
    icon: "/figma/menu/anthropic.svg",
    href: "/tools/models/claude",
    inMenu: true,
  },
  {
    slug: "grok",
    title: "Grok",
    description:
      "مدل xAI با دانش به‌روز برای پاسخ‌های سریع و جست‌وجوی موضوع‌های تازه.",
    category: "models",
    icon: "/figma/menu/grok.svg",
    href: "/tools/models/grok",
    inMenu: true,
  },
  {
    slug: "perplexity",
    title: "Perplexity",
    description:
      "پاسخ همراه منبع؛ برای تحقیق سریع و سوال‌هایی که باید به سند وصل شوند.",
    category: "models",
    icon: "/figma/design/globe.svg",
    href: "/tools/models/perplexity",
  },
  {
    slug: "image-generator",
    title: "تولید تصویر",
    description: "از ایده تا تصویر؛ ساخت تصویر با هوش مصنوعی در چند ثانیه.",
    category: "image-video",
    icon: "/figma/menu/image.svg",
    href: "/tools/image-generator",
    inMenu: true,
  },
  {
    slug: "video-generator",
    title: "تولید ویدیو",
    description: "ویدیوهای کوتاه را از متن بساز، بدون نیاز به تدوین پیچیده.",
    category: "image-video",
    icon: "/figma/menu/video-play.svg",
    href: "/tools/video-generator",
    inMenu: true,
  },
  {
    slug: "nano-banana-pro",
    title: "Nano Banana Pro",
    description:
      "مدل تصویر گوگل برای ساخت تصویر باکیفیت و ویرایش با زبان طبیعی.",
    category: "image-video",
    icon: "/figma/image.svg",
    href: "/tools/nano-banana-pro",
    badge: "جدید",
  },
  {
    slug: "gpt-image",
    title: "GPT Image",
    description:
      "تولید تصویر با مدل تصویری OpenAI؛ مناسب طرح، پوستر و ایده‌های بصری.",
    category: "image-video",
    icon: "/figma/gpt.svg",
    href: "/tools/gpt-image",
  },
  {
    slug: "veo",
    title: "Veo",
    description:
      "ویدیو با مدل تصویری گوگل؛ مناسب صحنه، حرکت و ایده‌های سینمایی.",
    category: "image-video",
    icon: "/figma/video-square.svg",
    href: "/tools/veo",
    badge: "جدید",
  },
  {
    slug: "wan",
    title: "Wan",
    description: "ویدیوهای کوتاه تبلیغاتی و داستانی را از یک جمله بساز.",
    category: "image-video",
    icon: "/figma/video-square.svg",
    href: "/tools/wan",
  },
  {
    slug: "image-to-image",
    title: "تبدیل تصویر",
    description: "عکس را بگیر و به سبک، ترکیب یا نسخهٔ تازه‌تری تبدیلش کن.",
    category: "image-video",
    icon: "/figma/rotate-3d.svg",
    href: "/tools/image-to-image",
  },
  {
    slug: "logo-generator",
    title: "ساخت لوگو",
    description: "برای برند، کانال یا استارتاپ، چند گزینه لوگو در چند ثانیه.",
    category: "image-video",
    icon: "/figma/design/bolt.svg",
    href: "/tools/logo-generator",
  },
  {
    slug: "ad-image",
    title: "تصویر تبلیغاتی",
    description: "از متن کمپین، پرامپت تصویر و قاب آمادهٔ تبلیغاتی بساز.",
    category: "image-video",
    icon: "/figma/image.svg",
    href: "/tools/ad-image",
  },
  {
    slug: "chat",
    title: "چت هوشمند",
    description: "گفتگو با قدرتمندترین مدل‌های زبانی دنیا در یک فضای فارسی.",
    category: "writing",
    icon: "/figma/menu/messages.svg",
    href: "/tools/chat",
    inMenu: true,
  },
  {
    slug: "voice",
    title: "دستیار صوتی فارسی",
    description: "به‌جای تایپ، با صدا حرف بزن؛ مناسب مکالمه طبیعی به فارسی.",
    category: "writing",
    icon: "/figma/menu/microphone.svg",
    href: "/tools/voice",
    inMenu: true,
  },
  {
    slug: "writing",
    title: "نگارش",
    description: "ایمیل، گزارش و متن رسمی را سریع بنویس یا بازنویسی کن.",
    category: "writing",
    icon: "/figma/menu/edit.svg",
    href: "/tools/writing",
    inMenu: true,
  },
  {
    slug: "coding",
    title: "کد نویسی",
    description: "کمک برای نوشتن، توضیح و رفع اشکال کد با مدل‌های برنامه‌نویسی.",
    category: "writing",
    icon: "/figma/menu/code.svg",
    href: "/tools/coding",
    inMenu: true,
  },
  {
    slug: "translator",
    title: "مترجم",
    description: "متن را دقیق و روان به فارسی یا زبان‌های دیگر برگردان.",
    category: "writing",
    icon: "/figma/menu/translate-language.svg",
    href: "/tools/translator",
    inMenu: true,
  },
  {
    slug: "rewrite",
    title: "بازنویسی متن",
    description: "جمله را واضح‌تر، رسمی‌تر یا صمیمی‌تر بنویس؛ بدون عوض کردن معنی.",
    category: "writing",
    icon: "/figma/edit-2.svg",
    href: "/tools/rewrite",
  },
  {
    slug: "social-caption",
    title: "کپشن شبکه‌های اجتماعی",
    description: "برای هر پلتفرم، کپشن هماهنگ با لحن برند بنویس.",
    category: "writing",
    icon: "/figma/messages-3.svg",
    href: "/tools/social-caption",
  },
  {
    slug: "email-writer",
    title: "نگارش ایمیل",
    description: "ایمیل رسمی، پیگیری و پیشنهاد همکاری را سریع و مودب بنویس.",
    category: "writing",
    icon: "/figma/contact/email.svg",
    href: "/tools/email-writer",
  },
  {
    slug: "language-tutor",
    title: "مربی زبان",
    description: "تمرین مکالمه، گرامر و واژگان با بازخورد فوری.",
    category: "writing",
    icon: "/figma/book.svg",
    href: "/tools/language-tutor",
  },
  {
    slug: "mind-map",
    title: "تولید نقشه ذهنی",
    description:
      "ایده‌ها را از متن، فایل یا ویدیو در چند ثانیه به نقشه ذهنی تبدیل کن.",
    category: "organize",
    icon: "/figma/menu/chart-pyramid.svg",
    href: "/design",
    inMenu: true,
  },
  {
    slug: "chat-pdf",
    title: "چت با PDF",
    description: "سند را بگذار و همان‌جا سوال بپرس؛ نکته‌ها را از داخل فایل بکش بیرون.",
    category: "organize",
    icon: "/figma/design/file-copy.svg",
    href: "/tools/chat-pdf",
  },
  {
    slug: "youtube-summary",
    title: "خلاصه ویدیو یوتیوب",
    description: "لینک ویدیو را بده؛ خلاصه، سرفصل و نکته‌های کلیدی را بگیر.",
    category: "organize",
    icon: "/figma/menu/youtube.svg",
    href: "/tools/youtube-summary",
    inMenu: true,
  },
  {
    slug: "audio-to-text",
    title: "صوت به متن",
    description: "فایل صوتی جلسه یا درس را به متن قابل جستجو تبدیل کن.",
    category: "organize",
    icon: "/figma/hero/microphone.svg",
    href: "/tools/audio-to-text",
  },
  {
    slug: "notes-summary",
    title: "خلاصه‌ساز جزوه",
    description: "جزوه و مقاله را در چند ثانیه به نکات کلیدی تبدیل کن.",
    category: "organize",
    icon: "/figma/design/note-text.svg",
    href: "/tools/notes-summary",
  },
  {
    slug: "research-assistant",
    title: "دستیار تحقیق",
    description: "منابع را جمع کن و پیش‌نویس گزارش یا تحقیق را آماده کن.",
    category: "organize",
    icon: "/figma/design/book-open.svg",
    href: "/tools/research-assistant",
  },
  {
    slug: "daily-tasks",
    title: "مدیریت کار روزانه",
    description: "لیست کار، اولویت و پیش‌نویس پاسخ را مرتب و قابل اجرا کن.",
    category: "organize",
    icon: "/figma/setting-2.svg",
    href: "/tools/daily-tasks",
  },
  {
    slug: "characters",
    title: "کاراکترها",
    description: "با شخصیت‌های محبوب انیمه و فیلم به فارسی حرف بزن.",
    category: "companion",
    icon: "/figma/menu/sticky-note-square-smile.svg",
    href: "/tools/characters",
    inMenu: true,
  },
  {
    slug: "personal-companion",
    title: "همراه هوشمند",
    description: "یک همراه شخصی با لحن و هدف خودت بساز؛ برای درس، کار یا گفتگوی روزانه.",
    category: "companion",
    icon: "/figma/menu/user-star.svg",
    href: "/tools/personal-companion",
    inMenu: true,
  },
];

export function getTool(slug: string) {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(id: ToolCategoryId) {
  return TOOLS.filter((tool) => tool.category === id);
}

export function getRelatedTools(slug: string, limit = 3) {
  const current = getTool(slug);
  if (!current) return [];
  return TOOLS.filter(
    (tool) => tool.category === current.category && tool.slug !== slug,
  ).slice(0, limit);
}

export function getMenuColumns() {
  return TOOL_CATEGORIES.map((category) => ({
    title: category.label,
    href: `/products#${category.id}`,
    links: TOOLS.filter((tool) => tool.category === category.id && tool.inMenu).map(
      (tool) => ({
        label: tool.title,
        href: tool.href,
        icon: tool.icon,
      }),
    ),
  })).filter((column) => column.links.length > 0);
}
