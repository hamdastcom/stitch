import { APP_URL, CAFE_BAZAAR_URL, getMenuColumns } from "./tools";

export { APP_URL, CAFE_BAZAAR_URL };

export type ProductLink = {
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
  hint?: string;
};

export type ProductColumn = {
  title: string;
  href?: string;
  links: ProductLink[];
};

export const productApps: ProductLink[] = [
  {
    label: "وب اپلیکیشن",
    hint: "دسترسی در مرورگر",
    href: APP_URL,
    external: true,
    icon: "/figma/menu/globe.svg",
  },
  {
    label: "اپلیکیشن موبایل",
    hint: "اندروید و ios",
    href: CAFE_BAZAAR_URL,
    external: true,
    icon: "/figma/menu/mobile.svg",
  },
];

export const productColumns: ProductColumn[] = [
  {
    title: "مدل های هوش مصنوعی",
    href: "/products#models",
    links: [
      {
        label: "GPT Luna",
        href: "/tools/models/gpt-luna",
        icon: "/figma/menu/openai.svg",
      },
      {
        label: "Claude Fable 5",
        href: "/tools/models/claude-fable-5",
        icon: "/figma/menu/anthropic.svg",
      },
      {
        label: "Kimi K3",
        href: "/tools/models/kimi-k3",
        icon: "/figma/menu/kimi.svg",
      },
      {
        label: "Chat GPT",
        href: "/tools/models/chat-gpt",
        icon: "/figma/menu/openai.svg",
      },
      {
        label: "Gemini",
        href: "/tools/models/gemini",
        icon: "/figma/menu/magicoon.svg",
      },
      {
        label: "Claude",
        href: "/tools/models/claude",
        icon: "/figma/menu/anthropic.svg",
      },
      {
        label: "Grok",
        href: "/tools/models/grok",
        icon: "/figma/menu/grok.svg",
      },
    ],
  },
  {
    title: "تصویر و ویدیو",
    href: "/products#image-video",
    links: [
      {
        label: "تولید تصویر",
        href: "/tools/image-generator",
        icon: "/figma/menu/image.svg",
      },
      {
        label: "تولید ویدیو",
        href: "/tools/video-generator",
        icon: "/figma/menu/video-play.svg",
      },
    ],
  },
  {
    title: "نوشتار",
    href: "/products#writing",
    links: [
      {
        label: "چت هوشمند",
        href: "/tools/chat",
        icon: "/figma/menu/messages.svg",
      },
      {
        label: "دستیار صوتی فارسی",
        href: "/tools/voice",
        icon: "/figma/menu/microphone.svg",
      },
      {
        label: "نگارش",
        href: "/tools/writing",
        icon: "/figma/menu/edit.svg",
      },
      {
        label: "کدنویسی",
        href: "/tools/coding",
        icon: "/figma/menu/code.svg",
      },
      {
        label: "مترجم",
        href: "/tools/translator",
        icon: "/figma/menu/translate-language.svg",
      },
    ],
  },
  {
    title: "سازماندهی",
    href: "/products#organize",
    links: [
      {
        label: "تولید نقشه ذهنی",
        href: "/design",
        icon: "/figma/menu/chart-pyramid.svg",
      },
      {
        label: "خلاصه ویدیو یوتوب",
        href: "/tools/youtube-summary",
        icon: "/figma/menu/youtube.svg",
      },
    ],
  },
  {
    title: "کارکتر و همراه",
    href: "/products#companion",
    links: [
      {
        label: "کارکترها",
        href: "/tools/characters",
        icon: "/figma/menu/sticky-note-square-smile.svg",
      },
      {
        label: "همراه هوشمند",
        href: "/tools/personal-companion",
        icon: "/figma/menu/user-star.svg",
      },
    ],
  },
];
