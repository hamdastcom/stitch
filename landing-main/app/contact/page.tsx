import type { Metadata } from "next";
import { Header } from "../_components/Header";
import { CtaFooter } from "../_components/CtaFooter";
import { ContactPageContent } from "../_components/ContactPageContent";

export const metadata: Metadata = {
  title: "تماس با همدست",
  description:
    "سوالی درباره حساب کاربری، پرداخت یا مدل‌های هوش مصنوعی همدست داری؟ تیم پشتیبانی همدست معمولاً ظرف ۲۴ ساعت کاری پاسخ می‌دهد.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <ContactPageContent />
      </main>
      <CtaFooter />
    </>
  );
}
