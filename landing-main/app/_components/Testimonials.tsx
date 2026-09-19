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
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const items = [
  {
    name: "سارا رضایی",
    avatar: "/figma/av2.png",
    stars: "/figma/stars-a.svg",
    quote:
      "همه چیز با کیفیت بالا بود و دانستن اینکه از شرکت‌های ایرانی حمایت می‌کنم، حس خوبی داشت. من قبلاً سمپلورا را به دوستانم توصیه کرده‌ام!",
  },
  {
    name: "کامران زارع",
    avatar: "/figma/av1.png",
    stars: "/figma/stars-a.svg",
    quote:
      "من واقعاً از اینکه کل تجربه چقدر روان بود، شگفت‌زده شدم. محصولات فوق‌العاده بودند،",
  },
  {
    name: "سینا رمضانی",
    avatar: "/figma/av4.png",
    stars: "/figma/stars-c.svg",
    quote:
      "من واقعاً از اینکه کل تجربه چقدر روان بود، شگفت‌زده شدم. محصولات فوق‌العاده بودند، همه چیز با کیفیت بالا بود و دانستن اینکه از شرکت‌های کانادایی حمایت می‌کنم ...",
  },
  {
    name: "علیرضا محمد نیا",
    avatar: "/figma/av3.png",
    stars: "/figma/stars-b.svg",
    quote:
      "دانستن اینکه از شرکت‌های ایرانی حمایت می‌کنم، حس خوبی داشت. من قبلاً سمپلورا را به دوستانم توصیه کرده‌ام!",
  },
];

export function Testimonials() {
  const reduce = !!useReducedMotion();

  return (
    <motion.section
      className="py-8"
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="mx-auto flex w-full max-w-[856px] flex-col items-center gap-8 px-4 sm:px-6">
        <motion.h2
          className="w-full text-center text-[28px] font-extrabold leading-[34px] text-[#121316]"
          variants={reduce ? undefined : fadeUp}
        >
          کاربرای همدست چی می‌گن !
        </motion.h2>

        <motion.div
          className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
          variants={reduce ? undefined : list}
        >
          {items.map((t) => (
            <motion.article
              key={t.name}
              className="flex flex-col gap-2 rounded-2xl border border-[#e5e7e9] bg-grey-01 p-4"
              variants={reduce ? undefined : card}
              whileHover={
                reduce
                  ? undefined
                  : {
                      y: -6,
                      boxShadow: "0 16px 28px rgba(123,16,211,0.08)",
                      transition: { type: "spring", stiffness: 380, damping: 28 },
                    }
              }
            >
              <div className="flex w-full items-center gap-[18px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  width={64}
                  height={64}
                  className="size-16 shrink-0 rounded-full object-cover"
                />
                <p className="flex-1 text-right text-lg font-extrabold leading-6 text-black">
                  {t.name}
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.stars}
                alt=""
                width={144}
                height={24}
                className="h-6 w-[144px]"
              />
              <p className="text-right text-sm font-medium leading-6 text-neutral-400">
                {t.quote}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
