const APP_URL = "http://app.hamdast.com/";
const CAFE_BAZAAR_URL = "https://cafebazaar.ir/app/ir.lontra.hamdast";

type NavLink = { label: string; href?: string; icon?: string };

const modelLinks: NavLink[] = [
  { label: "GPT Luna", href: "/tools/models/gpt-luna", icon: "/figma/menu/openai.svg" },
  { label: "Claude Fable 5", href: "/tools/models/claude-fable-5", icon: "/figma/menu/anthropic.svg" },
  { label: "Kimi K3", href: "/tools/models/kimi-k3", icon: "/figma/menu/kimi.svg" },
  { label: "Chat GPT", href: "/tools/models/chat-gpt", icon: "/figma/gpt.svg" },
  { label: "Gemini", href: "/tools/models/gemini", icon: "/figma/gemini.svg" },
  { label: "Claude", href: "/tools/models/claude", icon: "/figma/claude.svg" },
  { label: "Grok", href: "/tools/models/grok", icon: "/figma/grok.png" },
];

const columns: { title: string; links: NavLink[]; order: string }[] = [
  { title: "مدل ها", links: modelLinks, order: "order-3 lg:order-1" },
  {
    title: "کاربردها",
    links: [
      { label: "نگارش" },
      { label: "تصویر" },
      { label: "ویدیو" },
      { label: "کد نویسی" },
    ],
    order: "order-4 lg:order-2",
  },
  {
    title: "پشتیبانی",
    links: [
      { label: "تماس با ما", href: "/contact" },
      { label: "آموزش", href: "/blog" },
      { label: "پرسش های متداول", href: "/faq" },
      { label: "همکاری با ما" },
    ],
    order: "order-1 lg:order-3",
  },
  {
    title: "حقوقی",
    links: [
      { label: "قوانین و مقررات" },
      { label: "حریم خصوصی" },
      { label: "بازپرداخت" },
    ],
    order: "order-2 lg:order-4",
  },
];

const stores = [
  { kind: "image" as const, src: "/figma/app-store.png", alt: "Download on the App Store" },
  { kind: "image" as const, src: "/figma/google-play.png", alt: "Get it on Google Play" },
  {
    kind: "composed" as const,
    src: "/figma/cafe-bazaar.svg",
    alt: "دریافت از بازار",
    top: "GET IT ON",
    bottom: "Café Bazaar",
    href: CAFE_BAZAAR_URL,
  },
  {
    kind: "composed" as const,
    src: "/figma/myket.png",
    alt: "دریافت از مایکت",
    top: "GET IT ON",
    bottom: "Myket",
  },
];

const socials = [
  { src: "/figma/social-facebook.svg", label: "Facebook" },
  { src: "/figma/social-instagram.svg", label: "Instagram" },
  { src: "/figma/social-youtube.svg", label: "YouTube" },
  { src: "/figma/social-twitter.svg", label: "Twitter" },
];

