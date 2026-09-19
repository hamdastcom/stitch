import toast from "react-hot-toast";
import authStorage from "@/auth/storage";
import { toastUserError } from "@/lib/userError";

/**
 * Check if we're running in the Hamdast app environment
 * Verifies that Hamdast object exists AND has the attachImage method
 * @returns {boolean}
 */
function isHamdastEnvironment() {
  return (
    typeof window !== "undefined" &&
    window.Hamdast &&
    typeof window.Hamdast.attachImage === "function"
  );
}

/**
 * Upload image using Hamdast's native interface
 * @param {Function} setShowOverlayLoading
 * @returns {Promise<{fileName: string, name: string, url: string, filePath: string} | null>}
 */
function uploadImageHamdast(setShowOverlayLoading) {
  return new Promise((resolve) => {
    Hamdast.attachImage(
      "attachImageSuccess",
      "attachImageStart",
      "attachImageError",
      false
    );

    window.attachImageSuccess = function (serverResponse) {
      const response = JSON.parse(serverResponse);
      setShowOverlayLoading(false);
      resolve({
        fileName: response.fileName,
        name: response.name || response.fileName,
        url: response.url,
        filePath: response.filePath,
      });
    };

    window.attachImageError = function () {
      setShowOverlayLoading(false);
      resolve(null);
      toast.error("آپلود تصویر با خطا مواجه شد");
    };

    window.attachImageStart = function () {
      setShowOverlayLoading(true);
    };
  });
}

/**
 * Upload image using web file input (for non-Hamdast environments)
 * @param {Function} setShowOverlayLoading
 * @returns {Promise<{fileName: string, name: string, url: string, filePath: string} | null>}
 */
function uploadImageWeb(setShowOverlayLoading) {
  return new Promise((resolve) => {
    // Create hidden file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp";
    input.style.display = "none";
    document.body.appendChild(input);

    // Track if file was selected
    let fileSelected = false;

    input.addEventListener("change", async (e) => {
      fileSelected = true;
      const file = e.target.files?.[0];

      // Clean up input element
      if (input.parentNode) {
        document.body.removeChild(input);
      }

      if (!file) {
        resolve(null);
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("حجم فایل نباید بیشتر از ۱۰ مگابایت باشد");
        resolve(null);
        return;
      }

      setShowOverlayLoading(true);

      try {
        // Create form data
        const formData = new FormData();
        formData.append("image", file);

        // Get auth token
        const token = authStorage.getToken();
        const headers = {};
        if (token) {
          headers["x-auth-token"] = token;
        }

        // Upload to backend using native fetch (don't set Content-Type, let browser handle it)
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/upload/image`,
          {
            method: "POST",
            headers,
            body: formData,
          }
        );

        const data = await response.json();

        setShowOverlayLoading(false);

        if (response.ok && data?.success) {
          resolve({
            fileName: data.fileName,
            name: data.name,
            url: data.url,
            filePath: data.filePath,
          });
        } else {
          toastUserError(data?.message, "آپلود تصویر با خطا مواجه شد");
          resolve(null);
        }
      } catch (error) {
        setShowOverlayLoading(false);
        console.error("Upload error:", error);
        toast.error("آپلود تصویر با خطا مواجه شد");
        resolve(null);
      }
    });

    // Handle cancel - use focus event on window to detect when file dialog closes
    const handleFocus = () => {
      // Small delay to ensure change event fires first if file was selected
      setTimeout(() => {
        if (!fileSelected && input.parentNode) {
          document.body.removeChild(input);
          resolve(null);
        }
        window.removeEventListener("focus", handleFocus);
      }, 300);
    };

    window.addEventListener("focus", handleFocus);

    // Trigger file picker
    input.click();
  });
}

/**
 * Upload image - automatically chooses between Hamdast and web implementation
 * @param {Function} setShowOverlayLoading
 * @returns {Promise<{fileName: string, name: string, url: string, filePath: string} | null>}
 */
function uploadImage(setShowOverlayLoading) {
  if (isHamdastEnvironment()) {
    return uploadImageHamdast(setShowOverlayLoading);
  }
  return uploadImageWeb(setShowOverlayLoading);
}

export default uploadImage;
