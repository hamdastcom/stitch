import React, { useState, useEffect, useRef } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import {
  showReachLimitPricingSheetAtom,
  showOverlayLoadingAtom,
  themeAtom,
  reachLimitPricingSheetTriggerSourceAtom,
} from "@/config/state";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import {
  isStoreBillingBuild,
  purchasePlan,
  fetchStorePeriods,
} from "@/lib/storeBilling";
import pricingImg from "@/assets/img/pricing-img.png";
import pricingDarkImg from "@/assets/img/pricing-img-dark.png";
import {
  trackPricingEvent,
  PRICING_EVENTS,
  MODAL_TYPES,
} from "@/lib/pricingAnalytics";
import {
  fetchPlans,
  getSellablePlan,
  buildPeriodOptions,
  FALLBACK_BASIC_PLAN,
} from "@/lib/plans";

import "react-spring-bottom-sheet/dist/style.css";

const ReachLimitPricingSheet = () => {
  const setShowOverlayLoading = useSetAtom(showOverlayLoadingAtom);
  const [open, setOpen] = useAtom(showReachLimitPricingSheetAtom);
  const theme = useAtomValue(themeAtom);
  const [triggerSource] = useAtom(reachLimitPricingSheetTriggerSourceAtom);

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
        modalType: MODAL_TYPES.REACH_LIMIT_PRICING_SHEET,
        triggerSource,
        selectedPlan: plan.slug,
        selectedPeriod,
      });
    }
    if (!open) {
      hasTrackedView.current = false;
    }
  }, [open, triggerSource]);

  const handlePurchase = async () => {
    trackPricingEvent({
      eventType: PRICING_EVENTS.CHECKOUT_CLICK,
      modalType: MODAL_TYPES.REACH_LIMIT_PRICING_SHEET,
      triggerSource,
      selectedPlan: plan.slug,
      selectedPeriod,
    });

    setOpen(false);
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

  const formatPrice = (price) => {
    return price.toLocaleString("fa-IR");
  };

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
      <div className="relative overflow-hidden bg-background flex flex-col h-[calc(100vh-1.3rem)]">
        <button
          aria-label="بستن"
          onClick={() => setOpen(false)}
          className="absolute top-3 left-3 z-30 p-2 rounded-full text-foreground transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-full flex items-center justify-center -px-4">
          <img
            src={theme === "dark" ? pricingDarkImg : pricingImg}
            alt="pricing"
            className="w-full object-contain"
          />
        </div>

        <div className="flex flex-col px-8 -mt-2 rounded-t-3xl relative z-10 flex-1 overflow-y-auto pb-24">
          <div className="text-center space-y-2 pt-4">
            <p className="text-lg font-bold text-foreground">
              ChatGPT و ۲۰ مدل هوش مصنوعی‌ دیگر رو <br /> در یک اشتراک بخر!
            </p>
            <p className="text-[15px] text-[#333333] dark:text-gray-400 font-semibold leading-relaxed mt-4">
              با خرید اشتراک به Gemini, Claude, Grok, ChatGPT و مدل‌های پیشرفته
              ساخت تصویر و ویدئو مانند Seadream, Nanobanana و Flux دسترسی پیدا
              کنید.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {periods.map((period) => {
              const isSelected = selectedPeriod === period.id;

              return (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={cn(
                    "flex items-center justify-between h-16 px-4 rounded-xl border-2 transition-all text-right relative",
                    isSelected
                      ? "border-primary bg-primary/10 dark:bg-primary/15"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {period.discount && (
                    <span className="absolute -top-3 right-4 text-xs text-white bg-red-500 dark:bg-red-600 px-2 py-0.5 rounded-full font-bold">
                      {period.discount}
                    </span>
                  )}

                  <span className="absolute top-5 -right-8 rotate-90 text-xs text-white bg-primary dark:bg-primary px-4 py-0.5 rounded-full font-bold">
                    {period.label}
                  </span>

                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-foreground font-medium">
                      {period.gemsLabel}
                    </span>
                  </div>

                  <div className="text-left">
                    <p className="text-foreground font-bold">
                      {formatPrice(period.price)} تومان
                    </p>
                    {period.monthlyPrice && (
                      <span className="text-xs text-muted-foreground">
                        (ماهانه {formatPrice(period.monthlyPrice)} تومان)
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handlePurchase}
          className={cn(
            "w-full py-5 font-bold transition-all text-base mt-2 absolute bottom-0 left-0 right-0 z-10",
            "bg-primary hover:bg-primary/90 text-white shadow-lg"
          )}
        >
          خرید اشتراک {plan.name || "پلاس"}
        </button>
      </div>
    </BottomSheet>
  );
};

export default ReachLimitPricingSheet;
