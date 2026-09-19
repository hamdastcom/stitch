import type { Metadata } from "next";
import { Header } from "../_components/Header";
import { CtaFooter } from "../_components/CtaFooter";
import { FaqPageContent } from "../_components/FaqPageContent";
import {
  FAQ_PAGE_TITLE,
  FAQ_PAGE_DESCRIPTION,
  FAQS,
} from "../_data/faq";

export const metadata: Metadata = {
  title: FAQ_PAGE_TITLE,
  description: FAQ_PAGE_DESCRIPTION,
};

export default function FaqPage() {
  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <Header />
      <main className="flex flex-1 flex-col">
        <FaqPageContent />
      </main>
      <CtaFooter />
    </>
  );
}
