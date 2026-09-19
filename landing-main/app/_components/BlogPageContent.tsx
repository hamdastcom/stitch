"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { BlogCard, FeaturedPost } from "./BlogCard";
import {
  CATEGORY_LABEL,
  getAllPosts,
  getPostCounts,
  type PostCategory,
} from "../_data/posts";

const easeOut = [0.16, 1, 0.3, 1] as const;

const list = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const FILTERS: Array<"all" | PostCategory> = [
  "all",
  "learn",
  "blog",
  "newsletter",
];

type BlogPageContentProps = {
  initialCategory?: "all" | PostCategory;
};

export function BlogPageContent({
  initialCategory = "all",
}: BlogPageContentProps) {
  const reduce = !!useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const posts = getAllPosts();
  const counts = getPostCounts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | PostCategory>(
    initialCategory,
  );

  const selectCategory = (item: "all" | PostCategory) => {
    setCategory(item);
    const url = item === "all" ? pathname : `${pathname}?category=${item}`;
    router.replace(url, { scroll: false });
  };

  const featured = posts.find((post) => post.featured) ?? posts[0];

  const filtered = useMemo(() => {
    const q = query.trim();
    return posts.filter((post) => {
      const matchesCategory = category === "all" || post.category === category;
      const matchesQuery =
        !q || post.title.includes(q) || post.excerpt.includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [posts, query, category]);

  const showFeatured =
    featured &&
    !query.trim() &&
    (category === "all" || featured.category === category);

  const gridPosts = showFeatured
    ? filtered.filter((post) => post.slug !== featured.slug)
    : filtered;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-[180px] h-[406px] w-[406px] rounded-full bg-[#c9a8ff]/20 blur-3xl sm:h-[765px] sm:w-[765px]" />
        <div className="absolute -right-40 top-[640px] h-[479px] w-[479px] rounded-full bg-[#e9d5ff]/25 blur-3xl sm:h-[902px] sm:w-[902px]" />
      </div>

      <section className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-4 pt-8 pb-8 sm:gap-14 sm:px-6 sm:pt-[72px]">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <motion.h1
            className="text-[36px] font-extrabold leading-[46px] text-[#121316]"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.7, ease: easeOut }
            }
          >
            مرکز آموزش همدست
          </motion.h1>
          <motion.p
            className="max-w-[760px] text-lg font-medium leading-[27px] text-neutral-300"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { delay: 0.12, duration: 0.7, ease: easeOut }
            }
          >
            آموزش‌ها، مقاله‌ها و نیوزلترهای{" "}
            <span className="text-primary">همدست</span> درباره مدل‌های هوش
            مصنوعی، سیستم جم، و استفادهٔ روزمره بدون فیلترشکن.
          </motion.p>
          <motion.p
            className="text-sm font-medium leading-6 text-neutral-400"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : { delay: 0.22, duration: 0.55, ease: easeOut }
            }
          >
            {counts.all} مطلب · {counts.learn} آموزش · {counts.blog} مقاله ·{" "}
            {counts.newsletter} نیوزلتر
          </motion.p>
        </div>

        <div className="flex w-full max-w-[1232px] flex-col items-center gap-8">
          <div className="flex w-full max-w-[860px] flex-col items-center gap-4">
            <label className="flex h-12 w-full items-center gap-1 rounded-lg bg-neutral-50 px-4 sm:h-14 sm:rounded-xl">
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
                placeholder="عنوان مطلب را جستجو کن"
                aria-label="جستجو در مرکز آموزش همدست"
                className="min-w-0 flex-1 bg-transparent text-right text-base font-medium leading-6 text-neutral-600 placeholder:text-neutral-300 focus:outline-none"
              />
            </label>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {FILTERS.map((item) => {
                const isActive = category === item;
                const count =
                  item === "all"
                    ? counts.all
                    : item === "learn"
                      ? counts.learn
                      : item === "blog"
                        ? counts.blog
                        : counts.newsletter;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => selectCategory(item)}
                    className={`flex min-h-11 cursor-pointer items-center justify-center rounded-[20px] border-[0.45px] px-[14px] py-[5px] text-sm font-medium leading-6 whitespace-nowrap transition-colors ${
                      isActive
                        ? "border-primary bg-primary-50 text-primary"
                        : "border-[#f0f0f0] text-neutral-400 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {CATEGORY_LABEL[item]}
                    <span className="mr-1.5 text-xs opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {showFeatured ? <FeaturedPost post={featured} /> : null}

          {gridPosts.length === 0 ? (
            <p className="py-16 text-center text-sm font-medium leading-6 text-neutral-400">
              مطلبی با این عنوان پیدا نشد. عبارت دیگری را امتحان کن.
            </p>
          ) : (
            <motion.div
              key={`${category}-${query}`}
              className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
              initial={reduce ? false : "hidden"}
              animate="show"
              variants={reduce ? undefined : list}
            >
              {gridPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
