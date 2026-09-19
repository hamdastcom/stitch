"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import {
  TOOL_CATEGORIES,
  TOOLS,
  type Tool,
  type ToolCategoryId,
} from "../_data/tools";
import { TintedIcon } from "./TintedIcon";

type FilterId = "all" | ToolCategoryId;

function Icon({ src, className }: { src: string; className?: string }) {
  return <TintedIcon src={src} className={className} />;
}

function ViewCta({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-8 min-w-[102px] items-center justify-center gap-2 rounded-lg py-2 pr-4 pl-2 text-base font-extrabold leading-5 text-[#b5bac2] transition-colors group-hover:text-primary ${className}`}
    >
      <span>مشاهده</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/menu/angle-left.svg"
        alt=""
        width={24}
        height={24}
        className="size-6 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
      />
    </div>
  );
}

function SeeMoreCard({ href }: { href?: string }) {
  return (
    <Link
      href={href ?? "#"}
      className="group flex min-h-[126px] w-full items-center justify-center rounded-[16px] border border-[#f1f2f2] bg-white p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_28px_rgba(139,4,255,0.08)] md:min-h-0"
    >
      <div className="flex h-10 min-w-[102px] items-center justify-center gap-2 rounded-[10px] py-2 pr-4 pl-2 text-lg font-extrabold leading-6 text-[#b5bac2] transition-colors group-hover:text-primary">
        <span className="whitespace-nowrap">مشاهده موارد بیشتر</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/menu/angle-left.svg"
          alt=""
          width={24}
          height={24}
          className="size-6 shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
        />
      </div>
    </Link>
  );
}

function ToolCard({
  tool,
  isHorizontalOnMobile = false,
  decorative = false,
}: {
  tool: Tool;
  isHorizontalOnMobile?: boolean;
  decorative?: boolean;
}) {
  const a11y = decorative
    ? { "aria-hidden": true as const, tabIndex: -1 }
    : {};

  if (isHorizontalOnMobile) {
    return (
      <Link
        href={tool.href}
        {...a11y}
        className="group flex w-full flex-col items-center justify-between rounded-[16px] border border-[#f1f2f2] bg-white p-4 text-center transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_28px_rgba(139,4,255,0.08)] focus-visible:ring-2 focus-visible:ring-primary md:min-h-[282px] motion-reduce:transition-none motion-reduce:hover:translate-y-0 max-md:flex-row max-md:items-center max-md:gap-2 max-md:p-4 max-md:text-right"
      >
        {/* Mobile Horizontal Layout */}
        <div className="flex min-w-0 flex-1 items-start justify-end gap-3 max-md:order-2">
          <div className="flex min-w-0 flex-1 flex-col items-end justify-center">
            <h3 className="text-lg font-bold leading-6 text-[#121316] transition-colors group-hover:text-primary">
              {tool.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm font-normal leading-5 text-[#8b94a4] md:max-w-[204px]">
              {tool.description}
            </p>
            <div className="mt-2 flex items-center justify-end gap-1 text-sm font-normal text-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/crown-alt.svg"
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0"
              />
              <span>مصرف هر پیام : ۱۸</span>
            </div>
          </div>
          <span className="flex size-[72px] shrink-0 items-center justify-center rounded-[16px] bg-primary/8 p-2">
            <Icon src={tool.icon} className="size-8" />
          </span>
        </div>

        <ViewCta className="shrink-0 max-md:order-1 max-md:pl-0 max-md:pr-1 md:mt-4 md:px-4" />
      </Link>
    );
  }

  return (
    <Link
      href={tool.href}
      {...a11y}
      className="group flex h-full w-full flex-col items-center justify-between gap-8 rounded-[16px] border border-[#f1f2f2] bg-white p-4 text-center transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_28px_rgba(139,4,255,0.08)] focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="flex size-[72px] items-center justify-center rounded-[16px] bg-primary/8 p-2">
          <Icon src={tool.icon} className="size-8" />
        </span>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-lg font-bold leading-6 text-[#121316] transition-colors group-hover:text-primary">
              {tool.title}
            </h3>
            <p className="line-clamp-2 w-full max-w-[204px] text-sm font-normal leading-5 text-[#8b94a4]">
              {tool.description}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1 text-sm font-normal leading-5 text-primary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/crown-alt.svg"
              alt=""
              width={20}
              height={20}
              className="size-5 shrink-0"
            />
            <span>مصرف هر پیام : ۱۸</span>
          </div>
        </div>
      </div>

      <ViewCta />
    </Link>
  );
}

function ModelsCarousel({ tools }: { tools: Tool[] }) {
  const reduce = !!useReducedMotion();
  const copies = reduce ? [0] : [0, 1];

  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-16"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-16"
      />

      <div
        className={
          reduce
            ? "flex gap-4 overflow-x-auto pb-4 pt-1 overscroll-x-contain snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "overflow-hidden py-1"
        }
      >
        <div
          className={
            reduce
              ? "flex"
              : "models-marquee flex w-max hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
          }
          style={
            reduce
              ? undefined
              : { animationDuration: `${Math.max(tools.length * 5, 28)}s` }
          }
        >
          {copies.map((copy) => (
            <div key={copy} className="flex gap-4 pe-4">
              {tools.map((tool) => (
                <div
                  key={`${tool.slug}-${copy}`}
                  className="w-[min(238px,calc(100vw-72px))] shrink-0 snap-start"
                >
                  <ToolCard tool={tool} decorative={copy > 0} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductsPageContent() {
  const [active, setActive] = useState<FilterId>("all");
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return TOOLS;
    return TOOLS.filter((tool) => {
      const category = TOOL_CATEGORIES.find((item) => item.id === tool.category);
      return (
        tool.title.includes(normalizedQuery) ||
        tool.description.includes(normalizedQuery) ||
        category?.label.includes(normalizedQuery)
      );
    });
  }, [normalizedQuery]);

  useEffect(() => {
    if (normalizedQuery) return;

    const hash = window.location.hash.replace("#", "") as ToolCategoryId;
    if (TOOL_CATEGORIES.some((category) => category.id === hash)) {
      setActive(hash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActive(visible.target.id as ToolCategoryId);
        }
      },
      { rootMargin: "-180px 0px -50% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    TOOL_CATEGORIES.forEach((category) => {
      const el = document.getElementById(category.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [normalizedQuery]);

  const chips: { id: FilterId; label: string }[] = [
    { id: "all", label: "همه ابزارها" },
    ...TOOL_CATEGORIES.map((category) => ({
      id: category.id,
      label: category.label,
    })),
  ];

  return (
    <div className="relative w-full bg-white">
      {/* Hero / Section 01 */}
      <section className="mx-auto flex w-full max-w-[860px] flex-col items-center gap-8 px-4 pt-8 pb-8 text-center sm:px-6 sm:pt-14">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-[36px] font-extrabold leading-[46px] text-[#121316]">
            محصولات و ابزارها
          </h1>
          <p className="max-w-[700px] text-lg font-medium leading-[27px] text-[#8b94a4]">
            32 ابزار برای چت، تصویر، نوشتار و سازماندهی. پیدا کن و مستقیم برو داخل همان قابلیت.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <label className="flex h-14 w-full items-center gap-2 rounded-xl bg-neutral-50 px-4">
            <input
              dir="rtl"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="نام ابزار را جستجو کن مثلا نقشه ذهنی"
              aria-label="جستجو در ابزارهای همدست"
              className="min-w-0 flex-1 bg-transparent text-right text-base font-medium leading-6 text-[#121316] placeholder:text-[#8b94a4] focus:outline-none"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/faq/search.svg"
              alt=""
              width={24}
              height={24}
              className="size-6 shrink-0 opacity-70"
            />
          </label>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {chips.map((chip) => {
              const isActive = normalizedQuery
                ? chip.id === "all"
                : active === chip.id;
              return (
                <a
                  key={chip.id}
                  href={chip.id === "all" ? "/products" : `#${chip.id}`}
                  onClick={() => {
                    if (normalizedQuery) setQuery("");
                    setActive(chip.id);
                  }}
                  className={`shrink-0 rounded-[20px] border-[0.45px] px-[11px] py-[3.5px] text-sm font-medium leading-6 whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-primary bg-primary-50 text-primary"
                      : "border-[#f0f0f0] bg-white text-[#656f81] hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {chip.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      {normalizedQuery ? (
        <div className="mx-auto flex w-full max-w-[1254px] flex-col px-4 py-8 sm:px-6 sm:py-12">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm font-medium leading-6 text-neutral-400">
              ابزاری با این عنوان پیدا نشد. عبارت دیگری را امتحان کن.
            </p>
          ) : (
            <section>
              <h2 className="mb-6 text-center text-[24px] font-extrabold leading-8 text-[#121316] sm:text-[28px] sm:leading-[34px]">
                {filtered.length} نتیجه
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="flex w-full flex-col">
          {TOOL_CATEGORIES.map((category) => {
            const tools = TOOLS.filter((tool) => tool.category === category.id);
            const isModels = category.id === "models";
            const isImageVideo = category.id === "image-video";
            const isOrganize = category.id === "organize";

            if (isImageVideo) {
              return (
                <section
                  key={category.id}
                  id={category.id}
                  className="relative w-full scroll-mt-24 overflow-hidden border-y border-[#f1f2f2] bg-[#f9fafb] py-12 sm:py-16"
                >
                  {/* Figma Background Decorations (Group 35344) */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                    {/* Top Right - Camera & Stars (Group 35345) */}
                    <div className="absolute -top-4 -right-12 h-[200px] w-[340px] opacity-70 select-none sm:h-[242px] sm:w-[414px] lg:opacity-85">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" className="size-full object-contain" src="/figma/tools/bg-camera.svg" />
                    </div>
                    {/* Top Left - Polaroid & Stars (Group 35346) */}
                    <div className="absolute top-2 -left-12 h-[200px] w-[340px] opacity-70 select-none sm:left-4 sm:h-[242px] sm:w-[414px] lg:opacity-85">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" className="size-full object-contain" src="/figma/tools/bg-polaroid.svg" />
                    </div>
                    {/* Bottom Left - Studio Softbox Light (Group 35344 -> Group) */}
                    <div className="absolute bottom-0 left-0 h-[220px] w-[150px] opacity-70 select-none sm:h-[276px] sm:w-[194px] lg:opacity-85">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" className="size-full object-contain" src="/figma/tools/bg-softbox.svg" />
                    </div>
                  </div>

                  <div className="relative z-10 mx-auto flex w-full max-w-[1254px] flex-col items-center px-4 sm:px-6">
                    <div className="mb-8 flex flex-col items-center gap-2 text-center">
                      <h2 className="text-[28px] font-extrabold leading-[34px] text-[#121316]">
                        {category.label}
                      </h2>
                      <p className="max-w-[640px] text-lg font-medium leading-[27px] text-[#8b94a4]">
                        {category.blurb}
                      </p>
                    </div>

                    {/* 5-col Grid on Desktop / Stacked on Mobile + See More Card */}
                    <div className="w-full">
                      <div className="flex flex-col gap-4 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {tools.map((tool) => (
                          <ToolCard key={tool.slug} tool={tool} />
                        ))}
                        <SeeMoreCard href="#image-video" />
                      </div>
                    </div>
                  </div>
                </section>
              );
            }

            const isWriting = category.id === "writing";
            const isCompanion = category.id === "companion";
            const useFigmaCards = isWriting || isOrganize || isCompanion;

            return (
              <section
                key={category.id}
                id={category.id}
                className="w-full scroll-mt-24 bg-white py-12 sm:py-16"
              >
                <div className="mx-auto flex w-full max-w-[1254px] flex-col px-4 sm:px-6">
                  <div className="mb-8 flex flex-col items-center gap-2 text-center">
                    <h2 className="text-[28px] font-extrabold leading-[34px] text-[#121316]">
                      {category.label}
                    </h2>
                    <p className="max-w-[640px] text-lg font-medium leading-[27px] text-[#8b94a4]">
                      {category.blurb}
                    </p>
                  </div>

                  {isModels ? (
                    <ModelsCarousel tools={tools} />
                  ) : isCompanion ? (
                    <div className="flex w-full justify-center">
                      <div className="grid w-full grid-cols-2 gap-4 md:w-[492px] md:shrink-0">
                        {tools.map((tool) => (
                          <ToolCard key={tool.slug} tool={tool} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${
                        useFigmaCards
                          ? "flex flex-col gap-4"
                          : "flex flex-col gap-3 md:gap-4"
                      }`}
                    >
                      {tools.map((tool) => (
                        <ToolCard
                          key={tool.slug}
                          tool={tool}
                          isHorizontalOnMobile={!useFigmaCards}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