export function CtaFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef2ff] via-[#f6ecff] to-white" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/footer-blob.svg"
          alt=""
          className="absolute left-1/2 top-[-20%] w-[min(1600px,180vw)] max-w-none -translate-x-1/2 opacity-80"
        />
      </div>

      <div className="flex flex-col items-center gap-8 lg:gap-16">
        <div className="mx-auto flex w-full max-w-[983px] flex-col items-center gap-4 px-4 pt-8 text-center lg:gap-5 lg:px-6">
          <h2 className="w-full text-lg font-extrabold leading-6 text-black lg:text-2xl lg:font-bold lg:leading-8">
            همین حالا به ۲۲+ مدل هوش مصنوعی دنیا{" "}
            <br className="lg:hidden" />
            دسترسی داشته باش
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 min-w-[159px] cursor-pointer items-center justify-center rounded-[10px] bg-primary px-4 text-lg font-extrabold leading-6 text-white shadow-[0_6px_12px_rgba(62,0,73,0.24)] lg:h-12 lg:min-w-[165px] lg:rounded-xl lg:text-xl lg:leading-[26px]"
            >
              شروع رایگان
            </a>
            <a
              href={CAFE_BAZAAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 min-w-[159px] cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-black/10 px-4 text-lg font-extrabold leading-6 text-[#121316] lg:h-12 lg:min-w-[165px] lg:rounded-xl lg:text-xl lg:leading-[26px] lg:text-black"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/cafe-bazaar.svg"
                alt=""
                width={24}
                height={24}
                className="size-5 shrink-0 object-contain lg:size-6"
              />
              دانلود از کافه بازار
            </a>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-8 pt-2 lg:pt-8">
          <div className="mx-auto flex w-full max-w-[1232px] flex-col items-center gap-8 px-4 lg:flex-row lg:items-start lg:justify-between lg:px-6">
            <div className="order-2 flex w-full shrink-0 flex-col items-center gap-7 text-center lg:order-1 lg:w-auto lg:items-start lg:gap-6 lg:text-right">
              <div className="flex max-w-[267px] flex-col items-center gap-2 lg:max-w-[374px] lg:items-start lg:gap-4">
                <div className="flex items-center gap-1 lg:items-end lg:gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/logo-ftr.svg"
                    alt=""
                    width={25}
                    height={32}
                    className="h-[18px] w-[14px] lg:h-8 lg:w-[24.5px]"
                  />
                  <span className="text-lg font-extrabold leading-6 text-black lg:text-[28px] lg:leading-[34px]">
                    همدست
                  </span>
                </div>
                <p className="text-center text-xs font-medium leading-6 text-neutral-500 lg:text-right lg:text-base">
                  به بیش از ۲۲ مدل برتر هوش مصنوعی جهان از جمله Claude ،GPT و
                  Gemini ، بدون نیاز به فیلترشکن دسترسی داشته باش. با اعتبار
                  منصفانه، فقط برای چیزی که واقعاً استفاده می‌کنی پول بده.
                </p>
              </div>
              <div className="flex w-full flex-col items-center gap-2 lg:items-start lg:gap-4">
                <p className="text-lg font-bold leading-6 text-neutral-500">
                  دانلود اپلیکیشن ما
                </p>
                <div
                  className="grid grid-cols-2 gap-[11px] lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:gap-3"
                  dir="ltr"
                >
                  {stores.map((store) => (
                    <StoreBadge key={store.alt} {...store} />
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 grid w-full min-w-0 grid-cols-2 gap-x-16 gap-y-4 lg:order-2 lg:flex lg:w-auto lg:gap-x-20 lg:gap-y-8">
              {columns.map((col) => (
                <div
                  key={col.title}
                  className={`flex flex-col items-start gap-0.5 text-right lg:gap-2 ${col.order}`}
                >
                  <p className="text-base font-extrabold leading-5 text-primary lg:text-xl lg:font-bold lg:leading-9">
                    {col.title}
                  </p>
                  {col.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href ?? "#"}
                      className="flex items-center gap-2 text-sm font-medium leading-6 text-neutral-500 transition-colors hover:text-primary"
                    >
                      {link.icon ? (
                        <span className="relative hidden size-5 shrink-0 overflow-clip lg:inline-flex">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={link.icon}
                            alt=""
                            width={20}
                            height={20}
                            className="size-5 object-contain"
                          />
                        </span>
                      ) : null}
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="h-px w-full bg-white/70" />
            <div
              className="mx-auto flex w-full max-w-[1232px] flex-col items-center gap-2 px-4 py-2 pb-4 lg:h-16 lg:flex-row lg:justify-between lg:px-6 lg:py-4 lg:pb-8"
              dir="ltr"
            >
              <p className="text-[10px] font-normal leading-[14px] text-neutral-500 lg:text-sm lg:leading-5">
                © 2026 Hamdast. All rights reserved.
              </p>
              <div className="flex w-[78px] items-center justify-between lg:w-auto lg:gap-6">
                {socials.map((s) => (
                  <a
                    key={s.src}
                    href="#"
                    aria-label={s.label}
                    className="relative flex size-4 items-center justify-center overflow-clip lg:size-8 lg:rounded lg:bg-white/20 lg:backdrop-blur-[2.7px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.src}
                      alt=""
                      width={21}
                      height={21}
                      className="size-[11px] lg:size-[21px]"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function StoreBadge(
  store:
    | { kind: "image"; src: string; alt: string; href?: string }
    | {
        kind: "composed";
        src: string;
        alt: string;
        top: string;
        bottom: string;
        href?: string;
      },
) {
  const isExternal = Boolean(store.href);

  return (
    <a
      href={store.href ?? "#"}
      aria-label={store.alt}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="relative flex h-8 w-[103px] shrink-0 items-center justify-center overflow-clip rounded-lg border border-black/5 bg-white/70 shadow-sm backdrop-blur-[1.4px] lg:h-10 lg:w-[129px] lg:rounded-[8.5px]"
    >
      {store.kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={store.src}
          alt={store.alt}
          width={110}
          height={27}
          className="h-[22px] w-[83px] object-contain lg:h-[27px] lg:w-[110px]"
        />
      ) : (
        <span className="flex w-full items-center gap-1 px-1.5 lg:gap-1.5 lg:px-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={store.src}
            alt=""
            width={22}
            height={22}
            className="size-4 shrink-0 object-contain lg:size-[22px]"
          />
          <span className="min-w-0 text-left leading-none text-neutral-600">
            <span className="block text-[6px] font-medium tracking-[0.04em] lg:text-[7px]">
              {store.top}
            </span>
            <span className="mt-0.5 block text-[9px] font-bold lg:text-[11px]">
              {store.bottom}
            </span>
          </span>
        </span>
      )}
    </a>
  );
}
