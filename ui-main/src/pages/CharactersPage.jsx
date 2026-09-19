import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Sparkles, Bot } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";

import apiClient from "@/lib/apiClient";
import { toastUserError } from "@/lib/userError";
import { Spinner } from "@/components/ui/spinner";
import { CustomDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/free-mode";
import "react-lazy-load-image-component/src/effects/blur.css";

let orderCategories = [
  "انیمه و انیمیشن",
  "فیلم و سریال",
  "بازیگران",
  "ستاره‌های موسیقی",
  "ورزشی",
  "یادگیری زبان",
  "درس و مدرسه",
  "دنیای دیجیتال",
  "فراغت و سرگرمی",
];
function CharactersPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGPT, setSelectedGPT] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadGPTs();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      // Sync heights of all cards in each category
      const syncHeights = () => {
        categories.forEach((category, categoryIndex) => {
          const swiperContainer = document.querySelector(
            `[data-category-index="${categoryIndex}"]`
          );
          if (!swiperContainer) return;

          const cards = swiperContainer.querySelectorAll(".character-card");
          if (cards.length === 0) return;

          // Reset heights first to get natural heights
          cards.forEach((card) => {
            card.style.height = "auto";
          });

          // Find max height
          let maxHeight = 0;
          cards.forEach((card) => {
            const height = card.getBoundingClientRect().height;
            if (height > maxHeight) {
              maxHeight = height;
            }
          });

          // Apply max height to all cards
          cards.forEach((card) => {
            card.style.height = `${maxHeight}px`;
          });
        });
      };

      // Run after a short delay to ensure DOM is ready
      const timeoutId = setTimeout(syncHeights, 100);
      window.addEventListener("resize", syncHeights);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", syncHeights);
      };
    }
  }, [categories]);

  const loadGPTs = async () => {
    setIsLoading(true);

    const { data, ok } = await apiClient.get("/gpts");
    setIsLoading(false);

    if (!ok) return toastUserError(data?.message, "خطا در بارگذاری کاراکترها");

    const categories = data.categories || [];

    // Sort categories based on orderCategories
    const sortedCategories = [...categories].sort((a, b) => {
      const indexA = orderCategories.indexOf(a.name);
      const indexB = orderCategories.indexOf(b.name);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });

    setCategories(sortedCategories);
  };

  const handleGPTClick = (gpt) => {
    setSelectedGPT(gpt);
    setIsDialogOpen(true);
  };

  const handleStartChat = async () => {
    setIsDialogOpen(false);
    navigate("/chat/new", {
      state: {
        gpt: selectedGPT,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">کاراکترهای هوش مصنوعی</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          با کاراکترهای متخصص گفتگو کنید
        </p>
      </div>

      {/* Categories */}
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">هیچ کاراکتری موجود نیست</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category, categoryIndex) => (
            <div key={category.name} className="space-y-2">
              {/* Category Header */}
              <div className="flex justify-center items-center gap-2">
                <div className="h-[2px] flex-1 bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                <h2 className="text-lg font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {category.name}
                </h2>
                <div className="h-[2px] flex-1 bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
              </div>

              <div className="swiper-container-wrapper">
                <style>{`
                  .swiper-container-wrapper .swiper-wrapper {
                    display: flex !important;
                    align-items: stretch !important;
                  }
                  .swiper-container-wrapper .swiper-slide {
                    height: auto !important;
                    display: flex !important;
                  }
                `}</style>
                <Swiper
                  modules={[FreeMode]}
                  spaceBetween={16}
                  slidesPerView="auto"
                  freeMode={true}
                  dir="rtl"
                  className="px-0!"
                  data-category-index={categoryIndex}
                >
                  {category.gpts.map((gpt) => (
                    <SwiperSlide key={gpt.id} className="w-[180px]! py-4">
                      <div
                        onClick={() => handleGPTClick(gpt)}
                        className="group relative w-full cursor-pointer text-right h-full flex flex-col"
                      >
                        {/* Card */}
                        <div className="character-card relative h-full flex flex-col bg-secondary overflow-hidden rounded-2xl bg-linear-to-br from-card to-card/50 border border-primary/50 shadow-lg shadow-primary/10">
                          {/* Glow Effect */}
                          <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-primary/0 to-primary/10 h-full" />

                          {/* Image */}
                          <div className="relative p-2 aspect-square">
                            {gpt.image ? (
                              <LazyLoadImage
                                src={gpt.image}
                                alt={gpt.name}
                                className="w-full h-full object-cover rounded-xl"
                                effect="blur"
                                placeholderSrc="/img-placeholder.jpg"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                                <Bot className="w-16 h-16 text-primary" />
                              </div>
                            )}

                            {/* Sparkle Icon */}
                            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex flex-col p-4 pt-0 space-y-1 grow">
                            <h3 className="font-semibold text-sm line-clamp-1">
                              {gpt.name}
                            </h3>
                            <p
                              className="text-xs text-muted-foreground whitespace-break-spaces line-clamp-2"
                              dir="rtl"
                            >
                              {gpt.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GPT Detail Dialog */}
      <CustomDialog
        title=""
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        className="max-w-sm"
        modal={false}
      >
        {selectedGPT && (
          <div className="space-y-6">
            {/* Image */}
            <div className="relative flex w-full items-center justify-center">
              <div className="w-full flex items-center justify-center relative h-full min-h-[256px] min-w-[256px] max-h-[256px] max-w-[256px]">
                {selectedGPT.image ? (
                  <LazyLoadImage
                    src={selectedGPT.image}
                    alt={selectedGPT.name}
                    className="w-fit aspect-video object-cover h-full rounded-xl min-h-[256px] min-w-[256px] max-h-[256px] max-w-[256px]"
                    effect="blur"
                    placeholderSrc="/img-placeholder.jpg"
                  />
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5">
                    <Bot className="w-24 h-24 text-primary" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-3 text-center">
              <h2 className="text-xl font-bold">{selectedGPT.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedGPT.description}
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleStartChat}
              className="w-full h-12 text-base font-semibold"
            >
              <Sparkles className="w-5 h-5 ml-2" />
              شروع گفتگو
            </Button>
          </div>
        )}
      </CustomDialog>
    </div>
  );
}

export default CharactersPage;
