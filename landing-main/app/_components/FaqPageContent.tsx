"use client";

import { useMemo, useState } from "react";
import {
  FAQ_CATEGORIES,
  FAQS,
  type FaqCategory,
  type FaqItem,
} from "../_data/faq";

const CATEGORY_ROWS_MOBILE: readonly (readonly FaqCategory[])[] = [
  ["تولید تصویر", "مدل‌های چت متنی", "دسترسی بدون فیلترشکن"],
  ["پرداخت و اعتبار", "حساب کاربری", "شروع کار"],
  ["مقایسه با سایر ابزارها", "اپلیکیشن و نصب", "رفع اشکال فنی"],
  ["امنیت و حریم خصوصی", "کاراکتر و همراه هوشمند", "تولید ویدیو"],
] as const;

const CATEGORY_ROWS_DESKTOP: readonly (readonly FaqCategory[])[] = [
  [...CATEGORY_ROWS_MOBILE[0], ...CATEGORY_ROWS_MOBILE[1]],
  [...CATEGORY_ROWS_MOBILE[2], ...CATEGORY_ROWS_MOBILE[3]],
] as const;

function CategoryChip({
  category,
  isActive,
  onClick,
}: {
  category: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex items-center justify-center rounded-[20px] border-[0.45px] px-[11px] py-[3.5px] text-sm font-medium leading-6 whitespace-nowrap transition-colors ${
        isActive
          ? "border-primary bg-primary-50 text-primary"
          : "border-[#f0f0f0] text-neutral-400 hover:border-primary/40 hover:text-primary"
      }`}
    >
      {category}
    </button>
  );
}

export function FaqPageContent() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(FAQS.slice(0, 4).map((item) => item.q)),
  );

  const toggle = (q: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(q)) next.delete(q);
      else next.add(q);
      return next;
    });

  const filtered = useMemo(() => {
    const q = query.trim();
    return FAQS.filter((item) => {
      const matchesCategory = !activeCategory || item.category === activeCategory;
      const matchesQuery = !q || item.q.includes(q) || item.a.includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const chipProps = (category: string) => ({
    category,
    isActive: activeCategory === category,
    onClick: () => setActiveCategory(activeCategory === category ? null : category),
  });

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-4 pt-8 pb-8 sm:gap-14 sm:px-6 sm:pt-[72px] sm:pb-8">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <h1 className="text-[36px] font-extrabold leading-[46px] text-[#121316]">
            سوالات متداول همدست
          </h1>
          <p className="max-w-[1004px] text-lg font-medium leading-[27px] text-neutral-300">
            پاسخ کامل سوالات درباره ثبت‌نام، پرداخت، مدل‌های هوش مصنوعی و
            دسترسی بدون فیلترشکن به{" "}
            <span className="text-primary">همدست</span>
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-8 py-8">
          <div className="flex w-full max-w-[398px] flex-col items-center gap-4 sm:max-w-none">
            <label className="flex h-12 w-full max-w-[860px] items-center gap-1 rounded-lg bg-neutral-50 px-4 sm:h-14 sm:rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/faq/search.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <input
                dir="rtl"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="سوال مورد نظر خود را بنویس"
                aria-label="جستجو در سوالات متداول"
                className="min-w-0 flex-1 bg-transparent text-right text-base font-medium leading-6 text-neutral-600 placeholder:text-neutral-300 focus:outline-none"
              />
            </label>

            <div className="flex w-full flex-col items-center gap-1.5 sm:hidden">
              {CATEGORY_ROWS_MOBILE.map((row) => (
                <div
                  key={row[0]}
                  className="flex flex-wrap items-center justify-center gap-1.5"
                >
                  {row.map((category) => (
                    <CategoryChip key={category} {...chipProps(category)} />
                  ))}
                </div>
              ))}
            </div>
            <div className="hidden w-full flex-col items-center gap-1.5 sm:flex sm:[direction:ltr]">
              {CATEGORY_ROWS_DESKTOP.map((row) => (
                <div
                  key={row[0]}
                  className="flex flex-wrap items-center justify-center gap-1.5"
                >
                  {row.map((category) => (
                    <CategoryChip key={category} {...chipProps(category)} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="faq-page-list flex w-full max-w-[378px] flex-col gap-2 sm:max-w-[1076px]">
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm font-medium leading-6 text-neutral-400">
                سوالی با این عنوان پیدا نشد. عبارت دیگری را امتحان کن یا با پشتیبانی
                تماس بگیر.
              </p>
            ) : (
              filtered.map((item) => {
                const isOpen = open.has(item.q);
                return (
                  <div
                    key={item.q}
                    className={`w-full min-w-0 overflow-hidden transition-[border-color,box-shadow] duration-300 ease-out ${
                      isOpen
                        ? "rounded-2xl border border-[#f1f2f2] bg-white shadow-[0_0_8px_rgba(160,11,215,0.04)]"
                        : "border-b border-[#f1f2f2]"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggle(item.q)}
                      className={`flex w-full min-w-0 cursor-pointer items-center gap-2 p-4 text-right ${
                        isOpen ? "rounded-t-2xl border-b border-[#ededee] bg-white" : ""
                      }`}
                    >
                      <span className="min-w-0 flex-1 text-lg font-extrabold leading-6 text-neutral-400">
                        {item.qMobile ? (
                          <>
                            {item.qMobile[0]}
                            <br className="sm:hidden" />{" "}
                            {item.qMobile[1]}
                            {item.qMobile[2] ? (
                              <>
                                <br className="sm:hidden" /> {item.qMobile[2]}
                              </>
                            ) : null}
                          </>
                        ) : (
                          item.q
                        )}
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
                        <div className="rounded-b-2xl bg-grey-01 p-4">
                          <p className="w-full text-right text-sm font-medium leading-6 text-neutral-400">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
