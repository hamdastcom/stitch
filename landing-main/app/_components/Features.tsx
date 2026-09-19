"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { RolesSection } from "./RolesSection";

const easeOut = [0.16, 1, 0.3, 1] as const;

type Feat = { icon: string; title: string; body: string; order: string };

const features: Feat[] = [
  {
    icon: "/figma/messages-3.svg",
    title: "چت هوشمند",
    body: "گفتگو با قدرتمندترین مدل‌های زبانی دنیا",
    order: "order-3 sm:order-1",
  },
  {
    icon: "/figma/image.svg",
    title: "تولید تصویر",
    body: "از ایده تا تصویر، در چند ثانیه",
    order: "order-4 sm:order-2",
  },
  {
    icon: "/figma/video-square.svg",
    title: "تولید ویدیو",
    body: "ویدیوهای کوتاه حرفه‌ای بدون نیاز به تدوین",
    order: "order-1 sm:order-3",
  },
  {
    icon: "/figma/translate.svg",
    title: "دستیار صوتی فارسی",
    body: "گفت‌وگوی طبیعی با صدا، نه فقط تایپ",
    order: "order-2 sm:order-4",
  },
];

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

function FeatureItem({
  f,
  reduce,
  className,
}: {
  f: Feat;
  reduce: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={`flex w-full flex-col items-center gap-4 ${className ?? ""}`}
      variants={reduce ? undefined : item}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      <motion.div
        className="flex size-[86px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/8"
        whileHover={reduce ? undefined : { scale: 1.06 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={f.icon} alt="" width={40} height={40} className="size-10" />
      </motion.div>
      <div className="flex w-full flex-col gap-1 text-center">
        <h3 className="text-xl font-extrabold leading-8 text-neutral-500">
          {f.title}
        </h3>
        <p className="text-sm font-medium leading-6 text-neutral-300">
          {f.body}
        </p>
      </div>
    </motion.div>
  );
}

export function Features() {
  const reduce = !!useReducedMotion();

  return (
    <section
      id="features"
      className="flex flex-col gap-16 py-16 sm:gap-24 sm:py-24"
    >
      <motion.div
        className="mx-auto flex w-full max-w-[1080px] flex-col items-center gap-16 px-4 sm:px-6"
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="w-full text-center text-[28px] font-extrabold leading-[34px] text-[#121316]"
          variants={reduce ? undefined : fadeUp}
        >
          هرچی از هوش مصنوعی
          <br className="sm:hidden" />
          نیاز داری، یک‌جا
        </motion.h2>

        <motion.div
          className="grid w-full grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 sm:gap-0"
          variants={reduce ? undefined : list}
        >
          {features.map((f) => (
            <FeatureItem
              key={f.title}
              f={f}
              reduce={reduce}
              className={f.order}
            />
          ))}
        </motion.div>
      </motion.div>
      <RolesSection />
    </section>
  );
}
