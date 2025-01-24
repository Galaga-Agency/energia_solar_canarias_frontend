"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaDownload, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import PrimaryButton from "./ui/PrimaryButton";

const InstallationGuide = ({ debug = true }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installState, setInstallState] = useState({
    isInstallable: false,
    isInstalled: false,
    platform: null,
    installMethod: null,
  });

  const isBrowser = typeof window !== "undefined";

  const log = useCallback(
    (message, data = {}) => {
      if (debug && isBrowser) {
        console.log(`[PWA Install Debug] ${message}`, data);
      }
    },
    [debug, isBrowser]
  );

  const handleInstallClick = useCallback(async () => {
    log("Install button clicked", {
      hasPrompt: !!deferredPrompt,
      platform: installState.platform,
    });

    if (!deferredPrompt) {
      if (installState.platform === "iOS") {
        toast.info("Install on iOS", {
          description: (
            <div className="space-y-2">
              <p>To install our app:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Tap the share button (rectangle with arrow)</li>
                <li>Scroll and select &quot;Add to Home Screen&quot;</li>
                <li>Tap &quot;Add&quot; to complete installation</li>
              </ol>
            </div>
          ),
          duration: 10000,
        });
        return;
      }

      if (installState.platform === "Android") {
        toast.info("Install on Android", {
          description: (
            <div className="space-y-2">
              <p>To install our app:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Tap the menu button (three dots)</li>
                <li>Select &quot;Install app&quot;</li>
                <li>Follow the prompts to complete installation</li>
              </ol>
            </div>
          ),
          duration: 10000,
        });
        return;
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      log("User choice", { outcome: choiceResult.outcome });

      if (choiceResult.outcome === "accepted") {
        setInstallState((prev) => ({ ...prev, isInstalled: true }));
      } else {
        toast("Installation Declined", {
          description:
            "You can install the app later from the menu if you change your mind",
        });
      }

      setDeferredPrompt(null);
      setInstallState((prev) => ({ ...prev, isInstallable: false }));
    } catch (error) {
      log("Installation error", { error: error.message });
      toast.error("Installation Error", {
        description:
          "There was a problem installing the app. Please try again later.",
      });
    }
  }, [deferredPrompt, installState.platform, log]);

  useEffect(() => {
    if (!isBrowser) return;

    setMounted(true);

    const detectPlatform = () => {
      const ua = window.navigator.userAgent.toLowerCase();
      const isIOS = /ipad|iphone|ipod/.test(ua) && !window.MSStream;
      const isAndroid = /android/.test(ua);
      const isChrome = /chrome/.test(ua);

      let platform = isIOS ? "iOS" : isAndroid ? "Android" : "Desktop";
      let method = isChrome ? "chrome" : "browser";

      log("Platform Detection", { platform, method, userAgent: ua });
      return { platform, method };
    };

    const platformInfo = detectPlatform();

    const checkInstallation = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isNavigatorStandalone = window.navigator?.standalone;
      return isStandalone || isNavigatorStandalone;
    };

    setInstallState((prev) => ({
      ...prev,
      platform: platformInfo.platform,
      installMethod: platformInfo.method,
      isInstalled: checkInstallation(),
    }));

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      log("Install prompt received", { type: e.type });
      setDeferredPrompt(e);
      setInstallState((prev) => ({ ...prev, isInstallable: true }));

      toast("Install App", {
        description: "Get quick access to our app from your device",
        action: {
          label: "Install",
          onClick: () => handleInstallClick(),
        },
        duration: 10000,
      });
    };

    const handleAppInstalled = () => {
      log("App installed successfully");
      setInstallState((prev) => ({ ...prev, isInstalled: true }));
      setDeferredPrompt(null);

      toast.success("App Installed Successfully", {
        description: "You can now access the app from your home screen",
      });
    };

    const handleDisplayModeChange = (e) => {
      log("Display mode changed", { isStandalone: e.matches });
      setInstallState((prev) => ({ ...prev, isInstalled: e.matches }));
    };

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    mediaQuery.addListener(handleDisplayModeChange);

    return () => {
      mediaQuery.removeListener(handleDisplayModeChange);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isBrowser, handleInstallClick, log]);

  if (!mounted) return null;

  if (installState.isInstalled) {
    log("PWA is installed - hiding button");
    return null;
  }

  const buttonText =
    installState.platform === "iOS"
      ? t("addToHomeScreen", "Add to Home Screen")
      : t("installApp", "Install App");

  const shouldShowButton =
    installState.isInstallable ||
    ["iOS", "Android"].includes(installState.platform);

  if (!shouldShowButton) {
    log("Install conditions not met - hiding button");
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <PrimaryButton onClick={handleInstallClick} aria-label={buttonText}>
        <FaPlus className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <FaDownload className="text-lg" aria-hidden="true" />
        <span>{buttonText}</span>
      </PrimaryButton>
    </div>
  );
};

export default InstallationGuide;
