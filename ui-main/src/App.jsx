import React, { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";

import router from "./routers";
import {
  showOverlayLoadingAtom,
  themeAtom,
  showAuthSheetAtom,
  authCallbacksAtom,
  currentModelAtom,
  chatModelsAtom,
  searchModeAtom,
  webSearchEnabledAtom,
} from "./config/state";
import CheckLogin from "./components/CheckLogin";
import useAuth from "./auth/useAuth";
import useAndroidBackButton from "./hooks/useAndroidBackButton";
import storage from "@/auth/storage";
import ErrorFallback from "./components/ErrorFallback";
import AuthBottomSheet, {
  getWebAuthData,
  isWebAuthenticated,
  clearWebAuthData,
} from "./components/AuthBottomSheet";
import {
  fetchChatModels,
  readCachedChatModels,
  resolveCurrentModel,
  applyWebSearchForSelectedModel,
} from "@/lib/models";
import { recoverPendingPurchases } from "@/lib/bazaarBilling";
import {
  applyTheme,
  detectPreferredTheme,
  getStoredTheme,
  getSystemTheme,
} from "@/lib/theme";

const toastOptions = {
  className: "font-vazirmatn",
  style: {
    background: "var(--card)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
  },
};

function App() {
  const { setCurrentUser, handleLoginSuccess } = useAuth();
  useAndroidBackButton();

  const showOverlayLoading = useAtomValue(showOverlayLoadingAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const setCurrentModel = useSetAtom(currentModelAtom);
  const setChatModels = useSetAtom(chatModelsAtom);
  const searchMode = useAtomValue(searchModeAtom);
  const setSearchMode = useSetAtom(searchModeAtom);
  const setWebSearchEnabled = useSetAtom(webSearchEnabledAtom);
  const [isReady, setIsReady] = useState(false);
  const setShowAuthSheet = useSetAtom(showAuthSheetAtom);
  const setAuthCallbacks = useSetAtom(authCallbacksAtom);

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const preload = async () => {
    // Prefer Hamdast bridge; fall back to legacy Myket host bridge if present
    if (!window.Hamdast) {
      if (window.Myket) {
        window.Hamdast = window.Myket;
      } else {
        // Web mode - implement Hamdast object with web authentication
        window.Hamdast = {
          isLogin: () => isWebAuthenticated(),
          getBinds: () => {
            const authData = getWebAuthData();
            return JSON.stringify({ phone: authData?.phone || "" });
          },
          login: (_, message, successCallback, errorCallback) => {
            // Store callback names for later use
            setAuthCallbacks({
              onSuccess: successCallback
                ? () => window[successCallback]?.()
                : null,
              onError: errorCallback ? () => window[errorCallback]?.() : null,
            });
            // Open the auth bottom sheet
            setShowAuthSheet(true);
          },
          getTheme: () => (getSystemTheme() === "dark" ? "dark" : "default"),
          getClientVersion: () => 1011,
          __isWebStub: true,
        };
      }
    }

    // Stale-while-revalidate: apply cached models immediately so a slow
    // /models request never blocks the login/ready gate. Refresh in the
    // background and replace the cache when the network responds.
    let storedModel = null;
    try {
      const raw = localStorage.getItem("hamdast-ai-model");
      if (raw) storedModel = JSON.parse(raw);
    } catch {
      // ignore invalid cache
    }

    const applyModels = (models, preferredModel = storedModel) => {
      if (!models?.length) return;
      setChatModels(models);
      const resolved = resolveCurrentModel(models, preferredModel);
      setCurrentModel(resolved);
      applyWebSearchForSelectedModel(resolved, {
        searchMode,
        setWebSearchEnabled,
        setSearchMode,
      });
    };

    applyModels(readCachedChatModels());

    void fetchChatModels()
      .then(({ ok, models }) => {
        if (!ok) return;
        let latestStored = storedModel;
        try {
          const raw = localStorage.getItem("hamdast-ai-model");
          if (raw) latestStored = JSON.parse(raw);
        } catch {
          // keep preload snapshot
        }
        applyModels(models, latestStored);
      })
      .catch((error) => {
        console.log("error syncing models:", error);
      });

    if (!Hamdast.isLogin()) {
      showLogin();
    } else {
      const user = storage.getUser();

      if (!storage.getToken()) {
        await handleLoginSuccess();
        setIsReady(true);
      }

      if (!!user) {
        setCurrentUser(user);
        setIsReady(true);
      }

      // Store APKs only — credit any purchase that was paid for but
      // never verified (app killed mid-flow, network drop, ...).
      recoverPendingPurchases();
    }

    if (!getStoredTheme()) {
      setTheme(detectPreferredTheme());
    }
  };

  const showLogin = () => {
    Hamdast.login(
      "",
      "لطفا شماره موبایل خود را وارد کنید",
      "loginSuccess",
      "loginError",
    );
  };

  window.loginSuccess = async () => {
    await handleLoginSuccess();
    setIsReady(true);
  };

  window.loginError = () => {
    Hamdast.close();
  };

  const handleError = (error, errorInfo) => {
    // Log error to console for debugging
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // You can also send error to your logging service here
    // Example: logErrorToService(error, errorInfo);
  };

  const handleReset = () => {
    // Optional: Clear any problematic state
    // You can add custom reset logic here
    window.location.reload();
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={handleReset}
    >
      {!isReady ? (
        <>
          <CheckLogin />
          <AuthBottomSheet />
          <Toaster toastOptions={toastOptions} />
        </>
      ) : (
        <>
          <RouterProvider router={router} />

          <Toaster toastOptions={toastOptions} />
          <AuthBottomSheet />
          <LoadingOverlay
            spinner
            active={showOverlayLoading}
            text="لطفا منتظر باشید..."
            fadeSpeed={200}
            styles={{
              overlay: (base) => ({
                ...base,
                position: "fixed",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                zIndex: 99999999,
              }),
              spinner: (base) => ({
                ...base,
                marginBottom: "20px",
              }),
            }}
          />
        </>
      )}
    </ErrorBoundary>
  );
}

export default App;
