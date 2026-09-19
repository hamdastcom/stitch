"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOut },
  },
};

const list: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const faqs: { q: string; a: string; qMobile?: [string, string] }[] = [
  {
    q: "آیا برای استفاده از همدست به فیلترشکن نیاز دارم؟",
    qMobile: [
      "آیا برای استفاده از همدست به فیلترشکن نیاز",
      "دارم؟",
    ],
    a: "نه. همدست مستقیم و بدون نیاز به فیلترشکن در ایران در دسترسه.",
  },
  {
    q: "قیمت استفاده از Claude و GPT در همدست به تومان چقدره؟",
    qMobile: [
      "قیمت استفاده از Claude و GPT در همدست به",
      "تومان چقدره؟",
    ],
    a: "همدست از سیستم اعتباری استفاده می‌کنه؛ هر مدل بسته به توان پردازشی‌ش اعتبار متفاوتی مصرف می‌کنه. جزئیات کامل در صفحه قیمت‌گذاری.",
  },
  {
    q: "اعتبار مصرف‌نشده منقضی می‌شه؟",
    a: "نه. اعتبار خریداری‌شده‌ی شما منقضی نمی‌شه و هر وقت بخوای می‌تونی ازش استفاده کنی.",
  },
  {
    q: "چطور می‌تونم همین الان شروع کنم؟",
    a: "کافیه اپلیکیشن همدست رو نصب کنی یا وارد نسخه‌ی وب بشی و بدون ثبت‌نام اولین سوالت رو بپرسی.",
  },
];

export function Faq({
  items = faqs,
  id = "faq",
}: {
  items?: { q: string; a: string; qMobile?: [string, string] }[];
  dense?: boolean;
  id?: string;
}) {
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState(0);

  return (
    <motion.section
      id={id}
      className="py-8"
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="mx-auto flex w-full max-w-[1076px] flex-col items-center gap-8 px-4 sm:px-6">
        <motion.h2
          className="w-full text-center text-[28px] font-extrabold leading-[34px] text-[#121316]"
          variants={reduce ? undefined : fadeUp}
        >
          سوالات متداول همدست
        </motion.h2>

        <motion.div
          className="flex w-full flex-col gap-2"
          variants={reduce ? undefined : list}
        >
          {items.map((faqItem, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={faqItem.q}
                variants={reduce ? undefined : item}
                className={`w-full min-w-0 overflow-hidden transition-[border-color,box-shadow] duration-300 ease-out ${
                  isOpen
                    ? "rounded-2xl border border-[#f1f2f2] bg-white shadow-[0_0_8px_rgba(160,11,215,0.04)]"
                    : "border-b border-[#f1f2f2]"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className={`flex w-full min-w-0 cursor-pointer items-center gap-2 p-4 text-right ${
                    isOpen ? "rounded-t-2xl border-b border-[#ededee] bg-white" : ""
                  }`}
                >
                  <span className="min-w-0 flex-1 text-lg font-extrabold leading-6 text-neutral-400">
                    {faqItem.qMobile ? (
                      <>
                        {faqItem.qMobile[0]}
                        <br className="sm:hidden" />{" "}
                        {faqItem.qMobile[1]}
                      </>
                    ) : (
                      faqItem.q
                    )}
                  </span>
                  <span className="relative size-4 shrink-0 overflow-clip">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/figma/arrow-down.svg"
                      alt=""
                      width={16}
                      height={16}
                      className={`size-4 origin-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </span>
                </button>

                <div
                  className="faq-answer motion-reduce:transition-none"
                  data-open={isOpen}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="rounded-b-2xl bg-grey-01 p-4">
                      <p className="w-full text-right text-sm font-medium leading-6 text-neutral-400">
                        {faqItem.a}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
