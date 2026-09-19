import type { Metadata } from "next";
import { BlogPageContent } from "../_components/BlogPageContent";
import type { PostCategory } from "../_data/posts";

export const metadata: Metadata = {
  title: "مرکز آموزش همدست",
  description:
    "راهنمای استفاده از همدست، آموزش قابلیت‌ها، مقاله‌ها و نیوزلتر درباره مدل‌های هوش مصنوعی، سیستم جم و دسترسی بدون فیلترشکن.",
};

function parseCategory(
  value: string | string[] | undefined,
): "all" | PostCategory {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "blog" || raw === "newsletter" || raw === "learn") return raw;
  return "all";
}

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const params = await searchParams;
  const initialCategory = parseCategory(params.category);

  return <BlogPageContent initialCategory={initialCategory} />;
}
