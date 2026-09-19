import { registerPlugin, Capacitor } from "@capacitor/core";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

import { toastUserError } from "@/lib/userError";

const MediaDownload = registerPlugin("MediaDownload");

function extensionFromUrl(fileUrl) {
  try {
    const pathname = new URL(fileUrl, window.location.origin).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]{1,5})$/);
    return match ? match[1].toLowerCase() : "";
  } catch {
    return "";
  }
}

function buildFilename(filename, fileUrl) {
  const ext = extensionFromUrl(fileUrl) || "jpg";
  if (filename == null || filename === "") {
    return `hamdast-${uuidv4()}.${ext}`;
  }
  const name = String(filename).replace(/[/\\]/g, "_");
  if (/\.[a-zA-Z0-9]{1,5}$/.test(name)) return name;
  return `${name}.${ext}`;
}

async function downloadOnWeb(fileUrl, filename) {
  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error("دانلود انجام نشد");

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = buildFilename(filename, fileUrl);
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
}

async function downloader(fileUrl, filename) {
  if (!fileUrl) {
    toast.error("آدرس فایل برای دانلود موجود نیست");
    return;
  }

  if (typeof Hamdast?.openIntent === "function") {
    Hamdast.openIntent(fileUrl, "");
    return;
  }

  const toastId = toast.loading("در حال دانلود...");

  try {
    if (Capacitor.isNativePlatform()) {
      await MediaDownload.save({
        url: fileUrl,
        filename: buildFilename(filename, fileUrl),
      });
      toast.success("فایل در پوشه دانلودها ذخیره شد", { id: toastId });
      return;
    }

    await downloadOnWeb(fileUrl, filename);
    toast.success("دانلود شروع شد", { id: toastId });
  } catch (error) {
    toast.dismiss(toastId);
    toastUserError(error, "دانلود انجام نشد. لطفاً دوباره تلاش کنید.");
  }
}

export default downloader;
