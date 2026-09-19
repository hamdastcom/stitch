"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";

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
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

export function Characters() {
  const reduce = !!useReducedMotion();

  return (
    <motion.section
      className="relative bg-grey-01 py-8 text-center"
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={
        reduce
          ? undefined
          : {
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }
      }
    >
      <motion.div
        className="mx-auto flex max-w-[720px] flex-col items-center gap-6 px-4 sm:px-6"
        variants={reduce ? undefined : fadeUp}
      >
        <h2 className="w-full text-[28px] font-extrabold leading-[34px] text-[#121316]">
          با شخصیت موردعلاقه‌ت{" "}
          <br className="sm:hidden" />
          گفتگو کن
        </h2>
        <p className="w-full text-lg font-medium leading-[27px] text-neutral-300">
          فقط چت‌بات نیست !
          <br />
          با کاراکترهای محبوب انیمه و فیلم
          <br className="sm:hidden" /> به فارسی صحبت کن،
          <br />
          یا یک همراه هوشمند شخصی برای خودت بساز.
        </p>
      </motion.div>

      <div className="mt-4 w-full overflow-x-clip">
        <motion.div
          className="direction-ltr flex items-start justify-center pb-2"
          variants={reduce ? undefined : list}
        >
          <div className="-mr-[52px] mt-[14px] flex size-[170px] shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/figma/char3.jpg"
              alt="کاراکتر هوش مصنوعی"
              width={151}
              height={151}
              className={`size-[151px] rounded-2xl object-cover ${
                reduce ? "-rotate-8" : ""
              }`}
              variants={
                reduce
                  ? undefined
                  : {
                      hidden: { opacity: 0, x: -36, rotate: -16 },
                      show: {
                        opacity: 1,
                        x: 0,
                        rotate: -8,
                        transition: { duration: 0.75, ease: easeOut },
                      },
                    }
              }
              whileHover={
                reduce
                  ? undefined
                  : {
                      y: -6,
                      rotate: -5,
                      transition: { type: "spring", stiffness: 380, damping: 28 },
                    }
              }
            />
          </div>
          <motion.div
            className="relative z-10 size-[165px] shrink-0"
            variants={
              reduce
                ? undefined
                : {
                    hidden: { opacity: 0, y: 28, scale: 0.92 },
                    show: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.75, ease: easeOut },
                    },
                  }
            }
            whileHover={
              reduce
                ? undefined
                : {
                    y: -8,
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 380, damping: 28 },
                  }
            }
          >
            <span
              className="pointer-events-none absolute top-[41px] left-0 h-[124px] w-full bg-[#15022b] blur-[15px]"
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/char1.jpg"
              alt="کاراکتر هوش مصنوعی"
              width={165}
              height={165}
              className="relative z-10 size-full rounded-2xl object-cover"
            />
          </motion.div>
          <div className="-ml-[52px] mt-[14px] flex size-[170px] shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="/figma/char2.jpg"
              alt="کاراکتر هوش مصنوعی"
              width={151}
              height={151}
              className={`size-[151px] rounded-2xl object-cover ${
                reduce ? "rotate-8" : ""
              }`}
              variants={
                reduce
                  ? undefined
                  : {
                      hidden: { opacity: 0, x: 36, rotate: 16 },
                      show: {
                        opacity: 1,
                        x: 0,
                        rotate: 8,
                        transition: { duration: 0.75, ease: easeOut },
                      },
                    }
              }
              whileHover={
                reduce
                  ? undefined
                  : {
                      y: -6,
                      rotate: 5,
                      transition: { type: "spring", stiffness: 380, damping: 28 },
                    }
              }
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="flex flex-col items-center gap-4 bg-grey-01 py-8 text-center"
    >
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 px-4 sm:px-6">
        <h2 className="w-full text-[28px] font-extrabold leading-[34px] text-[#121316]">
          چند برابر ارزون‌تر از{" "}
          <br className="sm:hidden" />
          تهیه‌ی جداگانه‌ی هر سرویس
        </h2>
        <p className="w-full text-lg font-medium leading-[27px] text-neutral-300">
          اشتراک جداگانه‌ی هر مدل{" "}
          <span className="text-primary">هوش مصنوعی</span>
          <br className="sm:hidden" /> ماهی چند ده دلار آب می‌خوره.
          <br />
          با <span className="text-primary">همدست</span>، همه‌ی این مدل‌ها زیر یک سقف
          قیمتی
          <br className="sm:hidden" /> و به تومان در دسترست هستن.
        </p>
      </div>
      <Link
        href="/pricing"
        className="inline-flex h-12 min-w-[102px] cursor-pointer items-center justify-center rounded-xl bg-gradient-to-l from-[#57069d] to-[#d50697] px-4 text-xl font-extrabold leading-[26px] text-white shadow-[0_6px_12px_rgba(62,0,73,0.24)]"
      >
        مشاهده بسته های اعتباری
      </Link>
    </section>
  );
}
