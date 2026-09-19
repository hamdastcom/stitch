"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const list: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

type Model = { name: string; provider: string; gems: number };

const CATEGORIES = [
  "مدل های چت متنی",
  "تولید تصویر",
  "تولید ویدیو",
] as const;

const MODELS: Record<(typeof CATEGORIES)[number], Model[]> = {
  "مدل های چت متنی": [
    { name: "Gemini 3.5 Flash", provider: "Google", gems: 11 },
    { name: "GPT-5", provider: "OpenAI", gems: 24 },
    { name: "Claude 4 Sonnet", provider: "Anthropic", gems: 28 },
    { name: "Grok 4", provider: "xAI", gems: 22 },
    { name: "Perplexity Sonar", provider: "Perplexity", gems: 16 },
  ],
  "تولید تصویر": [
    { name: "Nano Banana Pro", provider: "Google", gems: 45 },
    { name: "GPT Image", provider: "OpenAI", gems: 52 },
  ],
  "تولید ویدیو": [
    { name: "Wan", provider: "Alibaba", gems: 220 },
    { name: "Veo", provider: "Google", gems: 260 },
  ],
};

export function GemCalculator() {
  const reduce = !!useReducedMotion();
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]>("مدل های چت متنی");
  const [model, setModel] = useState<Model>(MODELS["مدل های چت متنی"][0]);

  function onCategory(next: (typeof CATEGORIES)[number]) {
    setCategory(next);
    setModel(MODELS[next][0]);
  }

  return (
    <motion.section
      className="w-full border-y border-[#ecebeb] bg-grey-01 py-8"
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="mx-auto flex w-full max-w-[1206px] flex-col items-center gap-4 px-4 sm:px-6">
        <div className="flex w-full max-w-[738px] flex-col items-center gap-6">
        <motion.h2
          className="w-full text-center text-[28px] font-extrabold leading-[34px] text-[#121316]"
          variants={reduce ? undefined : fadeUp}
        >
          هر مدل هوش مصنوعی چقدر{" "}
          <br className="sm:hidden" />
          اعتبار (جم) مصرف می‌کند؟
        </motion.h2>
        <motion.p
          className="text-center text-lg font-medium leading-[27px] text-neutral-300"
          variants={reduce ? undefined : fadeUp}
        >
          همین الان با انتخاب مدل هوش مصنوعی{" "}
          <br className="sm:hidden" />
          مورد نظرت و ارائه دهنده اون می تونی ببینی{" "}
          <br className="sm:hidden" />
          چقدر اعتبار (جم) مصرف میشه .
        </motion.p>
        </div>

        <motion.div
          className="flex w-full max-w-[796px] flex-col items-stretch gap-2"
          variants={reduce ? undefined : list}
        >
          <motion.div
            className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2"
            variants={reduce ? undefined : fadeUp}
          >
            <Dropdown
              label="دسته‌بندی مدل"
              value={category}
              options={CATEGORIES.map((item) => ({
                id: item,
                label: item,
                extraBold: true,
              }))}
              onChange={(id) => onCategory(id as (typeof CATEGORIES)[number])}
            />
            <Dropdown
              label="مدل هوش مصنوعی"
              value={model.name}
              options={MODELS[category].map((item) => ({
                id: item.name,
                label: item.name,
                badge: item.provider,
              }))}
              onChange={(id) => {
                const next = MODELS[category].find((item) => item.name === id);
                if (next) setModel(next);
              }}
            />
          </motion.div>

          <motion.div
            className="flex w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl border border-neutral-200 px-3 py-2"
            variants={reduce ? undefined : fadeUp}
          >
            <p className="shrink-0 text-lg font-medium leading-[27px] text-neutral-300">
              جم مصرفی هر پیام:
            </p>
            <div className="direction-ltr flex shrink-0 items-center gap-2">
              <span aria-hidden className="text-sm leading-6">
                💎
              </span>
              <span className="relative inline-grid min-w-[3ch] place-items-center text-xl font-extrabold leading-8 tabular-nums text-black">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={model.gems}
                    className="col-start-1 row-start-1"
                    initial={reduce ? false : { opacity: 0, y: 10, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, y: -10, scale: 0.88 }}
                    transition={{ duration: reduce ? 0 : 0.28, ease: easeOut }}
                  >
                    {toFaDigits(model.gems)}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

type Option = { id: string; label: string; badge?: string; extraBold?: boolean };

function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (id: string) => void;
}) {
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((item) => item.id === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full min-w-0 max-w-full">
      <button
        type="button"
        dir="rtl"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-auto w-full min-w-0 max-w-full cursor-pointer items-center gap-1 overflow-hidden rounded-xl border border-neutral-100 bg-white px-2 py-3 text-neutral-600"
      >
        {selected.badge ? (
          <span className="w-auto shrink-0 truncate rounded-full bg-primary-50 px-2 py-0.5 text-center text-base font-medium leading-6 text-primary">
            {selected.badge}
          </span>
        ) : null}
        <span
          className={`min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-right text-lg ${
            selected.extraBold ? "font-extrabold" : "font-bold"
          }`}
        >
          {selected.label}
        </span>
        <span className="relative size-6 shrink-0 overflow-clip rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/arrow-down.svg"
            alt=""
            className={`size-full origin-center p-1 transition-transform duration-200 sm:p-1.5 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={label}
            initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: easeOut }}
            className="absolute inset-x-0 top-[calc(100%+8px)] z-20 origin-top overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_8px_24px_rgba(62,0,73,0.12)]"
          >
            {options.map((item) => {
              const isSelected = item.id === selected.id;
              return (
                <li key={item.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(item.id);
                      setOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-right transition-colors hover:bg-primary-50 sm:gap-3 sm:px-4 sm:py-3 ${
                      isSelected ? "bg-primary-50" : "bg-white"
                    }`}
                  >
                    <span
                      className={`min-w-0 truncate text-lg ${
                        item.extraBold ? "font-extrabold" : "font-bold"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.badge ? (
                      <span className="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-sm font-bold text-primary sm:px-3 sm:text-base">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function toFaDigits(value: number) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}
