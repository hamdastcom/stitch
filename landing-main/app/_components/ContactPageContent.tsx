"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Faq } from "./Faq";

const SUPPORT_EMAIL = "support@hamdast.ai";

const socials = [
  {
    label: "تلگرام",
    href: "https://t.me/hamdast",
    src: "/figma/contact/telegram.svg",
  },
  {
    label: "اینستاگرام",
    href: "https://instagram.com/hamdast",
    src: "/figma/contact/instagram.svg",
  },
  {
    label: "ایتا",
    href: "https://eitaa.com/hamdast",
    src: "/figma/contact/eitaa.svg",
  },
  {
    label: "بله",
    href: "https://ble.ir/hamdast",
    src: "/figma/contact/bale.svg",
  },
];

const subjects = [
  "مشکل فنی",
  "پرداخت و اعتبار",
  "حساب کاربری",
  "همکاری با ما",
  "سایر موارد",
];

const contactFaqs = [
  {
    q: "چطور می‌توانم با پشتیبانی همدست تماس بگیرم؟",
    qMobile: [
      "چطور می‌توانم با پشتیبانی همدست تماس",
      "بگیرم؟",
    ] as [string, string],
    a: `می‌توانید از طریق ایمیل ${SUPPORT_EMAIL} یا فرم تماس همین صفحه با تیم همدست در ارتباط باشید.`,
  },
  {
    q: "پاسخ‌گویی چقدر طول می‌کشد؟",
    a: "تیم همدست معمولاً ظرف ۲۴ ساعت کاری به پیام‌ها پاسخ می‌دهد.",
  },
];

const fieldWrapper = "flex w-full flex-col items-stretch gap-2";
const labelRow =
  "flex w-full items-center justify-start gap-1 text-right text-lg font-medium leading-[27px] text-neutral-500";
const inputBox =
  "flex h-12 w-full flex-row items-center gap-1 rounded-lg border border-[#dddfe3] bg-[#f1f2f2] px-4 sm:h-14 sm:rounded-xl";
const inputText =
  "min-w-0 flex-1 bg-transparent text-right text-base font-medium leading-6 text-neutral-600 placeholder:text-neutral-300 focus:outline-none";
const iconSize = "size-6 shrink-0";

