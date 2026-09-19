"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductsMegaMenu } from "./ProductsMegaMenu";

const APP_URL = "http://app.hamdast.com/";

const navLinks = [
  { label: "صفحه اصلی", href: "/" },
  { label: "قیمت گذاری", href: "/pricing" },
  { label: "محصولات", href: "/products", mega: true },
  { label: "آموزش", href: "/blog" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

function isActivePath(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  if (href === "/products") {
    return (
      pathname === "/products" ||
      pathname === "/design" ||
      pathname.startsWith("/design/") ||
      pathname.startsWith("/models") ||
      pathname.startsWith("/tools")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M10 13.9584C9.84002 13.9584 9.68 13.8975 9.55833 13.775L3.725 7.94171C3.48083 7.69754 3.48083 7.30168 3.725 7.05752C3.96916 6.81335 4.36502 6.81335 4.60919 7.05752L10.0008 12.4492L15.3925 7.05752C15.6366 6.81335 16.0325 6.81335 16.2767 7.05752C16.5208 7.30168 16.5208 7.69754 16.2767 7.94171L10.4433 13.775C10.32 13.8975 10.16 13.9584 10 13.9584Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileBarHeight, setMobileBarHeight] = useState(96);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileProductsOpen(false);
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMobileProductsOpen(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const el = mobileBarRef.current;
    if (!el) return;

    const update = () => setMobileBarHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-[border-color] duration-200 ${
        scrolled ? "border-b border-black/5" : "border-b border-transparent"
      }`}
    >
      <div
        ref={mobileBarRef}
        className="relative z-[60] flex items-center justify-between px-4 pt-8 pb-4 lg:hidden"
      >
        <div className="flex items-center">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            id="mobile-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            className="relative size-12 shrink-0 rounded-full"
          >
            <span className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 overflow-clip">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/menu.svg"
                alt=""
                width={24}
                height={24}
                className="size-6"
              />
            </span>
          </button>
          <Link
            href="/"
            className="text-lg font-bold leading-6 text-primary"
          >
            همدست
          </Link>
        </div>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 min-w-[92px] cursor-pointer items-center justify-center rounded-[8px] border border-neutral-100 px-3 text-sm font-extrabold leading-5 text-[#2b3037] transition-opacity hover:opacity-80"
        >
          ورود / ثبت نام
        </a>
      </div>

      {open ? (
        <button
          type="button"
          aria-label="بستن منو"
          className="fixed inset-0 z-40 cursor-default bg-transparent lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        id="mobile-nav"
        className={`z-50 lg:hidden ${
          open
            ? "pointer-events-auto fixed inset-x-0 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
            : "pointer-events-none absolute inset-x-0 top-full overflow-hidden"
        }`}
        style={
          open
            ? {
                top: mobileBarHeight,
                maxHeight: `calc(100dvh - ${mobileBarHeight}px)`,
              }
            : undefined
        }
      >
        <div
          className={`grid ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none`}
        >
          <nav
            className={`min-h-0 bg-white shadow-[0_4px_2px_rgba(0,0,0,0.25)] ${
              open ? "overflow-visible" : "overflow-hidden"
            }`}
          >
            <div className="flex flex-col items-center gap-2 px-4 pb-4">
              {navLinks.map((link) => (
                <div key={link.label} className="flex w-full flex-col items-center gap-2">
                  <div className="h-px w-full bg-[#ededee]" />
                  {link.mega ? (
                    <>
                      <div className="flex h-10 w-full items-center justify-center gap-1 px-4 py-2">
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`text-center text-lg leading-6 ${
                            isActivePath(link.href, pathname) || mobileProductsOpen
                              ? "font-extrabold text-primary"
                              : "font-medium text-neutral-300"
                          }`}
                        >
                          {link.label}
                        </Link>
                        <button
                          type="button"
                          aria-expanded={mobileProductsOpen}
                          aria-label="باز کردن منوی محصولات"
                          onClick={() => setMobileProductsOpen((v) => !v)}
                          className="flex size-8 items-center justify-center"
                        >
                          <ChevronDown
                            className={`size-4 transition-[color,transform] duration-200 ${
                              mobileProductsOpen || scrolled
                                ? "text-primary"
                                : "text-neutral-300"
                            } ${mobileProductsOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>
                      {mobileProductsOpen ? (
                        <div className="w-full px-1 pb-2">
                          <ProductsMegaMenu onNavigate={() => setOpen(false)} />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex h-10 w-full items-center justify-center px-4 py-2 text-center text-lg leading-6 ${
                        isActivePath(link.href, pathname)
                          ? "font-extrabold text-primary"
                          : "font-medium text-neutral-300"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <div className="relative mx-auto hidden w-full max-w-[1440px] items-center justify-between px-[72px] py-8 lg:flex">
        <Link href="/" className="relative z-10 flex shrink-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/logo.svg"
            alt="همدست"
            width={24.5}
            height={32}
            className="h-8 w-[24.5px]"
          />
          <span className="text-xl font-extrabold leading-8 text-primary">
            همدست
          </span>
        </Link>

        <nav className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <div className="pointer-events-auto flex items-center gap-1 xl:gap-3">
            {navLinks.map((link) =>
              link.mega ? (
                <div key={link.label} className="group/mega">
                  <Link
                    href={link.href}
                    id="header-products"
                    aria-haspopup="true"
                    aria-controls="header-products-panel"
                    className={`flex h-8 min-w-0 items-center justify-center gap-1 border-b-2 px-2.5 py-2 text-sm whitespace-nowrap group-hover/mega:border-primary group-hover/mega:text-primary group-focus-within/mega:border-primary group-focus-within/mega:text-primary xl:px-3.5 xl:text-base ${
                      isActivePath(link.href, pathname)
                        ? "border-primary font-extrabold text-primary"
                        : "border-transparent font-medium text-neutral-300 transition-colors hover:text-primary"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`size-4 transition-[color,transform] duration-200 ${
                        scrolled || isActivePath(link.href, pathname)
                          ? "text-primary"
                          : "text-neutral-300"
                      } group-hover/mega:rotate-180 group-hover/mega:text-primary group-focus-within/mega:rotate-180 group-focus-within/mega:text-primary`}
                    />
                  </Link>
                  <div
                    aria-hidden
                    className="pointer-events-none fixed inset-x-0 top-[64px] z-30 hidden h-8 group-hover/mega:pointer-events-auto lg:block"
                  />
                  <div
                    id="header-products-panel"
                    className="invisible pointer-events-none fixed inset-x-0 top-[88px] z-40 hidden px-6 pb-8 opacity-0 transition duration-200 ease-out group-hover/mega:visible group-hover/mega:pointer-events-auto group-hover/mega:opacity-100 group-focus-within/mega:visible group-focus-within/mega:pointer-events-auto group-focus-within/mega:opacity-100 lg:block xl:px-[72px]"
                  >
                    <div className="mx-auto w-full max-w-[1296px]">
                      <ProductsMegaMenu />
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex h-8 min-w-0 items-center justify-center border-b-2 px-2.5 py-2 text-sm whitespace-nowrap xl:px-3.5 xl:text-base ${
                    isActivePath(link.href, pathname)
                      ? "border-primary font-extrabold text-primary"
                      : "border-transparent font-medium text-neutral-300 transition-colors hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </nav>

        <div className="relative z-10 flex shrink-0 items-center gap-2">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 min-w-[102px] cursor-pointer items-center justify-center rounded-[8px] border border-neutral-100 px-4 text-sm font-extrabold leading-5 text-[#2b3037] transition-opacity hover:opacity-80"
          >
            ورود / ثبت نام
          </a>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 min-w-[102px] cursor-pointer items-center justify-center rounded-[8px] bg-[#2b3037] px-4 text-sm font-extrabold leading-5 text-white transition-opacity hover:opacity-80"
          >
            شروع کن
          </a>
        </div>
      </div>
    </header>
  );
}
