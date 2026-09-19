"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const APP_URL = "http://app.hamdast.com/";
const easeOut = [0.16, 1, 0.3, 1] as const;

type ComposerMode = "text" | "upload" | "link";

const MODES: { id: ComposerMode; label: string }[] = [
  { id: "text", label: "متن ساده" },
  { id: "upload", label: "آپلود فایل" },
  { id: "link", label: "لینک" },
];

const EXAMPLES = [
  {
    label: "استراتژی بازاریابی نرم‌افزارهای اجتماعی",
    icon: "/figma/design/chart-line.svg",
    tint: "bg-[#faf2d1]",
  },
  {
    label: "برنامه سفر ۵ روزه تایلند",
    icon: "/figma/design/beach.svg",
    tint: "bg-primary-50",
  },
  {
    label: "نکاتی برای ارتباط موثر",
    icon: "/figma/design/messages.svg",
    tint: "bg-[#cdf8e5]",
  },
  {
    label: "چگونه کتاب بخوانیم؟",
    icon: "/figma/design/book-open.svg",
    tint: "bg-[#fbd7d7]",
  },
];

const SOURCES = [
  { label: "پی دی اف / تصویر", icon: "/figma/design/file-copy.svg" },
  { label: "متن طولانی", icon: "/figma/design/note-text.svg" },
  { label: "وب سایت", icon: "/figma/design/globe.svg" },
  { label: "ویدیو یوتوب", icon: "/figma/design/youtube.svg" },
];

const FAQS = [
  {
    q: "نقشه ذهنی دقیقا چیست ؟",
    a: "نقشه ذهنی که با نام‌های «نقشه مفهومی»، «نمودار اسپری» یا «درخت حافظه» نیز شناخته می‌شود، ابزاری برای تفکر بصری است که توسط روانشناس بریتانیایی، تونی بوزان، در دهه ۱۹۷۰ اختراع شد.",
  },
  {
    q: "نقشه ذهنی همدست چکونه کار می کند ؟ ",
    a: "ابزار نقشه ذهنی مبتنی بر هوش مصنوعی همدست برای ساده‌سازی سازماندهی و ارائه اطلاعات پیچیده طراحی شده است. نحوه کار آن به شرح زیر است:\n\n• نقاط شروع متنوع: می‌توانید از منابع مختلفی از جمله متن، تصاویر، اسناد، ویدیوهای یوتیوب یا صفحات وب متعدد، شروع به ایجاد نقشه‌های ذهنی کنید. همدست به طور خودکار محتوا را تجزیه و تحلیل می‌کند، موضوعات را تولید می‌کند و یک ساختار اولیه نقشه ذهنی ایجاد می‌کند و شروع کار را برای شما آسان می‌کند.\n• ایجاد شاخه با کمک هوش مصنوعی: نیازی نیست هر شاخه را به صورت دستی ایجاد کنید. کافیست هر گره را انتخاب کنید، کلیک راست کنید تا عملکرد «AI Generate Node» فعال شود و همدست به طور خودکار شاخه‌ها و ایده‌های جدید را بر اساس زمینه ایجاد می‌کند و به شما در گسترش افکارتان کمک می‌کند.\n• کدگذاری رنگ: با استفاده از ابزار پالت همدست، می‌توانید رنگ‌های متنوعی را برای ایده‌ها و دسته‌های مختلف اعمال کنید و اطلاعات را شهودی‌تر و درک و به خاطر سپردن آنها را آسان‌تر کنید.\n• سبک‌ها و طرح‌بندی‌های انعطاف‌پذیر: همدست انواع سبک‌ها و گزینه‌های جهت‌گیری نقشه ذهنی، از جمله طرح‌های رنگارنگ و طرح‌بندی‌های منحنی زیبا را ارائه می‌دهد. شما می‌توانید طرح یا جهت‌گیری را در هر زمانی تنظیم کنید تا نقشه‌های ذهنی خلاقانه و از نظر بصری جذاب ایجاد کنید.",
  },
];

function Icon({
  src,
  width,
  height,
  className,
}: {
  src: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      className={className}
    />
  );
}

function openApp() {
  window.open(APP_URL, "_blank", "noopener,noreferrer");
}

