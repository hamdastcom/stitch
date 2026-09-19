"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";

const APP_URL = "http://app.hamdast.com/";
const easeOut = [0.16, 1, 0.3, 1] as const;
const TITLE_WORDS = ["قیمت‌گذاری", "و", "پلن‌ها"] as const;

type Plan = {
  title: string;
  gems: string;
  price: string;
  note?: string;
  monthly?: string;
  featured?: boolean;
  order: string;
};

const plans: Plan[] = [
  {
    title: "اشتراک یک ماهه",
    gems: "۱۲۵۰",
    price: "۲۹۹,۰۰۰",
    note: "یک شروع خوب",
    order: "order-1",
  },
  {
    title: "اشتراک سه ماهه",
    gems: "۳۸۰۰",
    price: "۸۹۷,۰۰۰",
    monthly: "۲۹۹,۰۰۰",
    order: "order-2 lg:order-3",
  },
  {
    title: "اشتراک شش ماهه",
    gems: "۷۶۵۰",
    price: "۱,۳۹۹,۰۰۰",
    monthly: "۲۳۳,۱۶۷",
    featured: true,
    order: "order-3 lg:order-2",
  },
  {
    title: "اشتراک یک ساله",
    gems: "۱۵۳۰۰",
    price: "۲,۲۹۰,۰۰۰",
    monthly: "۱۹۰,۸۳۳",
    order: "order-4",
  },
];

const list: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
};

export function PricingPlans() {
  const reduce = !!useReducedMotion();
  const t = (delay: number, duration = 0.75): Transition =>
    reduce ? { duration: 0 } : { delay, duration, ease: easeOut };

  return (
    <section className="relative w-full bg-white">
      <div className="relative mx-auto flex w-full max-w-[1206px] flex-col items-center gap-8 px-4 pb-8 pt-8 sm:px-6 sm:pt-16">
      <div className="flex max-w-[868px] flex-col items-center gap-6 text-center">
        <h1 className="flex flex-wrap items-baseline justify-center gap-x-[0.28em] text-[36px] font-extrabold leading-[46px] text-[#121316]">
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
        </h1>
        <motion.p
          className="text-lg font-medium leading-[27px] text-neutral-300"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.42, 0.8)}
        >
          اگه دنبال قیمت استفاده از{" "}
          <span className="text-primary">Claude، GPT-5 یا Gemini</span> به تومان
          هستی،
          <br />
          خبر خوب اینه که دیگه لازم نیست جدا جدا مشترک هرکدوم بشی
          <br />
          یا نگران کارت بانکی خارجی و فیلترشکن باشی.
          <br />
          <span className="text-primary">همدست</span> از یک سیستم اعتباری (جم)
          استفاده می‌کنه:
          <br />
          یک بار شارژ می‌کنی،
          <br />
          بعد بین <span className="text-primary">۲۲+</span> مدل هوش مصنوعی جهان،
          از مدل‌های اقتصادی گرفته تا قدرتمندترین‌ها،
          <br />
          هرچی نیاز داری انتخاب می‌کنی. بدون اشتراک ماهانه‌ی اجباری، بدون سقف مصرف
          پنهان.
        </motion.p>
      </div>

      <motion.div
        className="flex w-full flex-col gap-4 sm:grid sm:max-w-[810px] lg:grid-cols-2"
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={reduce ? undefined : list}
      >
        {plans.map((plan) => (
          <PlanCard key={plan.title} plan={plan} reduce={reduce} />
        ))}
      </motion.div>
      </div>
    </section>
  );
}

function PlanCard({ plan, reduce }: { plan: Plan; reduce: boolean }) {
  return (
    <motion.a
      href={APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      variants={reduce ? undefined : cardItem}
      whileHover={
        reduce
          ? undefined
          : {
              y: -8,
              scale: plan.featured ? 1.02 : 1.015,
            }
      }
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`flex min-h-[91px] cursor-pointer items-center gap-2 rounded-2xl border p-4 ${plan.order} ${
        plan.featured
          ? "border-primary-200 bg-primary-50 shadow-[0_2px_6px_rgba(62,0,73,0.24)]"
          : "border-neutral-100 bg-[rgba(241,242,243,0.6)]"
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <h2 className="text-lg font-extrabold leading-6 text-black">
          {plan.title}
        </h2>
        <div className="flex flex-wrap items-center justify-end gap-2.5 py-1">
          <p className="text-sm font-medium leading-6 text-neutral-300">
            جم دریافتی:
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold leading-6 text-black">
              {plan.gems}
            </span>
            <span aria-hidden className="text-xs leading-4">
              💎
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`inline-flex items-baseline justify-center gap-1.5 rounded-lg px-2 ${
            plan.featured ? "bg-primary-100" : "bg-primary-50"
          }`}
        >
          <span
            className={`text-xl font-extrabold leading-8 ${
              plan.featured ? "text-primary-600" : "text-primary"
            }`}
          >
            {plan.price}
          </span>
          <span
            className={`text-xs font-medium leading-6 ${
              plan.featured ? "text-[#aa47ff]" : "text-primary-200"
            }`}
          >
            تومان
          </span>
        </span>
        {plan.monthly ? (
          <p className="text-sm font-medium leading-6 text-primary">
            معادل ماهانه {plan.monthly} تومان
          </p>
        ) : (
          <p className="text-sm font-medium leading-6 text-primary">
            {plan.note}
          </p>
        )}
      </div>
    </motion.a>
  );
}
