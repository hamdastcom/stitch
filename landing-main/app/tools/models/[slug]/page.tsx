import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS, getTool } from "../../../_data/tools";
import { GptLunaPageContent } from "../../../_components/GptLunaPageContent";
import { ClaudeFable5PageContent } from "../../../_components/ClaudeFable5PageContent";
import { KimiK3PageContent } from "../../../_components/KimiK3PageContent";
import { ToolPageContent } from "../../../_components/ToolPageContent";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.filter((tool) => tool.category === "models").map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tools/models/[slug]">): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "gpt-luna") {
    const title = "هوش مصنوعی GPT Luna — نسل جدید هوشمندی مکالمه | همدست";
    const description =
      "بدون نیاز به فیلترشکن، بدون کارت بانکی خارجی و بدون پیچیدگی فنی. با GPT Luna در همدست یک مدل زبانی قدرتمند، فوق‌سریع و آشنا با زبان فارسی را مستقیماً از مرورگر خود تجربه کنید.";
    return {
      title,
      description,
      alternates: {
        canonical: "https://hamdast.com/tools/models/gpt-luna",
        languages: {
          "fa-IR": "https://hamdast.com/tools/models/gpt-luna",
        },
      },
      openGraph: {
        title,
        description,
        url: "https://hamdast.com/tools/models/gpt-luna",
        siteName: "هم‌دست",
        locale: "fa_IR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  }

  if (slug === "claude-fable-5") {
    const title =
      "هوش مصنوعی Claude Fable 5 در ایران | متخصص کدنویسی و مهندسی نرم‌افزار — هم‌دست";
    const description =
      "کدنویسی، دیباگ و معماری سیستم با Claude Fable 5 در هم‌دست؛ هوش مصنوعی تخصصی مهندسی نرم‌افزار. بدون نیاز به فیلترشکن و با پرداخت ریالی تست کنید.";
    return {
      title,
      description,
      keywords: [
        "هوش مصنوعی Claude Fable 5",
        "Claude Fable 5 ایران",
        "هوش مصنوعی کدنویسی Claude Fable",
        "دستیار برنامه‌نویسی کلود فیبل",
        "دیباگ کد با هوش مصنوعی",
        "جایگزین Claude بدون فیلترشکن",
      ],
      alternates: {
        canonical: "https://hamdast.com/tools/models/claude-fable-5",
        languages: {
          "fa-IR": "https://hamdast.com/tools/models/claude-fable-5",
        },
      },
      openGraph: {
        title,
        description,
        url: "https://hamdast.com/tools/models/claude-fable-5",
        siteName: "هم‌دست",
        locale: "fa_IR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  }

  if (slug === "kimi-k3") {
    const title =
      "هوش مصنوعی Kimi K3 در ایران | مدل ۱ میلیون توکنی Moonshot AI — هم‌دست";
    const description =
      "چت با Kimi K3 در هم‌دست؛ ابرمدل ۲.۸ تریلیون پارامتری Moonshot AI با کانتکست ۱ میلیون توکن و چندوجهی. بدون فیلترشکن، با پرداخت ریالی و رایگان تست کنید.";
    return {
      title,
      description,
      keywords: [
        "هوش مصنوعی Kimi K3",
        "چت با Kimi K3",
        "هوش مصنوعی کیمی K3 در ایران",
        "Moonshot AI Kimi بدون تحریم",
        "کانتکست ۱ میلیون توکن هوش مصنوعی",
        "خرید اکانت Kimi K3 ریالی",
      ],
      alternates: {
        canonical: "https://hamdast.com/tools/models/kimi-k3",
        languages: {
          "fa-IR": "https://hamdast.com/tools/models/kimi-k3",
        },
      },
      openGraph: {
        title,
        description,
        url: "https://hamdast.com/tools/models/kimi-k3",
        siteName: "هم‌دست",
        locale: "fa_IR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  }

  const tool = getTool(slug);
  if (!tool) return { title: "مدل پیدا نشد" };
  const title = `${tool.title} — همدست`;
  return {
    title,
    description: tool.description,
    alternates: {
      canonical: `https://hamdast.com/tools/models/${slug}`,
    },
    openGraph: {
      title,
      description: tool.description,
      url: `https://hamdast.com/tools/models/${slug}`,
      siteName: "هم‌دست",
      locale: "fa_IR",
      type: "website",
    },
  };
}

const claudeFable5JsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "هم‌دست",
          item: "https://hamdast.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "مدل‌های هوش مصنوعی",
          item: "https://hamdast.com/products#models",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Claude Fable 5",
          item: "https://hamdast.com/tools/models/claude-fable-5",
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "Claude Fable 5 — هم‌دست",
      description:
        "دسترسی پایدار و مستقیم به Claude Fable 5 در پلتفرم هم‌دست؛ هوش مصنوعی تخصصی مهندسی نرم‌افزار، ریفکتورینگ و رفع باگ‌های کد با پرداخت ریالی.",
      url: "https://hamdast.com/tools/models/claude-fable-5",
      applicationCategory: "DeveloperApplication",
      inLanguage: "fa-IR",
      operatingSystem: "Web, Android, iOS, Windows, macOS, Linux",
      featureList: [
        "درک کانتکست پروژه‌های چندفایلی",
        "تولید خودکار تست‌های واحد و یکپارچگی",
        "تحلیل امنیتی کد بر اساس استاندارد OWASP",
        "مهاجرت و بازنویسی کد میان زبان‌های مختلف",
        "اتصال پایدار بدون نیاز به فیلترشکن",
      ],
      creator: {
        "@type": "Organization",
        name: "Anthropic",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IRR",
        description: "اعتبار آزمایشی رایگان برای تمامی کاربران جدید",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "1420",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Claude Fable 5 چه برتری در کدنویسی نسبت به مدل‌های معمولی دارد؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Claude Fable 5 به جای حدس زدن خطوط، کل معماری سیستم، وابستگی‌های چندفایلی و امنیت کد را تحلیل کرده و راهکارهای تست‌شده ارائه می‌دهد.",
          },
        },
        {
          "@type": "Question",
          name: "آیا برای استفاده از Claude Fable 5 در ایران نیاز به VPN است؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "خیر. هم‌دست زیرساختی پایدار فراهم کرده تا توسعه‌دهندگان بدون نیاز به فیلترشکن مستقیماً از Claude Fable 5 استفاده نمایند.",
          },
        },
        {
          "@type": "Question",
          name: "چگونه می‌توان هزینه اشتراک Claude Fable 5 را پرداخت کرد؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "تمامی پرداخت‌ها در پلتفرم هم‌دست به‌صورت ریالی و از طریق درگاه‌های امن شبکه شتاب با کارت‌های بانکی انجام می‌شود.",
          },
        },
      ],
    },
  ],
};

