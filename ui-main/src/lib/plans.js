import apiClient from "@/lib/apiClient";

export const PERIOD_MONTHS = {
  monthly: 1,
  quarterly: 3,
  halfYearly: 6,
  yearly: 12,
};

export const PERIOD_LABELS = {
  monthly: "۱ ماهه",
  quarterly: "۳ ماهه",
  halfYearly: "۶ ماهه",
  yearly: "۱۲ ماهه",
};

/** Hardcoded fallback matching current production values */
export const FALLBACK_BASIC_PLAN = {
  slug: "basic",
  name: "پلاس",
  nameEn: "Basic",
  monthlyCredits: 1250,
  features: [
    {
      icon: "MessageSquareIcon",
      text: "دسترسی به پیشرفته‌ترین مدل‌های Gemini ,ChatGPT, Grok, Claude",
    },
    {
      icon: "ImageIcon",
      text: "تولید تصویر  و طراحی حرفه‌ای Seadream ,Nanobana, Flux و سایر مدل‌های پیشرفته",
    },
    {
      icon: "VideoIcon",
      text: "تولید ویدئوهای حرفه‌ای با Seadance, Wan و سایر مدل‌های پیشرفته",
    },
    {
      icon: "UploadIcon",
      text: "آپلود فایل و عکس و جست‌وجو در اینترنت",
    },
    {
      icon: "UsersIcon",
      text: "گفتگو با شخصیت‌ها",
    },
  ],
  prices: [
    { period: "monthly", amountToman: 299000, discountLabel: null, credits: 1250 },
    { period: "quarterly", amountToman: 897000, discountLabel: null, credits: 3800 },
    { period: "halfYearly", amountToman: 1399000, discountLabel: "۲۰٪ تخفیف", credits: 7650 },
    { period: "yearly", amountToman: 2290000, discountLabel: null, credits: 15300 },
  ],
};

export async function fetchPlans() {
  const { data, ok } = await apiClient.get(`/plans?_t=${Date.now()}`);

  if (!ok || !data?.plans?.length) {
    return { ok: false, plans: [FALLBACK_BASIC_PLAN] };
  }

  return { ok: true, plans: data.plans };
}

export function getSellablePlan(plans, preferredSlug = "basic") {
  const list = plans?.length ? plans : [FALLBACK_BASIC_PLAN];
  const preferred = list.find(
    (p) => p.slug === preferredSlug && p.prices?.length
  );
  if (preferred) return preferred;
  return list.find((p) => p.prices?.length) || FALLBACK_BASIC_PLAN;
}

export function getPriceMap(plan) {
  const map = {};
  for (const price of plan?.prices || []) {
    map[price.period] = price.amountToman;
  }
  return map;
}

export function getDiscountLabel(plan, period) {
  return (
    plan?.prices?.find((p) => p.period === period)?.discountLabel || null
  );
}

export function formatGemsLabel(monthlyCredits, period, periodCredits) {
  const months = PERIOD_MONTHS[period] ?? 1;
  const gems = periodCredits ?? monthlyCredits * months;
  return `${gems.toLocaleString("fa-IR", { useGrouping: false })} 💎 جم`;
}

export function formatToman(price) {
  const rounded = Math.floor(price / 1000) * 1000;
  return rounded.toLocaleString("fa-IR");
}

/** Build period rows from whatever active prices the plan has in DB */
export function buildPeriodOptions(plan, periodIds) {
  const monthlyCredits = plan?.monthlyCredits ?? 1250;
  const allPrices = [...(plan?.prices || [])].sort(
    (a, b) => (PERIOD_MONTHS[a.period] ?? 99) - (PERIOD_MONTHS[b.period] ?? 99)
  );

  const filtered = periodIds?.length
    ? allPrices.filter((p) => periodIds.includes(p.period))
    : allPrices;

  return filtered.map((priceRow) => {
    const period = priceRow.period;
    const months = PERIOD_MONTHS[period] ?? 1;
    return {
      id: period,
      label: PERIOD_LABELS[period] || period,
      gemsLabel: formatGemsLabel(monthlyCredits, period, priceRow.credits),
      price: priceRow.amountToman,
      monthlyPrice:
        months > 1 ? Math.round(priceRow.amountToman / months) : null,
      discount: priceRow.discountLabel || null,
    };
  });
}
