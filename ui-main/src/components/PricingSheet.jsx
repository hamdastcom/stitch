import React, { useState, useEffect, useRef } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useAtom, useSetAtom } from "jotai";
import toast from "react-hot-toast";

import {
  showPricingSheetAtom,
  pricingSheetTriggerSourceAtom,
  showOverlayLoadingAtom,
} from "@/config/state";
import {
  MessageSquareIcon,
  ImageIcon,
  VideoIcon,
  UsersIcon,
  UploadIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import {
  isStoreBillingBuild,
  purchasePlan,
  fetchStorePeriods,
} from "@/lib/storeBilling";
import {
  trackPricingEvent,
  PRICING_EVENTS,
  MODAL_TYPES,
} from "@/lib/pricingAnalytics";
import {
  fetchPlans,
  getSellablePlan,
  buildPeriodOptions,
  formatToman,
  PERIOD_MONTHS,
  FALLBACK_BASIC_PLAN,
} from "@/lib/plans";

import "react-spring-bottom-sheet/dist/style.css";

const FEATURE_ICONS = {
  MessageSquareIcon,
  ImageIcon,
  VideoIcon,
  UploadIcon,
  UsersIcon,
};

const PricingSheet = () => {
  const setShowOverlayLoading = useSetAtom(showOverlayLoadingAtom);
  const [open, setOpen] = useAtom(showPricingSheetAtom);
  const [triggerSource] = useAtom(pricingSheetTriggerSourceAtom);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [plan, setPlan] = useState(FALLBACK_BASIC_PLAN);
  const [periods, setPeriods] = useState(buildPeriodOptions(FALLBACK_BASIC_PLAN));
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    (async () => {
      const [{ plans }, storePeriods] = await Promise.all([
        fetchPlans(),
        fetchStorePeriods(),
      ]);
      if (cancelled) return;
      const sellable = getSellablePlan(plans, "basic");
      // storePeriods is null outside Bazaar/Myket builds, which keeps every period.
      const options = buildPeriodOptions(sellable, storePeriods);
      setPlan(sellable);
      setPeriods(options);
      if (options.length && !options.some((p) => p.id === selectedPeriod)) {
        setSelectedPeriod(options[0].id);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (open && !hasTrackedView.current) {
      hasTrackedView.current = true;
      trackPricingEvent({
        eventType: PRICING_EVENTS.MODAL_VIEW,
        modalType: MODAL_TYPES.PRICING_SHEET,
        triggerSource,
        selectedPlan: plan.slug,
        selectedPeriod,
      });
    }
    if (!open) {
      hasTrackedView.current = false;
    }
  }, [open, triggerSource]);

  const handleConfirmPurchase = async () => {
    trackPricingEvent({
      eventType: PRICING_EVENTS.CHECKOUT_CLICK,
      modalType: MODAL_TYPES.PRICING_SHEET,
      triggerSource,
      selectedPlan: plan.slug,
      selectedPeriod,
    });

    setShowOverlayLoading(true);

    // Store APKs (Bazaar / Myket): digital goods must be sold through in-app billing.
    if (isStoreBillingBuild()) {
      try {
        const { status } = await purchasePlan({
          planSlug: plan.slug,
          period: selectedPeriod,
          onReadyToPay: () => setShowOverlayLoading(false),
        });

        if (status === "success") {
          toast.success("اشتراک شما با موفقیت فعال شد.");
          setOpen(false);
          window.location.reload();
        }
      } catch (error) {
        toast.error(error?.message || "پرداخت انجام نشد.");
      } finally {
        setShowOverlayLoading(false);
      }
      return;
    }

    const { data, ok } = await apiClient.post("/payment/create", {
      type: plan.slug,
      period: selectedPeriod,
    });
    setShowOverlayLoading(false);

    if (!ok) return toast.error("در ایجاد درگاه مشکلی به وجود آمد.");

    const redirectUrl = data.paymentUrl;

    if (typeof Hamdast?.openIntent !== "undefined")
      return Hamdast.openIntent(redirectUrl, "");

    window.location.href = redirectUrl;
  };

  const features =
    plan.features?.length > 0
      ? plan.features
      : FALLBACK_BASIC_PLAN.features;

  return (
    <BottomSheet
      open={open}
      onDismiss={() => setOpen(false)}
      defaultSnap={({ maxHeight }) => maxHeight * 1}
      snapPoints={({ maxHeight }) => [maxHeight * 1]}
      blocking={true}
      scrollLocking={true}
      className="bottom-sheet"
    >
      <div className="flex px-4 items-center justify-between sticky top-0 bg-background z-30">
        <p className="text-lg">خرید اشتراک {plan.name || "پلاس"}</p>

        <button
          className="rounded-full hover:bg-muted transition-colors"
          aria-label="بستن"
          onClick={() => setOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-4 px-4 pb-24">
        <div className="bg-primary/10 text-muted-foreground space-y-2 dark:bg-primary/15 rounded-md p-3 m-2 mt-4">
          <p className="text-center font-semibold text-sm">
            با خرید اشتراک به ChatGPT و همه مدل‌های پیشرفته‌ی هوش مصنوعی برای
            چت، تولید تصویر و ویدیو‌ دسترسی پیدا کن.
          </p>
        </div>

        <div className="mt-1">
          <div className="flex flex-col gap-4 px-2">
            {periods.map((period) => {
              const months = PERIOD_MONTHS[period.id] ?? 1;
              const isSelected = selectedPeriod === period.id;
              const showMonthlyBreakdown = months > 1;
              const isSuggested = period.id === "halfYearly";

              return (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border-2 transition-all text-right relative",
                    period.id === "monthly" && "py-4 px-2",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {period.discount && (
                    <span className="absolute -top-3 left-4 text-xs text-white bg-red-500 dark:bg-red-600 px-2 py-0.5 rounded-lg">
                      {period.discount}
                    </span>
                  )}
                  {isSuggested && (
                    <span className="absolute rotate-90 -right-8 text-[11px] text-white bg-red-500 dark:bg-red-600 px-1.5 rounded-lg">
                      پیشنهادی
                    </span>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected ? "border-primary" : "border-muted-foreground"
                      )}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-foreground"> {period.label}</span>
                      <span className="text-muted-foreground"> - </span>
                      <span className="">{period.gemsLabel}</span>
                    </div>
                  </div>
                  {period.price != null && (
                    <div className="text-left">
                      <p>{formatToman(period.price)} تومان</p>
                      {showMonthlyBreakdown && (
                        <span className="text-xs text-muted-foreground">
                          ( ماهانه {formatToman(Math.round(period.price / months))}{" "}
                          تومان )
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            قیمت‌ها نهایی و شامل ۱۰٪ مالیات بر ارزش افزوده است.
          </p>
        </div>

        <div className="space-y-2 mb-4 pt-4">
          {features.map((feature, index) => {
            const FeatureIcon =
              FEATURE_ICONS[feature.icon] || MessageSquareIcon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-primary/10 rounded-md p-2">
                  <FeatureIcon className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                </div>
                <div className="flex items-start gap-2 flex-1">
                  <span className="text-[13px] leading-relaxed text-[#333333] dark:text-gray-200">
                    {feature.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleConfirmPurchase}
          className="absolute bottom-0 left-0 w-full py-5 font-bold transition-all text-base bg-primary hover:bg-primary/90 text-white"
        >
          خرید اشتراک {plan.name || "پلاس"}
        </button>
      </div>
    </BottomSheet>
  );
};

export default PricingSheet;
