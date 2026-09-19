"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

const APP_URL = "http://app.hamdast.com/";

function Icon({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}

export function PromptInput() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function openApp() {
    window.open(APP_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <motion.div
        className="direction-ltr grid w-full min-w-0 max-w-full cursor-text items-center gap-2 rounded-2xl bg-[#f1f2f2] p-2 [grid-template-columns:32px_32px_minmax(0,1fr)_32px]"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a, button")) return;
          inputRef.current?.focus();
        }}
        animate={
          focused
            ? { boxShadow: "0 0 0 2px rgba(139,4,255,0.22)" }
            : { boxShadow: "0 0 0 0px rgba(139,4,255,0)" }
        }
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ارسال"
          className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-primary transition-opacity hover:opacity-90"
        >
          <Icon
            src="/figma/hero/arrow-up.svg"
            alt=""
            width={24}
            height={24}
            className="size-6"
          />
        </a>
        <button
          type="button"
          aria-label="ضبط صدا"
          onClick={openApp}
          className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-transparent transition-colors hover:bg-white"
        >
          <Icon
            src="/figma/hero/microphone.svg"
            alt=""
            width={24}
            height={24}
            className="size-6"
          />
        </button>
        <input
          ref={inputRef}
          dir="rtl"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              openApp();
            }
          }}
          placeholder="متن دلخواه خود را وارد کنید ..."
          className="min-w-0 w-full bg-transparent text-right text-base font-medium leading-6 text-black outline-none placeholder:text-neutral-300"
          size={1}
          aria-label="متن دلخواه خود را وارد کنید"
          autoComplete="off"
        />
        <button
          type="button"
          aria-label="افزودن فایل"
          onClick={openApp}
          className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white"
        >
          <Icon
            src="/figma/hero/plus.svg"
            alt=""
            width={24}
            height={24}
            className="size-6"
          />
        </button>
      </motion.div>

      <div className="direction-ltr flex w-full min-w-0 flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={openApp}
          className="flex h-8 min-w-0 cursor-pointer items-center justify-center gap-1 rounded-2xl border border-neutral-100 bg-white py-1 pl-1 pr-2 transition-colors hover:bg-neutral-50 sm:min-w-[102px]"
          aria-label="انتخاب مدل Chat-GPT"
        >
          <Icon
            src="/figma/hero/sort-vertical.svg"
            alt=""
            width={20}
            height={20}
            className="size-5 shrink-0"
          />
          <span className="flex-1 text-center text-sm font-medium leading-6 text-neutral-400">
            Chat-GPT
          </span>
          <Icon
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
          className="direction-ltr flex cursor-pointer items-center justify-center gap-1 rounded-3xl border border-primary-100 bg-primary-50 py-1 pl-4 pr-3 transition-opacity hover:opacity-90"
          aria-haspopup="listbox"
          aria-label="تولید عکس"
        >
          <span className="text-sm font-medium leading-6 text-primary" dir="rtl">
            تولید عکس
          </span>
          <Icon
            src="/figma/hero/angle-down.svg"
            alt=""
            width={20}
            height={20}
            className="size-5 shrink-0"
          />
        </button>
      </div>
    </div>
  );
}
