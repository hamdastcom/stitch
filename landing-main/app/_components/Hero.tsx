"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { PromptInput } from "./PromptInput";

const easeOut = [0.16, 1, 0.3, 1] as const;
const APP_URL = "http://app.hamdast.com/";
const CAFE_BAZAAR_URL = "https://cafebazaar.ir/app/ir.lontra.hamdast";

export function Hero() {
  const reduce = !!useReducedMotion();
  const t = (delay: number, duration = 0.75): Transition =>
    reduce ? { duration: 0 } : { delay, duration, ease: easeOut };

  return (
    <section className="relative overflow-x-clip">
      <div className="mx-auto flex w-full min-w-0 max-w-[1078px] flex-col items-center gap-[72px] overflow-x-clip px-4 pt-8 pb-16 text-center sm:px-6 sm:pt-16 sm:pb-24">
        <div className="flex w-full max-w-[338px] flex-col items-center gap-8 sm:max-w-none">
          <h1 className="flex flex-col items-center">
            <motion.span
              className="text-xl font-bold leading-9 text-neutral-400 sm:text-[28px] sm:leading-[36px]"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.12, 0.7)}
            >
              همه‌ی هوش مصنوعی‌های دنیا
            </motion.span>
            <motion.span
              className="text-[36px] font-extrabold leading-[46px] text-black sm:text-[48px] sm:leading-[62px]"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(0.22, 0.8)}
            >
              یک‌جا و به فارسی
            </motion.span>
          </h1>

          <motion.div
            className="flex w-full items-center justify-center gap-2 sm:gap-4"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.38)}
          >
            <motion.a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 min-w-[165px] cursor-pointer items-center justify-center rounded-xl bg-primary px-4 py-2 text-xl font-extrabold leading-[26px] text-white shadow-[0_6px_12px_rgba(62,0,73,0.24)]"
              whileHover={reduce ? undefined : { scale: 1.03, y: -1 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              شروع رایگان
            </motion.a>
            <motion.a
              href={CAFE_BAZAAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 min-w-[165px] cursor-pointer items-center justify-center gap-2 rounded-[32px] px-4 py-2 text-xl font-extrabold leading-[26px] text-[#2b3037] transition-colors hover:bg-black/[0.04]"
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/cafe-bazaar.svg"
                alt=""
                width={24}
                height={24}
                className="hidden size-6 shrink-0 object-contain sm:block"
              />
              دانلود از کافه بازار
            </motion.a>
          </motion.div>
        </div>

        <div className="relative z-10 w-full min-w-0">
          <TryCard reduce={reduce} />
        </div>
      </div>
    </section>
  );
}

function TryCard({ reduce }: { reduce: boolean }) {
  const t = (delay: number, duration = 0.85): Transition =>
    reduce ? { duration: 0 } : { delay, duration, ease: easeOut };

  return (
    <motion.div
      className="relative w-full min-w-0 max-w-full self-stretch"
      initial={reduce ? false : { opacity: 0, y: 52, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={t(0.48, 0.9)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-[35px] h-[253px] rounded-[24px] bg-[rgba(66,1,107,0.16)] blur-[25px]"
      />

      <div className="relative flex w-full min-w-0 max-w-full flex-col gap-4 rounded-[24px] bg-white p-4 shadow-[0_0_16px_rgba(0,0,0,0.04)] sm:p-8">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-xl font-extrabold leading-8 text-black">
            همدست را همین حالا،
            <br />
            بدون ثبت‌نام امتحان کن
          </h2>
          <p className="text-base font-medium leading-6 text-[#918d8d]">
            یک سوال بپرس،
            <br />
            ببین چند مدل هوش مصنوعی هم‌زمان چطور
            <br />
            جواب می‌دن و بهترین پاسخ رو خودت انتخاب کن.
          </p>
        </div>

        <PromptInput />
      </div>
    </motion.div>
  );
}
