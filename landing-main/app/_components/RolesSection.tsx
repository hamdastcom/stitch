"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useState } from "react";

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

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOut },
  },
};

const toolsList: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

type Tool = { icon: string; title: string; body: string };

const roles = [
  {
    id: "student",
    icon: "/figma/book.svg",
    title: "دانشجو",
    body: "خلاصه‌ی جزوه، حل مسئله، تمرین زبان",
    tools: [
      {
        icon: "/figma/book.svg",
        title: "خلاصه‌ساز جزوه",
        body: "جزوه و مقاله‌ات را در چند ثانیه به نکات کلیدی تبدیل می‌کند.",
      },
      {
        icon: "/figma/msg-question.svg",
        title: "حل‌کننده مسئله",
        body: "مسئله را قدم‌به‌قدم توضیح می‌دهد تا خودت یاد بگیری، نه فقط جواب.",
      },
      {
        icon: "/figma/translate.svg",
        title: "مربی زبان",
        body: "تمرین مکالمه، گرامر و واژگان را با بازخورد فوری می‌سازد.",
      },
      {
        icon: "/figma/edit-2.svg",
        title: "دستیار تحقیق",
        body: "منابع را جمع می‌کند و پیش‌نویس گزارش یا پایان‌نامه را آماده می‌کند.",
      },
    ],
  },
  {
    id: "freelancer",
    icon: "/figma/personalcard.svg",
    title: "فریلنسر و کارمند",
    body: "نگارش ایمیل، تهیه گزارش، ایده‌پردازی",
    tools: [
      {
        icon: "/figma/edit-2.svg",
        title: "نگارش ایمیل حرفه‌ای",
        body: "ایمیل رسمی، پیگیری و پیشنهاد همکاری را سریع و مودب می‌نویسد.",
      },
      {
        icon: "/figma/messages-3.svg",
        title: "تهیه گزارش",
        body: "از داده و یادداشت، گزارش مرتب و قابل ارائه می‌سازد.",
      },
      {
        icon: "/figma/aialgorithm.svg",
        title: "ایده‌پردازی پروژه",
        body: "برای هر بریف، چند مسیر اجرایی و عنوان پیشنهادی می‌دهد.",
      },
      {
        icon: "/figma/setting-2.svg",
        title: "مدیریت کار روزانه",
        body: "لیست کار، اولویت و پیش‌نویس پاسخ به کارفرما را مرتب می‌کند.",
      },
    ],
  },
  {
    id: "developer",
    icon: "/figma/msg-programming-bulk.svg",
    title: "برنامه‌نویس",
    body: "دیباگ کد، توضیح خطا، نوشتن مستندات",
    tools: [
      {
        icon: "/figma/msg-programming-linear.svg",
        title: "مشاور کد هوشمند",
        body: "پیشنهادات بهینه‌سازی کد را بر اساس زمینه پروژه ارائه می‌دهد.",
      },
      {
        icon: "/figma/edit-2.svg",
        title: "پیمایشگر منابع کد",
        body: "در GitHub / StackOverflow به دنبال مثال‌ها و بحث‌های کد می‌گردد.",
      },
      {
        icon: "/figma/setting-2.svg",
        title: "پلتفرم ربات بدون کد",
        body: "دستیارهای Claude 3.5 را با گردش‌های کاری خودکار ایجاد می‌کند.",
      },
      {
        icon: "/figma/rotate-3d.svg",
        title: "موتور تولید کد",
        body: "قطعه کد و تست‌های واحد را برای توسعه سریع‌تر تولید می‌کند.",
      },
    ],
  },
  {
    id: "marketer",
    icon: "/figma/people.svg",
    title: "بازاریاب",
    body: "کپشن، سناریو، تصویر تبلیغاتی",
    tools: [
      {
        icon: "/figma/messages-3.svg",
        title: "کپشن شبکه‌های اجتماعی",
        body: "برای هر پلتفرم، کپشن جذاب و هماهنگ با لحن برند می‌نویسد.",
      },
      {
        icon: "/figma/video-square.svg",
        title: "سناریو تبلیغاتی",
        body: "ایده را به استوری‌برد و دیالوگ کوتاه تبلیغاتی تبدیل می‌کند.",
      },
      {
        icon: "/figma/image.svg",
        title: "تصویر تبلیغاتی",
        body: "از متن کمپین، پرامپت تصویر و پیشنهاد بصری می‌سازد.",
      },
      {
        icon: "/figma/aialgorithm.svg",
        title: "استراتژی محتوا",
        body: "تقویم محتوا و پیام کلیدی هر کمپین را یکجا پیشنهاد می‌دهد.",
      },
    ],
  },
];

type Role = (typeof roles)[number];

export function RolesSection() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState("developer");
  const role = roles.find((r) => r.id === active) ?? roles[2];

  return (
    <motion.div
      className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-16 px-4 sm:px-6"
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h2
        className="w-full text-center text-[28px] font-extrabold leading-[34px] text-[#121316]"
        variants={reduce ? undefined : fadeUp}
      >
        برای هر کاری که انجام می‌دی
      </motion.h2>

      <div className="flex w-full flex-col items-center gap-4 sm:gap-8">
        <motion.div
          className="grid w-full max-w-[1080px] grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 sm:gap-0"
          variants={reduce ? undefined : list}
        >
          {roles.map((roleItem) => (
            <RolePicker
              key={roleItem.id}
              roleItem={roleItem}
              selected={roleItem.id === active}
              reduce={reduce}
              onSelect={() => setActive(roleItem.id)}
            />
          ))}
        </motion.div>

        <motion.div
          className="w-full rounded-[32px] border border-primary-50 bg-grey-01 p-8"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={role.id}
              className="grid gap-x-8 gap-y-8 sm:gap-x-16 sm:gap-y-16 md:grid-cols-2"
              initial={reduce ? false : "hidden"}
              animate="show"
              exit={
                reduce
                  ? undefined
                  : { opacity: 0, y: -10, transition: { duration: 0.2 } }
              }
              variants={reduce ? undefined : toolsList}
            >
              {role.tools.map((tool) => (
                <motion.div
                  key={tool.title}
                  className="flex items-center gap-4"
                  variants={reduce ? undefined : item}
                >
                  <div className="flex size-[86px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tool.icon}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1 text-right">
                    <h3 className="text-xl font-extrabold leading-8 text-neutral-500">
                      {tool.title}
                    </h3>
                    <p className="text-sm font-medium leading-6 text-neutral-300">
                      {tool.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

function RolePicker({
  roleItem,
  selected,
  reduce,
  onSelect,
}: {
  roleItem: Role;
  selected: boolean;
  reduce: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      className="w-full"
      variants={reduce ? undefined : item}
    >
      <motion.button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="flex w-full cursor-pointer flex-col items-center gap-4 text-center"
        whileHover={reduce ? undefined : { y: -6 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        <motion.div
          className={`flex size-[86px] items-center justify-center overflow-hidden rounded-2xl transition-colors duration-300 ${
            selected ? "bg-primary/8" : "bg-black/8"
          }`}
          whileHover={reduce ? undefined : { scale: 1.06 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={roleItem.icon}
            alt=""
            width={40}
            height={40}
            className="size-10"
          />
        </motion.div>
        <div className="flex w-full flex-col gap-1">
          <h3 className="text-xl font-extrabold leading-8 text-neutral-500">
            {roleItem.title}
          </h3>
          <p className="text-sm font-medium leading-6 text-neutral-300">
            {roleItem.body}
          </p>
        </div>
      </motion.button>
    </motion.div>
  );
}
