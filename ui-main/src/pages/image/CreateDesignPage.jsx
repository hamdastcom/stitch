import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useAtom } from "jotai";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MonitorIcon,
  SquareIcon,
  SmartphoneIcon,
  Sparkles,
  History,
  Download,
  ChevronDown,
  Settings,
  Search,
  EyeIcon,
  GemIcon,
  Palette,
  X,
  AlertTriangleIcon,
} from "lucide-react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CustomDialog } from "@/components/ui/dialog";
import apiClient from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { getCreditIssue, toastUserError } from "@/lib/userError";
import {
  currentImageModelAtom,
  showHintAlertModalAtom,
  hasTitleReachLimitPricingSheetAtom,
} from "@/config/state";
import openaiImg from "@/assets/img/openai.png";
import anthropicImg from "@/assets/img/anthropic.jpg";
import googleImg from "@/assets/img/google.png";
import xaiImg from "@/assets/img/xai.png";
import hamdastImg from "/logo.png";
import logoImg from "@/assets/img/logo.png";
import stickerImg from "@/assets/img/sticker.png";
import posterImg from "@/assets/img/poster.png";
import useAuth from "@/auth/useAuth";
import designPlaceholder from "@/assets/img/Design-generated-placeholder.png";
import downloader from "@/lib/downloader";
import bytedanceImg from "@/assets/img/bytedance.png";
import fluxImg from "@/assets/img/flux.webp";

import "react-spring-bottom-sheet/dist/style.css";
import "swiper/css";
import "swiper/css/navigation";

const providerImages = {
  openai: openaiImg,
  anthropic: anthropicImg,
  google: googleImg,
  xai: xaiImg,
  maya: hamdastImg,
  bytedance: bytedanceImg,
  flux: fluxImg,
};

// Asset Type Options
const assetTypes = [
  {
    value: "logo",
    label: "Logo",
    desc: "لوگو",
    image: logoImg,
  },
  {
    value: "sticker",
    label: "Sticker",
    desc: "استیکر",
    image: stickerImg,
  },
  {
    value: "poster",
    label: "Poster",
    desc: "پوستر",
    image: posterImg,
  },
];

function CreateDesignPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { state } = location;

  const [, setShowReachLimitPricingSheet] = useAtom(showHintAlertModalAtom);
  const [, setHasTitleReachLimitPricingSheet] = useAtom(
    hasTitleReachLimitPricingSheetAtom
  );
  const [currentImageModel, setCurrentImageModel] = useAtom(
    currentImageModelAtom
  );

  const [models, setModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState("");

  const [prompt, setPrompt] = useState(state?.initialPrompt || "");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [assetsType, setAssetsType] = useState(
    state?.initialAssetsType || "logo"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const lastProcessedLocationKey = useRef(null);
  const containerRef = useRef(null);
  const { setCurrentUser } = useAuth();

  const currentAsset = assetTypes.find((a) => a.value === assetsType);
  const currentAssetDesc = currentAsset?.desc || "تصویر";

  useEffect(() => {
    loadModels();

    // Handle visual viewport changes for Android keyboard
    const handleViewportResize = () => {
      if (window.visualViewport && containerRef.current) {
        const viewport = window.visualViewport;
        containerRef.current.style.height = `${viewport.height}px`;
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
      window.visualViewport.addEventListener("scroll", handleViewportResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportResize
        );
        window.visualViewport.removeEventListener(
          "scroll",
          handleViewportResize
        );
      }
    };
  }, []);

  useEffect(() => {
    // Set initial prompt from navigation state
    if (location.state?.initialPrompt) {
      const currentLocationKey = location.key || location.pathname;
      const lastKey = lastProcessedLocationKey.current;

      // Only process if this is a new navigation (different key/pathname or first time)
      if (lastKey === null || currentLocationKey !== lastKey) {
        setPrompt(location.state.initialPrompt);
        lastProcessedLocationKey.current = currentLocationKey;
        // Clear the state after using it to prevent re-setting
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location, navigate]);

  const loadModels = async () => {
    setIsLoadingModels(true);
    const { data, ok } = await apiClient.get("/models?type=image");
    setIsLoadingModels(false);

    if (!ok) {
      toastUserError(data?.message, "خطا در بارگذاری مدل‌ها");
      return;
    }

    setModels(data.models || []);

    // Set first model as default if current model not found
    if (data.models.length > 0 && !currentImageModel.slug) {
      setCurrentImageModel({
        id: data.models[0].id,
        slug: data.models[0].slug,
        provider: data.models[0].provider,
        name: data.models[0].name,
        price: data.models[0].price,
      });
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.trim().length < 10) {
      toast.error("توضیحات باید حداقل ۱۰ کاراکتر باشد");
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);

    const { data, ok } = await apiClient.post("/images/generate", {
      modelSlug: currentImageModel.slug,
      prompt: prompt.trim(),
      config: {
        aspectRatio,
        assetsType,
        generationCount: 1,
      },
    });

    setIsGenerating(false);

    if (!ok) {
      const creditIssue = getCreditIssue(data);
      if (creditIssue === "insufficient" || creditIssue === "price_missing") {
        setShowReachLimitPricingSheet(true);
        setHasTitleReachLimitPricingSheet(true);
        return;
      }
      toast.error(`خطا در تولید ${currentAssetDesc}`);
      return;
    }

    if (data?.generation?.remaining !== undefined) {
      setCurrentUser((prevUser) => {
        const prevCredits = prevUser?.credits;
        const prevCreditsObj =
          typeof prevCredits === "number"
            ? { remaining: prevCredits }
            : prevCredits || {};

        return {
          ...prevUser,
          credits: {
            ...prevCreditsObj,
            remaining: data.generation.remaining,
          },
        };
      });
    }

    setGeneratedImages(data.generation.images || []);
    setActiveSlideIndex(0);
    toast.success("تصویر با موفقیت تولید شد!");
  };

  const handleDownload = async (imageUrl, index) => {
    downloader(imageUrl, index);
  };

  const currentProvider =
    currentImageModel.provider?.toLowerCase() || "bytedance";

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(modelSearchQuery.toLowerCase())
  );

  const selectedModel = models.find(
    (model) => model.slug === currentImageModel.slug
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-4 pb-4 h-full overflow-y-auto"
    >
      {/* Generated Images or Demo Image */}
      <div className="shrink-0 flex justify-center items-center">
        {generatedImages.length > 0 ? (
          <div className="space-y-3 mt-4 w-full max-w-4xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">تصویر تولید شده</h3>
              {generatedImages.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setSelectedImage(generatedImages[activeSlideIndex].s3Url)
                    }
                    className="gap-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    مشاهده
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handleDownload(
                        generatedImages[activeSlideIndex].s3Url,
                        activeSlideIndex
                      )
                    }
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    دانلود
                  </Button>
                </div>
              )}
            </div>
            <div className="relative">
              <style>{`
              .swiper-button-next,
              .swiper-button-prev {
                color: #000000 !important;
                width: 48px !important;
                height: 48px !important;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
              }
              .swiper-button-next:hover,
              .swiper-button-prev:hover {
                background-color: rgba(255, 255, 255, 1);
                transform: scale(1.1);
              }
              .swiper-button-next::after,
              .swiper-button-prev::after {
                font-size: 24px !important;
                font-weight: bold;
              }
            `}</style>
              <Swiper
                modules={[Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={true}
                dir="rtl"
                className="w-full image-swiper"
                onSlideChange={(swiper) =>
                  setActiveSlideIndex(swiper.activeIndex)
                }
                initialSlide={0}
              >
                {generatedImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative group rounded-xl overflow-hidden border border-border bg-secondary">
                      <div className="aspect-video overflow-hidden flex items-center justify-center bg-secondary">
                        <img
                          src={image.s3Url}
                          alt={`Generated ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-3 mt-4">
            <div className="relative rounded-xl overflow-hidden border border-border bg-secondary aspect-video flex items-center justify-center">
              <img
                src={designPlaceholder}
                alt="Demo Image"
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  isGenerating ? "opacity-29" : "opacity-100"
                )}
              />
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-transparent" />

              {/* Loading Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center gap-2 rounded-xl px-4 py-3 bg-white/85 dark:bg-card/95 backdrop-blur-sm border border-primary/20 dark:border-primary/30 shadow-md">
                    <Spinner className="w-6 h-6 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      در حال تولید {currentAssetDesc}...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isGenerating && (
        <div className="flex justify-center items-center gap-2 py-3 rounded-lg bg-amber-100/80 text-amber-500 dark:bg-amber-900/80 dark:text-amber-400 text-xs font-semibold">
          <AlertTriangleIcon className="w-4 h-4" />
          درهنگام تولید تصویر از صفحه خارج نشوید
        </div>
      )}

      {/* Active Model Display */}
      <div className="space-y-4 flex flex-col shrink-0">
        <div className="flex items-center justify-between gap-3 px-4 rounded-xl border border-border bg-card">
          <div className="flex flex-col items-center">
            <p
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 py-2.5 border-b border-border"
            >
              <Settings className="w-4 h-4" />
              <span className="text-xs">تنظیمات</span>
            </p>
            <p
              onClick={() => navigate("/image/history")}
              className="flex items-center gap-2 py-2.5"
            >
              <History className="w-4 h-4" />
              <span className="text-xs">تاریخچه</span>
            </p>
          </div>

          <button
            onClick={() => setIsModelSelectorOpen(true)}
            className="flex flex-row-reverse items-center px-3 py-2 h-[30px] w-[150px] rounded-xl border border-border bg-card hover:bg-accent/50 transition-all shadow-sm hover:shadow-md group"
          >
            {currentImageModel?.name ? (
              <>
                <img
                  src={providerImages[currentProvider] || providerImages.openai}
                  alt={currentImageModel.provider}
                  className={cn(
                    "w-5 h-5 rounded",
                    ["openai", "xai"].includes(currentProvider) && "bg-white"
                  )}
                />
                <div className="flex flex-col items-start ml-2 min-w-0">
                  <span
                    className="text-[12px] font-semibold text-foreground truncate w-full text-left"
                    dir="ltr"
                  >
                    {currentImageModel.name}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Spinner className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  در حال بارگذاری...
                </span>
              </>
            )}
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors ml-2" />
          </button>
        </div>
        <div className="flex justify-center items-center gap-3">
          <div
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card/50 cursor-pointer hover:bg-card transition-colors"
          >
            <SquareIcon className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">نسبت تصویر</span>
              <span className="text-sm font-semibold">{aspectRatio}</span>
            </div>
          </div>
          <div
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card/50 cursor-pointer hover:bg-card transition-colors"
          >
            <Palette className="w-4 h-4 text-green-500" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">نوع تولید</span>
              <span className="text-sm font-semibold capitalize">
                {assetTypes.find((a) => a.value === assetsType)?.label ||
                  assetsType}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <label className="text-sm font-semibold">
              پرامپت برای ساخت {currentAssetDesc} جدید :
            </label>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={(e) => {
              // Scroll the textarea into view when focused
              setTimeout(() => {
                e.target.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }, 300);
            }}
            placeholder={`${currentAssetDesc} مورد نظر خود را توضیح دهید...`}
            className="w-full min-h-[140px] p-3! text-sm rounded-xl border border-border bg-card resize-none outline-none focus:border-primary transition-colors"
            disabled={isGenerating}
            maxLength={1000}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{prompt.length}/1000 کاراکتر</span>
            <span className="text-primary">حداقل ۱۰ کاراکتر</span>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={
              isGenerating || !prompt.trim() || prompt.trim().length < 10
            }
            className="w-full h-14 text-base font-semibold rounded-xl gap-2"
          >
            {isGenerating ? (
              <>
                <Spinner className="w-5 h-5" />
                در حال تولید {currentAssetDesc}...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                تولید {currentAssetDesc}
                {selectedModel ? (
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-sm mt-[2px]">
                      {selectedModel.price}
                    </span>
                    <GemIcon size={15} />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-white">
                    <Spinner className="w-4 h-4" />
                  </div>
                )}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Dialog */}
      <BottomSheet
        open={isSettingsOpen}
        onDismiss={() => setIsSettingsOpen(false)}
        defaultSnap={({ maxHeight }) => maxHeight * 0.9}
        snapPoints={({ maxHeight }) => [maxHeight * 0.9]}
        blocking={true}
        scrollLocking={true}
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">تنظیمات تولید </h2>
            <button
              className="rounded-full hover:bg-muted transition-colors"
              aria-label="بستن"
              onClick={() => setIsSettingsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        }
        className="bottom-sheet"
      >
        <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar px-4 pb-8 mt-4">
          {/* Model Selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <label className="text-sm font-semibold">مدل هوش مصنوعی</label>
            </div>

            <button
              onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all shadow-sm"
            >
              <img
                src={providerImages[currentProvider] || providerImages.openai}
                alt={currentImageModel.provider}
                className={cn(
                  "w-8 h-8 rounded",
                  ["openai", "xai"].includes(currentProvider) && "bg-white p-1"
                )}
              />
              <div className="flex flex-col items-start flex-1">
                <span className="text-sm font-semibold">
                  {currentImageModel.name}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {currentImageModel.provider}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Asset Type Selector */}
          {assetTypes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <label className="text-sm font-semibold">نوع تولید</label>
              </div>

              <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto custom-scrollbar">
                {assetTypes.map((assetTypeOption) => (
                  <button
                    key={assetTypeOption.value}
                    onClick={() => setAssetsType(assetTypeOption.value)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-right",
                      assetsType === assetTypeOption.value
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {assetTypeOption.image && (
                        <img
                          src={assetTypeOption.image}
                          alt={assetTypeOption.label}
                          className="w-12 h-12 rounded-lg object-contain border border-border"
                        />
                      )}
                      <div className="flex flex-col items-start">
                        <div className="text-sm font-medium">
                          {assetTypeOption.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {assetTypeOption.desc}
                        </div>
                      </div>
                    </div>
                    {assetsType === assetTypeOption.value && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500" />
              <label className="text-sm font-semibold">نسبت تصویر</label>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setAspectRatio("16:9")}
                className={cn(
                  "flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all",
                  aspectRatio === "16:9"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-accent/50"
                )}
              >
                <MonitorIcon className="w-6 h-6" />
                <span className="text-sm font-medium">16:9</span>
              </button>

              <button
                onClick={() => setAspectRatio("1:1")}
                className={cn(
                  "flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all",
                  aspectRatio === "1:1"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-accent/50"
                )}
              >
                <SquareIcon className="w-6 h-6" />
                <span className="text-sm font-medium">1:1</span>
              </button>

              <button
                onClick={() => setAspectRatio("9:16")}
                className={cn(
                  "flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all",
                  aspectRatio === "9:16"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-accent/50"
                )}
              >
                <SmartphoneIcon className="w-6 h-6" />
                <span className="text-sm font-medium">9:16</span>
              </button>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={() => setIsSettingsOpen(false)}
            className="w-full h-12 text-base font-semibold rounded-xl gap-2"
          >
            تایید
          </Button>
        </div>
      </BottomSheet>

      {/* Model Selection Dialog */}
      <BottomSheet
        open={isModelSelectorOpen}
        onDismiss={() => setIsModelSelectorOpen(false)}
        defaultSnap={({ maxHeight }) => maxHeight * 0.9}
        snapPoints={({ maxHeight }) => [maxHeight * 0.9]}
        blocking={true}
        scrollLocking={true}
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">انتخاب مدل هوش مصنوعی</h2>
            <button
              className="rounded-full hover:bg-muted transition-colors"
              aria-label="بستن"
              onClick={() => setIsModelSelectorOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        }
        className="bottom-sheet"
      >
        <div className="flex flex-col gap-4 px-4 pb-8 mt-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="جستجو در مدل‌ها..."
              value={modelSearchQuery}
              onChange={(e) => setModelSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-xl border border-border bg-card outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Models List */}
          <div className="overflow-y-auto custom-scrollbar space-y-2">
            {isLoadingModels ? (
              <div className="flex items-center justify-center py-8">
                <Spinner />
              </div>
            ) : filteredModels.length > 0 ? (
              filteredModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setCurrentImageModel({
                      id: model.id,
                      slug: model.slug,
                      provider: model.provider,
                      name: model.name,
                      price: model.price,
                    });
                    setIsModelSelectorOpen(false);
                    setModelSearchQuery("");
                    toast.success(`مدل ${model.name} انتخاب شد`);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-right",
                    currentImageModel.id === model.id
                      ? "bg-primary/10 border border-primary"
                      : "hover:bg-accent/50 border border-border"
                  )}
                >
                  <img
                    src={
                      providerImages[model.provider.toLowerCase()] ||
                      providerImages.openai
                    }
                    alt={model.provider}
                    className="w-6 h-6 rounded"
                  />
                  <div className="flex flex-col items-start flex-1">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm font-medium">{model.name}</span>

                      <div className="flex items-center gap-2 text-primary">
                        <span className="text-sm mt-[2px]">{model.price}</span>
                        <GemIcon size={15} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize mb-2">
                      {model.provider}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <span>مدلی یافت نشد</span>
              </div>
            )}
          </div>
        </div>
      </BottomSheet>

      <CustomDialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        className="max-w-[95vw] md:max-w-4xl"
      >
        {selectedImage && (
          <div className="flex flex-col gap-4">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </CustomDialog>
    </div>
  );
}

export default CreateDesignPage;
