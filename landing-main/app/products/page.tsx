import type { Metadata } from "next";
import { Header } from "../_components/Header";
import { CtaFooter } from "../_components/CtaFooter";
import { ProductsPageContent } from "../_components/ProductsPageContent";
import { Faq } from "../_components/Faq";

export const metadata: Metadata = {
  title: "محصولات و ابزارهای همدست",
  description:
    "مدل‌های GPT، Claude، Gemini و Grok، تولید تصویر و ویدیو، ترجمه، خلاصه یوتیوب، کاراکتر و سازنده نقشه ذهنی همدست را اینجا ببین.",
};

const productsFaqs = [
  {
    q: "نقشه ذهنی دقیقا چیست ؟",
    a: "نقشه ذهنی که با نام‌های «نقشه مفهومی»، «نمودار اسپری» یا «درخت حافظه» نیز شناخته می‌شود، ابزاری برای تفکر بصری است که توسط روانشناس بریتانیایی، تونی بوزان، در دهه ۱۹۷۰ اختراع شد.",
  },
  {
    q: "آیا برای استفاده از همدست به فیلترشکن نیاز دارم؟",
    a: "نه. همدست مستقیم و بدون نیاز به فیلترشکن در ایران در دسترس است.",
  },
  {
    q: "سیستم اعتباری (جم) در همدست چطور کار می‌کند؟",
    a: "همدست به‌جای اشتراک ثابت ماهانه، از واحد اعتباری به‌نام «جم» استفاده می‌کند. هر بسته تعداد مشخصی جم می‌دهد و هر مدل هوش مصنوعی بسته به توان پردازشی‌اش جم متفاوتی از حساب شما کم می‌کند — دقیقاً همان‌قدر که مصرف می‌کنید.",
  },
  {
    q: "آیا برای استفاده از مدل‌ها نیاز به شماره خارجی یا کارت دلاری هست؟",
    a: "خیر، ثبت‌نام با شماره موبایل ایران انجام می‌شود و پرداخت‌ها به تومان است.",
  },
];

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <ProductsPageContent />
        <Faq items={productsFaqs} />
      </main>
      <CtaFooter />
    </>
  );
}
