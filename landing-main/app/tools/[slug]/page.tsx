import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ToolPageContent } from "../../_components/ToolPageContent";
import { TOOLS, getTool } from "../../_data/tools";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.filter((tool) => tool.slug !== "mind-map").map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return { title: "ابزار پیدا نشد" };
  return {
    title: `${tool.title} — همدست`,
    description: tool.description,
  };
}

export default async function ToolPage({
  params,
}: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  if (slug === "mind-map") redirect("/design");
  const tool = getTool(slug);
  if (!tool) notFound();
  if (tool.category === "models") redirect(`/tools/models/${slug}`);
  return <ToolPageContent tool={tool} />;
}
