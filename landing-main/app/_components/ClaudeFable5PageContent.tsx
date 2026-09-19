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
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
            isDark
              ? "border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF]"
              : "border border-[#00A8E8]/30 bg-[#00A8E8]/10 text-[#007EA7]"
          }`}
        >
          <span className="size-1.5 rounded-full bg-current animate-pulse" />
          {badge}
        </span>
      ) : null}

      <h2
        className={`font-extrabold ${
          isDark ? "text-white" : "text-[#0B132B]"
        } text-xl leading-8 sm:text-[30px] sm:leading-[40px]`}
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
/*                        Section 01: Hero & Code Studio                       */
/* -------------------------------------------------------------------------- */
const VALUE_TAGS = [
  { label: "ریفکتور چندفایلی یکپارچه", icon: "💻" },
  { label: "پویش و رفع حفره‌های امنیتی OWASP", icon: "🛡️" },
  { label: "نگارش خودکار Unit Test و E2E", icon: "🧪" },
];

type StudioTab = {
  id: string;
  label: string;
  lang: string;
  filename: string;
  beforeTitle: string;
  beforeCode: string;
  afterTitle: string;
  afterCode: string;
  analysis: string;
};

const STUDIO_TABS: StudioTab[] = [
  {
    id: "go",
    label: "Go Concurrency Pipeline",
    lang: "go",
    filename: "queue/handler.go",
    beforeTitle: "آسیب‌پذیر در برابر Race Condition و Memory Leak",
    beforeCode: `// --- BEFORE: فاقد کانال کنترل یا Context Timeout
func HandleQueue(req Request) {
    go processData(req) // نشت بالقوه گوروتین در ترافیک بالا
}`,
    afterTitle: "بازنویسی توسط Claude Fable 5 با مکانیزم Worker Pool",
    afterCode: `// +++ AFTER: بازنویسی توسط Claude Fable 5 با مکانیزم Worker Pool
func HandleQueue(ctx context.Context, req Request, pool *WorkerPool) error {
    select {
    case pool.tasks <- Task{Ctx: ctx, Payload: req}:
        return nil
    case <-ctx.Done():
        return fmt.Errorf("queue rejected: context timeout: %w", ctx.Err())
    }
}`,
    analysis:
      "باگ نشت گوروتین در ترافیک بالا برطرف شد و با افزودن Context Timeout، زمان پاسخ به کمتر از ۴۵ میلی‌ثانیه محدود گردید. تست‌های یکپارچگی پاس شدند.",
  },
  {
    id: "nextjs",
    label: "Next.js + TypeScript Micro-Frontend",
    lang: "typescript",
    filename: "services/userSession.ts",
    beforeTitle: "تداخل State سراسری بین رندرهای همزمان SSR",
    beforeCode: `// --- BEFORE: نشت داده بین کانتکست درخواست‌ها
export const userSessionCache = new Map<string, Session>()

export async function getSession(userId: string) {
  if (userSessionCache.has(userId)) return userSessionCache.get(userId)
  const session = await fetchSession(userId)
  userSessionCache.set(userId, session)
  return session
}`,
    afterTitle: "بازنویسی توسط Claude Fable 5 با React cache و Scope ایمن",
    afterCode: `// +++ AFTER: بازنویسی توسط Claude Fable 5 با React cache و Timeout ایزوله
import { cache } from "react"

export const getSession = cache(async (userId: string) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 1200)
  try {
    return await fetchSession(userId, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
})`,
    analysis:
      "ایزولاسیون کامل نشست‌ها در لایه SSR پیاده شد؛ خطر نشت سشن میان کاربران حل شد و با افزودن AbortController، ریسک درخواست‌های معلق رفع گردید.",
  },
  {
    id: "fastapi",
    label: "FastAPI JWT Security",
    lang: "python",
    filename: "security/auth.py",
    beforeTitle: "فقدان اعتبارسنجی انقضا، نوع و امضای کلید توکن",
    beforeCode: `// --- BEFORE: فقدان بررسی الگوریتم و انقضای زمانی توکن
