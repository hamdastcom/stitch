import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
} from "react";
import { toast } from "react-hot-toast";
import { useAtom } from "jotai";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MonitorIcon,
  SmartphoneIcon,
  Sparkles,
  History,
  Download,
  ChevronDown,
  Settings,
  Search,
  PlayCircle,
  Clock,
  GemIcon,
  X,
  AlertTriangleIcon,
} from "lucide-react";
import { BottomSheet } from "react-spring-bottom-sheet";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CustomDialog } from "@/components/ui/dialog";
import apiClient from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { getCreditIssue, toastUserError } from "@/lib/userError";
import { getVideoPrice } from "@/lib/getVideoPrice";
import {
  getVideoModelCapabilities,
  normalizeVideoConfig,
} from "@/lib/videoModelCapabilities";
import {
  currentVideoModelAtom,
  showHintAlertModalAtom,
  hasTitleReachLimitPricingSheetAtom,
} from "@/config/state";
import openaiImg from "@/assets/img/openai.png";
import googleImg from "@/assets/img/google.png";
import videoPlaceholder from "@/assets/img/Video-generated-placeholder.png";
import useAuth from "@/auth/useAuth";
import downloader from "@/lib/downloader";
import {
  getGenerationVideoUrl,
  getGenerationThumbnailUrl,
} from "@/lib/getGenerationMediaUrl";
import wanImg from "@/assets/img/wan.png";
import oviImg from "@/assets/img/ovi.jpg";
import kilingImg from "@/assets/img/kiling.png";
import falAIImg from "@/assets/img/fal-ai.png";
import longcatImg from "@/assets/img/longcat.png";
import hamdastImg from "/logo.png";

import "react-spring-bottom-sheet/dist/style.css";

const providerImages = {
  openai: openaiImg,
  google: googleImg,
  wan: wanImg,
  ovi: oviImg,
  kiling: kilingImg,
  "fal ai": falAIImg,
  longcat: longcatImg,
  hamdast: hamdastImg,
};

