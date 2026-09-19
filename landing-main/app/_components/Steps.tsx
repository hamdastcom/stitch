"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    n: "1",
    icon: "/figma/aialgorithm.svg",
    title: "مدل رو انتخاب کن",
    body: (
      <>
        از بین GPT، Claude، Gemini و بقیه،
        <br />
        مدل مناسب کارت رو انتخاب کن.
      </>
    ),
    iconStart: true,
    numberSide: "right" as const,
  },
  {
    n: "2",
    icon: "/figma/msg-question.svg",
    title: "سوالت رو بنویس",
    body: (
      <>
        متن بنویس، عکس بساز یا ویدیو
        <br />
        تولید کن.
      </>
    ),
    iconStart: false,
    numberSide: "left" as const,
  },
  {
    n: "3",
    icon: "/figma/moneys.svg",
    title: "اعتبارت رو شفاف ببین",
    body: (
      <>
        دقیقاً بدون هر پیام چقدر مصرف کرد،
        <br />
        بدون سوپرایز در پایان ماه.
      </>
    ),
    iconStart: true,
    numberSide: "right" as const,
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
    transition: { staggerChildren: 0.16, delayChildren: 0.08 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeOut },
  },
};

export function Steps() {
  const reduce = !!useReducedMotion();

  return (
    <motion.section
      className="relative py-14 sm:py-24"
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.h2
        className="text-center text-[22px] font-extrabold leading-7 text-[#121316] sm:text-[28px] sm:leading-[34px]"
        variants={reduce ? undefined : fadeUp}
      >
        در سه قدم ساده شروع کن
      </motion.h2>

      <motion.div
        className="mx-auto mt-4 flex max-w-[704px] flex-col items-center gap-4 px-6 sm:mt-4 sm:gap-4"
        variants={reduce ? undefined : list}
      >
        {steps.map((step) => (
          <motion.div
            key={step.n}
            className="relative w-full max-w-[550px] overflow-visible"
            variants={reduce ? undefined : card}
          >
            <span
              className={`pointer-events-none absolute inset-y-0 z-0 flex items-center font-extrabold leading-none text-primary/16 sm:leading-[215px] ${
                step.numberSide === "right"
                  ? "-right-8 translate-y-4 text-[96px] sm:-right-[72px] sm:left-auto sm:translate-y-8 sm:text-[196px]"
                  : "-left-8 translate-y-4 text-[96px] sm:-left-[72px] sm:right-auto sm:translate-y-8 sm:text-[196px]"
              }`}
              aria-hidden
            >
              <motion.span
                className="block"
                variants={
                  reduce
                    ? undefined
                    : {
                        hidden: {
                          opacity: 0,
                          x: step.numberSide === "right" ? 40 : -40,
                        },
                        show: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.85, ease: easeOut },
                        },
                      }
                }
              >
                {step.n}
              </motion.span>
            </span>

            <motion.div
              className="relative z-10 flex w-full items-center gap-3 rounded-[20px] bg-white p-2 shadow-[0_6px_9px_rgba(123,16,211,0.08)] sm:gap-[18px]"
              whileHover={
                reduce
                  ? undefined
                  : {
                      y: -4,
                      boxShadow: "0 16px 28px rgba(123,16,211,0.14)",
                    }
              }
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              {step.iconStart ? (
                <StepIcon src={step.icon} reduce={reduce} />
              ) : null}
              <div className="flex flex-1 flex-col gap-2 px-3 py-2 text-right sm:gap-3 sm:px-[21px] sm:py-0">
                <h3 className="text-base font-extrabold leading-6 text-black sm:text-xl sm:leading-8">
                  {step.title}
                </h3>
                <p className="text-sm font-medium leading-5 text-neutral-400 sm:text-base sm:leading-6">
                  {step.body}
                </p>
              </div>
              {step.iconStart ? null : (
                <StepIcon src={step.icon} reduce={reduce} />
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

function StepIcon({ src, reduce }: { src: string; reduce: boolean }) {
  return (
    <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-grey-01 sm:h-[142px] sm:w-[199px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={src}
        alt=""
        width={61}
        height={61}
        className="size-10 sm:size-[61px]"
        variants={
          reduce
            ? undefined
            : {
                hidden: { opacity: 0, scale: 0.86 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.55, ease: easeOut, delay: 0.08 },
                },
              }
        }
      />
    </div>
  );
}
