import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticleContent } from "../../_components/BlogArticleContent";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "../../_data/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "مطلب پیدا نشد" };
  return {
    title: `${post.title} — همدست`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <BlogArticleContent post={post} related={getRelatedPosts(post.slug)} />
  );
}
