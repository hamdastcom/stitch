import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Download, Trash2, Search, Calendar, X, Sparkles } from "lucide-react";
import { useSetAtom } from "jotai";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { CustomDialog } from "@/components/ui/dialog";
import { CustomAlertDialog } from "@/components/ui/alert-dialog";
import apiClient from "@/lib/apiClient";
import { toastUserError } from "@/lib/userError";
import { cn } from "@/lib/utils";
import { showOverlayLoadingAtom } from "@/config/state";
import downloader from "@/lib/downloader";

import "react-lazy-load-image-component/src/effects/blur.css";

function ImageHistoryPage() {
  const navigate = useNavigate();

  const setShowOverlayLoading = useSetAtom(showOverlayLoadingAtom);
  const [generations, setGenerations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async (searchTerm = "", pageNum = 1) => {
    setIsLoading(true);

    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: "20",
    });

    if (searchTerm) params.append("search", searchTerm);

    const { data, ok } = await apiClient.get(`/images/history?${params}`);
    setIsLoading(false);

    if (!ok) return toastUserError(data?.message, "خطا در بارگذاری تاریخچه");

    if (pageNum === 1) {
      setGenerations(data.generations || []);
    } else {
      setGenerations((prev) => [...prev, ...(data.generations || [])]);
    }

    setHasMore((data.generations || []).length === 20);
    setPage(pageNum);
  };

  const handleDelete = async (generationId) => {
    setShowOverlayLoading(true);
    setIsDeleteDialogOpen(false);

    const { data, ok } = await apiClient.delete(`/images/${generationId}`);
    setShowOverlayLoading(false);

    if (!ok) return toastUserError(data?.message, "خطا در حذف تصویر");

    toast.success("تصویر با موفقیت حذف شد");
    setGenerations((prev) => prev.filter((gen) => gen.id !== generationId));
    setIsDetailDialogOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const handleDownload = async (imageUrl, filename) => {
    downloader(imageUrl, filename);
  };

  const handleSearch = () => {
    loadHistory(searchQuery, 1);
  };

  const handleLoadMore = () => {
    loadHistory(searchQuery, page + 1);
  };

  const openDetailDialog = (generation) => {
    setSelectedGeneration(generation);
    setIsDetailDialogOpen(true);
  };

  const getImageUrl = (image) => {
    return image.s3Url;
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">تاریخچه تصاویر</h1>
        <p className="text-sm text-muted-foreground">
          {generations.length} تصویر تولید شده
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
          <h3 className="text-lg font-semibold mb-2">تاریخچه‌ای یافت نشد</h3>
          <p className="text-sm text-muted-foreground mb-4">
            هنوز تصویری تولید نکرده‌اید
          </p>
          <Button onClick={() => navigate("/image")} className="gap-2">
            ساخت اولین تصویر
          </Button>
        </div>
      ) : (
        <>
          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {generations.map((generation) => (
              <div
                key={generation.id}
                onClick={() => openDetailDialog(generation)}
                className="group relative rounded-xl overflow-hidden border border-border bg-card cursor-pointer hover:shadow-lg transition-all"
              >
                {/* First image as thumbnail */}
                {generation.images && generation.images.length > 0 && (
                  <div className="relative h-56 overflow-hidden bg-secondary flex items-center justify-center">
                    <LazyLoadImage
                      src={getImageUrl(generation.images[0])}
                      alt={generation.prompt}
                      className="w-full h-full object-cover"
                      effect="blur"
                      placeholderSrc="/img-placeholder.jpg"
                    />
                    {generation.images.length > 1 && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-semibold">
                        +{generation.images.length - 1}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {/* Info */}
                <div className="p-3 space-y-2">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {generation.prompt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {generation.config?.aspectRatio || "1:1"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(generation.createdAt).toLocaleDateString(
                        "fa-IR"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
                  : "grid-cols-2"
              )}
            >
              {selectedGeneration.images.map((image, index) => (
                <div key={index} className="relative group">
                  <LazyLoadImage
                    src={getImageUrl(image)}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl overflow-hidden border border-border"
                    effect="blur"
                    placeholderSrc="/img-placeholder.jpg"
                  />

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        handleDownload(
                          getImageUrl(image),
                          `image-${index + 1}.png`
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
                          `image-${selectedGeneration.id}.png`
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

      {/* Delete Confirmation Dialog */}
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

export default ImageHistoryPage;
