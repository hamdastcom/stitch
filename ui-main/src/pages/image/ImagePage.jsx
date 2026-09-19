import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { Sparkles, History, Download, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { CustomDialog } from "@/components/ui/dialog";
import { CustomAlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import apiClient from "@/lib/apiClient";
import { toastUserError } from "@/lib/userError";
import { cn } from "@/lib/utils";
import downloader from "@/lib/downloader";
import { showOverlayLoadingAtom } from "@/config/state";
import createImageLightImg from "@/assets/img/create-image-light.png";
import createImageDarkImg from "@/assets/img/create-image-dark.png";
import createDesignLightImg from "@/assets/img/create-design-light.png";
import createDesignDarkImg from "@/assets/img/create-design-dark.png";

import "swiper/css";
import "swiper/css/free-mode";
import "react-spring-bottom-sheet/dist/style.css";
import "react-lazy-load-image-component/src/effects/blur.css";

const showcaseImagesByCategory = [
  {
    category: "انیمه",
    images: [
      {
        id: 1,
        url: "1-Anime.webp",
        prompt:
          "طراحی تصویر انیمه‌ای از گروهی نوجوان با لباس‌های مدرن و رنگارنگ در پارکی در ژاپن، در حال خندیدن و گرفتن عکس سلفی. پس‌زمینه‌ای از درختان گیلاس شکوفه‌دار و فضایی روشن با نور طبیعی آفتاب. سبک هنری شبیه انیمه‌های محبوب با رنگ‌های زنده و طراحی چشم‌های بزرگ و حالت‌های چهره‌ی پر انرژی",
      },
      {
        id: 2,
        url: "2-Anime.webp",
        prompt:
          "تصویری به سبک انیمه از یک گروه نوجوان در یک مسابقه بازی‌های ویدئویی، با هیجان و شور فراوان. نورهای نئونی آبی و بنفش فضا را روشن کرده‌اند. شخصیت‌ها با طراحی مو و لباس‌های منحصربه‌فرد و اکسسوری‌های گیمینگ. حالت‌های چهره پر احساس و پس‌زمینه‌ای از نمادهای بازی‌های محبوب",
      },
      {
        id: 3,
        url: "3-Anime.webp",
        prompt:
          "تصویری سینمایی به سبک انیمه از لحظه‌ای حماسی در مسابقه دوچرخه‌سواری شهری. نوجوانی در حال پرش با دوچرخه از روی یک مانع، در هوا معلق با نور خورشید از پشت سر که هاله‌ای طلایی دورش ایجاد کرده. زاویه دوربین از پایین به بالا، با عمق میدان کم که پس‌زمینه شهری را محو نشان می‌دهد. رنگ‌های غنی و کنتراست بالا مثل فیلم‌های انیمیشن ژاپنی. دوستانش در حاشیه با هیجان و تحسین نظاره‌گر هستند. نورپردازی دراماتیک و ترکیب‌بندی پویا با حس حرکت قوی",
      },
      {
        id: 4,
        url: "4-Anime.webp",
        prompt:
          "تصویری به سبک انیمه از یک گروه نوجوان در ساحل غروب آفتاب، در حال آتش‌بازی و گیتار زدن. آسمان نارنجی و بنفش، دریای آرام با انعکاس نور ماه. شخصیت‌ها با لباس‌های تابستانی رنگارنگ، موهای در حال وزش با باد ساحلی و خنده‌های از ته دل. جرقه‌های آتش و ستاره‌های درخشان در آسمان فضا را جادویی کرده‌اند",
      },
    ],
  },
  {
    category: "واقع‌گرایانه",
    images: [
      {
        id: 10,
        url: "1-Realistic.webp",
        prompt:
          "یک تصویر فوق واقع‌گرایانه از گروهی نوجوان در حال پیک‌نیک در یک پارک سرسبز و پر از نور خورشید ایجاد کن. آن‌ها روی پتوهای رنگارنگ نشسته‌اند، در حال خوراکی خوردن و نوشیدنی‌های خنک هستند. محیط اطراف با درختان سر به فلک کشیده و گل‌های وحشی زیبا احاطه شده است. برخی از نوجوانان در حال بازی والیبال با توپ رنگارنگ هستند، در حالی که دیگران مشغول عکاسی با دوربین‌های فوری و گوشی‌های هوشمند خود هستند. همه لباس‌های تابستانی مد و اسپرت با طرح‌های شاد و زنده بر تن دارند. فضایی پرانرژی و مملو از خنده و شادی با آسمان آبی صاف و نور گرم آفتاب را به تصویر بکش",
      },
      {
        id: 11,
        url: "2-Realistic.webp",
        prompt: "یک پسر نوجوان در حال بازی بسکتبال",
      },
      {
        id: 12,
        url: "3-Realistic.webp",
        prompt:
          "یوزپلنگی در ساوانای آفریقا با نگاه تیز خود، به آرامی در میان علف‌های طلایی کمین کرده است.",
      },
      {
        id: 13,
        url: "4-Realistic.webp",
        prompt:
          "نمای نزدیک از زن سالخورده قبیله‌ای آفریقایی، چین و چروک‌های عمیق که داستان‌های زندگی را روایت می‌کنند، کلاه سنتی، نگاه قدرتمند",
      },
    ],
  },
  {
    category: "آب‌رنگ",
    images: [
      {
        id: 17,
        url: "1-Watercolor.webp",
        prompt: "دختری نوجوان در حال نقاشی با آبرنگ",
      },
      {
        id: 18,
        url: "2-Watercolor.webp",
        prompt:
          "دختری زیر شکوفه‌های گیلاس، نسیم ملایم، پخش شدن گلبرگ‌ها، نور گرم خورشید",
      },
      {
        id: 19,
        url: "3-Watercolor.webp",
        prompt:
          "یه نقاشی به سبک آبرنگ کافه ساحلی قدیمی با چشم‌اندازی به امواج مدیترانه، آبی‌ها و سفیدهای رنگ و رو رفته از آفتاب، سبدهای گل آویزان، فنجان‌های قهوه و کروسان‌های پراکنده، لبه‌های آبرنگی شلخته.",
      },
      {
        id: 20,
        url: "4-Watercolor.webp",
        prompt:
          "یک نقاشی آبرنگی شاد و پرانرژی از یک شهربازی پر از هیجان و رنگ‌ ایجاد کن. چرخ و فلکی با نورهای رنگارنگ در پس‌زمینه در حال چرخش است و دستگاه‌های بازی هیجان‌انگیز کناره‌های تصویر را پر کرده‌اند. نوجوانان با شگفتی و خنده در حال لذت بردن از بازی‌های متنوع و خوردن ذرت مکزیکی و بستنی‌های رنگی هستند. بادکنک‌های رنگارنگ در دستانشان در حال پرواز به سمت آسمان آبی روشن هستند. در گوشه‌ای، غرفه‌هایی با بازی‌های جایزه‌ای مثل تیراندازی به سیبل‌ها، شور و شوق بیشتری را به نمایش می‌گذارند. رنگ‌های زنده و ضربات سبک قلموی آبرنگ، حس بازیگوشی و شادی بی‌پایان این روز به‌یادماندنی را به تصویر می‌کشد.",
      },
    ],
  },
  {
    category: "سینماتیک",
    images: [
      {
        id: 22,
        url: "1-Cinematic.webp",
        prompt:
          "تصویری سینمایی از نوجوانان در یک مسابقه پارکور شهری، میان ساختمان‌های رنگارنگ و مدرن زیر نور درخشان خورشید. لحظه‌ای نفس‌گیر که پارکورکار اصلی در میانه یک پرش بلند بین دو سطح است، با بدنی کاملاً افقی در هوا و دست‌های باز مانند پرواز. لباس‌های اسپرت به رنگ‌های نارنجی روشن، آبی آسمانی و سبز نئون که در باد تکان می‌خورند. فضای شهری با دیوارهای رنگارنگ پوشیده از گرافیتی‌های هنری و نقاشی‌های خیابانی با رنگ‌های درخشان. دوستان در سطح پایین‌تر با حالت‌های هیجان‌زده و دوربین‌های موبایل آماده ثبت لحظه. آسمان فوق‌العاده آبی بدون ابر که عمق و درخشندگی خاصی به صحنه می‌بخشد. زاویه دوربین با تکنیک «بولت تایم» (زمان گلوله) که اطراف پارکورکار می‌چرخد و لحظه معلق بودن را از زوایای مختلف نشان می‌دهد.",
      },
      {
        id: 23,
        url: "2-Cinematic.webp",
        prompt:
          "تصویری سینمایی از نوجوانان در یک فستیوال بالن‌های آب رنگی در روز، زیر نور درخشان آفتاب تابستان. گروهی از دوستان در لحظه پرتاب و ترکیدن بالن‌های آب فسفری و نئونی، با لباس‌های سفید که اکنون پوشیده از رنگ‌های شاد صورتی، زرد قناری، فیروزه‌ای و سبز لیمویی شده‌اند. خنده‌های بزرگ با دندان‌های سفید درخشان و چشم‌های براق از شادی. قطرات آب رنگی در هوا، زیر نور آفتاب مثل الماس‌های رنگی می‌درخشند. آسمان فوق‌العاده آبی و ابرهای پنبه‌ای سفید. زاویه دوربین با حرکت آهسته و لنز واید برای ثبت همه جزئیات لحظه شادی. رنگ‌های فوق‌العاده روشن و شاد با اشباع بالا و نورپردازی طبیعی و درخشان که حس تابستان و نشاط را منتقل می‌کند",
      },
      {
        id: 24,
        url: "3-Cinematic.webp",
        prompt:
          "تصویری سینمایی از نوجوانان در یک مسابقه دوستانه اسکیت روی یخ در یک پیست روباز زیر نور خورشید زمستانی. لحظه‌ای که گروهی از دوستان در حال چرخش و پرش روی یخ، با لباس‌های زمستانی به رنگ‌های قرمز آتشین، آبی آسمانی و زرد طلایی هستند. نور خورشید از میان درختان پوشیده از برف می‌تابد و بلورهای یخ را به الماس‌های درخشان تبدیل می‌کند. بخار دهان در هوای سرد مثل ابرهای کوچک دیده می‌شود. خنده‌های بلند با گونه‌های سرخ از سرما و هیجان. زاویه دوربین با حرکت آهسته و چرخشی، همراه با اسکیت‌بازان حرکت می‌کند. ریسه‌های چراغ رنگی دور پیست که حتی در روز روشن می‌درخشند. رنگ‌های شاد و روشن با کنتراست قوی بین سفیدی برف و لباس‌های رنگی، که حس شادی زمستانی و انرژی جوانی را منتقل می‌کند.",
      },
      {
        id: 25,
        url: "4-Cinematic.webp",
        prompt:
          "تصویری سینمایی از نوجوانان در یک جشن فارغ‌التحصیلی، در لحظه پرتاب کلاه‌های فارغ‌التحصیلی به هوا. آسمان آبی درخشان با کلاه‌های سیاه که به بالا پرتاب شده‌اند، همراه با روبان‌های رنگارنگ و کنفتی‌های طلایی و نقره‌ای که در هوا می‌چرخند. نوجوانان با لباس‌های فارغ‌التحصیلی و روبان‌های رنگی، با خنده‌های بزرگ و بازوهای گشوده رو به آسمان. نور خورشید از پشت سر می‌تابد و هاله‌ای طلایی دور آنها ایجاد می‌کند. زاویه دوربین از پایین به بالا با لنز واید، که عظمت لحظه و آسمان پر از کلاه را نشان می‌دهد. رنگ‌های زنده و شاد، با کنتراست عالی بین آبی آسمان، سیاهی کلاه‌ها و رنگ‌های درخشان روبان‌ها. کل تصویر سرشار از حس پیروزی، شادی و امید به آینده، با نورپردازی درخشان و رنگ‌های اشباع شده که جشن بزرگ این مرحله از زندگی را نشان می‌دهد.",
      },
    ],
  },
  {
    category: "مینیمال ",
    images: [
      {
        id: 30,
        url: "1-Minimal.webp",
        prompt:
          "یک خرس قطبی به سبک نقاشی کودکان مینیمالیستی، با استفاده از خطوط سفید ضخیم و خطوط روشن. به نرمی با پس‌زمینه پارک ترکیب می‌شود. عناصر شناور کوچک و زیبا مانند فک‌ها حال و هوای خیالی می‌افزایند. نمای کامل بدن، با زیبایی گرم و ساده.",
      },
      {
        id: 31,
        url: "2-Minimal.webp",
        prompt:
          "یک طراحی مینیمالیستی کودکانه و بامزه از دوستانی با هدفون‌های بزرگ ایجاد کن که در دنیای موسیقی خود غرق شده‌اند. شخصیت‌ها فقط با خطوط ساده و هندسی و چهره‌های استیلیزه (با چشم‌های درشت و واکنش‌های متفاوت به موسیقی) نشان داده شوند. از حداقل عناصر استفاده کن - فقط شخصیت‌ها، هدفون‌ها و نت‌های موسیقی که به شکل خطوط موجی رنگارنگ از هدفون‌ها خارج می‌شوند. هر شخصیت با یک رنگ پاستلی متفاوت نشان داده شود، اما طراحی آن‌ها یکسان باشد تا ارتباط و اتحاد در تنوع را نشان دهد. پس‌زمینه سفید یا خیلی روشن باشد تا شخصیت‌ها برجسته شوند. این طراحی باید به قدری ساده و بامزه باشد که بتوان آن را روی استیکر، تیشرت یا کیف مدرسه چاپ کرد و مورد پسند نوجوانانی باشد که عاشق موسیقی و طراحی‌های کیوت هستند.",
      },
      {
        id: 33,
        url: "3-Minimal.webp",
        prompt:
          "یک طراحی مینیمالیستی و بامزه از چند کتاب شخصیت‌دار ایجاد کن که روی قفسه‌ای در کنار هم ایستاده‌اند. هر کتاب چهره‌ای ساده با چشم‌های گرد و حالت‌های متفاوت دارد - یکی عینکی و جدی، دیگری خواب‌آلود، یکی هیجان‌زده و دیگری خجالتی. از خطوط ساده و رنگ‌های تخت با پالت محدود استفاده کن. کتاب‌ها با دست‌های کوچک و ساده به هم کمک می‌کنند یا با هم تعامل دارند، مثلاً یک کتاب به کتاب دیگر تکیه داده یا یکی به کتاب دیگر شیرینی تعارف می‌کند. بوکمارک‌های رنگارنگ از بالای کتاب‌ها بیرون زده‌اند که مثل موهای شخصیت‌ها به نظر می‌رسند. این طراحی شیرین و بامزه می‌تواند الهام‌بخش نوجوانان برای مطالعه باشد و روی استیکر، کیف کتاب یا نشانک استفاده شود.",
      },
      {
        id: 34,
        url: "4-Minimal.webp",
        prompt:
          "یک طراحی مینیمالیستی و بامزه از گروهی شیرینی‌های مختلف با چهره‌های کارتونی ایجاد کن که در یک پارتی کوچک دورهمی دارند. دونات‌هایی با چشم‌های درشت و گونه‌های صورتی، کاپ‌کیک‌های خندان با کلاه‌های تولد کوچک، و شکلات‌های کوچک با حالت‌های مختلف چهره، همگی با طراحی فوق‌العاده ساده و جذاب. آن‌ها در حال رقصیدن، گرفتن عکس سلفی با دست‌های نازک چوب کبریتی، یا نواختن سازهای کوچک هستند. از رنگ‌های شاد ولی محدود استفاده کن و هر شخصیت را با حداقل جزئیات و خطوط ساده طراحی کن. یک بنر کوچک با نوشته 'Sweet Friends' در بالای تصویر به سبک دست‌نویس ساده قرار دارد. این طرح شیرین می‌تواند برای استیکر، پیکسل، کیف پول یا قاب گوشی نوجوانان جذاب باشد.",
      },
    ],
  },
];

function ImagePage() {
  const navigate = useNavigate();

  const setShowOverlayLoading = useSetAtom(showOverlayLoadingAtom);

  const [selectedImage, setSelectedImage] = useState(null);
  const [historyImages, setHistoryImages] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    const params = new URLSearchParams({
      page: "1",
      limit: "4",
    });

    const { data, ok } = await apiClient.get(`/images/history?${params}`);
    setIsLoadingHistory(false);

    if (!ok) {
      return; // Silent fail for preview
    }

    setHistoryImages(data.generations || []);
  };

  const getImageUrl = (imagePath) => {
    return imagePath.s3Url;
  };

  const openDetailDialog = (generation) => {
    setSelectedGeneration(generation);
    setIsDetailDialogOpen(true);
  };

  const handleDownload = async (imageUrl, filename) => {
    downloader(imageUrl, filename);
  };

  const handleDelete = async (generationId) => {
    setShowOverlayLoading(true);
    setIsDeleteDialogOpen(false);

    const { data, ok } = await apiClient.delete(`/images/${generationId}`);
    setShowOverlayLoading(false);

    if (!ok) {
      return toastUserError(data?.message, "خطا در حذف تصویر");
    }

    toast.success("تصویر با موفقیت حذف شد");
    setHistoryImages((prev) => prev.filter((gen) => gen.id !== generationId));
    setIsDetailDialogOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div
            onClick={() => navigate("/image-generate")}
            className="cursor-pointer rounded-3xl overflow-hidden bg-secondary/60 dark:bg-secondary/20 border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/40 aspect-square"
          >
            <img
              src={createImageLightImg}
              alt="ساخت عکس"
              effect="blur"
              className="w-full h-full object-contain dark:hidden min-h-[150px]"
              placeholderSrc="/img-placeholder.jpg"
            />
            <img
              src={createImageDarkImg}
              alt="ساخت عکس"
              effect="blur"
              className="hidden w-full h-full object-contain dark:block min-h-[150px]"
              placeholderSrc="/img-placeholder.jpg"
            />
          </div>
          <Button
            onClick={() => navigate("/image-generate")}
            className="w-full"
          >
            ساخت عکس
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <div
            onClick={() => navigate("/design-generate")}
            className="cursor-pointer rounded-3xl overflow-hidden bg-secondary/60 dark:bg-secondary/20 border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/40 aspect-square"
          >
            <img
              src={createDesignLightImg}
              alt="طراحی عکس"
              effect="blur"
              className="w-full h-full object-contain dark:hidden min-h-[150px]"
              placeholderSrc="/img-placeholder.jpg"
            />
            <img
              src={createDesignDarkImg}
              alt="طراحی عکس"
              effect="blur"
              className="hidden w-full h-full object-contain dark:block min-h-[150px]"
              placeholderSrc="/img-placeholder.jpg"
            />
          </div>
          <Button
            onClick={() => navigate("/design-generate")}
            className="w-full"
          >
            شروع طراحی
          </Button>
        </div>
      </div>

      {/* Image History Section */}
      {isLoadingHistory ? (
        <div className="flex items-center justify-center py-8">
          <Spinner className="w-6 h-6" />
        </div>
      ) : historyImages.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-lg font-extrabold">تاریخچه تصاویر</h3>

            <Button
              variant="outline"
              onClick={() => navigate("/image/history")}
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
            {historyImages.map((generation) => (
              <SwiperSlide key={generation.id} className="w-[140px]! py-2">
                <div
                  onClick={() => openDetailDialog(generation)}
                  className="group relative w-full cursor-pointer rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-all"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                    {generation.images && generation.images.length > 0 && (
                      <LazyLoadImage
                        src={getImageUrl(generation.images[0])}
                        alt={generation.prompt}
                        className="w-full h-full object-cover"
                        effect="blur"
                        placeholderSrc="/img-placeholder.jpg"
                      />
                    )}
                    {generation.images && generation.images.length > 1 && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-semibold">
                        +{generation.images.length - 1}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-card">
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                      {generation.prompt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {generation.config?.aspectRatio || "1:1"}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {new Date(generation.createdAt).toLocaleDateString(
                          "fa-IR",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-extrabold">تاریخچه تصاویر</h3>
          <div className="flex flex-col items-center justify-center py-12 text-center border border-border rounded-xl bg-card">
            <p className="text-base text-muted-foreground mb-4">
              هنوز تصویری ندارید
            </p>
            <Button
              onClick={() => navigate("/image-generate")}
              className="gap-2"
            >
              شروع ساخت عکس
            </Button>
          </div>
        </div>
      )}

      {/* Showcase Gallery */}
      {showcaseImagesByCategory.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-extrabold">تصاویر ساده و خلاقانه</h3>

          {showcaseImagesByCategory.map((category, categoryIndex) => {
            const urlPrefix = "https://s3.hamdast.com/public/images/demo/";

            return (
              <div key={categoryIndex} className="space-y-3">
                <h4 className="text-base font-semibold">{category.category}</h4>
                <Swiper
                  modules={[FreeMode]}
                  spaceBetween={12}
                  slidesPerView="auto"
                  freeMode={true}
                  dir="rtl"
                  className="px-0!"
                >
                  {category.images.map((image) => (
                    <SwiperSlide key={image.id} className="w-[140px]!">
                      <div
                        onClick={() => {
                          setSelectedImage({
                            url: urlPrefix + image.url,
                            prompt: image.prompt,
                          });
                        }}
                        className="relative cursor-pointer rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-all aspect-square"
                      >
                        <LazyLoadImage
                          src={urlPrefix + image.url}
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                          effect="blur"
                          placeholderSrc="/img-placeholder.jpg"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            );
          })}
        </div>
      )}

      <CustomDialog
        open={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null);
          }
        }}
        className="max-w-[95vw] md:max-w-4xl"
      >
        {selectedImage && (
          <div className="flex flex-col gap-4">
            <LazyLoadImage
              src={selectedImage.url || selectedImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
              effect="blur"
              placeholderSrc="/img-placeholder.jpg"
            />
            <Button
              onClick={() => {
                const prompt = selectedImage?.prompt;
                if (prompt) {
                  navigate("/image-generate", {
                    state: { initialPrompt: prompt },
                  });
                }
              }}
              className="w-full gap-2"
            >
              <Sparkles className="w-4 h-4" />
              استفاده از این پرامپت
            </Button>
          </div>
        )}
      </CustomDialog>

      {/* Detail Dialog for history items */}
      <CustomDialog
        title="جزئیات تصویر"
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        className="md:max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {selectedGeneration && (
          <div className="space-y-6">
            {/* Images Grid */}
            <div
              className={cn(
                "grid gap-3",
                selectedGeneration.images.length === 1
                  ? "grid-cols-1"
                  : "grid-cols-2",
              )}
            >
              {selectedGeneration.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border border-border"
                >
                  <LazyLoadImage
                    src={getImageUrl(image)}
                    alt={`Image ${index + 1}`}
                    className="w-full aspect-square object-cover"
                    effect="blur"
                    placeholderSrc="/img-placeholder.jpg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        handleDownload(
                          getImageUrl(image),
                          `image-${index + 1}.png`,
                        )
                      }
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      دانلود
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">توضیحات:</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedGeneration.prompt}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">مدل:</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedGeneration.modelName || "-"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">نسبت تصویر:</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedGeneration.config?.aspectRatio || "1:1"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">سبک:</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedGeneration.config?.style || "vivid"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">تاریخ:</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedGeneration.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedGeneration &&
              selectedGeneration.images &&
              selectedGeneration.images.length > 0 && (
                <>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleDownload(
                          getImageUrl(selectedGeneration.images[0]),
                          `image-${selectedGeneration.id}.png`,
                        )
                      }
                      className="flex-1 gap-2"
                    >
                      <Download className="w-4 h-4" />
                      دانلود
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="flex-1 gap-2 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </Button>
                  </div>

                  <Button
                    onClick={() => {
                      navigate("/image-generate", {
                        state: { initialPrompt: selectedGeneration.prompt },
                      });
                    }}
                    className="w-full gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    استفاده از این پرامپت
                  </Button>
                </>
              )}
          </div>
        )}
      </CustomDialog>

      {/* Delete Confirmation Dialog for history items */}
      <CustomAlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="حذف تصویر"
        description="آیا از حذف این تصویر اطمینان دارید؟ این عمل قابل بازگشت نیست."
        onConfirm={() => handleDelete(selectedGeneration.id)}
        confirmBtnClassName="bg-red-500 hover:bg-red-600"
      />
    </div>
  );
}

export default ImagePage;
