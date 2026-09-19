"use client";

import { useState } from "react";
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;
const TITLE_WORDS = ["هوش", "مصنوعی", "همدست", "کیست؟"] as const;
const TITLE_LINES_MOBILE = ["هوش مصنوعی", "همدست کیست؟"] as const;

const team = [
  {
    src: "/figma/about/team1.jpg",
    tint: "rgba(0,204,31,0.3)",
    height: 398,
    offset: 90,
    mobile: false,
  },
  {
    src: "/figma/about/team2.jpg",
    tint: "rgba(204,75,0,0.3)",
    height: 353,
    offset: 45,
    mobile: true,
  },
  {
    src: "/figma/about/team3.jpg",
    tint: "rgba(146,0,204,0.3)",
    height: 382,
    offset: 49,
    mobile: true,
  },
  {
    src: "/figma/about/team4.jpg",
    tint: "rgba(204,173,0,0.3)",
    height: 308,
    offset: 39,
    mobile: true,
  },
  {
    src: "/figma/about/team5.jpg",
    tint: "rgba(0,92,204,0.3)",
    height: 450,
    offset: 102,
    mobile: false,
  },
];

const registry = [
  { label: "نام ثبتی :", value: "شرکت هوش آفرینان توسعه فناوری" },
  { label: "شناسه ملی:", value: "۱۴۰۱۵۴۲۸۴۴۷" },
  { label: "شماره ثبت:", value: "۶۷۴۸۵۸" },
  {
    label: "آدرس:",
    value:
      "استان تهران، شهرستان تهران، بخش مرکزی، شهر تهران، تیموری، کوچه گلستان، خیابان شهید احمد قاسمی، پلاک ۷۹، واحد ۲",
  },
];

const faqs = [
  {
    q: "همدست چه شرکتی است؟",
    a: "همدست محصول شرکت هوش آفرینان توسعه فناوری است، یک شرکت ثبت‌شده در تهران با شناسه ملی ۱۴۰۱۵۴۲۸۴۴۷.",
  },
  {
    q: "همدست چه کاری انجام می‌دهد؟",
    a: "همدست به کاربران فارسی‌زبان اجازه می‌دهد بدون فیلترشکن و با پرداخت تومانی، از بیش از ۲۲ مدل هوش مصنوعی جهان مثل Claude، GPT و Gemini استفاده کنند.",
  },
  {
    q: "تیم همدست چند نفر است؟",
    a: "تیم همدست از ده نفر متخصص در حوزه‌ی مهندسی نرم‌افزار، طراحی محصول و هوش مصنوعی تشکیل شده که در تهران فعالیت می‌کنند.",
  },
];

const bodyText =
  "text-lg font-medium leading-[27px] text-neutral-400 text-justify";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40, filter: "blur(8px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: easeOut },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40, filter: "blur(8px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: easeOut },
  },
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const lineItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

