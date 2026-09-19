import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Trash2,
  Search,
  Calendar,
  PlayCircle,
  X,
} from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/apiClient";
import { toastUserError } from "@/lib/userError";
import { cn } from "@/lib/utils";
import VideoDetailDialog from "@/components/VideoDetailDialog";
import {
  getGenerationVideoUrl,
  getGenerationThumbnailUrl,
} from "@/lib/getGenerationMediaUrl";

import "react-lazy-load-image-component/src/effects/blur.css";

function VideoHistoryPage() {
  const navigate = useNavigate();

  const [generations, setGenerations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pollingIntervalsRef = useRef({});

  useEffect(() => {
    loadHistory();
  }, []);

  // Polling for processing videos
  useEffect(() => {
    const processingVideos = generations.filter(
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
      const video = generations.find((v) => String(v.id) === String(videoId));
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
  }, [generations]);

  // Update selectedGeneration when generations change
  useEffect(() => {
    if (selectedGeneration) {
      const updatedGeneration = generations.find(
        (gen) => gen.id === selectedGeneration.id
      );
      if (updatedGeneration) {
        setSelectedGeneration(updatedGeneration);
      }
    }
  }, [generations]);

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

      // Update the video in generations
      setGenerations((prevVideos) =>
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

  const loadHistory = async (searchTerm = "", pageNum = 1) => {
    setIsLoading(true);

    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: "20",
    });

    if (searchTerm) {
      params.append("search", searchTerm);
    }

    const { data, ok } = await apiClient.get(`/videos/history?${params}`);
    setIsLoading(false);

    if (!ok) {
      toastUserError(data?.message, "خطا در بارگذاری تاریخچه");
      return;
    }

    if (pageNum === 1) {
      setGenerations(data.generations || []);
    } else {
      setGenerations((prev) => [...prev, ...(data.generations || [])]);
    }

    setHasMore((data.generations || []).length === 20);
    setPage(pageNum);
  };

  const openDetailDialog = (generation) => {
    setSelectedGeneration(generation);
    setIsDetailDialogOpen(true);
  };

  const handleSearch = () => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setHasSearched(false);
      loadHistory("", 1);
      return;
    }

    setHasSearched(true);
    loadHistory(trimmed, 1);
  };

  const handleLoadMore = () => {
    loadHistory(searchQuery, page + 1);
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">تاریخچه ویدیوها</h1>
        <p className="text-sm text-muted-foreground">
          {generations.length} ویدیو تولید شده
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="جستجو در توضیحات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setHasSearched(false);
                loadHistory("", 1);
              }}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} className="gap-2">
          <Search className="w-4 h-4" />
          جستجو
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && generations.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="w-8 h-8" />
        </div>
      ) : generations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          {hasSearched ? (
            <>
              <h3 className="text-lg font-semibold mb-2">
                نتیجه‌ای برای جستجو یافت نشد
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                ویدیویی مطابق عبارت جستجو شده پیدا نشد. عبارت جستجو را تغییر
                دهید.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2">
                تاریخچه‌ای یافت نشد
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                هنوز ویدیویی تولید نکرده‌اید
              </p>
            </>
          )}
          {!hasSearched && (
            <Button onClick={() => navigate("/video")} className="gap-2">
              ساخت اولین ویدیو
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Video Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {generations.map((generation) => {
              const status = generation.status || "completed";
              const progress = generation.progress || 0;
              const isCompleted = status === "completed";
              const isProcessing =
                status === "processing" || status === "queued";
              const playUrl = getGenerationVideoUrl(generation);
              const thumbUrl = getGenerationThumbnailUrl(generation);

              return (
                <div
                  key={generation.id}
                  onClick={() => {
                    // Only allow click if completed and playable
                    if (isCompleted && playUrl) {
                      openDetailDialog({
                        ...generation,
                        videoS3Url: playUrl,
                        thumbnailS3Url: thumbUrl,
                      });
                    }
                  }}
                  className={cn(
                    "group relative rounded-xl overflow-hidden border border-border bg-card transition-all",
                    isCompleted
                      ? "cursor-pointer hover:shadow-lg"
                      : "cursor-default opacity-90"
                  )}
                >
                  {/* Video Thumbnail/Preview */}
                  <div className="relative h-56 overflow-hidden bg-secondary flex items-center justify-center">
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
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {generation.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {isCompleted
                          ? `${generation.config?.resolution || "720p"} • ${
                              generation.config?.aspectRatio || "16:9"
                            }`
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
              );
            })}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    در حال بارگذاری...
                  </>
                ) : (
                  "بارگذاری بیشتر"
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detail Dialog */}
      <VideoDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        selectedGeneration={selectedGeneration}
        onDelete={(genId) => {
          setGenerations((prev) => prev.filter((gen) => gen.id !== genId));
          setIsDetailDialogOpen(false);
        }}
      />
    </div>
  );
}

export default VideoHistoryPage;
