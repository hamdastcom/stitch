"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  productApps,
  productColumns,
} from "../_data/products-menu";

export function ProductsMegaMenu({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div
      dir="rtl"
      className="relative w-full rounded-[24px] bg-white p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.08)] lg:px-10 lg:py-8 xl:px-12"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8 xl:gap-10">
        {/* Card: اپلیکیشن ها */}
        <aside className="w-full shrink-0 rounded-[20px] bg-[#F1F2F2] p-4 lg:w-[251px]">
          <p className="text-base font-extrabold leading-6 text-[#8B94A4]">
            اپلیکیشن ها
          </p>
          <div className="my-2 h-px w-full bg-[#DDDFE3]" />
          <div className="flex flex-col gap-2">
            {productApps.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNavigate}
                className="group flex h-[68px] w-full items-center justify-between rounded-xl px-1 py-2 text-right transition-colors hover:bg-white/80"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-10 shrink-0 items-center justify-center p-2 text-[#121316]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.icon!}
                      alt=""
                      width={24}
                      height={24}
                      className="size-6 shrink-0 object-contain"
                    />
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5 text-right">
                    <span className="text-base font-extrabold leading-6 whitespace-nowrap text-[#121316]">
                      {item.label}
                    </span>
                    {item.hint ? (
                      <span className="text-sm font-medium leading-5 whitespace-nowrap text-[#8B94A4]">
                        {item.hint}
                      </span>
                    ) : null}
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/menu/angle-left.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 shrink-0 text-[#8B94A4] transition-transform group-hover:-translate-x-0.5"
                />
              </a>
            ))}
          </div>
        </aside>

        {/* 5 Categories */}
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-6 sm:grid-cols-3 lg:flex lg:items-start lg:justify-between lg:gap-6 xl:gap-8">
          {productColumns.map((column) => (
            <div
              key={column.title}
              className="flex min-w-[125px] flex-col items-start xl:min-w-[145px]"
            >
              <Link
                href={column.href ?? "/products"}
                onClick={onNavigate}
                className="group flex w-full items-center justify-between gap-2 py-2 text-right"
              >
                <span className="text-base font-extrabold leading-6 whitespace-nowrap text-[#121316] transition-colors group-hover:text-primary">
                  {column.title}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/menu/angle-left.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 shrink-0 text-[#8B94A4] transition-transform group-hover:-translate-x-0.5"
                />
              </Link>
              <div className="mb-2 h-px w-full bg-[#DDDFE3]" />
              <div className="flex w-full flex-col">
                {column.links.map((item) => {
                  const active = !item.external && pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onNavigate}
                      className={`group flex h-10 w-full items-center justify-start gap-2 rounded-xl px-1 text-right transition-colors hover:bg-[#F9FAFB] hover:text-primary ${
                        active
                          ? "font-bold text-primary"
                          : "font-medium text-[#656F81]"
                      }`}
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center p-2 text-[#656F81] transition-colors group-hover:text-primary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.icon!}
                          alt=""
                          width={24}
                          height={24}
                          className="size-6 shrink-0 object-contain transition-opacity group-hover:opacity-90"
                        />
                      </span>
                      <span className="text-base leading-6 whitespace-nowrap transition-colors group-hover:text-primary">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
