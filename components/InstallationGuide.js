"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FaDownload, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import PrimaryButton from "./ui/PrimaryButton";

const InstallationGuide = ({ debug = true }) => {
  const { t } = useTranslation();
  const [installState, setInstallState] = useState({
    deferredPrompt: null,
    canInstall: false,
    platformDetails: {
      os: "Unknown",
      browser: "Unknown",
      deviceType: "Unknown",
    },
  });

  const detectPlatform = useMemo(() => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    // Definitive OS Detection
    const detectOS = () => {
      // Prioritize platform detection
      if (/Win/i.test(platform)) return "Windows";
      if (/Mac/i.test(platform)) return "macOS";
      if (/Linux/i.test(platform)) return "Linux";

      // Fallback to user agent checks
      const uaLower = userAgent.toLowerCase();
      if (/windows/i.test(uaLower)) return "Windows";
      if (/macintosh/i.test(uaLower)) return "macOS";
      if (/linux/i.test(uaLower)) return "Linux";
      if (/android/i.test(uaLower)) return "Android";
      if (/iphone|ipad|ipod/i.test(uaLower)) return "iOS";

      return "Unknown";
    };

    const detectDeviceType = () => {
      const uaLower = userAgent.toLowerCase();

      // Explicit desktop indicators
      const desktopIndicators = [
        /windows nt/i,
        /macintosh/i,
        /x11/i,
        /linux/i,
        /win32/i,
        /win64/i,
      ];

      const mobileIndicators = [
        /android/i,
        /webos/i,
        /iphone/i,
        /ipad/i,
        /ipod/i,
        /blackberry/i,
        /windows phone/i,
        /mobile safari/i,
      ];

      // Explicit desktop detection
      if (desktopIndicators.some((indicator) => indicator.test(uaLower))) {
        return "Desktop";
      }

      // Explicit mobile detection
      if (mobileIndicators.some((indicator) => indicator.test(uaLower))) {
        return "Mobile";
      }

      // Window width as fallback
      if (window.innerWidth > 1024) return "Desktop";

      return "Unknown";
    };

    const detectBrowser = () => {
      const uaLower = userAgent.toLowerCase();
      const browserChecks = [
        {
          name: "Chrome",
          test: () =>
            /chrome/i.test(uaLower) &&
            !/edg/i.test(uaLower) &&
            !/opr/i.test(uaLower),
        },
        {
          name: "Firefox",
          test: () => /firefox/i.test(uaLower),
        },
        {
          name: "Safari",
          test: () => /safari/i.test(uaLower) && !/chrome/i.test(uaLower),
        },
        {
          name: "Edge",
          test: () => /edg/i.test(uaLower),
        },
        {
          name: "Opera",
          test: () => /opr/i.test(uaLower),
        },
      ];

      const detectedBrowser = browserChecks.find((browser) => browser.test());
      return detectedBrowser ? detectedBrowser.name : "Unknown";
    };

    const detectedPlatform = {
      os: detectOS(),
      browser: detectBrowser(),
      deviceType: detectDeviceType(),
    };

    // Extensive logging for debugging
    console.log("Detailed Platform Detection", {
      userAgent,
      platform,
      detectedPlatform,
    });

    return detectedPlatform;
  }, []);

  useEffect(() => {
    // Comprehensive Installation Status Check
    const checkInstallationStatus = () => {
      // Multiple methods to detect if app is already installed
      const installationChecks = [
        window.matchMedia("(display-mode: standalone)").matches,
        navigator.standalone === true,
        document.referrer.includes("android-app://"),
        localStorage.getItem("app_installed") === "true",
      ];

      const isInstalled = installationChecks.some((check) => check);

      // Logging for debugging
      console.group("PWA Installation Diagnostic");
      console.log("Installation Checks:", {
        standaloneMode: window.matchMedia("(display-mode: standalone)").matches,
        navigatorStandalone: navigator.standalone,
        referrerCheck: document.referrer.includes("android-app://"),
        localStorageCheck: localStorage.getItem("app_installed") === "true",
        finalInstallStatus: !isInstalled,
      });
      console.groupEnd();

      return !isInstalled;
    };

    // Installation Prompt Handler
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();

      console.log("Installation Prompt Captured:", e);

      setInstallState((prev) => ({
        ...prev,
        deferredPrompt: e,
        canInstall: checkInstallationStatus(),
        platformDetails: detectPlatform,
      }));
    };

    // Add event listener for installation prompt
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Add event listener for successful installation
    window.addEventListener("appinstalled", () => {
      localStorage.setItem("app_installed", "true");
      setInstallState((prev) => ({
        ...prev,
        canInstall: false,
        deferredPrompt: null,
      }));
    });

    // Initial installation status check
    setInstallState((prev) => ({
      ...prev,
      canInstall: checkInstallationStatus(),
    }));

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [detectPlatform]);

  const handleInstallClick = async () => {
    const { deferredPrompt } = installState;

    if (!deferredPrompt) {
      console.error("No installation prompt available");
      toast.error(t("install_not_supported"));
      return;
    }

    try {
      const result = await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      console.log("Installation Result:", choiceResult);

      if (choiceResult.outcome === "accepted") {
        toast.success(t("install_success"));
        localStorage.setItem("app_installed", "true");
      } else {
        toast.info(t("install_canceled"));
      }

      // Reset state
      setInstallState((prev) => ({
        ...prev,
        deferredPrompt: null,
        canInstall: false,
      }));
    } catch (error) {
      console.error("Installation Error:", error);
      toast.error(t("install_error"));
    }
  };

  // Render install button if installable
  if (!installState.canInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <PrimaryButton onClick={handleInstallClick} aria-label={t("install_app")}>
        <FaPlus className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <FaDownload className="text-lg" aria-hidden="true" />
        <span className="px-2">{t("install_app")}</span>
      </PrimaryButton>
    </div>
  );
};

export default InstallationGuide;