const photoItem: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const faqItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export function AboutPageContent() {
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const t = (delay: number, duration = 0.75): Transition =>
    reduce ? { duration: 0 } : { delay, duration, ease: easeOut };
  const inView = reduce
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, amount: 0.25 },
      };

  const toggle = (q: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(q)) next.delete(q);
      else next.add(q);
      return next;
    });

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-40 top-[900px] h-[406px] w-[406px] rounded-full bg-[#c9a8ff]/20 blur-3xl sm:h-[765px] sm:w-[765px]"
          animate={
            reduce ? undefined : { x: [0, 22, -14, 0], y: [0, -16, 12, 0] }
          }
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-40 top-[300px] h-[479px] w-[479px] rounded-full bg-[#e9d5ff]/25 blur-3xl sm:h-[902px] sm:w-[902px]"
          animate={
            reduce ? undefined : { x: [0, -18, 14, 0], y: [0, 14, -12, 0] }
          }
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Intro */}
      <section className="mx-auto flex max-w-[1284px] flex-col items-center gap-6 px-4 pt-8 pb-8 text-center sm:px-6 sm:pt-16">
        <h1 className="text-[36px] font-extrabold leading-[46px] text-[#121316]">
          <span className="flex flex-col items-center sm:hidden">
            {TITLE_LINES_MOBILE.map((line, i) => (
              <span key={line} className="overflow-hidden pb-[0.08em]">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={t(0.08 + i * 0.1, 0.85)}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </span>
          <span className="hidden flex-wrap items-baseline justify-center gap-x-[0.28em] sm:flex">
            {TITLE_WORDS.map((word, i) => (
              <span key={word} className="overflow-hidden pb-[0.08em]">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={t(0.08 + i * 0.1, 0.85)}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          className="max-w-[868px] text-center text-lg font-medium leading-[27px] text-neutral-300"
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={reduce ? undefined : stagger}
        >
          <motion.span className="block" variants={reduce ? undefined : lineItem}>
            <span className="text-primary">همدست</span> یک پلتفرم ایرانی است که
            به بیش از ۲۲ مدل برتر هوش مصنوعی جهان
          </motion.span>
          <motion.span className="block" variants={reduce ? undefined : lineItem}>
            از جمله <span className="text-primary">Claude، GPT و Gemini</span>
          </motion.span>
          <motion.span className="block" variants={reduce ? undefined : lineItem}>
            دسترسی مستقیم، فارسی و بدون فیلترشکن می‌دهد.
          </motion.span>
          <motion.span className="block" variants={reduce ? undefined : lineItem}>
            <span className="text-primary">همدست</span> را{" "}
            <span className="text-primary">شرکت هوش آفرینان توسعه فناوری</span>،
            با یک تیم ده‌نفره در تهران، ساخته و اداره می‌کند.
          </motion.span>
        </motion.p>
      </section>

      {/* Story */}
      <motion.section className="bg-grey-01" {...inView}>
        <div
          className="direction-ltrmx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 py-8 sm:flex-row sm:items-center sm:justify-center sm:gap-[67px] sm:px-16 lg:px-[120px]"
        >
          <motion.div
            className="flex shrink-0 justify-center"
            variants={reduce ? undefined : fadeLeft}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/figma/about/story.png"
              alt=""
              className="h-auto w-[314px] max-w-full"
              whileHover={
                reduce ? undefined : { y: -8, rotate: -1.5, scale: 1.03 }
              }
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            />
          </motion.div>

          <motion.div
            dir="rtl"
            className="flex w-full max-w-[380px] flex-col items-center gap-2 sm:max-w-[456px]"
            variants={reduce ? undefined : stagger}
          >
            <div className="flex w-full flex-col items-center gap-2 text-center sm:items-stretch sm:text-right">
              <motion.h2
                className="text-[28px] font-extrabold leading-[34px] text-[#121316]"
                variants={reduce ? undefined : fadeRight}
              >
                داستان همدست
              </motion.h2>
              <motion.p
                className="text-lg font-medium leading-[27px] text-primary sm:text-xl sm:font-extrabold sm:leading-[26px]"
                variants={reduce ? undefined : fadeRight}
              >
                دری که کسی کلیدش را نداشت
              </motion.p>
            </div>

            <div className={`flex w-full flex-col gap-4 ${bodyText}`}>
              <motion.p variants={reduce ? undefined : lineItem}>
                سال ۱۴۰۴ بود. چند مهندس و طراح، هرکدام از مسیر متفاوتی، به یک
                نقطه‌ی مشترک رسیده بودند: هر بار که می‌خواستند از قدرت واقعی هوش
                مصنوعی جهان استفاده کنند، باید از یک در پشتی رد می‌شدند
                فیلترشکنی که قطع و وصل می‌شد، کارت بانکی‌ای که نداشتند، رابطی که
                فارسی را نمی‌فهمید. انگار دری به دنیایی جادویی باز شده بود، اما
                کلیدش دست کاربر فارسی‌زبان نبود.
              </motion.p>
              <motion.p variants={reduce ? undefined : lineItem}>
                آن‌ها به‌جای شکایت از این در بسته، تصمیم گرفتند خودشان کلید
                بسازند.{" "}
                <span className="text-primary">
                  شرکت هوش آفرینان توسعه فناوری
                </span>{" "}
                دقیقاً با همین هدف شکل گرفت نه اختراع دوباره‌ی هوش مصنوعی، بلکه
                گشودن دری که از قبل وجود داشت اما به روی همه باز نبود.
              </motion.p>
              <motion.p variants={reduce ? undefined : lineItem}>
                امروز، یک تیم ده‌نفره در تهران هر روز پشت همین در می‌ایستد. اسم
                محصول را از همین‌جا انتخاب کردیم:{" "}
                <span className="text-primary">همدست</span> چون
                قرار نیست جادوگری از دور تماشا کنید؛ همدست، دستتان را می‌گیرد و
                همراه‌تان از آن در رد می‌شود.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission */}
      <motion.section {...inView}>
        <div
          className="direction-ltrmx-auto flex max-w-[1440px] flex-col items-center gap-4 px-4 py-8 sm:flex-row-reverse sm:items-center sm:justify-center sm:gap-[67px] sm:px-16 lg:px-[120px]"
        >
          <motion.div
            className="flex shrink-0 justify-center"
            variants={reduce ? undefined : fadeRight}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/figma/about/mission.png"
              alt=""
              className="h-auto w-[314px] max-w-full"
              whileHover={
                reduce ? undefined : { y: -10, scale: 1.04 }
              }
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            />
          </motion.div>

          <motion.div
            dir="rtl"
            className="flex w-full max-w-[380px] flex-col items-center gap-2 sm:max-w-[456px] sm:items-stretch"
            variants={reduce ? undefined : stagger}
          >
            <motion.h2
              className="text-[28px] font-extrabold leading-[34px] text-[#121316] sm:text-right"
              variants={reduce ? undefined : fadeLeft}
            >
              ماموریت ما
            </motion.h2>
            <div className={`flex w-full flex-col gap-4 ${bodyText}`}>
              <motion.p variants={reduce ? undefined : lineItem}>
                ما به یک اصل ساده اعتقاد داریم: دسترسی به بهترین ابزارهای هوش
                مصنوعی جهان نباید یک امتیاز جغرافیایی باشد. کار تیم{" "}
                <span className="text-primary">همدست</span>{" "}
                هر روز همین است هر سد فنی، مالی یا زبانی که بین یک ایده‌ی خوب و
                اجرای آن قرار گرفته را برمی‌داریم.
              </motion.p>
              <motion.p variants={reduce ? undefined : lineItem}>
                <span className="text-primary">همدست</span>{" "}
                دری است که همیشه باز می‌ماند. بدون فیلترشکن، بدون کارت بانکی خارجی،
                بدون واسطه فقط شما و قدرتمندترین هوش مصنوعی‌های دنیا، رو‌به‌روی هم.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Team */}
      <motion.section
        className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-4 py-8 text-center sm:px-6"
        {...inView}
      >
        <motion.h2
          className="text-[28px] font-extrabold leading-[34px] text-[#121316]"
          variants={reduce ? undefined : fadeUp}
        >
          تیم همدست
        </motion.h2>
        <motion.p
          className={`max-w-[380px] sm:max-w-[456px] ${bodyText} !text-center`}
          variants={reduce ? undefined : fadeUp}
        >
          پشت هر پاسخی که{" "}
          <span className="text-primary">همدست</span> به
          شما می‌دهد، یک تیم ده‌نفره از مهندسان، طراحان و متخصصان هوش مصنوعی در
          تهران نشسته‌اند آدم‌هایی که پیش از آنکه محصول را به دست شما برسانند،
          خودشان اولین کاربرش هستند.
        </motion.p>

        <motion.div
          className="direction-ltrflex w-full max-w-[1232px] items-end justify-center gap-1 sm:gap-2"
          variants={reduce ? undefined : stagger}
        >
          {team.map((member) => (
            <motion.div
              key={member.src}
              className={`relative w-[124px] max-w-[124px] shrink-0 overflow-hidden sm:w-[180px] sm:max-w-[180px] ${
                member.mobile ? "" : "hidden sm:block"
              }`}
              style={{ aspectRatio: `240 / ${member.height}` }}
              variants={reduce ? undefined : photoItem}
              whileHover={reduce ? undefined : { y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.src}
                alt=""
                className="size-full object-cover object-top grayscale"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0"
                style={{
                  top: `${(member.offset / member.height) * 100}%`,
                  backgroundColor: member.tint,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Company registration */}
      <motion.section {...inView}>
        <div
          className="direction-ltrmx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 py-8 sm:flex-row-reverse sm:items-center sm:justify-center sm:gap-[67px] sm:px-16 lg:px-[120px]"
        >
          <motion.div
            className="w-full max-w-[380px] overflow-hidden rounded-[21px] border-[5px] border-white bg-white shadow-[0_0_12px_rgba(0,0,0,0.04)] sm:max-w-[422px] sm:rounded-[23px] sm:border-[6px] sm:shadow-[0_0_13px_rgba(0,0,0,0.04)]"
            variants={reduce ? undefined : fadeLeft}
            whileHover={reduce ? undefined : { y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <div className="relative aspect-[516/379] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/about/map.png"
                alt="موقعیت دفتر همدست روی نقشه"
                className="size-full object-cover"
              />
              <motion.span
                className="absolute left-1/2 top-1/2 h-8 w-[27px] -translate-x-1/2 -translate-y-1/2 sm:h-9 sm:w-[30px]"
                animate={
                  reduce
                    ? undefined
                    : { y: [0, -7, 0], scale: [1, 1.08, 1] }
                }
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/figma/about/map-pin.svg" alt="" className="size-full" />
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            dir="rtl"
            className="flex w-full max-w-[380px] flex-col items-center gap-2.5 sm:max-w-[456px] sm:items-stretch"
            variants={reduce ? undefined : stagger}
          >
            <motion.h2
              className="text-[28px] font-extrabold leading-[34px] text-[#121316] sm:text-right"
              variants={reduce ? undefined : fadeRight}
            >
              اطلاعات ثبتی شرکت
            </motion.h2>

            <dl className="flex w-full flex-col gap-1 sm:gap-2">
              {registry.map((row, index) => (
                <motion.div
                  key={row.label}
                  className="flex flex-col gap-1 sm:gap-2"
                  variants={reduce ? undefined : lineItem}
                >
                  {index > 0 ? <div className="h-px w-full bg-[#ededee]" /> : null}
                  <div className="flex items-start gap-1.5 py-1 text-neutral-400 sm:gap-2.5 sm:py-2">
                    <dt className="shrink-0 text-lg font-medium whitespace-nowrap leading-[27px]">
                      {row.label}
                    </dt>
                    <dd className="min-w-0 flex-1 text-right text-xl font-bold leading-9">
                      {row.value}
                    </dd>
                  </div>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        className="mx-auto flex w-full max-w-[1076px] flex-col items-center gap-8 px-4 py-8 sm:px-6"
        {...inView}
      >
        <motion.h2
          className="text-[28px] font-extrabold leading-[34px] text-[#121316]"
          variants={reduce ? undefined : fadeUp}
        >
          سوالات متداول همدست
        </motion.h2>

        <motion.div
          className="flex w-full flex-col gap-2"
          variants={reduce ? undefined : stagger}
        >
          {faqs.map((item) => {
            const isOpen = open.has(item.q);
            return (
              <motion.div
                key={item.q}
                variants={reduce ? undefined : faqItem}
                className={`w-full min-w-0 overflow-hidden rounded-2xl border border-[#f1f2f2] transition-[box-shadow] duration-300 ease-out ${
                  isOpen
                    ? "bg-white shadow-[0_0_8px_rgba(160,11,215,0.04)]"
                    : "bg-white shadow-[0_0_8px_rgba(160,11,215,0.04)]"
                }`}
                whileHover={reduce ? undefined : { y: -2 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(item.q)}
                  className="flex w-full min-w-0 items-center gap-2 border-b border-[#ededee] p-4 text-right"
                >
                  <span className="min-w-0 flex-1 text-lg font-extrabold leading-6 text-neutral-400">
                    {item.q}
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
                    <div className="bg-grey-01 p-4">
                      <p className="w-full text-right text-sm font-medium leading-6 text-neutral-400">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>
    </div>
  );
}