export function ContactPageContent() {
  const reduce = !!useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = [
      `نام و نام خانوادگی: ${name}`,
      `ایمیل: ${email}`,
      "",
      message,
      file ? `\n(فایل پیوست: ${file.name} — لطفاً آن را به ایمیل ضمیمه کنید)` : "",
    ].join("\n");

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-[200px] h-[406px] w-[406px] rounded-full bg-[#c9a8ff]/20 blur-3xl sm:h-[765px] sm:w-[765px]" />
        <div className="absolute -right-40 top-[600px] h-[479px] w-[479px] rounded-full bg-[#e9d5ff]/25 blur-3xl sm:h-[902px] sm:w-[902px]" />
      </div>

      {/* Intro */}
      <section className="mx-auto flex max-w-[1284px] flex-col items-center gap-4 px-6 pt-8 pb-0 text-center sm:pt-16">
        <h1 className="text-[36px] font-extrabold leading-[46px] text-[#121316]">
          تماس با ما
        </h1>
        <p className="max-w-[701px] text-lg font-medium leading-[27px] text-neutral-300">
          سوالی درباره حساب کاربری، پرداخت
          <br /> یا مدل‌های هوش مصنوعی <span className="text-primary">همدست</span> داری؟
          <br /> تیم پشتیبانی <span className="text-primary">همدست</span> آماده‌ی پاسخ‌گویی است.
        </p>

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce ? { duration: 0 } : { delay: 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }
          }
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            {socials.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="group flex size-8 items-center justify-center rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-primary hover:opacity-80"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { delay: 0.28 + index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                }
                whileHover={reduce ? undefined : { y: -4, scale: 1.04 }}
                whileTap={reduce ? undefined : { scale: 0.96 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.label}
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
              </motion.a>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-lg font-extrabold leading-6">
              <span className="text-neutral-500">ایمیل پشتیبانی:</span>{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[#06c270] transition-opacity hover:opacity-80"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p className="max-w-[372px] text-center text-base font-medium leading-6 text-neutral-300">
              از طریق ایمیل و یا پیام رسان های فوق میتوانید با ما در ارتباط باشید
              معمولاً ظرف ۲۴ ساعت کاری پاسخ می‌دهیم.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Form */}
      <section className="mx-auto w-full px-6 pt-8 sm:max-w-[1080px] sm:pt-14">
        <form dir="rtl" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className={fieldWrapper}>
              <label htmlFor="contact-name" className={labelRow}>
                نام و نام خانوادگی
                <span className="text-[11.61px] text-[#ff3b3b]">*</span>
              </label>
              <div className={inputBox}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/figma/contact/user.svg" alt="" className={iconSize} />
                <input
                  id="contact-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام و نام خانوادگی را وارد کنید"
                  className={inputText}
                />
              </div>
            </div>

            <div className={fieldWrapper}>
              <label htmlFor="contact-email" className={labelRow}>
                ایمیل
                <span className="text-[11.61px] text-[#ff3b3b]">*</span>
              </label>
              <div className={inputBox}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/figma/contact/email.svg" alt="" className={iconSize} />
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className={inputText}
                />
              </div>
            </div>
          </div>

          <div className={fieldWrapper}>
            <label htmlFor="contact-subject" className={labelRow}>
              موضوع
              <span className="text-[11.61px] text-[#ff3b3b]">*</span>
            </label>
            <div className={inputBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/contact/info-circle.svg"
                alt=""
                className={iconSize}
              />
              <select
                id="contact-subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`${inputText} cursor-pointer appearance-none sm:text-[#383e48]`}
              >
                {subjects.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/contact/angle-down.svg"
                alt=""
                className={`${iconSize} pointer-events-none`}
              />
            </div>
          </div>

          <div className={fieldWrapper}>
            <label htmlFor="contact-message" className={labelRow}>
              پیام
              <span className="text-[11.61px] text-[#ff3b3b]">*</span>
            </label>
            <div className="flex h-[195px] w-full items-start gap-1 rounded-2xl border border-[#b5bac2] bg-[#f1f2f2] p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/contact/message-text.svg"
                alt=""
                className={iconSize}
              />
              <textarea
                id="contact-message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="متن پیام خود را وارد کنید"
                className={`${inputText} h-full min-h-0 resize-none`}
              />
            </div>
          </div>

          <label className="flex h-[215px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#8b94a4] px-6 text-center transition-colors hover:border-primary">
            <input
              type="file"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/contact/upload.svg"
              alt=""
              width={45}
              height={45}
              className="size-[45px]"
            />
            <span className="flex w-full max-w-[242px] flex-col">
              <span className="text-xl font-extrabold leading-[26px] text-neutral-400">
                آپلود فایل
              </span>
              <span className="text-sm font-medium leading-6 text-neutral-300">
                {file
                  ? file.name
                  : "فایل یا عکس در خصوص پیام و درخواست خود را در این قسمت آپلود نمایید."}
              </span>
            </span>
          </label>

          <button
            type="submit"
            className="flex h-10 w-full items-center justify-center rounded-[10px] bg-primary px-4 text-lg font-extrabold leading-6 text-white drop-shadow-[0_6px_6px_rgba(62,0,73,0.24)] transition-opacity hover:opacity-90 sm:h-12 sm:rounded-xl sm:text-xl sm:leading-[26px]"
          >
            ارسال
          </button>
        </form>
      </section>

      <div className="sm:hidden">
        <Faq id="contact-faq" items={contactFaqs} />
      </div>
      <div className="hidden sm:block">
        <Faq />
      </div>
    </div>
  );
}
