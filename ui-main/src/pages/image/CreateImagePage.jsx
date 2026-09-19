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
  Search,
  EyeIcon,
  GemIcon,
  X,
  AlertTriangleIcon,
} from "lucide-react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CustomDialog } from "@/components/ui/dialog";
import apiClient from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { getCreditIssue, toastFromApi, toastUserError } from "@/lib/userError";
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
import useAuth from "@/auth/useAuth";
import imagePlaceholder from "@/assets/img/Image-generated-placeholder.png";
import autoStyleImg from "@/assets/img/auto-style.png";
import photorealisticStyleImg from "@/assets/img/photorealistic-style.png";
import artisticStyleImg from "@/assets/img/artistic-style.png";
import animeStyleImg from "@/assets/img/anime-style.png";
import digitalArtStyleImg from "@/assets/img/digital_art-style.png";
import cinematicStyleImg from "@/assets/img/cinematic-style.png";
import creativeStyleImg from "@/assets/img/creative-style.png";
import dynamicStyleImg from "@/assets/img/dynamic-style.png";
import fashionStyleImg from "@/assets/img/fashion-style.png";
import portraitStyleImg from "@/assets/img/portrait-style.png";
import retroStyleImg from "@/assets/img/retro-style.png";
import vibrantStyleImg from "@/assets/img/vibrant-style.png";
import moodyStyleImg from "@/assets/img/moody-style.png";
import photographyStyleImg from "@/assets/img/photography-style.png";
import downloader from "@/lib/downloader";
import bytedanceImg from "@/assets/img/bytedance.png";
import fluxImg from "@/assets/img/flux.webp";

import "react-spring-bottom-sheet/dist/style.css";

const providerImages = {
  openai: openaiImg,
  anthropic: anthropicImg,
  google: googleImg,
  xai: xaiImg,
  hamdast: hamdastImg,
  myket: hamdastImg,
  bytedance: bytedanceImg,
  flux: fluxImg,
};

// Style presets by provider
const stylePresets = [
  {
    value: "auto",
    label: "Auto",
    desc: "انتخاب خودکار بهترین سبک",
  },
  {
    value: "photorealistic",
    label: "Photorealistic",
    desc: "عکاسی واقع‌گرایانه",
  },
  { value: "artistic", label: "Artistic", desc: "هنری و خلاقانه" },
  { value: "anime", label: "Anime", desc: "سبک انیمه ژاپنی" },
  { value: "digital_art", label: "Digital Art", desc: "هنر دیجیتال" },
  { value: "cinematic", label: "Cinematic", desc: "سبک سینمایی" },
  { value: "creative", label: "Creative", desc: "خلاقانه و نوآورانه" },
  { value: "dynamic", label: "Dynamic", desc: "پویا و پرانرژی" },
  { value: "fashion", label: "Fashion", desc: "سبک مد و فشن" },
  { value: "portrait", label: "Portrait", desc: "پرتره" },
  { value: "retro", label: "Retro", desc: "سبک رترو و کلاسیک" },
  { value: "vibrant", label: "Vibrant", desc: "زنده و پررنگ" },
  { value: "moody", label: "Moody", desc: "حال و هوای خاص" },
  { value: "photography", label: "Photography", desc: "عکاسی حرفه‌ای" },
];

const styleImageMap = {
  auto: autoStyleImg,
  photorealistic: photorealisticStyleImg,
  artistic: artisticStyleImg,
  anime: animeStyleImg,
  digital_art: digitalArtStyleImg,
  cinematic: cinematicStyleImg,
  creative: creativeStyleImg,
  dynamic: dynamicStyleImg,
  fashion: fashionStyleImg,
  portrait: portraitStyleImg,
  retro: retroStyleImg,
  vibrant: vibrantStyleImg,
  moody: moodyStyleImg,
  photography: photographyStyleImg,
};

const styleCarouselPresets = stylePresets.filter(
  (preset) => styleImageMap[preset.value]
);

