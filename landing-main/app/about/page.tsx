import type { Metadata } from "next";
import { Header } from "../_components/Header";
import { CtaFooter } from "../_components/CtaFooter";
import { AboutPageContent } from "../_components/AboutPageContent";

export const metadata: Metadata = {
  title: "درباره همدست",
  description:
    "همدست محصول شرکت هوش آفرینان توسعه فناوری است؛ یک تیم ده‌نفره در تهران که دسترسی مستقیم و فارسی به بیش از ۲۲ مدل هوش مصنوعی جهان را ممکن می‌کند.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <AboutPageContent />
      </main>
      <CtaFooter />
    </>
  );
}
