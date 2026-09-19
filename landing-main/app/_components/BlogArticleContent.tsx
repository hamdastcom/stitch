"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BlogCover } from "./BlogCover";
import { BlogCard, CategoryBadge } from "./BlogCard";
import { CATEGORY_LABEL, type BodyBlock, type Post } from "../_data/posts";

const APP_URL = "http://app.hamdast.com/";
const easeOut = [0.16, 1, 0.3, 1] as const;

function highlightHamdast(text: string) {
  const parts = text.split(/(همدست)/g);
  return parts.map((part, index) =>
    part === "همدست" ? (
      <span key={`${part}-${index}`} className="text-primary">
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

function Block({ block }: { block: BodyBlock }) {
  if (block.type === "p") {
    return (
      <p className="text-lg font-medium leading-[27px] text-neutral-400 text-justify">
        {highlightHamdast(block.text)}
      </p>
    );
  }

  if (block.type === "h2") {
    return (
      <h2 className="pt-2 text-xl font-extrabold leading-8 text-[#121316] sm:text-[22px]">
        {block.text}
      </h2>
    );
  }

  if (block.type === "ul") {
    return (
      <ul className="flex flex-col gap-2">
        {block.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-lg font-medium leading-[27px] text-neutral-400"
          >
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{highlightHamdast(item)}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="rounded-2xl border-r-4 border-primary bg-primary-50/60 p-4 text-lg font-medium leading-[27px] text-neutral-500">
        {highlightHamdast(block.text)}
      </blockquote>
    );
  }

  return (
    <aside className="rounded-2xl border border-[#f1f2f2] bg-grey-01 p-4">
      <p className="text-base font-extrabold leading-6 text-primary">
        {block.title}
      </p>
      <p className="mt-1 text-sm font-medium leading-6 text-neutral-400">
        {highlightHamdast(block.text)}
      </p>
    </aside>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="flex min-h-11 cursor-pointer items-center justify-center rounded-[20px] border-[0.45px] border-[#f0f0f0] px-[14px] text-sm font-medium leading-6 text-neutral-400 transition-colors hover:border-primary/40 hover:text-primary"
    >
      {copied ? "لینک کپی شد" : "کپی لینک مطلب"}
    </button>
  );
}

export function BlogArticleContent({
  post,
  related,
}: {
  post: Post;
  related: Post[];
}) {
  const reduce = !!useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const article = document.getElementById("article-body");
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight * 0.45;
      const passed = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress((passed / Math.max(total, 1)) * 100);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[51] h-1 bg-transparent"
      >
        <div
          className="ml-auto h-full bg-primary transition-[width] duration-150 ease-out motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-[220px] h-[406px] w-[406px] rounded-full bg-[#c9a8ff]/20 blur-3xl sm:h-[765px] sm:w-[765px]" />
        <div className="absolute -right-40 top-[720px] h-[479px] w-[479px] rounded-full bg-[#e9d5ff]/25 blur-3xl sm:h-[902px] sm:w-[902px]" />
      </div>

      <article className="mx-auto flex w-full max-w-[860px] flex-col gap-8 px-4 pt-8 pb-8 sm:px-6 sm:pt-16">
        <motion.div
          className="flex flex-col gap-4"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.65, ease: easeOut }}
        >
          <nav
            aria-label="مسیر صفحه"
            className="flex flex-wrap items-center gap-1.5 text-sm font-medium leading-6 text-neutral-300"
          >
            <Link href="/blog" className="transition-colors hover:text-primary">
              آموزش
            </Link>
            <span>/</span>
            <Link
              href={
                post.category === "newsletter"
                  ? "/blog?category=newsletter"
                  : post.category === "learn"
                    ? "/blog?category=learn"
                    : "/blog?category=blog"
              }
              className="transition-colors hover:text-primary"
            >
              {CATEGORY_LABEL[post.category]}
            </Link>
            <span>/</span>
            <span className="max-w-[220px] truncate text-neutral-500 sm:max-w-[360px]">
              {post.title}
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={post.category} />
            <p className="text-sm font-medium leading-6 text-neutral-300">
              {post.date} · {post.readMinutes} دقیقه مطالعه
            </p>
            <CopyLinkButton />
          </div>

          <h1 className="text-[36px] font-extrabold leading-[46px] text-[#121316]">
            {post.title}
          </h1>
          <p className="text-lg font-medium leading-[27px] text-neutral-400">
            {post.excerpt}
          </p>
        </motion.div>

        <motion.div
          className="overflow-hidden rounded-2xl border border-[#f1f2f2] shadow-[0_0_8px_rgba(160,11,215,0.04)]"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { delay: 0.12, duration: 0.7, ease: easeOut }
          }
        >
          <BlogCover
            cover={post.cover}
            className="aspect-[2/1] w-full"
          />
        </motion.div>

        <div id="article-body" className="flex flex-col gap-5">
          {post.body.map((block, index) => (
            <Block key={`${block.type}-${index}`} block={block} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#f1f2f2] bg-grey-01 p-6 text-center sm:p-8">
          <h2 className="text-xl font-extrabold leading-8 text-[#121316]">
            همین حالا در همدست امتحان کن
          </h2>
          <p className="max-w-[520px] text-sm font-medium leading-6 text-neutral-400">
            بدون فیلترشکن و با جم رایگان شروع کن. مدل‌ها آماده‌اند.
          </p>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 min-w-[165px] cursor-pointer items-center justify-center rounded-xl bg-primary px-4 text-xl font-extrabold leading-[26px] text-white shadow-[0_6px_12px_rgba(62,0,73,0.24)] transition-opacity hover:opacity-90"
          >
            شروع رایگان
          </a>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-1 text-base font-extrabold leading-6 text-primary transition-opacity hover:opacity-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/arrow-left.svg"
              alt=""
              width={16}
              height={16}
              className="size-4 rotate-180"
            />
            بازگشت به آموزش
          </Link>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="mx-auto w-full max-w-[1232px] px-4 pb-12 sm:px-6">
          <h2 className="mb-6 text-center text-[28px] font-extrabold leading-[34px] text-[#121316]">
            مطالب مرتبط
          </h2>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.6, ease: easeOut }
            }
          >
            {related.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </motion.div>
        </section>
      ) : null}
    </div>
  );
}
