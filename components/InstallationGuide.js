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

    // Definitive Platform Detection
    const detectOS = () => {
      // Prioritize platform detection over user agent
      if (/Win/i.test(platform)) return "Windows";
      if (/Mac/i.test(platform)) return "macOS";
      if (/Linux/i.test(platform)) return "Linux";

      // Fallback to more specific user agent checks
      const uaLower = userAgent.toLowerCase();
      if (/windows/i.test(uaLower)) return "Windows";
      if (/macintosh/i.test(uaLower)) return "macOS";
      if (/linux/i.test(uaLower)) return "Linux";

      return "Unknown";
    };

    const detectDeviceType = () => {
      const uaLower = userAgent.toLowerCase();

      // Explicit desktop checks
      const desktopIndicators = [/windows nt/i, /macintosh/i, /x11/i, /linux/i];

      const mobileIndicators = [
        /android/i,
        /webos/i,
        /iphone/i,
        /ipad/i,
        /ipod/i,
        /blackberry/i,
        /windows phone/i,
      ];

      // Check for explicit desktop indicators first
      if (desktopIndicators.some((indicator) => indicator.test(uaLower))) {
        return "Desktop";
      }

      // Then check if it's explicitly mobile
      if (mobileIndicators.some((indicator) => indicator.test(uaLower))) {
        return "Mobile";
      }

      // Use browser window to determine device type
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
        { name: "Firefox", test: () => /firefox/i.test(uaLower) },
        {
          name: "Safari",
          test: () => /safari/i.test(uaLower) && !/chrome/i.test(uaLower),
        },
        { name: "Edge", test: () => /edg/i.test(uaLower) },
        { name: "Opera", test: () => /opr/i.test(uaLower) },
      ];

      const detectedBrowser = browserChecks.find((browser) => browser.test());
      return detectedBrowser ? detectedBrowser.name : "Unknown";
    };

    const detectedPlatform = {
      os: detectOS(),
      browser: detectBrowser(),
      deviceType: detectDeviceType(),
    };

    // Additional logging for debugging
    console.log("Detailed Platform Detection:", {
      userAgent,
      platform,
      detectedPlatform,
    });

    return detectedPlatform;
  }, []);

  useEffect(() => {
    // Detailed Logging
    const logPlatformCapabilities = () => {
      console.group("PWA Installation Diagnostic");
      console.log("Detected Platform:", detectPlatform);
      console.log(
        "Manifest Present:",
        !!document.querySelector('link[rel="manifest"]')
      );
      console.log("Service Worker Supported:", "serviceWorker" in navigator);
      console.log(
        "Installation Prompt Supported:",
        "beforeinstallprompt" in window
      );
      console.groupEnd();
    };

    // Installation Prompt Handler
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();

      console.log("Installation Prompt Captured:", e);

      setInstallState((prev) => ({
        ...prev,
        deferredPrompt: e,
        canInstall: true,
        platformDetails: detectPlatform,
      }));

      // Log additional details
      logPlatformCapabilities();
    };

    // Add event listener
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Initial capability check
    logPlatformCapabilities();

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
      console.error("No deferred prompt available");
      toast.error("Installation not supported");
      return;
    }

    try {
      const result = await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      console.log("Installation Result:", choiceResult);
      console.log("Platform Details:", installState.platformDetails);

      if (choiceResult.outcome === "accepted") {
        toast.success(t("install_success"));
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

  // Render install button if can install
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
