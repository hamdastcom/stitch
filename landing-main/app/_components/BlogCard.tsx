"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BlogCover } from "./BlogCover";
import {
  CATEGORY_LABEL,
  type Post,
} from "../_data/posts";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function CategoryBadge({
  category,
  className = "",
}: {
  category: Post["category"];
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[20px] border-[0.45px] px-[11px] py-[3.5px] text-sm font-medium leading-6 ${
        category === "newsletter"
          ? "border-[#e0bcff] bg-white text-primary"
          : category === "learn"
            ? "border-primary bg-primary text-white"
            : "border-primary bg-primary-50 text-primary"
      } ${className}`}
    >
      {CATEGORY_LABEL[category]}
    </span>
  );
}

export function BlogCard({ post }: { post: Post }) {
  const reduce = !!useReducedMotion();

  return (
    <motion.article
      variants={
        reduce
          ? undefined
          : {
              hidden: { opacity: 0, y: 24 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.65, ease: easeOut },
              },
            }
      }
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="h-full"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#f1f2f2] bg-white shadow-[0_0_8px_rgba(160,11,215,0.04)] outline-none transition-[border-color,box-shadow] duration-200 hover:border-primary/20 hover:shadow-[0_12px_28px_rgba(139,4,255,0.08)] focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="overflow-hidden">
          <BlogCover
            cover={post.cover}
            className="aspect-[16/10] w-full transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <CategoryBadge category={post.category} />
            <p className="text-xs font-medium leading-6 text-neutral-300">
              {post.date} · {post.readMinutes} دقیقه
            </p>
          </div>
          <h3 className="text-lg font-extrabold leading-7 text-[#121316] transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="flex-1 text-sm font-medium leading-6 text-neutral-400">
            {post.excerpt}
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-extrabold leading-6 text-primary">
            ادامه مطلب
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/arrow-left.svg"
              alt=""
              width={16}
              height={16}
              className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export function FeaturedPost({ post }: { post: Post }) {
  const reduce = !!useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: easeOut }}
      className="w-full"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group grid cursor-pointer overflow-hidden rounded-2xl border border-[#f1f2f2] bg-white shadow-[0_0_8px_rgba(160,11,215,0.04)] outline-none transition-[border-color,box-shadow] duration-200 hover:border-primary/20 hover:shadow-[0_16px_36px_rgba(139,4,255,0.1)] focus-visible:ring-2 focus-visible:ring-primary lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
      >
        <div className="overflow-hidden">
          <BlogCover
            cover={post.cover}
            className="aspect-[16/10] w-full lg:aspect-auto lg:h-full lg:min-h-[320px] transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="flex flex-col justify-center gap-4 p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={post.category} />
            <span className="rounded-[20px] border-[0.45px] border-[#f0f0f0] px-[11px] py-[3.5px] text-sm font-medium leading-6 text-neutral-400">
              برگزیده
            </span>
            <p className="text-xs font-medium leading-6 text-neutral-300">
              {post.date} · {post.readMinutes} دقیقه مطالعه
            </p>
          </div>
          <h2 className="text-[28px] font-extrabold leading-[34px] text-[#121316] transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          <p className="text-lg font-medium leading-[27px] text-neutral-400">
            {post.excerpt}
          </p>
          <span className="inline-flex items-center gap-1 text-base font-extrabold leading-6 text-primary">
            خواندن مطلب
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/arrow-left.svg"
              alt=""
              width={16}
              height={16}
              className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
