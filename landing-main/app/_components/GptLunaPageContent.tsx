"use client";

import { useState, useRef } from "react";
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
  size = "Large",
}: {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  size?: "Large" | "Small";
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center sm:gap-4">
      <h2
        className={`font-extrabold text-[#121316] ${
          size === "Large"
            ? "text-2xl leading-9 sm:text-[36px] sm:leading-[46px]"
            : "text-xl leading-8 sm:text-[28px] sm:leading-[34px]"
        }`}
        style={{ color: "#121316" }}
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
        <div className="max-w-[850px] text-sm font-medium leading-6 text-[#8b94a4] sm:text-lg sm:leading-[27px]">
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
/*                        Section 01: Hero & Interactive Box                   */
/* -------------------------------------------------------------------------- */
function Section01Hero() {
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="relative flex flex-col items-center gap-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
      <SectionHeader
        size="Large"
        title={
          <>
            <span className="block text-[#121316]">هوش مصنوعی GPT Luna</span>
            <span className="block text-[#121316]">نسل جدید هوشمندی مکالمه</span>
          </>
        }
        subtitle={
          <p className="text-center font-medium text-[#8b94a4]">
            بدون نیاز به فیلترشکن، بدون کارت بانکی خارجی و بدون پیچیدگی فنی.
            <br />
            با <span className="text-primary">GPT Luna</span> در{" "}
            <span className="text-primary">همدست</span> یک مدل زبانی قدرتمند، فوق‌سریع و آشنا با زبان فارسی
            <br />
            را مستقیماً از مرورگر خود تجربه کنید.
          </p>
        }
      />

      {/* Dual Chat Preview + Composer Box */}
      <div className="relative mx-auto w-full max-w-[1078px]">
        {/* Soft purple glow shadow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-5 top-5 h-[418px] rounded-[32px] bg-[rgba(66,1,107,0.16)] blur-[25px]"
        />

        <div className="direction-ltr relative rounded-[32px] border border-[#f1f2f2] bg-white p-3 shadow-[0px_0px_16px_rgba(0,0,0,0.04)] sm:p-4">
          {/* Dual Panels */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Panel 1: Gemini 3 Flash */}
            <div className="relative flex h-[264px] flex-col justify-between rounded-[16px] border border-[#f1f2f2] bg-[#f9fafb] p-3 sm:p-4">
              <div className="direction-ltr flex items-center justify-start">
                <button
                  type="button"
                  onClick={openApp}
                  className="inline-flex h-8 items-center gap-1.5 rounded-2xl border border-[#dddfe3] bg-white py-1 pl-1.5 pr-2.5 text-sm font-medium text-[#656f81] transition-colors hover:bg-neutral-50 sm:min-w-[102px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/hero/sort-vertical.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="size-5 shrink-0"
                  />
                  <span className="text-sm font-medium text-[#656f81]">Gemini 3- Flash</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/menu/magicoon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 shrink-0"
                  />
                </button>
              </div>

              {/* Fake message area placeholder */}
              <div className="flex-1" />

              {/* Sub-input in panel */}
              <div className="direction-ltr flex h-[50px] items-center gap-2 rounded-2xl border border-[#dddfe3] bg-[#f1f2f2] p-2">
                <button
                  type="button"
                  onClick={openApp}
                  aria-label="ارسال"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/hero/arrow-up-grey.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </button>
                <p dir="rtl" className="flex-1 text-right text-sm font-medium text-[#8b94a4] sm:text-base">
                  متن دلخواه خود را وارد کنید ...
                </p>
              </div>
            </div>

            {/* Panel 2: Claude Haiku 4.5 */}
            <div className="relative flex h-[264px] flex-col justify-between rounded-[16px] border border-[#f1f2f2] bg-[#f9fafb] p-3 sm:p-4">
              <div className="direction-ltr flex items-center justify-start">
                <button
                  type="button"
                  onClick={openApp}
                  className="inline-flex h-8 items-center gap-1.5 rounded-2xl border border-[#dddfe3] bg-white py-1 pl-1.5 pr-2.5 text-sm font-medium text-[#656f81] transition-colors hover:bg-neutral-50 sm:min-w-[102px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/hero/sort-vertical.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="size-5 shrink-0"
                  />
                  <span className="text-sm font-medium text-[#656f81]">Claude Haiku 4.5</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/hero/anthropic.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 shrink-0"
                  />
                </button>
              </div>

              {/* Fake message area placeholder */}
              <div className="flex-1" />

              {/* Sub-input in panel */}
              <div className="direction-ltr flex h-[50px] items-center gap-2 rounded-2xl border border-[#dddfe3] bg-[#f1f2f2] p-2">
                <button
                  type="button"
                  onClick={openApp}
                  aria-label="ارسال"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/hero/arrow-up-grey.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </button>
                <p dir="rtl" className="flex-1 text-right text-sm font-medium text-[#8b94a4] sm:text-base">
                  متن دلخواه خود را وارد کنید ...
                </p>
              </div>
            </div>
          </div>

          {/* AI Composer Section */}
          <div className="mt-4 flex flex-col gap-2 rounded-[24px] bg-white p-2 shadow-[0px_0px_8px_rgba(0,0,0,0.04)] sm:p-3">
            {/* Top Chip */}
            <div className="direction-ltr flex items-center px-1">
              <button
                type="button"
                onClick={openApp}
                className="inline-flex h-8 items-center gap-1.5 rounded-[24px] border border-[#f1f2f2] bg-white pl-4 pr-3 text-sm font-medium text-[#2b3037] shadow-sm transition-colors hover:bg-neutral-50"
              >
                <span>گفتگو با دو هوش مصنوعی</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/hero/angle-down-dark.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-5 shrink-0"
                />
              </button>
            </div>

            {/* Input Bar */}
            <div
              className="direction-ltr grid w-full min-w-0 max-w-full cursor-text items-center gap-2 rounded-2xl bg-[#f1f2f2] p-2 [grid-template-columns:32px_32px_minmax(0,1fr)_32px]"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a, button")) return;
                inputRef.current?.focus();
              }}
            >
              <button
                type="button"
                onClick={openApp}
                aria-label="ارسال پیام"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#8b04ff] text-white shadow-sm transition-opacity hover:opacity-90"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/hero/arrow-up.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
              </button>

              <button
                type="button"
                onClick={openApp}
                aria-label="ضبط صدا"
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#b5bac2] bg-transparent text-[#656f81] transition-colors hover:bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/hero/microphone.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
              </button>

              <input
                ref={inputRef}
                type="text"
                dir="rtl"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    openApp();
                  }
                }}
                placeholder="متن دلخواه خود را وارد کنید ..."
                className="min-w-0 w-full bg-transparent text-right text-sm font-medium text-[#121316] outline-none placeholder:text-[#8b94a4] sm:text-base"
                autoComplete="off"
              />

              <button
                type="button"
                onClick={openApp}
                aria-label="پیوست فایل"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#656f81] transition-colors hover:bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/hero/plus.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
              </button>
            </div>

            {/* Bottom Controls Row — LTR like Figma: Chat-GPT, گفتگو, spacer, settings */}
            <div className="flex w-full items-center gap-2">
              <button
                type="button"
                onClick={openApp}
                className="inline-flex h-8 min-w-[102px] items-center justify-center gap-1 rounded-2xl border border-[#dddfe3] bg-white py-1 pl-1 pr-2 text-sm font-medium text-[#656f81] transition-colors hover:bg-neutral-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/hero/sort-vertical.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-5 shrink-0"
                />
                <span className="flex-1 text-center text-sm font-medium text-[#656f81]">
                  Chat-GPT
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/hero/openai.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="h-[16.24px] w-4 shrink-0"
                />
              </button>

              <button
                type="button"
                onClick={openApp}
                className="inline-flex h-8 items-center justify-center gap-1 rounded-3xl border border-[#e0bcff] bg-[#f5eaff] py-1 pl-4 pr-3 text-sm font-medium text-[#8b04ff] transition-colors hover:bg-[#ebd7ff]"
              >
                <span className="text-sm font-medium text-[#8b04ff]">گفتگو</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/hero/angle-down.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-5 shrink-0"
                />
              </button>

              <div className="min-w-px flex-1" />

              <div className="relative size-8 shrink-0">
                <button
                  type="button"
                  onClick={openApp}
                  aria-label="تنظیمات"
                  className="flex size-8 items-center justify-center rounded-full bg-[#f1f2f2] text-[#454c58] transition-colors hover:bg-[#e4e6e8]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/hero/sliders-horizontal-alt.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="size-6 shrink-0"
                  />
                </button>
                <span
                  className="absolute flex size-[18px] items-center justify-center rounded-full bg-[#ff3b3b] text-[13px] font-bold leading-none text-white"
                  style={{ left: 0, top: 0 }}
                >
                  ۱
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Section 02: Stats Counter Row                      */
/* -------------------------------------------------------------------------- */
const STATS = [
  {
    value: "#1",
    label: "بهترین پلتفرم هوش مصنوعی ۱۴۰۵",
    bg: "bg-[#fbd7d7]",
    iconColor: "#FF3B3B",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF3B3B"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
        <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H8v2h8v-2h-1c-.55 0-1-.45-1-1v-2.34" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    value: "۴.۹ از ۵",
    label: "رضایت کاربران",
    bg: "bg-[#f5eaff]",
    iconColor: "#8B04FF",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8B04FF"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    value: "+ ۵۰,۰۰۰",
    label: "کاربر فعال ایرانی",
    bg: "bg-[#cdf8e5]",
    iconColor: "#064D2E",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#064D2E"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    value: "۱۰۰٪",
    label: "بدون تحریم",
    bg: "bg-[#faf2d1]",
    iconColor: "#614F05",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#614F05"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

function Section02Stats() {
  return (
    <section className="mx-auto w-full max-w-[1078px] px-4 py-8">
      <div className="direction-ltr grid grid-cols-1 divide-y divide-[#f1f2f2] rounded-2xl border border-[#f1f2f2] bg-white sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {STATS.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center gap-3 p-4 transition-colors hover:bg-[#fafafc]"
          >
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-2xl p-2.5 ${stat.bg}`}
            >
              {stat.icon}
            </span>
            <div className="flex flex-col gap-0.5 text-right" dir="rtl">
              <span className="text-base font-extrabold text-[#121316] sm:text-lg">
                {stat.value}
              </span>
              <span className="text-xs font-medium text-[#8b94a4] sm:text-sm">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                     Section 03: Distinct Capabilities                      */
/* -------------------------------------------------------------------------- */
const CAPABILITIES = [
  {
    title: "درک عمیق زبان فارسی",
    desc: "GPT Luna یکی از بهترین مدل‌های موجود برای درک اصطلاحات، لحن بومی و ساختار جمله‌بندی فارسی است. ایمیل، گزارش، پیام و هر نوع متنی را طبیعی و روان می‌نویسد.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8b04ff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01" />
        <path d="M12 10h.01" />
        <path d="M16 10h.01" />
      </svg>
    ),
  },
  {
    title: "سرعت پاسخ‌دهی فوق‌العاده",
    desc: "با معماری بهینه‌شده GPT Luna، پاسخ‌های طولانی و پیچیده در کسری از ثانیه آماده می‌شوند. بدون انتظار، بدون توقف ناخواسته در وسط متن.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8b04ff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "استدلال چندمرحله‌ای پیشرفته",
    desc: "از تحلیل مالی گرفته تا حل مسئله‌های ریاضی و کد؛ GPT Luna قدم به قدم فکر می‌کند و مسیر رسیدن به پاسخ را با شفافیت نشان می‌دهد.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8b04ff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8"
      >
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
      </svg>
    ),
  },
  {
    title: "کدنویسی و دیباگ حرفه‌ای",
    desc: "از Python، JavaScript، SQL تا Dart و Kotlin؛ کد بنویسید، باگ پیدا کنید، کد را ریفکتور کنید و مستقیم در هم‌دست آن را تست کنید.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8b04ff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "حریم خصوصی و امنیت داده‌ها",
    desc: "مکالمات شما ذخیره‌سازی نمی‌شود و با اشخاص ثالث به اشتراک گذاشته نخواهد شد. با خیال راحت اسناد حساس کاری خود را وارد کنید.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8b04ff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "پردازش فایل‌ها و اسناد طولانی",
    desc: "PDF، Word، کد پروژه یا صفحه وب را بارگذاری کنید و GPT Luna خلاصه، تحلیل یا ویرایش آن را به شما می‌دهد؛ انگار یک دستیار حرفه‌ای کنارتان نشسته است.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8b04ff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

function Section03Capabilities() {
  return (
    <section className="relative overflow-hidden bg-[#f9fafb] py-16 sm:py-20">
      {/* Decorative large OpenAI watermarks */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-36 size-[460px] opacity-[0.035] sm:size-[620px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/menu/openai.svg"
          alt=""
          className="size-full rotate-45 object-contain"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-12 size-[340px] opacity-[0.035] sm:size-[440px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/menu/openai.svg"
          alt=""
          className="size-full rotate-45 object-contain"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1080px] flex-col items-center gap-10 px-4 sm:px-6">
        <SectionHeader
          size="Small"
          title="قابلیت‌های متمایزکننده GPT Luna"
          subtitle="این مدل دقیقاً برای همان چیزی طراحی شده که شما روزانه به آن نیاز دارید."
        />

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((card, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center rounded-2xl border border-[#f1f2f2] bg-white p-6 text-center transition-all hover:border-[#e0bcff] hover:shadow-md"
            >
              <div className="mb-4 flex size-[72px] items-center justify-center rounded-2xl bg-[rgba(139,4,255,0.08)]">
                {card.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-[#121316]">
                {card.title}
              </h3>
              <p className="text-sm font-normal leading-6 text-[#8b94a4]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                       Section 04: Comparison Table                          */
/* -------------------------------------------------------------------------- */
const TABLE_FEATURES = [
  "نیاز به فیلتر شکن",
  "پرداخت ریالی",
  "کیفیت مدل",
  "پشتیبانی فارسی",
  "دسترسی به چند مدل",
  "ابزارهای جانبی",
  "پشتیبانی انسانی",
];

const TABLE_DATA = [
  // Row 0: نیاز به فیلتر شکن
  {
    luna: { text: "ندارد", check: true },
    plus: { text: "دارد", check: false },
    free: { text: "ندارد", check: true },
  },
  // Row 1: پرداخت ریالی
  {
    luna: { text: "دارد", check: true },
    plus: { text: "خیر (کارت خارجی / تتر)", check: false },
    free: { text: "دارد", check: true },
  },
  // Row 2: کیفیت مدل
  {
    luna: { text: "بسیار بالا", check: true },
    plus: { text: "بالا", check: true },
    free: { text: "مدل‌های محدودتر", check: false },
  },
  // Row 3: پشتیبانی فارسی
  {
    luna: { text: "عالی", check: true },
    plus: { text: "متوسط تا خوب", check: false },
    free: { text: "ضعیف تا متوسط", check: false },
  },
  // Row 4: دسترسی به چند مدل
  {
    luna: { text: "+۵۰ مدل در یک پلن", check: true },
    plus: { text: "فقط GPT", check: false },
    free: { text: "یک مدل", check: false },
  },
  // Row 5: ابزارهای جانبی
  {
    luna: { text: "خلاصه‌ساز، ترجمه، PDF", check: true },
    plus: { text: "محدود", check: false },
    free: { text: "بسیار محدود", check: false },
  },
  // Row 6: پشتیبانی انسانی
  {
    luna: { text: "بله (فارسی)", check: true },
    plus: { text: "خیر", check: false },
    free: { text: "خیر", check: false },
  },
];

function CheckIcon() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#8b04ff] text-white">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-3"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

function CrossIcon() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#ff3b3b] text-white">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-3"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </span>
  );
}

function Section04Comparison() {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-4 pt-16 pb-16 sm:px-6 lg:pb-24">
      <SectionHeader
        size="Small"
        title="چرا GPT Luna را در هم‌دست تجربه کنید؟"
        subtitle="مقایسه صادقانه همدست با روش‌های دیگر دسترسی به مدل‌های هوش مصنوعی"
      />

      <div className="mt-10 overflow-x-auto">
        <div className="min-w-[760px]">
          {/* Table Container in RTL 4-column layout */}
          <div className="grid grid-cols-4 items-stretch gap-2 text-center" dir="rtl">
            {/* Col 1: Feature labels */}
            <div className="flex flex-col rounded-2xl border border-[#f1f2f2] bg-white">
              <div className="flex h-[76px] items-center justify-center p-3 font-extrabold text-[#383e48]">
                ویژگی‌ها
              </div>
              {TABLE_FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="flex h-[52px] items-center justify-start border-t border-[#f1f2f2] px-4 text-sm font-extrabold text-[#383e48] sm:text-base"
                >
                  {feature}
                </div>
              ))}
            </div>

            {/* Col 2: GPT Luna درهمدست (Highlighted) */}
            <div className="relative flex flex-col rounded-2xl border border-[#f5eaff] bg-[#f5eaff] shadow-[0_4px_20px_rgba(139,4,255,0.08)]">
              <div className="flex h-[76px] flex-col items-center justify-center rounded-t-2xl bg-[#8b04ff] p-3 text-white">
                <span className="text-lg font-extrabold">GPT Luna</span>
                <span className="text-sm font-medium text-[#e0bcff]">در همدست</span>
              </div>
              {TABLE_DATA.map((row, i) => (
                <div
                  key={i}
                  className="flex h-[52px] items-center justify-between border-t border-white/60 px-4 text-xs font-medium text-[#383e48] sm:text-sm"
                >
                  <span className="truncate">{row.luna.text}</span>
                  {row.luna.check ? <CheckIcon /> : <CrossIcon />}
                </div>
              ))}
            </div>

            {/* Col 3: GPT Plus مستقیم */}
            <div className="flex flex-col rounded-2xl border border-[#f1f2f2] bg-white">
              <div className="flex h-[76px] flex-col items-center justify-center rounded-t-2xl bg-[#f9fafb] p-3">
                <span className="text-lg font-extrabold text-[#121316]">GPT Plus</span>
                <span className="text-sm font-medium text-[#656f81]">مستقیم</span>
              </div>
              {TABLE_DATA.map((row, i) => (
                <div
                  key={i}
                  className="flex h-[52px] items-center justify-between border-t border-[#f1f2f2] px-4 text-xs font-medium text-[#383e48] sm:text-sm"
                >
                  <span className="truncate">{row.plus.text}</span>
                  {row.plus.check ? <CheckIcon /> : <CrossIcon />}
                </div>
              ))}
            </div>

            {/* Col 4: ابزارهای رایگان ایران */}
            <div className="flex flex-col rounded-2xl border border-[#f1f2f2] bg-white">
              <div className="flex h-[76px] flex-col items-center justify-center rounded-t-2xl bg-[#f9fafb] p-3">
                <span className="text-lg font-extrabold text-[#121316]">ابزارهای رایگان</span>
                <span className="text-sm font-medium text-[#656f81]">ایران</span>
              </div>
              {TABLE_DATA.map((row, i) => (
                <div
                  key={i}
                  className="flex h-[52px] items-center justify-between border-t border-[#f1f2f2] px-4 text-xs font-medium text-[#383e48] sm:text-sm"
                >
                  <span className="truncate">{row.free.text}</span>
                  {row.free.check ? <CheckIcon /> : <CrossIcon />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Section 05: Good News CTA Banner                   */
/* -------------------------------------------------------------------------- */
const BANNER_RINGS = [
  { src: "/figma/gpt-luna/ring-1.svg", size: 497 },
  { src: "/figma/gpt-luna/ring-5.svg", size: 452 },
  { src: "/figma/gpt-luna/ring-2.svg", size: 406 },
  { src: "/figma/gpt-luna/ring-3.svg", size: 360 },
  { src: "/figma/gpt-luna/ring-4.svg", size: 315 },
  { src: "/figma/gpt-luna/ring-8.svg", size: 269 },
  { src: "/figma/gpt-luna/ring-7.svg", size: 224 },
  { src: "/figma/gpt-luna/ring-9.svg", size: 178 },
  { src: "/figma/gpt-luna/ring-10.svg", size: 133 },
  { src: "/figma/gpt-luna/ring-6.svg", size: 87 },
  { src: "/figma/gpt-luna/ring-11.svg", size: 42 },
] as const;

function Section05Banner() {
  return (
    <section className="direction-ltr relative z-10 my-10 overflow-visible border-y-4 border-solid border-[#f5eaff] bg-gradient-to-l from-[#cf0697] to-[#6d069c] text-white lg:my-16">
      {/* Horizontal + vertical grid, right side, 58px like Figma */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[68%] overflow-hidden opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "100% 58px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[20%] overflow-hidden opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "58px 100%",
        }}
      />

      {/* Concentric dotted rings — physical left */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 size-[497px] origin-center -translate-y-1/2 scale-[0.6] opacity-70 sm:scale-[0.75] lg:top-[-92px] lg:translate-y-0 lg:scale-100"
        style={{ left: -69 }}
      >
        {BANNER_RINGS.map((ring) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={ring.src}
            src={ring.src}
            alt=""
            width={ring.size}
            height={ring.size}
            className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
            style={{ width: ring.size, height: ring.size }}
          />
        ))}
      </div>

      {/* Rotated model-logo cluster — Figma: 429px in 577px box, -26.88deg, top -115, left 43 */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2 z-[1] flex size-[577px] origin-center -translate-y-1/2 scale-[0.45] items-center justify-center sm:left-6 sm:scale-[0.6] lg:top-[-115px] lg:left-[43px] lg:translate-y-0 lg:scale-[0.8] xl:scale-100"
      >
        <div className="relative size-[429px] shrink-0 rotate-[-26.88deg] shadow-[0px_6.439px_12.877px_rgba(62,0,73,0.24)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/gpt-luna/logos.png"
            alt=""
            width={429}
            height={429}
            className="absolute inset-0 size-[429px] max-w-none object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[240px] w-full max-w-[1440px] items-center justify-end px-6 py-10 sm:min-h-[260px] sm:px-12 lg:min-h-[294px] lg:px-12 xl:px-[128px] lg:py-8">
        <div className="flex w-full max-w-[540px] flex-col items-end gap-4 text-right xl:max-w-[640px]">
          <p dir="rtl" className="w-full text-2xl font-extrabold leading-9 text-white sm:text-[36px] sm:leading-[46px]">
            خبر خوب!
          </p>
          <div className="flex w-full flex-col items-end gap-2">
            <h3 dir="rtl" className="w-full text-lg font-extrabold leading-7 text-white sm:text-[28px] sm:leading-[34px]">
              مدل{" "}
              <span className="bg-gradient-to-b from-[#f6f6f6] to-[#fcf7ff] bg-clip-text text-transparent">
                GPT Luna
              </span>{" "}
              همین الان در{" "}
              <span className="bg-gradient-to-b from-[#f6f6f6] to-[#fcf7ff] bg-clip-text text-transparent">
                همدست
              </span>{" "}
              در دسترس است.
            </h3>
            <p dir="rtl" className="w-full text-sm font-medium leading-6 text-[#dddfe3] sm:text-lg sm:leading-[27px]">
              اشتراک جداگانه‌ی هر مدل هوش مصنوعی ماهی چند ده دلار آب می‌خوره.
              <br />
              با همدست، همه‌ی این مدل‌ها زیر یک سقف قیمتی و به تومان در دسترست هستن.
            </p>
          </div>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 min-w-[102px] cursor-pointer items-center justify-center rounded-xl bg-gradient-to-b from-[#f6f6f6] to-[#fcf7ff] px-4 py-2 shadow-[0px_6px_12px_rgba(62,0,73,0.24)] transition-transform hover:scale-[1.03]"
          >
            <span className="bg-gradient-to-l from-[#57069d] to-[#d50697] bg-clip-text text-base font-extrabold leading-[26px] text-transparent sm:text-xl">
              همین الان رایگان شروع کن
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                     Section 07: Other AI Models Carousel                   */
/* -------------------------------------------------------------------------- */
const OTHER_MODELS = [
  {
    name: "Claude Fable 5",
    desc: "مدل تخصصی مهندسی نرم‌افزار برای کدنویسی چندماژوله، معماری و رفع باگ.",
    icon: "/figma/menu/anthropic.svg",
    href: "/tools/models/claude-fable-5",
    credits: "۱۸",
  },
  {
    name: "Kimi K3",
    desc: "ابرمدل چندوجهی Moonshot AI با کانتکست ۱ میلیون توکن پایدار.",
    icon: "/figma/menu/kimi.svg",
    href: "/tools/models/kimi-k3",
    credits: "۱۸",
  },
  {
    name: "Perplexity",
    desc: "پاسخ همراه منبع؛ برای تحقیق سریع و سوال‌هایی که باید به سند وصل شوند.",
    icon: "/figma/design/globe.svg",
    href: "/tools/models/perplexity",
    credits: "۱۸",
  },
  {
    name: "Grok",
    desc: "مدل xAI با دانش به‌روز برای پاسخ‌های سریع و جست‌وجوی موضوع‌های تازه.",
    icon: "/figma/menu/grok.svg",
    href: "/tools/models/grok",
    credits: "۱۸",
  },
  {
    name: "Claude",
    desc: "مدل Anthropic برای نوشتار دقیق، کدنویسی و تحلیل سندهای طولانی.",
    icon: "/figma/menu/anthropic.svg",
    href: "/tools/models/claude",
    credits: "۱۸",
  },
  {
    name: "Gemini",
    desc: "مدل چندوجهی گوگل برای متن، تصویر و کد؛ مناسب کار روزمره و تحقیق.",
    icon: "/figma/menu/magicoon.svg",
    href: "/tools/models/gemini",
    credits: "۱۸",
  },
  {
    name: "Chat GPT",
    desc: "گفتگو، استدلال و تولید متن با مدل‌های GPT، بدون فیلترشکن و با پرداخت تومانی.",
    icon: "/figma/menu/openai.svg",
    href: "/tools/models/chat-gpt",
    credits: "۱۸",
  },
];

function Section07OtherModels() {
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
      <SectionHeader
        size="Small"
        title="مدل GPT Luna تنها یکی از مدل‌های هم‌دست است"
        subtitle="در هم‌دست به بیش از ۵۰ مدل پرچمدار جهانی با یک اشتراک دسترسی دارید."
      />

      <div className="relative mt-10">
        {/* Soft edge gradients */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent"
        />

        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {OTHER_MODELS.map((model, idx) => (
            <div
              key={idx}
              className="flex w-[238px] shrink-0 flex-col items-center justify-between rounded-2xl border border-[#f1f2f2] bg-white p-4 text-center transition-all hover:border-[#e0bcff] hover:shadow-md"
            >
              <div className="flex flex-col items-center">
                <div className="mb-3 flex size-[72px] items-center justify-center rounded-2xl bg-[rgba(139,4,255,0.08)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={model.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 object-contain"
                  />
                </div>
                <h4 className="text-lg font-bold text-[#121316]">{model.name}</h4>
                <p className="mt-1 line-clamp-3 text-xs font-normal leading-5 text-[#8b94a4]">
                  {model.desc}
                </p>
                <div className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-[#8b04ff]">
                  <span>مصرف هر پیام : {model.credits}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/crown-alt.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="size-4 shrink-0"
                  />
                </div>
              </div>

              <Link
                href={model.href}
                className="mt-4 inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg border border-[#f1f2f2] text-xs font-extrabold text-[#656f81] transition-colors hover:bg-neutral-50"
              >
                <span>مشاهده</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4 shrink-0"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                          Section 06: FAQs Accordion                        */
/* -------------------------------------------------------------------------- */
const FAQS = [
  {
    q: "مدل هوش مصنوعی GPT Luna چیست و چه کاری می‌کند؟",
    a: "مدل GPT Luna یک مدل زبانی بزرگ (Large Language Model) پیشرفته است که توسط OpenAI توسعه داده شده. این مدل می‌تواند متن را درک کند، بنویسد، تحلیل کند، کد تولید کند و در طیف وسیعی از وظایف زبانی به شما کمک کند. در پلتفرم هم‌دست، دسترسی به این مدل بدون نیاز به فیلترشکن و با پرداخت ریالی فراهم شده است.",
  },
  {
    q: "تفاوت GPT Luna با GPT-4o یا ChatGPT چیست؟",
    a: "مدل GPT Luna نسبت به GPT-4o استاندارد در سرعت پردازش بهینه‌تر است و در پاسخ‌دهی به سوالات محاوره‌ای و روزمره عملکرد بهتری دارد. همچنین این مدل قدم‌به‌قدم استدلال می‌کند و مسیر رسیدن به پاسخ را شفاف‌تر نشان می‌دهد. در هم‌دست علاوه بر GPT Luna، به GPT-4o و سایر مدل‌های OpenAI هم دسترسی دارید.",
  },
  {
    q: "آیا برای استفاده از GPT Luna در هم‌دست به فیلترشکن نیاز دارم؟",
    a: "خیر. یکی از اصلی‌ترین مزایای هم‌دست این است که زیرساخت سرویس‌دهی آن به گونه‌ای طراحی شده که کاربران ایرانی بدون نیاز به هیچ‌گونه فیلترشکنی می‌توانند از تمام مدل‌های موجود از جمله GPT Luna استفاده کنند.",
  },
  {
    q: "چطور می‌توانم اشتراک هم‌دست را با پرداخت ریالی تهیه کنم؟",
    a: "پس از ثبت‌نام در هم‌دست با شماره موبایل یا ایمیل ایرانی، از بخش پلن‌ها می‌توانید اشتراک را با کارت شتاب، کارت‌های بانک ایرانی یا از طریق درگاه پرداخت امن داخلی خریداری کنید. هیچ نیازی به داشتن حساب بانکی خارجی یا ارز دیجیتال وجود ندارد.",
  },
];

function Section06Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto w-full max-w-[1076px] px-4 py-16 sm:px-6">
      <SectionHeader
        size="Small"
        title="سوالات متداول درباره GPT Luna در هم‌دست"
      />

      <div className="mt-10 flex flex-col gap-3">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border transition-[border-color,box-shadow] duration-200 ${
                isOpen
                  ? "border-[#f1f2f2] bg-white shadow-[0px_0px_8px_rgba(160,11,215,0.04)]"
                  : "border-[#f1f2f2] bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className={`flex w-full items-center justify-between p-4 text-right transition-colors ${
                  isOpen ? "border-b border-[#ededee] bg-white" : "hover:bg-neutral-50/50"
                }`}
              >
                <span className="text-base font-extrabold text-[#656f81] sm:text-lg">
                  {faq.q}
                </span>
                <span className="flex size-5 shrink-0 items-center justify-center text-[#656f81]">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`size-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#8b04ff]" : ""
                    }`}
                  >
                    <path d="M6 8l4 4 4-4" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="bg-[#f9fafb] p-4 text-right text-sm font-medium leading-7 text-[#656f81] sm:text-base">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Main Page Content                            */
/* -------------------------------------------------------------------------- */
export function GptLunaPageContent() {
  const reduce = !!useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="flex flex-col"
    >
      <Section01Hero />
      <Section02Stats />
      <Section03Capabilities />
      <Section04Comparison />
      <Section05Banner />
      <Section07OtherModels />
      <Section06Faq />
    </motion.div>
  );
}