const kimiK3JsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "هم‌دست",
          item: "https://hamdast.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "مدل‌های هوش مصنوعی",
          item: "https://hamdast.com/products#models",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Kimi K3",
          item: "https://hamdast.com/tools/models/kimi-k3",
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "Kimi K3 — هم‌دست",
      description:
        "دسترسی مستقیم و بدون تحریم به هوش مصنوعی Kimi K3 ساخت Moonshot AI با کانتکست ۱ میلیون توکن و معماری چندوجهی در پلتفرم هم‌دست با پرداخت ریالی.",
      url: "https://hamdast.com/tools/models/kimi-k3",
      applicationCategory: "BusinessApplication",
      inLanguage: "fa-IR",
      operatingSystem: "Web, Android, iOS, Windows, macOS",
      featureList: [
        "پنجره کانتکست ۱ میلیون توکنی",
        "معماری ۲.۸ تریلیون پارامتری MoE",
        "درک چندوجهی همزمان تصویر و متن",
        "بازیابی اطلاعات در اسناد کلان با دقت ۹۹.۸٪",
        "اتصال پایدار بدون نیاز به فیلترشکن",
      ],
      creator: {
        "@type": "Organization",
        name: "Moonshot AI",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IRR",
        description: "تست آزمایشی رایگان برای تمامی کاربران جدید",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "1120",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "مدل هوش مصنوعی Kimi K3 چه برتری نسبت به سایر مدل‌ها دارد؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kimi K3 با کانتکست ۱ میلیون توکنی، معماری ۲.۸ تریلیون پارامتری MoE و قابلیت‌های چندوجهی تصویری، امکان تحلیل اسناد بسیار طولانی را با حفظ کامل جزئیات و هزینه‌ای بهینه‌تر فراهم می‌کند.",
          },
        },
        {
          "@type": "Question",
          name: "آیا برای استفاده از Kimi K3 در هم‌دست به فیلترشکن نیاز است؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "خیر، پلتفرم هم‌دست دسترسی مستقیم و پرسرعت به Kimi K3 را بدون نیاز به VPN برای کاربران ایرانی فراهم کرده است.",
          },
        },
        {
          "@type": "Question",
          name: "نحوه پرداخت هزینه اشتراک Kimi K3 در ایران چگونه است؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "خرید اشتراک در هم‌دست کاملاً به‌صورت ریالی و از طریق کارت‌های عضو شبکه شتاب انجام می‌شود.",
          },
        },
      ],
    },
  ],
};

export default async function ModelPage({
  params,
}: PageProps<"/tools/models/[slug]">) {
  const { slug } = await params;

  if (slug === "gpt-luna") {
    return <GptLunaPageContent />;
  }

  if (slug === "claude-fable-5") {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(claudeFable5JsonLd),
          }}
        />
        <ClaudeFable5PageContent />
      </>
    );
  }

  if (slug === "kimi-k3") {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(kimiK3JsonLd),
          }}
        />
        <KimiK3PageContent />
      </>
    );
  }

  const tool = getTool(slug);
  if (!tool) notFound();
  return <ToolPageContent tool={tool} />;
}
