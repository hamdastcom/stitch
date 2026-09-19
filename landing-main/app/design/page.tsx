import type { Metadata } from "next";
import { Header } from "../_components/Header";
import { CtaFooter } from "../_components/CtaFooter";
import { DesignPageContent } from "../_components/DesignPageContent";

export const metadata: Metadata = {
  title: "تولید نقشه ذهنی همدست",
  description:
    "ایده‌ها را در عرض چند ثانیه، از متن گرفته تا ورودی‌های ویدیویی، به نقشه‌های ذهنی واضح و جذاب تبدیل کنید.",
};

export default function DesignPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <DesignPageContent />
      </main>
      <CtaFooter />
    </>
  );
}
