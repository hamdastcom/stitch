export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/bg/frame-14-mobile.png"
        alt=""
        width={430}
        height={610}
        className="absolute inset-x-0 top-0 w-full lg:hidden"
      />
      <div
        aria-hidden
        className="absolute left-10 top-0 h-[146px] w-[min(352px,calc(100%-5rem))] lg:hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(18,19,22,0.055) 0, rgba(18,19,22,0.055) 1px, transparent 1px, transparent 39px)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/bg/frame-14.png"
        alt=""
        width={1440}
        height={2042}
        className="absolute inset-0 hidden size-full object-cover object-left object-top lg:block"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[46px] hidden h-[488px] w-[1179px] -translate-x-1/2 lg:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(18,19,22,0.055) 0, rgba(18,19,22,0.055) 1px, transparent 1px, transparent 131px)",
        }}
      />
    </div>
  );
}