def verify_token(token: str = Depends(oauth2_scheme)):
    payload = jwt.decode(token, SECRET_KEY, verify=False)
    return payload["user_id"]`,
    afterTitle: "بازنویسی توسط Claude Fable 5 با استانداردهای OWASP ASVS",
    afterCode: `// +++ AFTER: بازنویسی توسط Claude Fable 5 با تطابق کامل OWASP ASVS
def verify_token(token: str = Depends(oauth2_scheme)) -> TokenPayload:
    try:
        payload = jwt.decode(
            token, SECRET_KEY, algorithms=["HS256"],
            options={"require": ["exp", "sub", "iss"], "verify_exp": True}
        )
        return TokenPayload(**payload)
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid auth token") from exc`,
    analysis:
      "حفره امنیتی احراز هویت OWASP A07 بسته شد؛ امضای توکن، انقضای زمانی و الگوریتم صراحتاً اعتبارسنجی شدند.",
  },
];

function FableCodeStudioSimulator() {
  const [activeTab, setActiveTab] = useState(0);
  const current = STUDIO_TABS[activeTab];

  return (
    <div className="relative mx-auto w-full max-w-[1140px]">
      {/* Outer Glow in Navy/Cyan Palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-r from-[#00F0FF]/20 via-[#00A8E8]/10 to-[#8B04FF]/20 blur-xl opacity-75"
      />

      <div className="relative overflow-hidden rounded-[24px] border border-[#00F0FF]/30 bg-[#0B132B] text-white shadow-[0px_20px_50px_rgba(11,19,43,0.7)]">
        {/* Console Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#070D1F] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-3 rounded-full bg-[#FF5F56] shadow-sm" />
              <span className="size-3 rounded-full bg-[#FFBD2E] shadow-sm" />
              <span className="size-3 rounded-full bg-[#27C93F] shadow-sm" />
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-200 sm:text-sm">
                💻 Claude Fable 5 Dev Studio — ترمینال کامپایل و ریفکتور خودکار
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#00F0FF]">
              <span className="size-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              Online
            </span>
            <span className="hidden font-mono text-xs text-slate-400 sm:inline">
              {current.filename}
            </span>
          </div>
        </div>

        {/* Project Tabs */}
        <div
          role="tablist"
          aria-label="تب‌های پروژه"
          className="flex overflow-x-auto border-b border-white/10 bg-[#091024] px-2 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {STUDIO_TABS.map((tab, idx) => {
            const isSelected = idx === activeTab;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => setActiveTab(idx)}
                className={`group flex shrink-0 items-center gap-2 rounded-t-xl px-4 py-2.5 font-mono text-xs font-medium transition-all sm:text-sm ${
                  isSelected
                    ? "border-t-2 border-[#00F0FF] bg-[#0B132B] text-[#00F0FF]"
                    : "border-t-2 border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Diff Body */}
        <div className="grid gap-3 p-3 sm:p-5 lg:grid-cols-2">
          {/* BEFORE Pane */}
          <div className="flex min-h-[220px] flex-col overflow-hidden rounded-xl border border-red-500/25 bg-[#070D1F]">
            <div className="flex items-center justify-between border-b border-red-500/20 bg-red-950/25 px-3 py-2">
              <span className="text-xs font-bold text-red-300">
                // --- BEFORE
              </span>
              <span className="rounded bg-red-900/60 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-200">
                VULNERABLE
              </span>
            </div>
            <p className="border-b border-white/5 px-3 py-1.5 text-right text-[11px] font-medium text-slate-400">
              {current.beforeTitle}
            </p>
            <pre
              dir="ltr"
              className="flex-1 overflow-x-auto p-3 text-left font-mono text-xs leading-5 text-red-200/90 [scrollbar-width:thin]"
            >
              <code>{current.beforeCode}</code>
            </pre>
          </div>

          {/* AFTER Pane */}
          <div className="flex min-h-[220px] flex-col overflow-hidden rounded-xl border border-[#00F0FF]/30 bg-[#070D1F]">
            <div className="flex items-center justify-between border-b border-[#00F0FF]/20 bg-[#00F0FF]/10 px-3 py-2">
              <span className="text-xs font-bold text-[#00F0FF]">
                // +++ AFTER
              </span>
              <span className="rounded bg-[#00F0FF]/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#00F0FF]">
                OPTIMIZED BY FABLE 5
              </span>
            </div>
            <p className="border-b border-white/5 px-3 py-1.5 text-right text-[11px] font-medium text-slate-400">
              {current.afterTitle}
            </p>
            <pre
              dir="ltr"
              className="flex-1 overflow-x-auto p-3 text-left font-mono text-xs leading-5 text-[#A7F3D0] [scrollbar-width:thin]"
            >
              <code>{current.afterCode}</code>
            </pre>
          </div>
        </div>

        {/* Engineering Analysis Output Footer */}
        <div className="flex items-start gap-3 border-t border-white/10 bg-[#070D1F] px-4 py-3 sm:px-6">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-[#00F0FF]/20 text-[#00F0FF]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <p
            dir="rtl"
            className="text-right text-xs font-medium leading-6 text-slate-200 sm:text-sm"
          >
            <span className="font-extrabold text-[#00F0FF]">
              خروجی تحلیل مهندسی:{" "}
            </span>
            {current.analysis}
          </p>
        </div>
      </div>
    </div>
  );
}

function Section01Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0B132B] via-[#0D1837] to-[#0B132B] px-4 pt-10 pb-16 text-white sm:pt-14 sm:pb-24">
      {/* Background Cyber Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Ambient Radial Highlights */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 size-[680px] rounded-full bg-[#00A8E8]/15 blur-[120px]"
      />

      <div className="relative mx-auto flex w-full max-w-[1140px] flex-col items-center gap-8 text-center sm:gap-10">
        {/* Breadcrumb */}
        <nav
          aria-label="مسیر راهنما"
          className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-400 sm:text-sm"
        >
          <Link href="/" className="transition-colors hover:text-[#00F0FF]">
            هم‌دست
          </Link>
          <span aria-hidden className="text-slate-600">
            &gt;
          </span>
          <Link
            href="/products#models"
            className="transition-colors hover:text-[#00F0FF]"
          >
            مدل‌های هوش مصنوعی
          </Link>
          <span aria-hidden className="text-slate-600">
            &gt;
          </span>
          <span className="text-[#00F0FF]">Claude Fable 5</span>
        </nav>

        {/* Badge */}
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#00F0FF]/40 bg-[#00F0FF]/10 px-4 py-1.5 text-center text-xs font-bold text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.2)] sm:text-sm">
          <span>⚡</span>
          <span>
            مدل پیشرو مهندسی نرم‌افزار و معماری سیستم — فراتر از دستیارهای
            کدنویسی معمولی
          </span>
        </div>

        {/* H1 Title */}
        <h1 className="max-w-[960px] text-2xl font-black leading-tight sm:text-4xl lg:text-[44px] lg:leading-[56px]">
          <span className="block text-white">هوش مصنوعی Claude Fable 5</span>
          <span className="mt-2 block bg-gradient-to-l from-[#00F0FF] via-[#70E000] to-[#00A8E8] bg-clip-text text-transparent">
            مهندس نرم‌افزار هوشمند در خدمت تیم فنی شما
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-[880px] text-sm font-medium leading-7 text-slate-300 sm:text-lg sm:leading-8">
          کدنویسی مدرن نیازمند درک همزمان وابستگی‌های چندپروژه‌ای، تست‌های واحد
          خودکار و سناریوهای استقرار است. Claude Fable 5 کدهای شما را فقط تکمیل
          نمی‌کند؛ بلکه معماری را بازبینی، باگ‌های پنهان امنیتی را کشف و
          ماژول‌ها را با استانداردهای Clean Code بازنویسی می‌کند. در هم‌دست،
          بدون محدودیت‌های IP و بدون نیاز به حساب‌های خارجی، زیرساخت توسعه خود
          را ارتقا دهید.
        </p>

        {/* Technical Value Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {VALUE_TAGS.map((tag) => (
            <span
              key={tag.label}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 backdrop-blur-sm transition-colors hover:border-[#00F0FF]/40 sm:text-sm"
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
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#00A8E8] px-6 text-base font-extrabold text-[#0B132B] shadow-[0_0_24px_rgba(0,168,232,0.45)] transition-all hover:bg-[#00F0FF] hover:shadow-[0_0_32px_rgba(0,240,255,0.6)] sm:w-auto sm:text-lg"
          >
            شروع کدنویسی رایگان با Claude Fable 5
          </button>
          <a
            href="#capabilities"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-base font-extrabold text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto sm:text-lg"
          >
            بررسی نمونه پروژه‌ها و مستندات
          </a>
        </div>

        {/* Code Studio Simulator */}
        <div className="w-full pt-4">
          <FableCodeStudioSimulator />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                 Section 02: Technical Performance Metrics                   */
/* -------------------------------------------------------------------------- */
const METRICS = [
  {
    title: "+۹۲٪ قبولی HumanEval",
    desc: "بالاترین دقت سینتکس و ساختار الگوریتمی",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00F0FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    title: "۳ برابر سریع‌تر در کامپایل",
    desc: "زمان پاسخ‌دهی بهینه برای کارهای Real-time",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00F0FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "کاهش ۷۰٪ کدهای زائد",
    desc: "تولید پکیج‌های تمیز و Clean Code",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00F0FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M4 7h16" />
        <path d="M4 12h10" />
        <path d="M4 17h7" />
        <path d="M20 17l-3-3 3-3" />
      </svg>
    ),
  },
  {
    title: "اتصال مستقیم بدون پروکسی",
    desc: "بدون نیاز به تغییر DNS یا VPNهای توسعه‌دهندگان",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00F0FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

function Section02Metrics() {
  return (
    <section className="relative z-10 -mt-8 mx-auto w-full max-w-[1140px] px-4">
      <div className="grid grid-cols-1 divide-y divide-[#00F0FF]/15 rounded-2xl border border-[#00F0FF]/30 bg-[#070D1F] p-2 shadow-2xl sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 lg:divide-x lg:divide-x-reverse">
        {METRICS.map((metric) => (
          <div
            key={metric.title}
            className="flex items-center gap-3.5 p-4 text-right transition-colors hover:bg-white/5"
            dir="rtl"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF]">
              {metric.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-base font-extrabold text-white sm:text-lg">
                {metric.title}
              </span>
              <span className="text-xs font-medium text-slate-300">
                {metric.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*               Section 03: Engineering Capabilities Table                   */
/* -------------------------------------------------------------------------- */
const CAPABILITIES = [
  {
    module: "۱. ریفکتورینگ عمیق کدبیس",
    capability:
      "شناسایی کدهای کثیف (Code Smells)، نقض اصول SOLID و بازسازی متدها.",
    benefit:
      "ارتقای سریع کدهای پروژه‌های قدیمی شرکتی بدون برهم‌زدن منطق تجاری.",
  },
  {
    module: "۲. تحلیل آسیب‌پذیری امنیتی",
    capability:
      "اسکن الگوهای تزریق SQL، ضعف توکن‌های JWT و ضعف‌های OWASP.",
    benefit:
      "تضمین امنیت سرویس‌های مالی، فین‌تک و وب‌سرویس‌های سازمانی.",
  },
  {
    module: "۳. ساخت سناریوهای تست خودکار",
    capability:
      "تولید کامل تست‌های واحد با فریم‌ورک‌های Jest، PyTest یا GoTest به‌همراه Mocking.",
    benefit:
      "پوشش تستی بالای ۸۵٪ بدون صرف ساعت‌ها زمان تکراری برنامه‌نویسان.",
  },
  {
    module: "۴. تبدیل ساختار کد میان زبان‌ها",
    capability:
      "ترجمه سیستماتیک کد میان پایتون، گو، نودجی‌اس و راست با حفظ الگوهای Idiomatic.",
    benefit:
      "مهاجرت راحت‌تر پروژه‌های مقیاس‌پذیر به استک‌های سبک‌تر و پرسرعت‌تر.",
  },
  {
    module: "۵. تدوین مستندات و اسکیمای دیتابیس",
    capability:
      "تولید خودکار اسناد Swagger/OpenAPI و مدل‌های دیتابیس PostgreSQL یا MongoDB.",
    benefit:
      "هماهنگی کامل میان تیم‌های فرانت‌اند و بک‌اند بدون جلسات طولانی.",
  },
  {
    module: "۶. تحلیل لاگ خطاها و ریشه‌یابی باگ",
    capability:
      "تجزیه لاگ‌های حجیم استک تریس سرور و ارائه راهکار رفع باگ در چند ثانیه.",
    benefit:
      "کاهش زمان قطعی سرور (Downtime) در زمان وقوع خطاهای محیط پروداکشن.",
  },
];

function Section03Capabilities() {
  return (
    <section id="capabilities" className="scroll-mt-20 py-20 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col items-center gap-10">
        <SectionHeader
          badge="قابلیت‌های مهندسی نرم‌افزار"
          title="قابلیت‌های مهندسی Claude Fable 5؛ فراتر از یک دستیار ساده چت"
          subtitle="ابزاری دقیق برای توسعه‌دهندگان که به جزئیات معماری، پرفورمنس و امنیت کد اهمیت می‌دهند."
        />

        {/* Desktop Table View */}
        <div className="hidden w-full overflow-hidden rounded-2xl border border-[#0B132B]/10 bg-white shadow-sm md:block">
          <table className="w-full text-right" dir="rtl">
            <thead className="bg-[#0B132B] text-white">
              <tr>
                <th className="w-1/4 px-6 py-4 text-sm font-extrabold">
                  ماژول مهندسی
                </th>
                <th className="w-1/2 px-6 py-4 text-sm font-extrabold">
                  توانمندی فنی
                </th>
                <th className="w-1/4 px-6 py-4 text-sm font-extrabold text-[#00F0FF]">
                  مزیت برای تیم‌های ایران
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {CAPABILITIES.map((row, i) => (
                <tr
                  key={row.module}
                  className={`transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"
                  } hover:bg-[#00F0FF]/5`}
                >
                  <td className="px-6 py-4.5 text-sm font-bold text-[#0B132B]">
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
              <span className="text-base font-extrabold text-[#0B132B]">
                {row.module}
              </span>
              <p className="text-xs leading-6 text-slate-600">
                {row.capability}
              </p>
              <div className="mt-1 rounded-lg bg-[#00F0FF]/10 p-2 text-xs font-bold text-[#007EA7]">
                مزیت: {row.benefit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*              Section 04: Performance Comparison Table                       */
/* -------------------------------------------------------------------------- */
const COMPARISON_ROWS = [
  {
    feature: "پشتیبانی از کانتکست کامل پروژه",
    fable: { text: "بله (درک ساختار چندفایلی)", status: "good" },
    copilot: { text: "محدود به فایل‌های فعال ادیتور", status: "warn" },
    generic: { text: "نیازمند کپی دستی فایل‌ها در چت", status: "bad" },
  },
  {
    feature: "تولید تست و داکیومنت همزمان",
    fable: { text: "خودکار با یک فرمان", status: "good" },
    copilot: { text: "نیازمند پرامپت‌های جداگانه", status: "warn" },
    generic: { text: "عدم هماهنگی بین ماژول‌ها", status: "bad" },
  },
  {
    feature: "استفاده بدون فیلترشکن و IP ثابت",
    fable: { text: "۱۰۰٪ پایدار روی شبکه کشور", status: "good" },
    copilot: { text: "نیازمند پروکسی و تنظیمات اختصاصی", status: "warn" },
    generic: { text: "نیازمند VPN با خطر قطعی مکرر", status: "bad" },
  },
  {
    feature: "هزینه و روش پرداخت",
    fable: { text: "پرداخت ریالی با کارت شتاب", status: "good" },
    copilot: { text: "ماهانه ۱۰ تا ۱۹ دلار + کارمزد صرافی", status: "warn" },
    generic: { text: "هزینه‌های پراکنده ارزی", status: "bad" },
  },
];

function Section04Comparison() {
  return (
    <section className="bg-[#F8FAFC] py-20 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col items-center gap-10">
        <SectionHeader
          badge="جدول مقایسه فنی"
          title="مقایسه عملکرد کدنویسی Claude Fable 5 با سایر ابزارهای توسعه"
          subtitle="بررسی تفاوت‌های کلیدی معماری، پایداری اتصال در ایران و روش پرداخت."
        />

        <div className="w-full overflow-x-auto">
          <div className="min-w-[760px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" dir="rtl">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="w-1/4 bg-slate-100 px-5 py-4 text-sm font-extrabold text-[#0B132B]">
                    شاخص فنی
                  </th>
                  <th className="w-1/4 border-x border-[#00F0FF]/40 bg-[#0B132B] px-5 py-4 text-center text-sm font-black text-[#00F0FF]">
                    Claude Fable 5 در هم‌دست ✅
                  </th>
                  <th className="w-1/4 bg-slate-50 px-5 py-4 text-center text-sm font-bold text-slate-700">
                    GitHub Copilot مستقیم ⚠️
                  </th>
                  <th className="w-1/4 bg-slate-50 px-5 py-4 text-center text-sm font-bold text-slate-700">
                    مدل‌های عمومی متنی ❌
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-5 py-4 text-sm font-bold text-[#0B132B]">
                      {row.feature}
                    </td>

                    {/* Fable 5 Highlighted Column */}
                    <td className="border-x border-[#00F0FF]/30 bg-[#0B132B]/5 px-5 py-4 text-center text-sm font-extrabold text-[#007EA7]">
                      <div className="inline-flex items-center gap-1.5">
                        <span>{row.fable.text}</span>
                        <span className="text-emerald-600">✓</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center text-xs text-slate-600 sm:text-sm">
                      {row.copilot.text}
                    </td>

                    <td className="px-5 py-4 text-center text-xs text-slate-500 sm:text-sm">
                      {row.generic.text}
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
/*                       Section 05: Mid-Page CTA                              */
/* -------------------------------------------------------------------------- */
function Section05MidCta() {
  return (
    <section className="relative overflow-hidden bg-[#0B132B] py-16 px-4 text-white sm:py-20 sm:px-6">
      {/* Background Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(#00F0FF 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 size-96 rounded-full bg-[#00A8E8]/20 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-[1000px] flex-col items-center gap-6 rounded-3xl border border-[#00F0FF]/30 bg-gradient-to-r from-[#070D1F] via-[#0B132B] to-[#070D1F] p-8 text-center shadow-2xl sm:p-12">
        <span className="rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-3.5 py-1 text-xs font-bold text-[#00F0FF]">
          توسعه چابک، کدنویسی تمیز
        </span>

        <h3 className="text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
          سرعت توسعه نرم‌افزار تیم خود را متحول کنید
        </h3>

        <p className="max-w-[720px] text-sm font-medium leading-7 text-slate-300 sm:text-base">
          به‌جای ساعت‌ها درگیری با لاگ‌های خطای سرور یا بازنویسی دستی تست‌ها، از
          هوش تخصصی Claude Fable 5 در هم‌دست استفاده کنید.
        </p>

        <button
          type="button"
          onClick={openApp}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00A8E8] px-7 text-base font-extrabold text-[#0B132B] shadow-[0_0_24px_rgba(0,168,232,0.4)] transition-all hover:bg-[#00F0FF] hover:shadow-[0_0_32px_rgba(0,240,255,0.6)] sm:text-lg"
        >
          تست رایگان Claude Fable 5 — اولین اسکریپت خود را دیباگ کنید
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
    desc: "پرچمدار تفکر و تحلیل عمیق برای مسائل نظری و محاسبات کلان.",
    href: "/tools/models/claude",
    tag: "تحلیل و استدلال عمیق",
  },
  {
    name: "Kimi K3",
    desc: "ابرمدل استدلالی چندوجهی Moonshot AI با کانتکست ۱ میلیون توکن.",
    href: "/tools/models/kimi-k3",
    tag: "کانتکست ۱ میلیون توکن",
  },
  {
    name: "Claude Sonnet",
    desc: "بهترین انتخاب برای تولید محتوا، ترجمه ادبی و نگارش روان.",
    href: "/tools/models/claude",
    tag: "تولید محتوا و نگارش",
  },
  {
    name: "GPT-5.1",
    desc: "موتور استدلال چندوجهی OpenAI برای کارهای محاسباتی سنگین.",
    href: "/tools/models/chat-gpt",
    tag: "استدلال چندوجهی",
  },
  {
    name: "DeepSeek R1",
    desc: "مدل تخصصی استدلال ریاضی و الگوریتمی با هزینه اقتصادی.",
    href: "/products#models",
    tag: "ریاضی و الگوریتم",
  },
  {
    name: "GPT Terra",
    desc: "تحلیل اسناد حجیم، صورت‌های مالی و اکسل‌های سازمانی.",
    href: "/tools/chat-pdf",
    tag: "اسناد و داده‌های مالی",
  },
  {
    name: "Flux AI",
    desc: "تولید تصاویر هنری با جزئیات بالا و رعایت دقیق پرامپت‌ها.",
    href: "/tools/image-generator",
    tag: "تولید تصویر هنری",
  },
];

function Section06Ecosystem() {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col items-center gap-10">
        <SectionHeader
          badge="اکوسیستم هوش مصنوعی"
          title="اکوسیستم تخصصی مدل‌ها در هم‌دست"
          subtitle="هم‌دست امکان سوییچ آنی میان مدل‌های پرچمدار جهان را برای هر نوع تسک تخصصی فراهم کرده است."
        />

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" dir="rtl">
          {ECOSYSTEM_MODELS.map((model) => (
            <div
              key={model.name}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#00A8E8]/50 hover:shadow-md"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#0B132B]">
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
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#007EA7] transition-colors hover:text-[#00A8E8]"
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
    q: "Claude Fable 5 چه برتری شاخصی در کدنویسی دارد؟",
    a: "تفاوت اصلی Fable 5 دید کل‌نگر و درک روابط بین چندین فایل است. بر خلاف مدل‌های قبلی که فقط خط بعدی را حدس می‌زدند، Fable 5 منطق کل معماری نرم‌افزار، عوارض جانبی تغییرات و الگوهای امنیتی را بررسی کرده و راهکار اجرایی تحویل می‌دهد.",
  },
  {
    q: "آیا برای استفاده از این مدل در هم‌دست نیاز به شماره مجازی یا کارت خارجی است؟",
    a: "خیر، همه دسترسی‌ها بدون نیاز به شماره‌های خارجی و با پرداخت ریالی از طریق کارت‌های عضو شبکه شتاب فراهم شده است.",
  },
  {
    q: "امنیت کدهای بارگذاری‌شده در هم‌دست چگونه تضمین می‌شود؟",
    a: "نشست‌های کاری به‌صورت ایزوله پردازش می‌شوند و هیچ کدی برای بازآموزی مدل‌های عمومی ذخیره نشده یا به اشتراک گذاشته نمی‌شود.",
  },
  {
    q: "Claude Fable 5 از چه زبان‌هایی پشتیبانی می‌کند؟",
    a: "این مدل تسلط کاملی بر Python، TypeScript، Go، Rust، Java، C++، C#، PHP و فریم‌ورک‌هایی نظیر React، Next.js، Django، FastAPI، Spring Boot و همچنین Docker و Kubernetes دارد.",
  },
];

function Section07Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#F8FAFC] py-20 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[850px] flex-col items-center gap-10">
        <SectionHeader
          badge="پاسخ به سوالات متداول"
          title="سوالات متداول (FAQ)"
          subtitle="تمام مواردی که باید درباره اتصال، امنیت کدهای شرکتی و پشتیبانی زبان‌ها بدانید."
        />

        <div className="flex w-full flex-col gap-3" dir="rtl">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className={`overflow-hidden rounded-2xl border bg-white transition-all ${
                  isOpen
                    ? "border-[#00A8E8]/40 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-right font-bold text-[#0B132B] sm:text-base"
                >
                  <span className="flex-1 text-sm font-extrabold sm:text-base">
                    س: {faq.q}
                  </span>
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-[#00A8E8]" : ""
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
/*                       Section 08: Closing CTA                               */
/* -------------------------------------------------------------------------- */
function Section08ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-[#0B132B] py-20 px-4 text-white sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-[#00F0FF]/10 blur-[140px]"
      />

      <div className="relative mx-auto flex w-full max-w-[850px] flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-black leading-tight sm:text-4xl lg:text-[40px]">
          کیفیت کد تیم خود را به بالاترین استاندارد جهانی برسانید
        </h2>

        <p className="max-w-[640px] text-sm font-medium leading-7 text-slate-300 sm:text-base">
          با Claude Fable 5 در هم‌دست، بدون چالش تحریم و با پرداخت ریالی با بالاترین
          سرعت کدنویسی کنید.
        </p>

        <button
          type="button"
          onClick={openApp}
          className="inline-flex h-13 items-center justify-center rounded-xl bg-[#00A8E8] px-8 text-base font-extrabold text-[#0B132B] shadow-[0_0_28px_rgba(0,168,232,0.45)] transition-all hover:bg-[#00F0FF] hover:shadow-[0_0_36px_rgba(0,240,255,0.6)] sm:text-lg"
        >
          ثبت‌نام سریع با شماره موبایل و شروع کدنویسی رایگان
        </button>

        {/* Feature Checks */}
        <div
          dir="rtl"
          className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-300 sm:gap-6 sm:text-sm"
        >
          <span className="flex items-center gap-1.5 text-[#00F0FF]">
            <span>✓</span>
            <span className="text-slate-200">بدون نیاز به VPN</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-[#00F0FF]">
            <span>✓</span>
            <span className="text-slate-200">فعال‌سازی ریالی با کارت شتاب</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-[#00F0FF]">
            <span>✓</span>
            <span className="text-slate-200">بدون ریسک تحریم</span>
          </span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Main Page Content                            */
/* -------------------------------------------------------------------------- */
export function ClaudeFable5PageContent() {
  const reduce = !!useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: easeOut }}
      className="flex flex-col bg-white"
    >
      <Section01Hero />
      <Section02Metrics />
      <Section03Capabilities />
      <Section04Comparison />
      <Section05MidCta />
      <Section06Ecosystem />
      <Section07Faq />
      <Section08ClosingCta />
    </motion.div>
  );
}
