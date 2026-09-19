import { useEffect } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

function dispatchEscape() {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      which: 27,
      bubbles: true,
      cancelable: true,
    })
  );
}

/**
 * Close the top-most overlay (dialog, menu, bottom sheet) without leaving the page.
 * Returns true when something was dismissed so the back press is consumed.
 */
function dismissOpenOverlay() {
  if (document.querySelector('[role="alertdialog"][data-state="open"]')) {
    dispatchEscape();
    return true;
  }

  if (document.querySelector('[role="dialog"][data-state="open"]')) {
    dispatchEscape();
    return true;
  }

  if (
    document.querySelector(
      "[data-radix-menu-content][data-state='open'], [data-radix-dropdown-menu-content][data-state='open']"
    )
  ) {
    dispatchEscape();
    return true;
  }

  const sheetBackdrop = document.querySelector("[data-rsbs-backdrop]");
  if (sheetBackdrop) {
    sheetBackdrop.click();
    return true;
  }

  return false;
}

function canNavigateBack() {
  const historyIndex = window.history.state?.idx;
  if (typeof historyIndex === "number") return historyIndex > 0;
  return window.history.length > 1;
}

/**
 * Android hardware back should walk the SPA history stack like a browser,
 * then exit only when there is nothing left to pop.
 */
export default function useAndroidBackButton() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") {
      return;
    }

    let cancelled = false;
    let handle;

    App.addListener("backButton", () => {
      if (dismissOpenOverlay()) return;

      if (canNavigateBack()) {
        window.history.back();
        return;
      }

      App.exitApp();
    }).then((listener) => {
      handle = listener;
      if (cancelled) handle.remove();
    });

    return () => {
      cancelled = true;
      handle?.remove();
    };
  }, []);
}
