import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, History, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { CustomDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import apiClient from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import textToVideoLightImg from "@/assets/img/text-to-video-light.png";
import textToVideoDarkImg from "@/assets/img/text-to-video-dark.png";
import imageToVideoLightImg from "@/assets/img/image-to-video-light.png";
import imageToVideoDarkImg from "@/assets/img/image-to-video-dark.png";
import VideoDetailDialog from "@/components/VideoDetailDialog";
import {
  getGenerationVideoUrl,
  getGenerationThumbnailUrl,
} from "@/lib/getGenerationMediaUrl";

import "swiper/css";
import "swiper/css/free-mode";
import "react-spring-bottom-sheet/dist/style.css";
import "react-lazy-load-image-component/src/effects/blur.css";

// Generate prompt based on category
const getPromptForCategory = (category) => {
  const prompts = {
    بیزینس:
      "یک ویدیو حرفه‌ای برای کسب‌وکار با محتوای تجاری و جذاب، مناسب برای نمایش محصول یا خدمات",
    خلاقانه:
      "یک ویدیو خلاقانه و هنرمندانه با ایده‌های نوآورانه و تصاویر بصری جذاب",
    "شبکه های اجتماعی":
      "یک ویدیو کوتاه و پرمحتوا مناسب برای شبکه‌های اجتماعی با جلوه‌های بصری جذاب",
  };
  return (
    prompts[category] || "یک ویدیو زیبا و با کیفیت با محتوای جذاب و خلاقانه"
  );
};

// Showcase videos with categories
const showcaseVideosByCategory = [
  {
    category: "انیمه",
    videos: [
      {
        id: 17,
        videoS3Url: "1-Anime.mp4",
        videoThumbnailS3Url: "video-1-thumbnail.png",
        prompt:
          "یک انیمیشن انیمه از یک نوجوان با چشم‌های بزرگ و درخشان بساز که هدفون به گوش دارد و با شنیدن آهنگ مورد علاقه‌اش، موهایش در هوا شناور می‌شود و هاله‌های نورانی صورتی و آبی اطرافش ظاهر می‌شود. از افکت‌های معمول انیمه مانند خطوط سرعت، بک‌گراند متحرک و حالت‌های چهره اغراق‌آمیز همراه با درخشش چشم‌ها استفاده کن.",
        duration: "5 ثانیه",
      },
      {
        id: 18,
        videoS3Url: "2-Anime.mp4",
        videoThumbnailS3Url: "video-2-thumbnail.png",
        prompt:
          "یک انیمیشن انیمه از یک صحنه تبدیل قدرت بساز که در آن یک دانش‌آموز معمولی با چرخش و درخشش نورهای سایبرپانک به یک قهرمان با لباس فوق‌العاده تبدیل می‌شود. از افکت‌های براق، نورهای نئونی، پارتیکل‌های درخشان و زاویه‌های دوربین دراماتیک همراه با شخصیت‌پردازی کلاسیک انیمه استفاده کن",
        duration: "5 ثانیه",
      },
      {
        id: 19,
        videoS3Url: "3-Anime.mp4",
        videoThumbnailS3Url: "video-3-thumbnail.png",
        prompt:
          "یک انیمیشن انیمه از مسابقه بین دو شخصیت بساز که با سرعت غیرطبیعی در خیابان‌های شهری نئونی می‌دوند. با هر قدم، خطوط سرعت و اثرات محوشدگی پس‌زمینه ایجاد می‌شود و چهره‌ها با حالت‌های مصمم و چشم‌های درخشان نمایش داده می‌شوند. از تغییرات ناگهانی زاویه دوربین، رنگ‌های زنده و سایه‌های شارپ به سبک انیمه استفاده کن.",
        duration: "5 ثانیه",
      },
      {
        id: 20,
        videoS3Url: "4-Anime.mp4",
        videoThumbnailS3Url: "video-4-thumbnail.png",
        prompt:
          "یک انیمیشن انیمه از یک صحنه احساسی بساز که در آن یک نوجوان زیر باران ایستاده و قطرات باران به آرامی روی چتر او می‌بارند. ناگهان با دیدن دوستش، چهره‌اش روشن می‌شود و هاله‌ای از نور و گل‌های گیلاس شناور اطرافشان ظاهر می‌شود. از افکت‌های لنز فلر، بوکه، سایه‌زنی خاص انیمه و رنگ‌های پاستلی استفاده کن",
        duration: "۵ ثانیه",
      },
 
    ],
  },
  {
    category: "پیکسلی",
    videos: [
      {
        id: 1,
        videoS3Url: "1-Pixelated.mp4",
        videoThumbnailS3Url: "new-video-7-thumbnail.png",
        prompt:
          "سبک پیکسلی، نیویورک منهتن پیکسلی، هلیکوپتری که بین آسمان‌خراش‌ها رفت و آمد می‌کنند در فضای دو بعدی",
        duration: "5 ثانیه",
      },
      {
        id: 2,
        videoS3Url: "2-Pixelated.mp4",
        videoThumbnailS3Url: "video-8-thumbnail.png",
        prompt:
          "یک لوپ پیکسل آرت از یک اتاق نوجوان طراحی کن که در آن وسایل جان می‌گیرند - هدفون‌ها با ریتم موسیقی تکان می‌خورند، کتاب‌ها صفحات‌شان را ورق می‌زنند و گوشی‌ای که شناور است با انفجار ذرات ایموجی. از پالت رنگ پاستلی با ترانزیشن‌های پیکسلی لوفای استفاده کن",
        duration: "5 ثانیه",
      },
      {
        id: 3,
        videoS3Url: "3-Pixelated.mp4",
        videoThumbnailS3Url: "video-9-thumbnail.png",
        prompt:
          "یک انیمیشن پیکسل آرت از معجونی جادویی که در دیگی مخلوط می‌شود و به بارانی از حیوانات خانگی پیکسلی بامزه و آب‌نبات تبدیل می‌شود، ایجاد کن. افکت‌های درخشان و ذرات حبابی تغییر رنگ دهنده با افکت‌های صوتی چیپ‌تیون را شامل کن",
        duration: "5 ثانیه",
      },
      {
        id: 4,
        videoS3Url: "4-Pixelated.mp4",
        videoThumbnailS3Url: "video-10-thumbnail.png",
        prompt:
          "یک انیمیشن پیکسل آرت از توالی تبدیل یک کوله‌پشتی معمولی به یک روبات همراه که هایفایو می‌دهد، ایجاد کن. از رنگ‌های اصلی جسورانه با افکت‌های دود پیکسلی و صداهای مرحله بالا رفتن بازی‌های رترو استفاده کن",
        duration: "۵ ثانیه",
      },
 
      // {
      //   id: 6,
      //   videoS3Url: "video-12.mp4",
      //   videoThumbnailS3Url: "video-12-thumbnail.png",
      //   prompt:
      //     "یک انیمیشن پیکسل آرت از یک گوشی هوشمند ایجاد کن که مانند یک پورتال باز می‌شود و موجودات پیکسلی را آزاد می‌کند که اطراف می‌رقصند، قبل از اینکه یک شکل قلب تشکیل دهند و دوباره به داخل گوشی بپرند. از طراحی‌های شخصیت به سبک کاوایی با افکت‌های صوتی ترکیدن حباب استفاده کن.",
      //   duration: "۵ ثانیه",
      // },
    ],
  },
  {
    category: "سینماتیک",
    videos: [
      {
        id: 22,
        videoS3Url: "1-Cinematic.mp4",
        videoThumbnailS3Url: "video-13-thumbnail.png",
        prompt:
          "یک ویدیوی سینماتیک از نوجوانان در حال پرش روی تخته‌های اسکیت بساز که با حرکت آهسته فیلمبرداری شده است. دوربین به دور سوژه‌ها می‌چرخد و قطرات آب پاشیده شده در هوا را در برابر نور غروب طلایی به تصویر می‌کشد. از گرید رنگی سینمایی با تن‌های گرم، لنز فلر طبیعی و عمق میدان کم استفاده کن تا حس آزادی و لحظات ناب نوجوانی را نشان دهی",
        duration: "5 ثانیه",
      },
      {
        id: 23,
        videoS3Url: "2-Cinematic.mp4",
        videoThumbnailS3Url: "video-14-thumbnail.png",
        prompt:
          "یک ویدیوی سینماتیک از نمای نزدیک دست‌های نوجوانی بساز که به آرامی صفحات یک کتاب قدیمی را ورق می‌زند. نور طبیعی از پنجره به صورت نرم بر روی صفحات می‌تابد و گرد و غبار معلق در هوا را روشن می‌کند. از حرکت دالی آرام دوربین استفاده کن که از دست‌ها به سمت چهره متفکر و چشم‌های کنجکاو نوجوان حرکت می‌کند.",
        duration: "5 ثانیه",
      },
      {
        id: 24,
        videoS3Url: "3-Cinematic.mp4",
        videoThumbnailS3Url: "video-15-thumbnail.png",
        prompt:
          "یک ویدیوی سینماتیک از نوجوانان در یک کافه شهری بساز که از پشت شیشه‌های باران خورده فیلمبرداری شده است. قطرات باران روی شیشه، تصاویر را تار و رویایی می‌کند و نورهای شهر در هر قطره می‌درخشند. از تکنیک رک فوکوس استفاده کن که بین قطرات باران و چهره‌های خندان داخل کافه حرکت می‌کند، همراه با پالت رنگی سرد و آبی برای بیرون و گرم و زرد برای داخل کافه",
        duration: "5 ثانیه",
      },
      {
        id: 26,
        videoS3Url: "4-Cinematic.mp4",
        videoThumbnailS3Url: "video-16-thumbnail.png",
        prompt:
          "یک ویدیوی سینماتیک از حرکت آرام دوربین روی میز مطالعه یک نوجوان بساز که پر از یادداشت‌ها، عکس‌ها و وسایل شخصی است. دوربین با دقت و ظرافت از روی هر آیتم حرکت می‌کند و داستانی شخصی را روایت می‌کند. از نورپردازی کلیدی نرم با سایه‌های عمیق استفاده کن که احساس صمیمیت و کشف را القا می‌کند",
        duration: "۵ ثانیه",
      },

    ],
  },
  {
    category: "مینیمال",
    videos: [
      {
        id: 13,
        videoS3Url: "1-Minimal.mp4",
        videoThumbnailS3Url: "video-24-thumbnail.png",
        prompt:
          "یک انیمیشن مینیمال سینماتیک از یک قطره باران ایجاد کن که از یک سطح شیشه‌ای به آرامی سُر می‌خورد و مسیر حرکتش با خطوط سفید نازک و ظریف دنبال می‌شود. با هر حرکت قطره، رنگ‌های پاستلی محو به اطراف پخش می‌شوند و بازتاب‌های مینیمال از دنیای بیرون به شکل اشکال هندسی ساده در قطره نمایان می‌شوند. با عمق میدان کم و نورپردازی نرم، همراه با صدای آرام باران",
        duration: "5 ثانیه",
      },
      {
        id: 14,
        videoS3Url: "2-Minimal.mp4",
        videoThumbnailS3Url: "video-25-thumbnail.png",
        prompt:
          "یک انیمیشن مینیمال سینماتیک از سیلوئت یک نوجوان بساز که در برابر پنجره‌ای بزرگ ایستاده و به آسمان نگاه می‌کند. ابرهای سفید مینیمالیستی آرام می‌گذرند و به اشکال ساده و انتزاعی تغییر شکل می‌دهند که نشان‌دهنده رویاها و افکار هستند. از تضاد سایه‌ها و نور طبیعی با تن‌های رنگی بسیار محدود (سفید، خاکستری و یک رنگ اصلی) استفاده شود",
        duration: "5 ثانیه",
      },
      {
        id: 15,
        videoS3Url: "3-Minimal.mp4",
        videoThumbnailS3Url: "video-26-thumbnail.png",
        prompt:
          "یک ویدیوی مینیمال سینماتیک از دو دایره رنگی بساز که به آرامی به سمت یکدیگر حرکت می‌کنند. با نزدیک شدن آن‌ها، رنگ‌هایشان با یکدیگر ترکیب می‌شوند و هاله‌های رنگی ظریفی اطرافشان شکل می‌گیرد. وقتی کاملاً به هم می‌رسند، نور سفیدی منفجر می‌شود و به آرامی به شکل قلبی مینیمالیستی تبدیل می‌شود. با پس‌زمینه مشکی مخملی و نورپردازی داخلی که سایه‌های نرم ایجاد می‌کند",
        duration: "5 ثانیه",
      },
      {
        id: 16,
        videoS3Url: "4-Minimal.mp4",
        videoThumbnailS3Url: "video-27-thumbnail.png",
        prompt:
          "یک انیمیشن مینیمال سینماتیک از صفحه ساعتی بساز که به جای اعداد، نمادهای کوچک و ساده از فعالیت‌های روزانه را نشان می‌دهد. عقربه‌ها به نرمی حرکت می‌کنند و هر بار که به یک نماد می‌رسند، آن نماد به آرامی می‌درخشد و کمی بزرگ می‌شود. طراحی فوق‌العاده ساده با خطوط نازک، تن‌های رنگی محدود و عمق تصویر که با سایه‌های ظریف ایجاد می‌شود.",
        duration: "۵ ثانیه",
      },
    ],
  },
];

function VideoPage() {
  const pollingIntervalsRef = useRef({});
  const navigate = useNavigate();

  const [selectedShowcaseVideo, setSelectedShowcaseVideo] = useState(null);
  const [selectedVideoCategory, setSelectedVideoCategory] = useState(null);
  const [historyVideos, setHistoryVideos] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  // Polling for processing videos
  useEffect(() => {
    const processingVideos = historyVideos.filter(
      (video) => video.status === "processing" || video.status === "queued"
    );

    // Start polling for each processing video
    processingVideos.forEach((video) => {
      if (!pollingIntervalsRef.current[video.id]) {
        startPolling(video.id);
      }
    });

    // Cleanup: stop polling for videos that are no longer processing
    Object.keys(pollingIntervalsRef.current).forEach((videoId) => {
      const video = historyVideos.find((v) => String(v.id) === String(videoId));
      if (
        !video ||
        (video.status !== "processing" && video.status !== "queued")
      ) {
        stopPolling(videoId);
      }
    });

    // Cleanup on unmount
    return () => {
      Object.keys(pollingIntervalsRef.current).forEach((videoId) => {
        stopPolling(videoId);
      });
    };
  }, [historyVideos]);

  const checkVideoStatus = async (id) => {
    try {
      const { data, ok } = await apiClient.get(`/videos/status/${id}`);

      // Prefer body status even on non-OK responses so failed jobs don't poll forever
      if (data?.status === "completed" || data?.status === "error") {
        return data;
      }

      if (!ok) {
        console.error("Error checking video status:", data?.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error checking video status:", error);
      return null;
    }
  };

  const startPolling = (id) => {
    // Clear any existing polling for this video
    if (pollingIntervalsRef.current[id]) {
      clearInterval(pollingIntervalsRef.current[id]);
    }

    // Start polling every 6 seconds
    pollingIntervalsRef.current[id] = setInterval(async () => {
      const statusData = await checkVideoStatus(id);

      if (!statusData) {
        return;
      }

      // Update the video in historyVideos
      setHistoryVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === id
            ? {
                ...video,
                status: statusData.status,
                progress: statusData.progress || 0,
                videoS3Url:
                  statusData.videoS3Url ||
                  statusData.videoUrl ||
                  video.videoS3Url,
                thumbnailS3Url:
                  statusData.thumbnailS3Url ||
                  statusData.thumbnailUrl ||
                  video.thumbnailS3Url,
                videoUrl: statusData.videoUrl || video.videoUrl,
              }
            : video
        )
      );

      // If completed or error, stop polling
      if (statusData.status === "completed" || statusData.status === "error") {
        stopPolling(id);
      }
    }, 6000); // Poll every 6 seconds
  };

  const stopPolling = (id) => {
    if (pollingIntervalsRef.current[id]) {
      clearInterval(pollingIntervalsRef.current[id]);
      delete pollingIntervalsRef.current[id];
    }
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    const params = new URLSearchParams({
      page: "1",
      limit: "4",
    });

    const { data, ok } = await apiClient.get(`/videos/history?${params}`);
    setIsLoadingHistory(false);

    if (!ok) {
      return; // Silent fail for preview
    }

    setHistoryVideos(data.generations || []);
  };

  return (
    <div className="flex flex-col gap-6 py-4 ">
      <div className="flex flex-col gap-3 justify-center items-center">
        <div
          onClick={() =>
            navigate("/video-generate", { state: { initialTab: "text" } })
          }
          className="cursor-pointer w-1/2 rounded-3xl overflow-hidden bg-secondary/60 dark:bg-secondary/20 border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/40 aspect-square"
        >
          <img
            src={textToVideoLightImg}
            alt="تبدیل متن به ویدیو"
            effect="blur"
            className="w-full h-full object-contain dark:hidden"
            placeholderSrc="/video-placeholder.jpg"
          />
          <img
            src={textToVideoDarkImg}
            alt="تبدیل متن به ویدیو"
            effect="blur"
            className="hidden w-full h-full object-contain dark:block"
            placeholderSrc="/video-placeholder.jpg"
          />
        </div>
        <Button
          onClick={() =>
            navigate("/video-generate", { state: { initialTab: "text" } })
          }
          className="w-1/2"
        >
          تولید ویدیو
        </Button>
      </div>

      {/* Video History Section */}
      {isLoadingHistory ? (
        <div className="flex items-center justify-center py-8">
          <Spinner className="w-6 h-6" />
        </div>
      ) : historyVideos.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-lg font-extrabold">تاریخچه ویدیوها</h3>
            <Button
              variant="outline"
              onClick={() => navigate("/video/history")}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              تاریخچه بیشتر
            </Button>
          </div>

          <Swiper
            modules={[FreeMode]}
            spaceBetween={16}
            slidesPerView="auto"
            freeMode={true}
            dir="rtl"
            className="px-0!"
          >
            {historyVideos.map((generation, idx) => {
              const status = generation.status || "completed";
              const progress = generation.progress || 0;
              const isCompleted = status === "completed";
              const isProcessing =
                status === "processing" || status === "queued";
              const playUrl = getGenerationVideoUrl(generation);
              const thumbUrl = getGenerationThumbnailUrl(generation);

              return (
                <SwiperSlide key={idx} className="w-[140px]! py-2">
                  <div
                    onClick={() => {
                      // Only allow click if completed and playable
                      if (isCompleted && playUrl) {
                        setSelectedGeneration({
                          ...generation,
                          videoS3Url: playUrl,
                          thumbnailS3Url: thumbUrl,
                        });
                      }
                    }}
                    className={cn(
                      "group relative w-full rounded-xl overflow-hidden border border-border bg-card transition-all",
                      isCompleted
                        ? "cursor-pointer hover:shadow-lg"
                        : "cursor-default opacity-90"
                    )}
                  >
                    {/* Video Thumbnail/Preview */}
                    <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                      {isCompleted && thumbUrl ? (
                        <LazyLoadImage
                          src={thumbUrl}
                          className="w-full h-full object-cover"
                          effect="blur"
                          placeholderSrc="/video-placeholder.jpg"
                        />
                      ) : isCompleted && playUrl ? (
                        <video
                          src={playUrl}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => e.target.play()}
                          onMouseLeave={(e) => {
                            e.target.pause();
                            e.target.currentTime = 0;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center"></div>
                      )}

                      {/* Status Overlay */}
                      {isProcessing && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 px-3">
                          <Spinner className="w-6 h-6 text-white" />
                          <span className="text-xs font-semibold text-white text-center">
                            در حال ساختن
                          </span>
                          {progress > 0 && (
                            <div className="w-full max-w-[100px]">
                              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-primary h-full rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-white/80 text-center block mt-1">
                                {progress}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Play Icon Overlay on Hover (only for completed) */}
                      {isCompleted && playUrl && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white" />
                        </div>
                      )}

                      {/* Duration Badge (only for completed) */}
                      {isCompleted && generation.config?.duration && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-semibold">
                          {generation.config.duration}s
                        </div>
                      )}

                      {/* Status Badge (for processing) */}
                    </div>

                    {/* Info */}
                    <div className="p-3 bg-card">
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                        {generation.prompt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {isCompleted
                            ? generation.config?.duration
                              ? `${generation.config.duration}s`
                              : generation.config?.aspectRatio || "16:9"
                            : ""}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(generation.createdAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-extrabold">تاریخچه ویدیوها</h3>
          <div className="flex flex-col items-center justify-center py-12 text-center border border-border rounded-xl bg-card">
            <p className="text-base text-muted-foreground mb-4">
              هنوز ویدیویی ندارید
            </p>

            <Button
              onClick={() => navigate("/video-generate")}
              className="gap-2"
            >
              شروع ساخت ویدیو
            </Button>
          </div>
        </div>
      )}

      {/* Showcase Gallery */}
      <div className="space-y-6">
        <h3 className="text-lg font-extrabold ">ویدیوهای ساده و خلاقانه</h3>

        {showcaseVideosByCategory.map((category, categoryIndex) => (
          <div key={`category-${categoryIndex}`} className="space-y-3">
            <h4 className="text-base font-semibold">{category.category}</h4>
            <Swiper
              modules={[FreeMode]}
              spaceBetween={16}
              slidesPerView="auto"
              freeMode={true}
              dir="rtl"
              className="px-0!"
            >
              {category.videos.map((video, idx) => {
                const urlPrefix = "https://s3.hamdast.com/public/videos/demo/";

                return (
                  <SwiperSlide key={`video-${idx}`} className="w-[140px]!">
                    <div
                      onClick={() => {
                        setSelectedShowcaseVideo({
                          videoS3Url: `${urlPrefix}${video.videoS3Url}`,
                          prompt: video.prompt,
                        });
                        setSelectedVideoCategory(category.category);
                      }}
                      className="group relative w-full cursor-pointer bg-card hover:shadow-lg transition-all"
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-border">
                        <video
                          className="w-full h-full object-cover"
                          src={`${urlPrefix}${video.videoS3Url}`}
                          preload="metadata"
                          muted
                          playsInline
                          aria-hidden="true"
                          onLoadedMetadata={(event) => {
                            event.currentTarget.currentTime = Math.min(
                              0.1,
                              event.currentTarget.duration
                            );
                          }}
                        />

                        {/* Play Icon Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white" />
                        </div>

                        {/* Duration Overlay */}
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                          <span className="text-xs text-white font-medium">
                            {video.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        ))}
      </div>

      <CustomDialog
        open={!!selectedShowcaseVideo?.videoS3Url}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedShowcaseVideo(null);
            setSelectedVideoCategory(null);
          }
        }}
        className="max-w-[95vw] md:max-w-4xl"
      >
        {selectedShowcaseVideo?.videoS3Url && (
          <div className="flex flex-col gap-4">
            <video
              controls
              controlsList="nodownload"
              autoPlay
              className="w-full rounded-lg"
              src={selectedShowcaseVideo.videoS3Url}
            >
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
            <Button
              onClick={() => {
                const prompt =
                  selectedShowcaseVideo?.prompt ||
                  getPromptForCategory(selectedVideoCategory);
                navigate("/video-generate", {
                  state: { initialPrompt: prompt },
                });
              }}
              className="w-full gap-2"
            >
              <Sparkles className="w-4 h-4" />
              استفاده از این پرامپت
            </Button>
          </div>
        )}
      </CustomDialog>

      <VideoDetailDialog
        open={!!selectedGeneration}
        onOpenChange={() => setSelectedGeneration(null)}
        selectedGeneration={selectedGeneration}
        onDelete={() => {
          setSelectedGeneration(null);

          // remove from history videos
          setHistoryVideos((prev) =>
            prev.filter((gen) => gen.id !== selectedGeneration.id)
          );
        }}
      />
    </div>
  );
}

export default VideoPage;
