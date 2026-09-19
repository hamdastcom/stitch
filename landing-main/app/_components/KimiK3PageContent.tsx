"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const APP_URL = "http://app.hamdast.com/";
const easeOut = [0.16, 1, 0.3, 1] as const;

function openApp() {
  window.open(APP_URL, "_blank", "noopener,noreferrer");
}

/* -------------------------------------------------------------------------- */
/*                                Section Headers                              */
/* -------------------------------------------------------------------------- */
function SectionHeader({
  title,
  subtitle,
  badge,
  theme = "light",
}: {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  badge?: string;
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";
  return (
    <div className="flex flex-col items-center gap-2 text-center sm:gap-3">
      {badge ? (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold tracking-wide ${
            isDark
              ? "border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF]"
              : "border border-[#00B4D8]/30 bg-[#00B4D8]/10 text-[#007EA7]"
          }`}
        >
          <span className="size-1.5 rounded-full bg-current animate-pulse" />
          {badge}
        </span>
      ) : null}

      <h2
        className={`font-black ${
          isDark ? "text-white" : "text-[#0A1128]"
        } text-xl leading-8 sm:text-[30px] sm:leading-[42px]`}
      >
        {typeof title === "string"
          ? title.split("\n").map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))
          : title}
      </h2>

      {subtitle ? (
        <div
          className={`max-w-[850px] text-sm font-medium leading-6 sm:text-base sm:leading-7 ${
            isDark ? "text-slate-300" : "text-[#4A5568]"
          }`}
        >
          {typeof subtitle === "string"
            ? subtitle.split("\n").map((line, idx) => (
                <span key={idx} className="block">
                  {line}
                </span>
              ))
            : subtitle}
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                        Section 01: Hero & 1M Inspector                     */
/* -------------------------------------------------------------------------- */
const VALUE_TAGS = [
  { label: "کانتکست ۱,۰۰۰,۰۰۰ توکن واقعی", icon: "📚" },
  { label: "درک چندوجهی همزمان تصویر و متن", icon: "👁️" },
  { label: "عامل‌های خودکار و پژوهش ژرف", icon: "🤖" },
];

type InspectorTab = {
  id: string;
  label: string;
  icon: string;
  documentsTitle: string;
  tokensCount: string;
  files: string[];
  userQuery: string;
  scanTime: string;
  scannedTokens: string;
  findings: string[];
  insight: string;
};

const INSPECTOR_TABS: InspectorTab[] = [
  {
    id: "legal",
    label: "تحلیل پرونده‌های حقوقی ۱۰۰۰ صفحه‌ای",
    icon: "⚖️",
    documentsTitle: "۵ سند مناقصه و قرارداد پیمانکاری با حجم مجموعاً ۳۴۰ هزار کلمه",
    tokensCount: "۷۸۰,۰۰۰ توکن بارگذاری‌شده",
    files: [
      "قرارداد_عمومی_پیمان_فاز_۱.pdf (۲۴۰ صفحه)",
      "پیوست_ج_تعهدات_ضمانت.pdf (۳۱۰ صفحه)",
      "صورتجلسه_تعدیل_نرخ_ارزی.pdf (۱۸۰ صفحه)",
      "اسناد_فنی_و_مقررات_تاخیرات.pdf (۲۹۰ صفحه)",
    ],
    userQuery:
      "«در میان این ۵ قرارداد، کدام بند در صورت تاخیر بیش از ۱۵ روز، پیمانکار را مشمول ضبط ضمانت‌نامه بدون اخطار قبلی می‌کند؟»",
    scanTime: "۱.۹ ثانیه",
    scannedTokens: "۸۵۰,۰۰۰ توکن",
    findings: [
      "یافته در پیوست ج سند شماره ۳ (صفحه ۴۱۲، بند ۱۸-۴): پیمانکار در صورت تاخیر فاز دوم بیش از ۱۵ روز کاری، مشمول ضبط بی‌قیدوشرط ضمانت‌نامه بدون نیاز به ابلاغ اظهارنامه رسمی خواهد بود.",
    ],
    insight:
      "تناقض قانونی شناسایی‌شده: این بند با ماده ۵۲ شرایط عمومی پیمان در سند شماره ۱ که فرصت ۱۰ روزه اعتراض پیش‌بینی کرده در تعارض آشکار است.",
  },
  {
    id: "academic",
    label: "تحلیل ۵ کتاب مرجع همزمان",
    icon: "📖",
    documentsTitle: "۵ کتاب مرجع دانشگاهی بیوشیمی و فیزیولوژی هارپر، گایتون و لنینجر",
    tokensCount: "۹۲۰,۰۰۰ توکن فعال",
    files: [
      "Lehninger_Principles_of_Biochemistry.pdf (۱۱۰۰ صفحه)",
      "Guyton_Hall_Medical_Physiology.pdf (۱۰۵۰ صفحه)",
      "Harper_Illustrated_Biochemistry.pdf (۸۲۰ صفحه)",
      "Cell_Metabolism_Review_2026.pdf (۱۴۰ صفحه)",
    ],
    userQuery:
      "«مکانیسم متقابل مسیر سیگنالینگ mTORC1 و اتوفاژی سلولی را با استناد دقیق به فصول و جداول مقایسه‌ای استخراج کن.»",
    scanTime: "۲.۱ ثانیه",
    scannedTokens: "۹۲۰,۰۰۰ توکن",
    findings: [
      "کتاب لنینجر (فصل ۲۲، صفحه ۸۷۴): فعال‌سازی Akt منجر به فسفوریلاسیون کمپلکس TSC1/2 شده و با رهایش پروتئین Rheb-GTP، فعال‌سازی مستقیم کیناز mTORC1 را در غشای لیزوزوم تسهیل می‌کند.",
      "کتاب گایتون (فصل ۶۷، جدول ۳-۶۷): مهار فرآیند اتوفاژی توسط mTORC1 از طریق فسفوریلاسیون مستقیم کمپلکس ULK1/Atg13 در سیتوپلاسم صورت می‌پذیرد.",
    ],
    insight:
      "سنتز مفهومی Kimi K3: تطابق دیاگرام‌های مسیر بیوشیمیایی در فصل ۲۲ لنینجر با شواهد بالینی گایتون نشان‌دهنده پنجره مداخله درمانی در هایپرتروفی عضلانی است.",
  },
  {
    id: "kernel",
    label: "بررسی سورس‌کد کامل هسته لینوکس",
    icon: "💻",
    documentsTitle: "ریپازیتوری کامل زیرسیستم‌های حافظه و زمان‌بند هسته لینوکس",
    tokensCount: "۷۵۰,۰۰۰ توکن کد و معماری",
    files: [
      "mm/slub.c & mm/slab.c (۳۲,۰۰۰ خط کد C)",
      "kernel/sched/fair.c (۱۴,۰۰۰ خط کد C)",
      "include/linux/mm.h (۸,۰۰۰ خط هدر)",
      "Documentation/vm/slub.rst (مستندات معماری)",
    ],
    userQuery:
      "«کدام توابع در زیرسیستم slab allocator خطر lock contention را در پردازنده‌های بیش از ۱۲۸ هسته ایجاد می‌کنند؟»",
    scanTime: "۱.۷ ثانیه",
    scannedTokens: "۷۵۰,۰۰۰ توکن",
    findings: [
      "تحلیل فایل mm/slub.c (خطوط ۱۴۵۰ تا ۱۵۱۰): تابع kmem_cache_cpu_free در شرایط جابجایی سریع آبجکت‌ها بین گره‌های NUMA، به قفل سراسری node->list_lock مراجعه مکرر دارد.",
      "نقطه بحرانی پرفورمنس: در ترافیک تخصیص همزمان در ماشین‌های NUMA با بیش از ۱۲۸ هسته، این قفل موجب اتلاف بیش از ۳۴٪ چرخه‌های CPU می‌شود.",
    ],
    insight:
      "راهکار پیشنهادی Kimi K3: بازسازی متد با الگوی per-cpu freelist بافرشده و تفکیک قفل‌های دانه ریز محلی.",
  },
];

function ContextInspectorSimulator() {
  const [activeTab, setActiveTab] = useState(0);
  const current = INSPECTOR_TABS[activeTab];

  return (
    <div className="relative mx-auto w-full max-w-[1140px]">
      {/* Outer Cyan Cosmic Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-r from-[#00E5FF]/25 via-[#00B4D8]/15 to-[#007EA7]/20 blur-xl opacity-80"
      />

      <div className="relative overflow-hidden rounded-[24px] border border-[#00E5FF]/35 bg-[#0A1128] text-white shadow-[0px_20px_60px_rgba(10,17,40,0.8)]">
        {/* Console Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#060C1E] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-3 rounded-full bg-[#FF5F56] shadow-sm" />
              <span className="size-3 rounded-full bg-[#FFBD2E] shadow-sm" />
              <span className="size-3 rounded-full bg-[#27C93F] shadow-sm" />
            </span>
            <span className="font-mono text-xs font-bold text-slate-200 sm:text-sm">
              🛰️ Kimi K3 Long-Context Studio — موتور جستجوی ادراکی در اسناد کلان
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3 py-0.5 font-mono text-[11px] font-bold text-[#00E5FF]">
              <span className="size-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              آنلاین | کانتکست ۱M
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          role="tablist"
          aria-label="تب‌های شبیه‌ساز Kimi K3"
          className="flex overflow-x-auto border-b border-white/10 bg-[#080E24] px-2 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {INSPECTOR_TABS.map((tab, idx) => {
            const isSelected = idx === activeTab;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => setActiveTab(idx)}
                className={`group flex shrink-0 items-center gap-2 rounded-t-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                  isSelected
                    ? "border-t-2 border-[#00E5FF] bg-[#0A1128] text-[#00E5FF]"
                    : "border-t-2 border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Simulator Content Panel */}
        <div className="flex flex-col gap-4 p-4 text-right sm:p-6" dir="rtl">
          {/* Document Ingestion & Metrics Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#060C1E] p-3.5 sm:px-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 sm:text-sm">
              <span className="text-[#00E5FF]">📁 بارگذاری اسناد:</span>
              <span>{current.documentsTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#00E5FF]/15 px-2.5 py-1 font-mono text-xs font-extrabold text-[#00E5FF]">
                {current.tokensCount}
              </span>
            </div>
          </div>

          {/* Uploaded Files Chips */}
          <div className="flex flex-wrap gap-2">
            {current.files.map((file) => (
              <span
                key={file}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300"
              >
                <span>📄</span>
                <span>{file}</span>
              </span>
            ))}
          </div>

          {/* User Query Box */}
          <div className="rounded-xl border border-[#00B4D8]/30 bg-[#0B1E38]/50 p-4">
            <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-[#00B4D8]">
              <span>💬 پرسش تحلیلی کاربر:</span>
            </div>
            <p className="text-xs font-medium leading-6 text-slate-100 sm:text-sm">
              {current.userQuery}
            </p>
          </div>

          {/* Kimi K3 Reasoning Scan & Needle Extraction */}
          <div className="relative overflow-hidden rounded-xl border border-[#00E5FF]/40 bg-gradient-to-b from-[#061224] to-[#081830] p-4 sm:p-5">
            {/* Visual Scan Beam Effect */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-80 animate-pulse"
            />

            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-[#00E5FF] animate-ping" />
                <span className="text-xs font-black text-[#00E5FF] sm:text-sm">
                  نتیجه کاوش هوشمند Kimi K3
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  (زمان پردازش: {current.scanTime} بر روی {current.scannedTokens})
                </span>
              </div>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                NEEDLE ACCURACY: 99.8%
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {current.findings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs leading-6 text-slate-200 sm:text-sm">
                  <span className="text-[#00E5FF] font-bold">•</span>
                  <p>{finding}</p>
                </div>
              ))}

              <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs font-semibold leading-6 text-amber-200">
                <span className="font-bold text-amber-400">💡 </span>
                {current.insight}
              </div>
            </div>
          </div>

          {/* Simulator CTA Hook */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
            <span className="text-xs font-medium text-slate-400">
              برای بارگذاری فایل‌های PDF، داکیومنت‌های مالی و اکسل حجیم خودتان:
            </span>
            <button
              type="button"
              onClick={openApp}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00E5FF] transition-colors hover:text-[#70E000]"
            >
              <span>ورود به هم‌دست و شروع تحلیل اسناد</span>
              <span>&larr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section01Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1128] via-[#0C1738] to-[#0A1128] px-4 pt-10 pb-16 text-white sm:pt-14 sm:pb-24">
      {/* Background Cosmic Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00E5FF 1px, transparent 1px), linear-gradient(to bottom, #00E5FF 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Ambient Electric Radial Highlights */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 size-[720px] rounded-full bg-[#00B4D8]/15 blur-[140px]"
      />

      <div className="relative mx-auto flex w-full max-w-[1140px] flex-col items-center gap-8 text-center sm:gap-10">
        {/* Breadcrumb */}
        <nav
          aria-label="مسیر راهنما"
          className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-400 sm:text-sm"
        >
          <Link href="/" className="transition-colors hover:text-[#00E5FF]">
            هم‌دست
          </Link>
          <span aria-hidden className="text-slate-600">
            &gt;
          </span>
          <Link
            href="/products#models"
            className="transition-colors hover:text-[#00E5FF]"
          >
            مدل‌های هوش مصنوعی
          </Link>
          <span aria-hidden className="text-slate-600">
            &gt;
          </span>
          <span className="text-[#00E5FF]">Kimi K3</span>
        </nav>

        {/* Badge */}
        <div className="inline-flex max-w-full items-center gap-2 rounded-2xl border border-[#00E5FF] bg-[#001E3D] px-4 py-2 text-center text-xs font-bold text-white shadow-[0_0_24px_rgba(0,229,255,0.3)] sm:text-sm">
          <span>🌌</span>
          <span>
            ابرمدل ۲.۸ تریلیون پارامتری Moonshot AI — پیشگام پردازش ۱,۰۰۰,۰۰۰ توکن یکپارچه
          </span>
        </div>

        {/* H1 Title */}
        <h1 className="max-w-[980px] text-2xl font-black leading-tight sm:text-4xl lg:text-[44px] lg:leading-[58px]">
          <span className="block text-white">هوش مصنوعی Kimi K3</span>
          <span className="mt-2 block bg-gradient-to-l from-[#00E5FF] via-[#70E000] to-[#00B4D8] bg-clip-text text-transparent">
            اقیانوس کانتکست ۱ میلیون توکنی و استدلال عامل‌محور در ایران
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-[880px] text-sm font-medium leading-7 text-slate-300 sm:text-lg sm:leading-8">
          دیگر نیازی به خلاصه‌سازی اجباری یا قطعه‌قطعه کردن کتاب‌ها، گزارش‌های مالی
          ۵۰۰ صفحه‌ای یا رپوزیتوری‌های عظیم نرم‌افزاری نیست. Kimi K3 با کانتکست
          شگفت‌انگیز ۱ میلیون توکنی و ادراک چندوجهی، کل اطلاعات شما را در حافظه فعال
          نگه می‌دارد و در چند ثانیه به پیچیده‌ترین سوالات استدلالی پاسخ می‌دهد.
          در پلتفرم هم‌دست، بدون نیاز به شماره‌های خارجی و بدون فیلترشکن، مستقیماً به
          قدرت Moonshot AI دسترسی پیدا کنید.
        </p>

        {/* Value Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {VALUE_TAGS.map((tag) => (
            <span
              key={tag.label}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 backdrop-blur-sm transition-colors hover:border-[#00E5FF]/40 sm:text-sm"
            >
              <span>{tag.icon}</span>
              <span>{tag.label}</span>
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={openApp}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#00B4D8] px-8 text-base font-extrabold text-[#001220] shadow-[0_0_24px_rgba(0,180,216,0.5)] transition-all hover:bg-[#00E5FF] hover:shadow-[0_0_32px_rgba(0,229,255,0.7)] sm:w-auto sm:text-lg"
          >
            شروع رایگان با Kimi K3 — تست با شماره موبایل
          </button>
          <a
            href="#comparison"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#00B4D8] bg-transparent px-8 text-base font-extrabold text-white backdrop-blur-sm transition-colors hover:bg-[#00B4D8]/10 sm:w-auto sm:text-lg"
          >
            بررسی معماری MoE و بنچمارک‌ها
          </a>
        </div>

        {/* 1M Context Inspector Simulator */}
        <div className="w-full pt-4">
          <ContextInspectorSimulator />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                 Section 02: Performance & Authority Bar                     */
/* -------------------------------------------------------------------------- */
const STATS = [
  {
    title: "۱,۰۴۸,۵۷۶ توکن",
    desc: "طولانی‌ترین پنجره کانتکست پایدار جهان",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    ),
  },
  {
    title: "۲.۸ تریلیون پارامتر",
    desc: "معماری MoE با فعال‌سازی ۱۶ کارشناس از ۸۹۶",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "۱۰۰٪ بازیابی بدون خطا",
    desc: "امتیاز ۹۹.۸٪ در آزمون Needle-In-A-Haystack",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "ریالی و بدون مسدودی",
    desc: "اتصال پایدار تجاری بدون دردسرهای ارزی",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
];

function Section02Stats() {
  return (
    <section className="relative z-10 -mt-8 mx-auto w-full max-w-[1140px] px-4">
      <div className="grid grid-cols-1 divide-y divide-[#00E5FF]/15 rounded-2xl border border-[#00E5FF]/30 bg-[#060C1E] p-2 shadow-2xl sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 lg:divide-x lg:divide-x-reverse">
        {STATS.map((stat) => (
          <div
            key={stat.title}
            className="flex items-center gap-3.5 p-4 text-right transition-colors hover:bg-white/5"
            dir="rtl"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]">
              {stat.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-base font-black text-white sm:text-lg">
                {stat.title}
              </span>
              <span className="text-xs font-medium text-slate-300">
                {stat.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*               Section 03: Distinct Features Grid                           */
/* -------------------------------------------------------------------------- */
const CAPABILITIES = [
  {
    module: "۱. حافظه ۱ میلیون توکنی پایدار",
    capability:
      "معماری Kimi Delta Attention بدون افت کارایی و بدون فراموشی جزئیات ابتدای متن.",
    benefit:
      "بارگذاری کامل کتاب‌های تخصصی، پایان‌نامه‌ها و آرشیو چندساله قراردادها در یک گفتگو.",
  },
  {
    module: "۲. چندوجهی بومی (Native Vision)",
    capability:
      "انکودر تصویری MoonViT-V2 جهت تحلیل همزمان نمودارها، اسکرین‌شات‌ها، نقشه‌های معماری و CAD.",
    benefit:
      "استخراج داده از صورت‌های مالی اسکن‌شده، فاکتورهای تصویری و نقشه‌های مهندسی به فارسی.",
  },
  {
    module: "۳. تحقیقات مستقل عامل‌محور (Agentic Research)",
    capability:
      "توانایی زنجیره‌سازی ابزارها، کاوش وب و ساخت داشبوردهای تعاملی برای گزارش‌های تحلیلی.",
    benefit:
      "تهیه گزارش‌های جامع بازار و تحلیل رقبا با نمودارهای ساختاریافته بدون دخالت دستی.",
  },
  {
    module: "۴. پایداری در کدنویسی سورس‌های کلان",
    capability:
      "پیمایش کل ساختار یک ریپازیتوری، درک وابستگی‌های فریم‌ورک و بهینه‌سازی کدهای هسته (Kernel).",
    benefit:
      "دیباگ کدهای سنگین چندماژوله و ارتقای پروژه‌های نرم‌افزاری انترپرایز.",
  },
  {
    module: "۵. هزینه اقتصادی و کارایی MoE",
    capability:
      "فعال‌سازی هوشمند تنها ۱۰۴ میلیارد پارامتر از ۲.۸ تریلیون در هر لحظه (LatentMoE).",
    benefit:
      "پردازش ارزان‌تر و سریع‌تر پروژه‌های حجیم سازمانی با هزینه‌ای کسری از مدل‌های غربی.",
  },
  {
    module: "۶. درک استثنایی زبان فارسی و شرقی",
    capability:
      "تسلط بالا بر ساختارهای نحوی زبان‌های مختلف و متون فشرده دانشگاهی فارسی.",
    benefit:
      "ترجمه یکدست کل کتاب‌های مرجع به فارسی روان بدون از دست رفتن پیوستگی مفاهیم.",
  },
];

function Section03Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col items-center gap-10">
        <SectionHeader
          badge="توانمندی‌های بی‌رقیب پردازش حجیم"
          title="چرا نخبگان و پژوهشگران داده Kimi K3 را انتخاب می‌کنند؟"
          subtitle="توانمندی‌های بی‌رقیب در پردازش داده‌های فوق‌حجیم که هیچ مدل دیگری تاب رقابت با آن را ندارد."
        />

        {/* Desktop Table View */}
        <div className="hidden w-full overflow-hidden rounded-2xl border border-[#0A1128]/10 bg-white shadow-sm md:block">
          <table className="w-full text-right" dir="rtl">
            <thead className="bg-[#0A1128] text-white">
              <tr>
                <th className="w-1/4 px-6 py-4 text-sm font-extrabold">
                  ماژول تخصصی
                </th>
                <th className="w-1/2 px-6 py-4 text-sm font-extrabold">
                  شرح توانمندی فنی
                </th>
                <th className="w-1/4 px-6 py-4 text-sm font-extrabold text-[#00E5FF]">
                  کاربرد مستقیم برای کاربر ایرانی
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {CAPABILITIES.map((row, i) => (
                <tr
                  key={row.module}
                  className={`transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"
                  } hover:bg-[#00E5FF]/5`}
                >
                  <td className="px-6 py-4.5 text-sm font-bold text-[#0A1128]">
                    {row.module}
                  </td>
                  <td className="px-6 py-4.5 text-sm leading-6 text-slate-600">
                    {row.capability}
                  </td>
                  <td className="px-6 py-4.5 text-xs font-semibold leading-5 text-[#007EA7]">
                    {row.benefit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card-List View */}
        <div className="flex w-full flex-col gap-3 md:hidden" dir="rtl">
          {CAPABILITIES.map((row) => (
            <div
              key={row.module}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span className="text-base font-extrabold text-[#0A1128]">
                {row.module}
              </span>
              <p className="text-xs leading-6 text-slate-600">
                {row.capability}
              </p>
              <div className="mt-1 rounded-lg bg-[#00E5FF]/10 p-2 text-xs font-bold text-[#007EA7]">
                کاربرد: {row.benefit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*              Section 04: Detailed Comparison Table                         */
/* -------------------------------------------------------------------------- */
const COMPARISON_ROWS = [
  {
    feature: "طول پنجره کانتکست (Context Window)",
    kimi: "۱,۰۰۰,۰۰۰ توکن واقعی",
    gpt: "۱۲۸,۰۰۰ تا ۲۰۰,۰۰۰ توکن",
    claude: "۲۰۰,۰۰۰ توکن",
  },
  {
    feature: "حفظ دقت در میانه اسناد (Needle Accuracy)",
    kimi: "۹۹.۸٪ (به لطف KDA و AttnRes)",
    gpt: "افت در متون بالای ۱۰۰ هزار کلمه",
    claude: "بسیار خوب تا ۱۵۰ هزار توکن",
  },
  {
    feature: "ابعاد مدل و معماری",
    kimi: "۲.۸ تریلیون پارامتر MoE",
    gpt: "نامشخص (حدود ۱.۸ تریلیون MoE)",
    claude: "نامشخص",
  },
  {
    feature: "پشتیبانی از فایل‌های تصویری سنگین",
    kimi: "بله (MoonViT-V2 چندوجهی بومی)",
    gpt: "بله",
    claude: "بله",
  },
  {
    feature: "دسترسی و پرداخت در ایران",
    kimi: "پرداخت ریالی شتاب + بدون فیلترشکن",
    gpt: "نیازمند دلار، ویزاکارت و VPN ثابت",
    claude: "نیازمند حساب خارجی با خطر مسدودسازی",
  },
  {
    feature: "قیمت تمام‌شده به ازای هر توکن",
    kimi: "فوق‌العاده اقتصادی و ارزان",
    gpt: "گران‌قیمت",
    claude: "متوسط تا گران",
  },
];

function Section04Comparison() {
  return (
    <section id="comparison" className="scroll-mt-20 bg-[#F8FAFC] py-20 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col items-center gap-10">
        <SectionHeader
          badge="مقایسه علمی و ظرفیتی"
          title="مقایسه ظرفیت پردازشی Kimi K3 با سایر غول‌های هوش مصنوعی"
          subtitle="وقتی حجم داده‌ها فراتر از توان مدل‌های معمولی می‌رود، تفاوت‌ها نمایان می‌شود:"
        />

        <div className="w-full overflow-x-auto">
          <div className="min-w-[760px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="rtl">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-1/4 bg-slate-100 px-5 py-4 text-sm font-extrabold text-[#0A1128]">
                    شاخص مقایسه
                  </th>
                  <th className="w-1/4 border-x border-[#00E5FF]/40 bg-[#0A1128] px-5 py-4 text-center text-sm font-black text-[#00E5FF]">
                    Kimi K3 در هم‌دست ✅
                  </th>
                  <th className="w-1/4 bg-slate-50 px-5 py-4 text-center text-sm font-bold text-slate-700">
                    GPT-4o / GPT-5.1 ⚠️
                  </th>
                  <th className="w-1/4 bg-slate-50 px-5 py-4 text-center text-sm font-bold text-slate-700">
                    Claude 3.5 / 3.7 Sonnet ⚠️
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-5 py-4 text-sm font-bold text-[#0A1128]">
                      {row.feature}
                    </td>

                    {/* Kimi K3 Highlighted Column */}
                    <td className="border-x border-[#00E5FF]/30 bg-[#0A1128]/5 px-5 py-4 text-center text-sm font-extrabold text-[#007EA7]">
                      <div className="inline-flex items-center gap-1.5">
                        <span>{row.kimi}</span>
                        <span className="text-emerald-600 font-bold">✓</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center text-xs text-slate-600 sm:text-sm">
                      {row.gpt}
                    </td>

                    <td className="px-5 py-4 text-center text-xs text-slate-600 sm:text-sm">
                      {row.claude}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                       Section 05: Mid-Page Banner                           */
/* -------------------------------------------------------------------------- */
function Section05MidBanner() {
  return (
    <section className="relative overflow-hidden bg-[#0A1128] py-16 px-4 text-white sm:py-20 sm:px-6">
      {/* Background Cosmic Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#00E5FF 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 size-96 rounded-full bg-[#00B4D8]/20 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-[1000px] flex-col items-center gap-6 rounded-3xl border border-[#00E5FF]/35 bg-gradient-to-r from-[#060C1E] via-[#0A1128] to-[#060C1E] p-8 text-center shadow-2xl sm:p-12">
        <span className="rounded-full border border-[#00E5FF]/35 bg-[#00E5FF]/10 px-4 py-1 text-xs font-bold text-[#00E5FF]">
          پایان قطعه‌قطعه کردن متون طولانی
        </span>

        <h3 className="text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
          کتاب‌ها و پروژه‌های خود را یکجا به هوش مصنوعی بسپارید
        </h3>

        <p className="max-w-[720px] text-sm font-medium leading-7 text-slate-300 sm:text-base">
          دیگر زمان خود را برای قطعه‌قطعه کردن اسناد یا مقابله با خطای محدودیت حافظه
          تلف نکنید. با حافظه ۱ میلیون توکنی Kimi K3 در هم‌دست، همه چیز را با یک پرامپت
          تحلیل کنید.
        </p>

        <button
          type="button"
          onClick={openApp}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00B4D8] px-8 text-base font-extrabold text-[#001220] shadow-[0_0_24px_rgba(0,180,216,0.5)] transition-all hover:bg-[#00E5FF] hover:shadow-[0_0_32px_rgba(0,229,255,0.7)] sm:text-lg"
        >
          امتحان رایگان Kimi K3 — بارگذاری اولین پرونده یا کتاب
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                  Section 06: Model Ecosystem Grid                           */
/* -------------------------------------------------------------------------- */
const ECOSYSTEM_MODELS = [
  {
    name: "Claude Opus",
    desc: "پرچمدار تفکر فلسفی، محاسبات عمیق و استدلال‌های دشوار آکادمیک.",
    href: "/tools/models/claude",
    tag: "تفکر فلسفی و استدلال عمیق",
  },
  {
    name: "Claude Fable 5",
    desc: "متخصص کدنویسی چندماژوله، معماری نرم‌افزار و رفع باگ‌های امنیتی.",
    href: "/tools/models/claude-fable-5",
    tag: "مهندسی نرم‌افزار و کدنویسی",
  },
  {
    name: "Claude Sonnet",
    desc: "بهترین قلم برای تولید محتوای انسانی، ادبی و بازاریابی طبیعی.",
    href: "/tools/models/claude",
    tag: "تولید محتوا و ترجمه ادبی",
  },
  {
    name: "GPT-5.1",
    desc: "موتور قدرتمند استدلال چندوجهی OpenAI برای کارهای تحلیلی سنگین.",
    href: "/tools/models/chat-gpt",
    tag: "استدلال تجاری چندوجهی",
  },
  {
    name: "GPT Terra",
    desc: "مدل تخصصی تحلیل اسناد تجاری، صورت‌های مالی و اکسل‌های شرکتی.",
    href: "/tools/chat-pdf",
    tag: "اسناد مالی و شرکتی",
  },
  {
    name: "Flux AI",
    desc: "تولید تصویر با جزئیات خیره‌کننده، تایپوگرافی تمیز و پرامپت‌های ترکیبی.",
    href: "/tools/image-generator",
    tag: "تولید تصویر هنری",
  },
];

function Section06Ecosystem() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col items-center gap-10">
        <SectionHeader
          badge="اکوسیستم هوش مصنوعی هم‌دست"
          title="تنوع بی‌نظیر مدل‌های برتر دنیا در یک اشتراک هم‌دست"
          subtitle="هر ابزار برای بهترین کارایی خود انتخاب شده است:"
        />

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" dir="rtl">
          {ECOSYSTEM_MODELS.map((model) => (
            <div
              key={model.name}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#00B4D8]/50 hover:shadow-md"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#0A1128]">
                    {model.name}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                    {model.tag}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {model.desc}
                </p>
              </div>

              <Link
                href={model.href}
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#007EA7] transition-colors hover:text-[#00B4D8]"
              >
                <span>مشاهده لندینگ {model.name}</span>
                <span aria-hidden>&larr;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                       Section 07: FAQ Accordion                             */
/* -------------------------------------------------------------------------- */
const FAQS = [
  {
    q: "هوش مصنوعی Kimi K3 چیست و چه شرکتی آن را ساخته است؟",
    a: "Kimi K3 پیشرفته‌ترین مدل هوش مصنوعی چندوجهی شرکت Moonshot AI است. این مدل با ۲.۸ تریلیون پارامتر و استفاده از نوآوری‌های معماری Attention Residuals، قادر است بیش از ۱ میلیون توکن ورودی (معادل صدها صفحه متن، تصویر و کد) را بدون افت دقت پردازش نماید.",
  },
  {
    q: "کانتکست ۱ میلیون توکن در عمل چه کاربردی دارد؟",
    a: "یک میلیون توکن به شما امکان می‌دهد کل کدهای یک پروژه نرم‌افزاری بزرگ، یک رمان چندجلدی، صورت‌های مالی ده سال یک شرکت، یا ده‌ها پرونده حقوقی را در یک جلسه کاری بارگذاری کرده و مانند یک کارشناس خبره در میان تمام این اسناد جستجو، مقایسه و استنتاج کنید.",
  },
  {
    q: "آیا استفاده از Kimi K3 در پلتفرم هم‌دست به فیلترشکن نیاز دارد؟",
    a: "خیر. کاربران ایرانی می‌توانند بدون نیاز به هیچ‌گونه نرم‌افزار تحریم‌شکن یا تغییر IP و با بالاترین سرعت اینترنت داخلی از تمامی قابلیت‌های مدل Kimi K3 در هم‌دست استفاده کنند.",
  },
  {
    q: "هزینه اشتراک و نحوه پرداخت Kimi K3 در هم‌دست چگونه است؟",
    a: "به دلیل معماری بهینه MoE این مدل، هزینه استفاده از آن در پلتفرم هم‌دست بسیار اقتصادی است و تمامی پرداخت‌ها به‌صورت ریالی و با کارت‌های شتاب بانکی انجام می‌پذیرد.",
  },
  {
    q: "آیا Kimi K3 زبان فارسی را به درستی متوجه می‌شود؟",
    a: "بله. Kimi K3 با توجه به دادگان عظیم چندزبانه، درک بسیار دقیقی از واژگان، اصطلاحات علمی، دستور زبان و متون دانشگاهی و اداری فارسی دارد.",
  },
];

function Section07Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#F8FAFC] py-20 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[850px] flex-col items-center gap-10">
        <SectionHeader
          badge="پاسخ به سوالات شما"
          title="پاسخ به پرسش‌های متداول درباره مدل هوش مصنوعی Kimi K3"
          subtitle="همه‌چیز درباره طول کانتکست، پشتیبانی زبان فارسی و نحوه دسترسی بدون تحریم."
        />

        <div className="flex w-full flex-col gap-3" dir="rtl">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className={`overflow-hidden rounded-2xl border bg-white transition-all ${
                  isOpen
                    ? "border-[#00B4D8]/50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-right font-bold text-[#0A1128] sm:text-base"
                >
                  <span className="flex-1 text-sm font-extrabold sm:text-base">
                    س: {faq.q}
                  </span>
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-[#00B4D8]" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-5 text-sm font-medium leading-7 text-slate-700">
                    <span className="font-bold text-[#007EA7]">پ: </span>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                       Section 08: Closing Action Section                   */
/* -------------------------------------------------------------------------- */
function Section08ClosingAction() {
  return (
    <section className="relative overflow-hidden bg-[#0A1128] py-20 px-4 text-white sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00E5FF 1px, transparent 1px), linear-gradient(to bottom, #00E5FF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[640px] rounded-full bg-[#00E5FF]/10 blur-[150px]"
      />

      <div className="relative mx-auto flex w-full max-w-[850px] flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-black leading-tight sm:text-4xl lg:text-[40px]">
          پایان محدودیت حافظه در هوش مصنوعی
        </h2>

        <p className="max-w-[640px] text-sm font-medium leading-7 text-slate-300 sm:text-base">
          بزرگ‌ترین پروژه‌ها، اسناد و کتاب‌های خود را بدون نگرانی از قطع شدن یا کمبود حافظه
          به Kimi K3 بسپارید. همین امروز در هم‌دست رایگان شروع کنید.
        </p>

        <button
          type="button"
          onClick={openApp}
          className="inline-flex h-13 items-center justify-center rounded-xl bg-[#00B4D8] px-8 text-base font-extrabold text-[#001220] shadow-[0_0_28px_rgba(0,180,216,0.5)] transition-all hover:bg-[#00E5FF] hover:shadow-[0_0_36px_rgba(0,229,255,0.7)] sm:text-lg"
        >
          ثبت‌نام با شماره موبایل و تست رایگان Kimi K3
        </button>

        {/* Feature Checks */}
        <div
          dir="rtl"
          className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-300 sm:gap-6 sm:text-sm"
        >
          <span className="flex items-center gap-1.5 text-[#00E5FF]">
            <span>✓</span>
            <span className="text-slate-200">دسترسی مستقیم بدون فیلترشکن</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-[#00E5FF]">
            <span>✓</span>
            <span className="text-slate-200">پرداخت ریالی با کارت شتاب</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-[#00E5FF]">
            <span>✓</span>
            <span className="text-slate-200">کانتکست نامحدود ۱M توکن</span>
          </span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Main Page Content                            */
/* -------------------------------------------------------------------------- */
export function KimiK3PageContent() {
  const reduce = !!useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: easeOut }}
      className="flex flex-col bg-white"
    >
      <Section01Hero />
      <Section02Stats />
      <Section03Features />
      <Section04Comparison />
      <Section05MidBanner />
      <Section06Ecosystem />
      <Section07Faq />
      <Section08ClosingAction />
    </motion.div>
  );
}