function CreateVideoPage() {
  const lastProcessedLocationKey = useRef(null);
  const containerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser } = useAuth();

  const [, setShowReachLimitPricingSheet] = useAtom(showHintAlertModalAtom);
  const [, setHasTitleReachLimitPricingSheet] = useAtom(
    hasTitleReachLimitPricingSheetAtom
  );
  const [currentVideoModel, setCurrentVideoModel] = useAtom(
    currentVideoModelAtom
  );
  const [models, setModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const [prompt, setPrompt] = useState(location.state?.initialPrompt || "");
  const [generationMode, setGenerationMode] = useState(
    location.state?.initialTab === "image" ? "image" : "text"
  );
  const [imageReferenceFile, setImageReferenceFile] = useState(null);
  const [imageReferenceUrl, setImageReferenceUrl] = useState(null);
  const [resolution, setResolution] = useState("720p");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedShowcaseVideo, setSelectedShowcaseVideo] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  const currentModelSlug = currentVideoModel?.slug;
  const currentProvider = currentVideoModel.provider?.toLowerCase() || "fal-ai";

  const availableModels = useMemo(() => {
    if (!models?.length) return [];
    if (generationMode === "image") {
      return models.filter(
        (model) => model.provider?.toLowerCase() === "openai"
      );
    }
    return models;
  }, [models, generationMode]);

  const filteredModels = useMemo(() => {
    const query = modelSearchQuery.toLowerCase();
    return availableModels.filter(
      (model) =>
        model.name.toLowerCase().includes(query) ||
        model.provider.toLowerCase().includes(query)
    );
  }, [availableModels, modelSearchQuery]);

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

  useLayoutEffect(() => {
    // Set initial prompt and tab from navigation state
    const initialPrompt = location.state?.initialPrompt;
    const initialTab = location.state?.initialTab;

    if (initialPrompt || initialTab) {
      // Create a unique key for this navigation
      const navigationId = location.key
        ? `${location.pathname}-${location.key}`
        : `${location.pathname}-${Date.now()}`;
      const lastKey = lastProcessedLocationKey.current;

      // Only process if this is a new navigation
      if (lastKey !== navigationId) {
        // Store values before navigation clears state
        if (initialPrompt !== undefined) {
          setPrompt(initialPrompt);
        }
        if (initialTab !== undefined) {
          setGenerationMode(initialTab === "image" ? "image" : "text");
        }
        lastProcessedLocationKey.current = navigationId;

        // Clear the state after using it to prevent re-setting
        // Use requestAnimationFrame to ensure state updates are queued first
        requestAnimationFrame(() => {
          navigate(location.pathname, { replace: true, state: {} });
        });
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    if (
      generationMode !== "image" &&
      (imageReferenceFile || imageReferenceUrl || imagePreviewUrl)
    ) {
      if (imagePreviewUrl && !imageReferenceUrl) {
        // Only revoke if it's a local object URL, not a server URL
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImageReferenceFile(null);
      setImageReferenceUrl(null);
      setImagePreviewUrl(null);
    }
  }, [generationMode, imageReferenceUrl]);

  useEffect(() => {
    if (!modelsLoaded) return;

    if (generationMode === "image" && availableModels.length === 0) {
      toast.error("هیچ مدلی برای حالت تصویر یافت نشد");
      setGenerationMode("text");
      return;
    }

    if (!availableModels.length) return;

    const existing = availableModels.find(
      (model) => model.slug === currentModelSlug
    );

    if (!existing) {
      const fallback = availableModels[0];
      setCurrentVideoModel({
        id: fallback.id,
        slug: fallback.slug,
        provider: fallback.provider,
        name: fallback.name,
        price: fallback.price,
      });
    }
  }, [
    availableModels,
    currentModelSlug,
    generationMode,
    modelsLoaded,
    setCurrentVideoModel,
  ]);

  const videoCaps = useMemo(
    () => getVideoModelCapabilities(currentVideoModel?.slug),
    [currentVideoModel?.slug]
  );

  const selectedModelBasePrice = useMemo(() => {
    const fromList = models.find(
      (model) => model.slug === currentVideoModel?.slug
    )?.price;
    return fromList ?? currentVideoModel?.price ?? null;
  }, [models, currentVideoModel?.slug, currentVideoModel?.price]);

  // Keep options aligned with what this fal model actually supports
  useEffect(() => {
    if (!videoCaps) return;

    const normalized = normalizeVideoConfig(currentVideoModel?.slug, {
      duration,
      resolution,
      aspectRatio,
    });
    if (!normalized) return;

    if (normalized.duration !== duration) setDuration(normalized.duration);
    if (normalized.aspectRatio !== aspectRatio)
      setAspectRatio(normalized.aspectRatio);
    if ((normalized.resolution ?? "") !== (resolution ?? "")) {
      setResolution(normalized.resolution || videoCaps.defaultResolution || "1080p");
    }
  }, [videoCaps, currentVideoModel?.slug, duration, resolution, aspectRatio]);

  const loadModels = async () => {
    setIsLoadingModels(true);
    const { data, ok } = await apiClient.get("/models?type=video");
    setIsLoadingModels(false);
    setModelsLoaded(true);

    if (!ok) return toastUserError(data?.message, "خطا در بارگذاری مدل‌ها");

    setModels(data.models || []);

    // Set first model as default if current model not found
    if (data.models.length > 0 && !currentVideoModel.slug) {
      setCurrentVideoModel({
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
    setGeneratedVideo(null);
    setProgress(0);

    try {
      let imageRef = imageReferenceUrl || null;

      // Upload local image first (JSON generate body is reliable; multipart needs multer)
      if (imageReferenceFile) {
        const uploadForm = new FormData();
        uploadForm.append("image", imageReferenceFile);
        const { data: uploadData, ok: uploadOk } = await apiClient.post(
          "/upload/image",
          uploadForm
        );
        if (!uploadOk || !uploadData?.url) {
          setIsGenerating(false);
          return toastUserError(uploadData?.message, "خطا در آپلود تصویر مرجع");
        }
        imageRef = uploadData.url;
      }

      const normalized = normalizeVideoConfig(currentVideoModel.slug, {
        duration,
        resolution,
        aspectRatio,
      });

      if (!normalized) {
        setIsGenerating(false);
        return toast.error("این مدل برای تولید ویدیو پیکربندی نشده است");
      }

      const { data, ok } = await apiClient.post("/videos/generate", {
        modelSlug: currentVideoModel.slug,
        prompt: prompt.trim(),
        mode: generationMode,
        config: normalized,
        imageReference: imageRef,
      });

      if (!ok) {
        setIsGenerating(false);

        const creditIssue = getCreditIssue(data);
        if (creditIssue === "insufficient") {
          setShowReachLimitPricingSheet(true);
          setHasTitleReachLimitPricingSheet(true);
          return;
        }

        if (creditIssue === "price_missing") {
          return toast.error(
            "قیمت این تنظیمات ویدیو یافت نشد. مدل یا مدت و کیفیت را تغییر دهید."
          );
        }

        return toastUserError(data?.message, "خطا در تولید ویدیو");
      }

      // Credits update immediately after queue accept (no wait for fal)
      if (data?.remaining !== undefined) {
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
              remaining: data.remaining,
            },
          };
        });
      }

      if (!data.id) {
        setIsGenerating(false);
        return toast.error("خطا در دریافت شناسه تولید ویدیو");
      }

      setProgress(10);
      toast.success(data?.message || "ویدیو در حال تولید است");

      const videoId = data.id;
      const pollStartedAt = Date.now();
      const POLL_TIMEOUT_MS = 20 * 60 * 1000;
      let consecutiveStatusFailures = 0;

      // Poll status — generate API returns immediately; progress lives in DB
      while (true) {
        if (Date.now() - pollStartedAt > POLL_TIMEOUT_MS) {
          setIsGenerating(false);
          toast.error(
            "زمان انتظار تولید ویدیو به پایان رسید. وضعیت را در تاریخچه بررسی کنید."
          );
          break;
        }

        const { data: statusData, ok: statusOk } = await apiClient.get(
          `/videos/status/${videoId}`
        );

        const status = statusData?.status;
        const progressValue = Number(statusData?.progress);

        if (status === "completed") {
          setIsGenerating(false);
          setProgress(100);
          const playUrl = getGenerationVideoUrl({
            videoS3Url: statusData.videoS3Url,
            videoUrl: statusData.videoUrl,
          });
          const thumbUrl = getGenerationThumbnailUrl({
            thumbnailS3Url: statusData.thumbnailS3Url,
            thumbnailUrl: statusData.thumbnailUrl,
          });
          if (!playUrl) {
            toast.error(
              "ویدیو تولید شد اما لینک پخش در دسترس نیست. تاریخچه را بررسی کنید."
            );
            break;
          }
          setGeneratedVideo({
            videoS3Url: playUrl,
            thumbnailS3Url: thumbUrl,
            prompt: statusData.prompt,
            config: statusData.config,
          });
          toast.success("ویدیو با موفقیت تولید شد");
          break;
        }

        if (status === "error") {
          setIsGenerating(false);
          toastUserError(statusData?.errorMessage, "خطا در تولید ویدیو");
          break;
        }

        // Transient network / gateway blips must not abort a long generation.
        if (!statusOk || !status) {
          consecutiveStatusFailures += 1;
          console.warn(
            "[video-gen] status poll failed",
            consecutiveStatusFailures,
            statusData?.message
          );
          if (consecutiveStatusFailures >= 5) {
            setIsGenerating(false);
            toastUserError(
              statusData?.message,
              "خطا در دریافت وضعیت ویدیو. وضعیت را در تاریخچه بررسی کنید."
            );
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 3000));
          continue;
        }

        consecutiveStatusFailures = 0;

        if (Number.isFinite(progressValue)) {
          setProgress(progressValue);
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      setIsGenerating(false);
      toastUserError(error, "خطا در تولید ویدیو");
    }
  };

  const handleDownload = async (videoS3Url) => {
    downloader(videoS3Url);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-4 pb-4 h-full overflow-y-auto"
    >
      {isGenerating && <div className="fixed inset-0 z-50 cursor-wait" />}

      {/* Generated Video or Demo Video */}
      <div className="shrink-0 flex justify-center items-center">
        {generatedVideo ? (
          <div className="space-y-3 mt-4 w-full max-w-4xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">ویدیو تولید شده</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSelectedShowcaseVideo({
                      url: generatedVideo.videoS3Url,
                      thumbnailUrl: generatedVideo.thumbnailS3Url,
                    })
                  }
                  className="gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  مشاهده
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(generatedVideo.videoS3Url)}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  دانلود
                </Button>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden border border-border bg-secondary ">
              <video
                controls
                controlsList="nodownload"
                className="w-full max-h-[215px]"
                src={generatedVideo.videoS3Url}
                poster={generatedVideo.thumbnailS3Url}
              >
                مرورگر شما از پخش ویدیو پشتیبا نی نمی‌کند.
              </video>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-3 mt-4">
            <div className="relative rounded-xl overflow-hidden border border-border bg-secondary aspect-video flex items-center justify-center">
              <img
                src={videoPlaceholder}
                alt="Demo Video"
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  isGenerating ? "opacity-20" : "opacity-100"
                )}
              />

              {/* Loading Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center gap-2 rounded-xl px-5 py-3 bg-white/90 dark:bg-card/95 backdrop-blur-sm border border-primary/20 dark:border-primary/30 shadow-lg min-w-[280px] max-w-[320px]">
                    <Spinner className="w-5 h-5 text-primary" />

                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <span className="text-sm font-semibold text-primary text-center">
                        در حال تولید ویدیو... ({progress}%)
                      </span>

                      <div className="flex flex-col items-center gap-1 mt-1.5 pt-1.5 border-t border-gray-200 dark:border-gray-700 w-full">
                        <span className="text-xs text-muted-foreground text-center">
                          زمان تقریبی: ۲ تا ۴ دقیقه
                        </span>
                      </div>
                    </div>
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
          درهنگام تولید ویدیو از صفحه خارج نشوید
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
              onClick={() => navigate("/video/history")}
              className="flex items-center gap-2 py-2.5"
            >
              <History className="w-4 h-4" />
              <span className="text-xs">تاریخچه</span>
            </p>
          </div>

          <button
            onClick={() => setIsModelSelectorOpen(true)}
            className="flex flex-row-reverse items-center px-2 py-1 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all shadow-sm hover:shadow-md group"
          >
            {currentVideoModel?.name ? (
              <>
                <img
                  src={providerImages[currentProvider] || providerImages.hamdast}
                  alt={currentVideoModel.provider}
                  className={cn(
                    "w-5 h-5 rounded",
                    ["openai", "xai"].includes(currentProvider) && "bg-white"
                  )}
                />
                <div className="flex flex-col items-start ml-2">
                  <span className="text-[12px] font-semibold text-foreground">
                    {currentVideoModel.name}
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
        <div className="grid grid-cols-3 gap-3">
          {videoCaps &&
            !videoCaps.aspectRatioLocked &&
            videoCaps.aspectRatios?.length > 1 && (
            <div
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card/50 cursor-pointer hover:bg-card transition-colors"
            >
              {aspectRatio === "16:9" ? (
                <MonitorIcon className="w-4 h-4 text-blue-500" />
              ) : (
                <SmartphoneIcon className="w-4 h-4 text-green-500" />
              )}
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  نسبت تصویر
                </span>
                <span className="text-sm font-semibold">{aspectRatio}</span>
              </div>
            </div>
          )}
          <div
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card/50 cursor-pointer hover:bg-card transition-colors"
          >
            <Clock className="w-4 h-4 text-purple-500" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">مدت زمان</span>
              <span className="text-sm font-semibold">{duration}s</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <label className="text-sm font-semibold">
              پرامپت برای ساخت ویدیو جدید :
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
            placeholder="ویدیو مورد نظر خود را توضیح دهید... (مثلاً: یک ویدیو سینمایی از غروب آفتاب در کنار دریا)"
            className="w-full min-h-[140px] text-sm p-3! rounded-xl border border-border bg-card resize-none outline-none focus:border-primary transition-colors"
            disabled={isGenerating}
            maxLength={2000}
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{prompt.length}/2000 کاراکتر</span>
            <span className="text-primary">حداقل ۱۰ کاراکتر</span>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={
              isGenerating || !prompt.trim() || prompt.trim().length < 10
            }
            className="w-full h-14 text-base font-semibold rounded-xl gap-2 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {isGenerating ? (
              <>
                <Spinner className="w-5 h-5" />
                <span>در حال تولید ویدیو... ({progress}%)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                تولید ویدیو
                {currentVideoModel &&
                  (() => {
                    const price = getVideoPrice({
                      model: currentVideoModel.slug,
                      duration,
                      resolution,
                      basePrice: selectedModelBasePrice,
                    });

                    if (!price) return null;

                    return (
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-sm mt-[2px]">{price}</span>
                        <GemIcon size={15} />
                      </div>
                    );
                  })()}
              </>
            )}
          </Button>
        </div>
      </div>

      <BottomSheet
        open={isSettingsOpen}
        onDismiss={() => setIsSettingsOpen(false)}
        defaultSnap={({ maxHeight }) => maxHeight * 0.9}
        snapPoints={({ maxHeight }) => [maxHeight * 0.9]}
        blocking={true}
        scrollLocking={true}
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">تنظیمات تولید ویدیو</h2>
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
                src={providerImages[currentProvider] || providerImages.hamdast}
                alt={currentVideoModel.provider}
                className={cn(
                  "w-8 h-8 rounded",
                  currentProvider === "openai" && "bg-white p-1"
                )}
              />
              <div className="flex flex-col items-start flex-1">
                <span className="text-sm font-semibold">
                  {currentVideoModel.name}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {currentVideoModel.provider}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Aspect Ratio — only ratios this model supports */}
          {videoCaps &&
            !videoCaps.aspectRatioLocked &&
            videoCaps.aspectRatios?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500" />
                <label className="text-sm font-semibold">نسبت تصویر</label>
              </div>

              <div
                className={cn(
                  "grid gap-3",
                  videoCaps.aspectRatios.length <= 2
                    ? "grid-cols-2"
                    : "grid-cols-3"
                )}
              >
                {videoCaps.aspectRatios.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={cn(
                      "flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all",
                      aspectRatio === ratio
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-accent/50"
                    )}
                  >
                    {ratio === "9:16" ? (
                      <SmartphoneIcon className="w-6 h-6" />
                    ) : (
                      <MonitorIcon className="w-6 h-6" />
                    )}
                    <span className="text-sm font-medium">{ratio}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Video Duration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <label className="text-sm font-semibold">مدت زمان ویدیو</label>
            </div>

            <div
              className={cn(
                "grid gap-3",
                (videoCaps?.durations?.length || 3) <= 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              )}
            >
              {(videoCaps?.durations || [5, 10]).map((dur) => (
                <button
                  key={dur}
                  onClick={() => setDuration(dur)}
                  className={cn(
                    "flex items-center justify-center py-4 rounded-xl border text-xl font-bold transition-all",
                    duration === dur
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-accent/50"
                  )}
                >
                  {dur}s
                </button>
              ))}
            </div>
          </div>

          {/* Resolution — hidden when model has no resolution control (e.g. Kling) */}
          {videoCaps?.resolutions?.length > 1 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <label className="text-sm font-semibold">رزولوشن</label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {videoCaps.resolutions.map((res) => (
                      <button
                        key={res}
                        onClick={() => setResolution(res)}
                        className={cn(
                          "flex items-center justify-center py-4 rounded-xl border text-base font-bold transition-all uppercase",
                          resolution === res
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:bg-accent/50"
                        )}
                      >
                        {res}
                      </button>
                    ))}
                </div>
              </div>
            )}
          {videoCaps?.resolutions?.length === 1 && (
            <div className="text-xs text-muted-foreground text-center">
              رزولوشن این مدل: {videoCaps.resolutions[0]}
            </div>
          )}
          {videoCaps && videoCaps.resolutions == null && (
            <div className="text-xs text-muted-foreground text-center">
              این مدل رزولوشن قابل انتخاب ندارد
            </div>
          )}

          {/* Confirm Button */}
          <Button
            onClick={() => setIsSettingsOpen(false)}
            className="w-full h-12 text-base font-semibold rounded-xl gap-2"
          >
            تایید
          </Button>
        </div>
      </BottomSheet>

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
                    setCurrentVideoModel({
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
                    currentVideoModel.id === model.id
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
                    <p className="text-xs text-muted-foreground">
                      {model.description}
                    </p>
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
        open={!!selectedShowcaseVideo}
        onOpenChange={(open) => !open && setSelectedShowcaseVideo(null)}
        className="max-w-[95vw] md:max-w-4xl"
      >
        {selectedShowcaseVideo && (
          <div className="flex flex-col gap-4">
            <video
              controls
              controlsList="nodownload"
              autoPlay
              className="w-full rounded-lg"
              src={selectedShowcaseVideo.url}
              poster={selectedShowcaseVideo.thumbnailUrl}
            >
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
          </div>
        )}
      </CustomDialog>
    </div>
  );
}

export default CreateVideoPage;
