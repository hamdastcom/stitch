"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const rowItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

type Row = {
  service: string;
  serviceSub?: string;
  plan: string;
  usd: string;
  toman: string;
};

const rows: Row[] = [
  { service: "ChatGPT Plus", plan: "Plus", usd: "$20 ماهانه", toman: "۴,۱۰۰,۰۰۰ تومان" },
  { service: "Claude Pro", plan: "Pro", usd: "$20 ماهانه", toman: "۴,۱۰۰,۰۰۰ تومان" },
  {
    service: "Google AI Pro",
    serviceSub: "(Gemini)",
    plan: "Pro",
    usd: "$20 ماهانه",
    toman: "۴,۱۰۰,۰۰۰ تومان",
  },
  { service: "Perplexity Pro", plan: "Pro", usd: "$20 ماهانه", toman: "۴,۱۰۰,۰۰۰ تومان" },
  { service: "SuperGrok", plan: "Standard", usd: "$30 ماهانه", toman: "۴,۹۰۰,۰۰۰ تومان" },
  {
    service: "Kimi",
    serviceSub: "(Moonshot)",
    plan: "Moderate",
    usd: "$20 ماهانه",
    toman: "۴,۱۰۰,۰۰۰ تومان",
  },
];

export function ComparisonTable() {
  const reduce = !!useReducedMotion();

  return (
    <motion.section
      className="relative w-full bg-white py-8"
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="relative mx-auto flex w-full max-w-[850px] flex-col items-center gap-4 px-4 sm:px-0">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <motion.h2
          className="text-[28px] font-extrabold leading-[34px] text-[#121316]"
          variants={reduce ? undefined : fadeUp}
        >
          همدست در برابر خرید جداگانه{" "}
          <br className="sm:hidden" />
          هر سرویس
        </motion.h2>
        <motion.p
          className="text-lg font-medium leading-[27px] text-neutral-300"
          variants={reduce ? undefined : fadeUp}
        >
          <span className="hidden sm:inline">
            این مقایسه فرض می‌کند اگر بتوانید این سرویس‌ها را مستقیم از ایران بخرید
            <br />
            که در عمل نیاز به فیلترشکن،کارت بانکی خارجی و اغلب آدرس خارج از ایران دارد.
            <br />
            <span className="text-primary">همدست</span> همه‌ی این موانع را حذف می‌کند.
          </span>
          <span className="sm:hidden">
            این مقایسه فرض می‌کند اگر بتوانید این سرویس‌ها
            <br /> را مستقیم از ایران بخرید
            <br />
            که در عمل نیاز به فیلترشکن،کارت بانکی خارجی
            <br />
            و اغلب آدرس خارج از ایران دارد.
            <br />
            <span className="text-primary">همدست</span> همه‌ی این موانع را حذف
            می‌کند.
          </span>
        </motion.p>
      </div>

      <div className="-mx-4 w-[calc(100%+2rem)] sm:mx-0 sm:w-full">
        <motion.div
          className="w-full overflow-x-auto overscroll-x-contain ps-4 [scrollbar-width:none] [-ms-overflow-style:none] sm:overflow-visible sm:ps-0 [&::-webkit-scrollbar]:hidden"
          variants={reduce ? undefined : fadeUp}
        >
          <table className="w-[850px] table-fixed border-separate border-spacing-0 text-center sm:w-full">
            <colgroup>
              <col className="w-[290px] sm:w-[34%]" />
              <col className="w-[160px] sm:w-[19%]" />
              <col className="w-[160px] sm:w-[19%]" />
              <col className="w-[240px] sm:w-[28%]" />
            </colgroup>
            <thead>
              <tr className="bg-neutral-50">
                <th className="border border-neutral-100 p-3 text-lg font-extrabold leading-6 whitespace-nowrap text-[#383e48]">
                  سرویس
                </th>
                <th className="border border-neutral-100 p-3 text-lg font-extrabold leading-6 whitespace-nowrap text-[#383e48]">
                  پلن پایه
                </th>
                <th className="border border-neutral-100 p-3 text-lg font-extrabold leading-6 whitespace-nowrap text-[#383e48]">
                  قیمت دلاری
                </th>
                <th className="border border-neutral-100 p-3 text-lg font-extrabold leading-6 whitespace-nowrap text-[#383e48]">
                  معادل تومانی{" "}
                  <span className="text-sm font-medium leading-6 text-neutral-300">
                    (تقریبی)
                  </span>
                </th>
              </tr>
            </thead>
            <motion.tbody
              initial={reduce ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={reduce ? undefined : list}
            >
              {rows.map((row) => (
                <motion.tr
                  key={row.service}
                  className="bg-white"
                  variants={reduce ? undefined : rowItem}
                >
                  <td className="border border-neutral-100 p-3 text-lg font-medium leading-[27px] whitespace-nowrap text-[#383e48]">
                    {row.serviceSub
                      ? `${row.service} ${row.serviceSub}`
                      : row.service}
                  </td>
                  <td className="border border-neutral-100 p-3 text-lg font-medium leading-[27px] whitespace-nowrap text-[#383e48]">
                    {row.plan}
                  </td>
                  <td className="border border-neutral-100 p-3 text-lg font-medium leading-[27px] whitespace-nowrap text-[#383e48]">
                    {row.usd}
                  </td>
                  <td className="border border-neutral-100 p-3 text-lg font-medium leading-[27px] whitespace-nowrap text-[#383e48]">
                    {row.toman}
                  </td>
                </motion.tr>
              ))}
              <motion.tr
                className="bg-white"
                variants={reduce ? undefined : rowItem}
              >
                <td
                  colSpan={2}
                  className="border border-neutral-100 p-3 text-lg font-medium leading-[27px] whitespace-nowrap text-[#383e48]"
                >
                  جمع کل سرویس ها
                </td>
                <td className="border border-neutral-100 p-3 text-lg font-medium leading-[27px] whitespace-nowrap text-[#383e48]">
                  $128.99 ماهانه
                </td>
                <td className="border border-neutral-100 p-3 text-lg font-medium leading-[27px] whitespace-nowrap text-[#383e48]">
                  ۱۲۶,۴۴۳,۰۰۰ تومان
                </td>
              </motion.tr>
              <motion.tr
                className="bg-primary-50"
                variants={reduce ? undefined : rowItem}
              >
                <td
                  colSpan={2}
                  className="border border-primary-100 p-3 text-lg font-medium leading-[27px] whitespace-nowrap text-primary-600"
                >
                  همدست{" "}
                  <span className="text-base leading-6 text-primary-200">
                    ( یک ماهه، همه مدل ها )
                  </span>
                </td>
                <td className="border border-primary-100 p-3" />
                <td className="border border-primary-100 p-3 text-lg font-medium leading-[27px] whitespace-nowrap text-primary-600">
                  ۲۹۹,۰۰۰ تومان
                </td>
              </motion.tr>
            </motion.tbody>
          </table>
        </motion.div>
      </div>
      </div>
    </motion.section>
  );
}
