import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const iranYekan = localFont({
  src: [
    { path: "./fonts/IRANYekanMobileRegular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/IRANYekanMobileMedium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/IRANYekanMobileBold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/IRANYekanMobileExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/IRANYekanMobileBlack.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-iranyekan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "همدست — همه‌ی هوش مصنوعی‌های دنیا، یک‌جا و به فارسی",
  description:
    "دسترسی به بیش از ۲۲ مدل برتر هوش مصنوعی جهان مثل Claude، GPT و Gemini، بدون فیلترشکن و با پرداخت به تومان.",
  applicationName: "همدست",
  manifest: "/site.webmanifest",
  themeColor: "#8B04FF",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${iranYekan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-600">
        {children}
      </body>
    </html>
  );
}
