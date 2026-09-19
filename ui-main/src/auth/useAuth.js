import { toast } from "react-hot-toast";
import { useAtom, useSetAtom } from "jotai";

import authStorage from "./storage";
import apiClient from "@/lib/apiClient";
import { toastUserError } from "@/lib/userError";
import { currentUserAtom, showOverlayLoadingAtom } from "@/config/state";
import userIcon from "@/assets/img/user.png";
import { clearWebAuthData } from "@/components/AuthBottomSheet";
import { clearPreferenceCache } from "@/hooks/useUserPreference";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const setShowOverlayLoading = useSetAtom(showOverlayLoadingAtom);
  
  const logIn = (data) => {
    authStorage.storeToken(data.token);
    localStorage.setItem("hamdast-ai-user", JSON.stringify(data.user));

    setCurrentUser(data.user);
  };

  const logOut = async () => {
    authStorage.removeToken();
    localStorage.removeItem("hamdast-ai-user");
    // Clear web auth data for web users
    clearWebAuthData();
    // Clear preference cache on logout
    clearPreferenceCache();

    window.location.reload();
  };

  const updateUser = async () => {
    if(! currentUser) return;
  
    const { data, ok } = await apiClient.get("/users/me");
    if(!ok) return toast.error("خطا در به روز رسانی اطلاعات کاربر");

    let binds = Hamdast.getBinds();
    binds = JSON.parse(binds.replace(/'/g, '"'));

    // this rule is for when user change his phone number in the hamdast app itself
    if(data.user.phone !== binds?.phone) {
      setShowOverlayLoading(true);
      await handleLoginSuccess();
      setShowOverlayLoading(false);
    } else setCurrentUser(data.user);
  }

  const getUserImage = (image = currentUser?.image) => {
    if(image) {
      if(image.startsWith("https://")) return image;

      return `${import.meta.env.VITE_API_URL}/uploads/user/${image}`;
    }

    return userIcon;
  };

  const handleLoginSuccess = async () => {
    let binds = Hamdast.getBinds();
    binds = JSON.parse(binds.replace(/'/g, '"'));

    let phone = binds?.phone || "";

    const { ok, data, problem } = await apiClient.post("/auth/check-user", {
      phone,
    });

    if (!ok) return toastUserError(null, "خطا در بررسی حساب کاربری", { problem });

    logIn(data);
  };

  return { logIn, logOut, setCurrentUser, currentUser, updateUser, getUserImage, handleLoginSuccess };
};