function CreateImagePage() {
  const lastProcessedLocationKey = useRef(null);
  const containerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser } = useAuth();

  const [currentImageModel, setCurrentImageModel] = useAtom(
    currentImageModelAtom
  );
  const [, setShowReachLimitPricingSheet] = useAtom(showHintAlertModalAtom);
  const [, setHasTitleReachLimitPricingSheet] = useAtom(
    hasTitleReachLimitPricingSheetAtom
  );
  const [models, setModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [prompt, setPrompt] = useState(location.state?.initialPrompt || "");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("auto");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  useEffect(() => {
    // Update style when model changes
    const provider = currentImageModel.provider?.toLowerCase();
    if (provider === "google") {
      setStyle("auto");
    } else {
      setStyle("auto");
    }
  }, [currentImageModel]);

  const loadModels = async () => {
    setIsLoadingModels(true);

    const { data, ok } = await apiClient.get("/models?type=image");
    setIsLoadingModels(false);

    if (!ok) return toastUserError(data?.message, "خطا در بارگذاری مدل‌ها");

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

    const response = await apiClient.post("/images/generate", {
      modelSlug: currentImageModel.slug,
      prompt: prompt.trim(),
      config: {
        aspectRatio,
        style,
        generationCount: 1,
      },
    });
    const { data, ok, problem, status } = response;

    setIsGenerating(false);

    if (!ok) {
      const creditIssue = getCreditIssue(data);
      if (creditIssue === "insufficient" || creditIssue === "price_missing") {
        setShowReachLimitPricingSheet(true);
        setHasTitleReachLimitPricingSheet(true);
        return;
      }
      // اگر پاسخ سرور خطا بود ولی generation داخلش هست، به کاربر بگو از تاریخچه چک کند
      if (data?.generation?.images?.length) {
        toast.error(
          "پاسخ سرور با خطا برگشت، اما تصویر احتمالا در تاریخچه ذخیره شده. لطفا چند لحظه بعد بخش تاریخچه را چک کنید."
        );
        return;
      }

      if (problem === "TIMEOUT_ERROR" || status === 408 || status === 504) {
        toast.error(
          "زمان پاسخ‌دهی هنگام تولید تصویر به پایان رسید. اگر تصویر در تاریخچه ظاهر شد، تولید موفق بوده است."
        );
        return;
      }
      if (problem === "NETWORK_ERROR" || problem === "CONNECTION_ERROR") {
        toast.error(
          "اتصال هنگام تولید تصویر برقرار نشد. اگر بعد از وصل شدن اینترنت تصویر در تاریخچه ظاهر شد، تولید موفق بوده است."
        );
        return;
      }

      toastFromApi(response, "خطا در تولید تصویر");
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
      className="flex flex-col gap-2 pb-4 h-full overflow-y-auto"
    >
      {/* Generated Images or Demo Image */}
      <div className="shrink-0 flex justify-center items-center">
        {generatedImages.length > 0 ? (
          <div className="space-y-4 mt-4 w-full max-w-4xl">
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
          <div className="w-full max-w-2xl space-y-4 mt-4">
            <div className="relative rounded-xl overflow-hidden border border-border bg-secondary aspect-video flex items-center justify-center">
              <img
                src={imagePlaceholder}
                alt="Demo Image"
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  isGenerating ? "opacity-20" : "opacity-100"
                )}
              />
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-transparent" />

              {/* Loading Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center gap-2 rounded-xl px-4 py-3 bg-white/85 dark:bg-card/95 backdrop-blur-sm border border-primary/20 dark:border-primary/30 shadow-md">
                    <Spinner className="w-6 h-6 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      در حال تولید تصویر...
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

      <div className="flex items-center justify-between ">
        <button
          type="button"
          onClick={() => navigate("/image/history")}
          className="flex flex-row-reverse items-center gap-2 px-2 py-1 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all shadow-sm hover:shadow-md group ml-3"
        >
          <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
            تاریخچه
          </span>
          <History className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

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

      {/* Style Presets Slider */}
      {styleCarouselPresets.length > 0 && (
        <div>
          <style>{`
            .style-presets-swiper .swiper-slide {
              height: auto;
            }
          `}</style>

          <Swiper
            dir="rtl"
            className="style-presets-swiper"
            spaceBetween={0.5}
            slidesPerView={2.5}
            breakpoints={{
              480: { slidesPerView: 3.5, spaceBetween: 6 },
              640: { slidesPerView: 4.8, spaceBetween: 8 },
              768: { slidesPerView: 6, spaceBetween: 10 },
              1024: { slidesPerView: 7, spaceBetween: 12 },
              1280: { slidesPerView: 7.5, spaceBetween: 14 },
            }}
          >
            {styleCarouselPresets.map((preset) => {
              const image = styleImageMap[preset.value];
              const isActive = style === preset.value;

              return (
                <SwiperSlide
                  key={preset.value}
                  className="h-auto w-[110px]! sm:w-[130px]! md:w-[150px]! lg:w-[170px]!"
                >
                  <button
                    type="button"
                    onClick={() => setStyle(preset.value)}
                    className={cn(
                      "group w-full rounded-2xl border bg-card/60  transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                      isActive ? "border-primary " : "border-transparent"
                    )}
                  >
                    <div className="relative overflow-hidden rounded-xl aspect-square">
                      <img
                        src={image}
                        alt={preset.label}
                        className="h-full w-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-linear-to-t from-primary/40 via-transparent to-transparent" />
                      )}
                    </div>
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* Active Model Display */}
      <div className="space-y-4 flex flex-col shrink-0">
        <div className="flex gap-3 justify-start">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex flex-row items-center justify-between  px-3 py-1 rounded-xl border border-border bg-card transition-all shadow-sm hover:bg-accent/50 hover:shadow-md group"
          >
            <div className="flex flex-col items-start pl-2">
              <span className="text-[12px] font-medium text-muted-foreground">
                نسبت تصویر
              </span>

              <span className="text-sm font-semibold text-foreground">
                {aspectRatio}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <label className="text-sm font-semibold">
              پرامپت برای ساخت تصویر جدید :
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
            placeholder="تصویر مورد نظر خود را توضیح دهید..."
            className="w-full min-h-[100px] p-3! text-sm rounded-xl border border-border bg-card resize-none outline-none focus:border-primary transition-colors"
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
                در حال تولید تصویر...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                تولید تصویر
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
        defaultSnap={({ maxHeight }) => maxHeight * 0.5}
        snapPoints={({ maxHeight }) => [maxHeight * 0.5]}
        blocking={true}
        scrollLocking={true}
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">تنظیمات تولید تصویر</h2>
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

export default CreateImagePage;
