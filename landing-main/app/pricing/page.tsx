import type { Metadata } from "next";
import { Header } from "../_components/Header";
import { CtaFooter } from "../_components/CtaFooter";
import { PricingPlans } from "../_components/PricingPlans";
import { GemCalculator } from "../_components/GemCalculator";
import { ComparisonTable } from "../_components/ComparisonTable";
import { Faq } from "../_components/Faq";

export const metadata: Metadata = {
  title: "قیمت‌گذاری و پلن‌ها — همدست",
  description:
    "دسترسی به Claude، GPT و Gemini با یک سیستم اعتباری به تومان. بدون فیلترشکن، بدون اشتراک دلاری جداگانه.",
};

const pricingFaqs = [
  {
    q: "سیستم اعتباری (جم) در همدست چطور کار می‌کند؟",
    a: "همدست به‌جای اشتراک ثابت ماهانه، از واحد اعتباری به‌نام «جم» استفاده می‌کند. هر بسته تعداد مشخصی جم می‌دهد و هر مدل هوش مصنوعی بسته به توان پردازشی‌اش جم متفاوتی از حساب شما کم می‌کند — دقیقاً همان‌قدر که مصرف می‌کنید.",
  },
  {
    q: "آیا همدست پلن رایگان یا اعتبار هدیه دارد؟",
    a: "بله، با ثبت‌نام مقداری جم رایگان برای استفاده آزمایشی دریافت می‌کنید.",
  },
  {
    q: "ارزان‌ترین راه دسترسی به چند مدل هوش مصنوعی در ایران چیست؟",
    a: "خرید جداگانه‌ی ChatGPT Plus، Claude Pro، Gemini و Perplexity Pro در مجموع حدود ۲۶ میلیون تومان در ماه هزینه دارد و نیازمند فیلترشکن و کارت بانکی خارجی است. همدست همه‌ی این مدل‌ها را با شروع از ۲۹۹ هزار تومان در ماه، بدون فیلترشکن، در یک حساب کاربری ارائه می‌دهد.",
  },
  {
    q: "آیا برای استفاده از همدست به فیلترشکن نیاز دارم؟",
    a: "نه. همدست مستقیم و بدون نیاز به فیلترشکن در ایران در دسترس است.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <PricingPlans />
        <GemCalculator />
        <ComparisonTable />
        <Faq items={pricingFaqs} dense />
      </main>
      <CtaFooter />
    </>
  );
}