function ExampleButton({
  item,
}: {
  item: (typeof EXAMPLES)[number];
}) {
  return (
    <button
      type="button"
      dir="rtl"
      onClick={openApp}
      className="flex h-14 w-full min-w-[102px] items-center gap-2 rounded-xl border border-[#f1f2f2] bg-white px-4 py-2"
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-[20px] p-2 ${item.tint}`}
      >
        <Icon src={item.icon} width={24} height={24} className="size-6" />
      </span>
      <span className="min-w-0 flex-1 truncate text-right text-base font-extrabold leading-6 text-[#121316]">
        {item.label}
      </span>
      <Icon
        src="/figma/design/angle-left.svg"
        width={24}
        height={24}
        className="size-6 shrink-0"
      />
    </button>
  );
}

export function DesignPageContent() {
  const reduce = !!useReducedMotion();
  const [mode, setMode] = useState<ComposerMode>("upload");
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(FAQS.map((item) => item.q)),
  );

  const toggle = (q: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(q)) next.delete(q);
      else next.add(q);
      return next;
    });

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[758px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/design/hero-dots.png"
          alt=""
          width={1440}
          height={758}
          className="h-[758px] w-full object-cover object-top"
        />
      </div>

      {/* Hero + composer */}
      <section className="relative z-10 mx-auto flex w-full max-w-[1078px] flex-col items-center gap-8 px-4 pt-20 pb-8 sm:px-0 sm:pt-[72px]">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <h1 className="text-[36px] font-extrabold leading-[46px] text-[#121316]">
            <span className="sm:hidden">
              سازنده <span className="text-primary">نقشه ذهنی</span>
              <br />
              هوش مصنوعی
              <br />
              هر چیزی را تجسم کن
            </span>
            <span className="hidden sm:inline">
              سازنده <span className="text-primary">نقشه ذهنی</span> هوش مصنوعی
              <br />
              هر چیزی را تجسم کن
            </span>
          </h1>
          <p className="text-lg font-medium leading-[27px] text-[#8b94a4]">
            <span className="sm:hidden">
              ایده‌ها را در عرض چند ثانیه، از متن گرفته
              <br />
              تا ورودی‌های ویدیویی، به نقشه‌های ذهنی
              <br />
              واضح و جذاب تبدیل کنید.
            </span>
            <span className="hidden sm:inline">
              ایده‌ها را در عرض چند ثانیه، از متن گرفته تا ورودی‌های ویدیویی، به
              نقشه‌های ذهنی واضح و جذاب تبدیل کنید.
            </span>
          </p>
        </div>

        <motion.div
          className="relative w-full"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.65, ease: easeOut }
          }
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-8 right-8 left-8 hidden h-[320px] rounded-[24px] bg-[rgba(66,1,107,0.16)] blur-[25px] sm:block"
          />
          <div className="relative flex w-full flex-col gap-4 rounded-[24px] bg-white p-4 shadow-[0_0_8px_rgba(0,0,0,0.04)] sm:p-8">
            <div className="direction-ltr flex w-full rounded-2xl border border-[#f1f2f2] p-1">
              {MODES.map((item) => {
                const active = mode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={`flex min-h-10 min-w-[72px] flex-1 items-center justify-center rounded-xl px-4 py-2 text-center text-base font-medium leading-6 ${
                      active
                        ? "bg-primary-50 text-primary"
                        : "text-neutral-300 hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {mode === "upload" ? (
              <button
                type="button"
                onClick={openApp}
                className="flex h-[120px] w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-neutral-200 bg-neutral-50 p-2"
              >
                <span className="flex flex-col items-center gap-2">
                  <Icon
                    src="/figma/design/upload.svg"
                    width={45}
                    height={45}
                    className="size-[45px] shrink-0"
                  />
                  <span className="text-center">
                    <span className="block text-xl font-extrabold leading-[26px] text-neutral-400">
                      آپلود فایل یا عکس
                    </span>
                    <span className="block text-sm font-medium leading-6 text-neutral-300">
                      فایل یا عکس خود را این قسمت بارگذاری کنید
                    </span>
                  </span>
                </span>
              </button>
            ) : mode === "text" ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="متن دلخواه خود را وارد کنید ..."
                className="h-[120px] w-full resize-none rounded-[24px] border border-neutral-200 bg-neutral-50 p-4 text-right text-base font-medium leading-6 text-neutral-600 placeholder:text-neutral-300 focus:outline-none"
              />
            ) : (
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="لینک صفحه یا ویدیو را وارد کنید"
                className="h-[120px] w-full rounded-[24px] border border-neutral-200 bg-neutral-50 px-4 text-right text-base font-medium leading-6 text-neutral-600 placeholder:text-neutral-300 focus:outline-none"
              />
            )}

            <div className="direction-ltr flex w-full flex-wrap items-center justify-start gap-2">
              <button
                type="button"
                onClick={openApp}
                className="flex h-8 min-w-[102px] items-center justify-center gap-1 rounded-2xl border border-neutral-100 bg-white py-1 pr-2 pl-1"
              >
                <Icon
                  src="/figma/design/sort-vertical.svg"
                  width={20}
                  height={20}
                  className="size-5 shrink-0"
                />
                <span className="flex-1 text-center text-sm font-medium leading-6 text-neutral-400">
                  Chat-GPT
                </span>
                <Icon
                  src="/figma/design/openai.svg"
                  width={16}
                  height={16}
                  className="h-[16.24px] w-4 shrink-0"
                />
              </button>
              <button
                type="button"
                onClick={openApp}
                className="flex items-center justify-center gap-1 rounded-3xl border border-primary-100 bg-primary-50 py-1 pr-3 pl-4"
              >
                <span className="text-sm font-medium leading-6 text-primary">
                  نقشه ذهنی
                </span>
                <Icon
                  src="/figma/design/angle-down.svg"
                  width={20}
                  height={20}
                  className="size-5 shrink-0"
                />
              </button>
            </div>

            <button
              type="button"
              onClick={openApp}
              className="direction-ltr flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-lg font-extrabold leading-6 text-white transition-opacity hover:opacity-90"
            >
              <span dir="rtl">تولید نقشه ذهنی</span>
              <Icon
                src="/figma/design/bolt.svg"
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Examples */}
      <section className="relative z-10 mx-auto flex w-full min-w-0 max-w-[1078px] flex-col items-center gap-8 px-4 py-8 sm:px-0">
        <h2 className="w-full text-center text-[28px] font-extrabold leading-[34px] text-[#121316]">
          مثال های پیشنهادی
        </h2>
        <div className="flex w-full min-w-0 flex-col gap-4 sm:hidden">
          {[EXAMPLES[0], EXAMPLES[2], EXAMPLES[1], EXAMPLES[3]].map((item) => (
            <ExampleButton key={item.label} item={item} />
          ))}
        </div>
        <div className="direction-ltr hidden w-full grid-cols-2 gap-x-8 gap-y-4 sm:grid">
          {EXAMPLES.map((item) => (
            <ExampleButton key={item.label} item={item} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 flex min-w-0 flex-col items-center gap-4 overflow-x-hidden bg-white py-8">
        <div className="mx-auto flex w-full min-w-0 max-w-[1078px] flex-col items-center gap-6 overflow-hidden px-4 text-center sm:px-6">
          <h2 className="w-full max-w-full text-[28px] font-extrabold leading-[34px] text-[#121316]">
            <span className="sm:hidden">
              نحوه استفاده از نقشه ذهنی
              <br />
              مبتنی بر هوش مصنوعی
            </span>
            <span className="hidden sm:inline">
              نحوه استفاده از نقشه ذهنی مبتنی بر هوش مصنوعی
            </span>
          </h2>
          <p className="w-full min-w-0 max-w-full break-words text-lg font-medium leading-[27px] text-neutral-300">
            <span className="sm:hidden">
              به سرعت ایده‌ها را سازماندهی کنید، ارتباطات جدید را کشف کنید و
              بهره‌وری خود را در ارائه‌ها و توضیحات افزایش دهید.
            </span>
            <span className="hidden sm:inline">
              به سرعت ایده‌ها را سازماندهی کنید، ارتباطات جدید را کشف کنید
              <br />
              و بهره‌وری خود را در ارائه‌ها و توضیحات افزایش دهید.
            </span>
          </p>
        </div>

        <div className="relative w-full overflow-hidden bg-grey-01">
          <div
            className="direction-ltr relative mx-auto flex w-full min-w-0 max-w-[1440px] flex-col-reverse items-center justify-center gap-8 overflow-hidden px-4 py-8 lg:flex-row lg:gap-4 lg:px-6"
          >
            <div
              dir="rtl"
              className="flex w-full min-w-0 max-w-[398px] flex-col items-center gap-4 lg:max-w-[456px] lg:items-end"
            >
              <div className="flex w-full min-w-0 flex-col items-center gap-2 text-center lg:items-end lg:text-right">
                <h3 className="w-full max-w-full text-[28px] font-extrabold leading-[34px] text-[#121316]">
                  <span className="lg:hidden">
                    نقشه‌های ذهنی فوری
                    <br />
                    ازهر محتوایی
                  </span>
                  <span className="hidden lg:inline">
                    نقشه‌های ذهنی فوری ازهر محتوایی
                  </span>
                </h3>
                <p className="w-full max-w-full min-w-0 break-words text-lg font-medium leading-[27px] text-neutral-300 lg:text-justify">
                  فرآیند سنتی و خسته‌کننده‌ی نقشه ذهنی را کنار بگذارید. تنها با یک
                  کلیک، هوش مصنوعی افکار شما را، صرف نظر از منبع آنها، ترسیم
                  می‌کند.
                </p>
              </div>
              <div className="direction-ltr flex w-full flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-4">
                {SOURCES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={openApp}
                    className="direction-ltr flex h-12 min-w-[102px] items-center justify-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2"
                  >
                    <span dir="rtl" className="text-xl font-extrabold leading-[26px] whitespace-nowrap text-neutral-500">
                      {item.label}
                    </span>
                    <Icon
                      src={item.icon}
                      width={24}
                      height={24}
                      className="size-6 shrink-0"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative h-[269px] w-[378px] max-w-full shrink-0 lg:h-[507px] lg:w-full lg:max-w-[713px]">
              <div
                aria-hidden
                className="pointer-events-none absolute top-[19px] left-[21px] h-[256px] w-[357px] rounded-2xl bg-[rgba(66,1,107,0.16)] blur-[25px] lg:hidden"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute top-[35px] left-[39px] hidden h-[483px] w-[674px] rounded-2xl bg-[rgba(66,1,107,0.16)] blur-[25px] lg:block"
              />
              <div className="absolute inset-0 overflow-hidden rounded-2xl border-[6px] border-white/70 lg:border-[12px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/design/wireframe.png"
                  alt="پیش‌نمایش سازنده نقشه ذهنی همدست"
                  width={713}
                  height={507}
                  className="size-full object-cover"
                />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[214px] bg-gradient-to-r from-transparent to-[#f9fafb] lg:hidden"
              />
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-[min(606px,42%)] bg-gradient-to-r from-transparent to-[#f9fafb] lg:block"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 mx-auto flex w-full max-w-[378px] flex-col items-center gap-8 px-0 py-8 sm:max-w-[1076px] sm:px-6">
        <h2 className="w-full text-center text-[28px] font-extrabold leading-[34px] text-[#121316]">
          سوالات متداول همدست
        </h2>
        <div className="flex w-full flex-col gap-2">
          {FAQS.map((item) => {
            const isOpen = open.has(item.q);
            return (
              <div
                key={item.q}
                className={`w-full min-w-0 overflow-hidden ${
                  isOpen
                    ? "rounded-2xl border border-[#f1f2f2] bg-white shadow-[0_0_8px_rgba(160,11,215,0.04)]"
                    : "border-b border-[#f1f2f2]"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(item.q)}
                  className={`flex w-full items-center gap-2 p-4 text-right ${
                    isOpen ? "rounded-t-2xl border-b border-[#ededee] bg-white" : ""
                  }`}
                >
                  <span className="min-w-0 flex-1 text-lg font-extrabold leading-6 text-neutral-400">
                    {item.q}
                  </span>
                  <span className="relative size-4 shrink-0 overflow-clip">
                    <Icon
                      src="/figma/arrow-down.svg"
                      width={16}
                      height={16}
                      className={`size-4 origin-center transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </span>
                </button>
                {isOpen ? (
                  <div className="rounded-b-2xl bg-grey-01 p-4">
                    <p className="whitespace-pre-line text-right text-sm font-medium leading-6 text-neutral-400">
                      {item.a}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
