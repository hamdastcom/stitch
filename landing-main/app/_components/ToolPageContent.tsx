"use client";

import Link from "next/link";
import { APP_URL, getRelatedTools, type Tool } from "../_data/tools";
import { TintedIcon } from "./TintedIcon";

function Icon({ src }: { src: string }) {
  return <TintedIcon src={src} className="size-10" />;
}

export function ToolPageContent({ tool }: { tool: Tool }) {
  const related = getRelatedTools(tool.slug);

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-24 h-[320px] w-[320px] rounded-full bg-[#c9a8ff]/20 blur-3xl sm:h-[560px] sm:w-[560px]" />
      </div>

      <section className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 sm:py-20">
        <nav className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium leading-6 text-neutral-300">
          <Link href="/products" className="hover:text-primary">
            محصولات
          </Link>
          <span>／</span>
          <span className="text-neutral-500">{tool.title}</span>
        </nav>

        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary-50">
          <Icon src={tool.icon} />
        </span>

        <div className="flex flex-col gap-4">
          <h1 className="text-[36px] font-extrabold leading-[46px] text-[#121316]">
            {tool.title}
          </h1>
          <p className="text-lg font-medium leading-[27px] text-neutral-300">
            {tool.description}
          </p>
        </div>

        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 min-w-[180px] items-center justify-center rounded-[10px] bg-primary px-6 text-lg font-extrabold leading-6 text-white transition-opacity hover:opacity-90"
        >
          شروع در همدست
        </a>
      </section>

      {related.length > 0 ? (
        <section className="mx-auto w-full max-w-[1080px] px-4 pb-16 sm:px-6">
          <h2 className="mb-6 text-center text-[28px] font-extrabold leading-[34px] text-[#121316]">
            ابزارهای مرتبط
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="flex h-full flex-col items-start gap-3 rounded-2xl border border-[#f1f2f2] bg-white p-5 text-right transition-colors hover:border-primary-100 hover:bg-primary-50/40"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-grey-01">
                  <Icon src={item.icon} />
                </span>
                <div className="flex flex-col gap-1 text-right">
                  <h3 className="text-lg font-extrabold leading-6 text-[#121316]">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium leading-6 text-neutral-300">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
