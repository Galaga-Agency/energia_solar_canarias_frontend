import React, { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const InstallationGuide = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    isPWA: false,
    userAgent: "",
    platform: "",
  });

  useEffect(() => {
    // Check platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroidDevice = /android/.test(userAgent);
    setIsAndroid(isAndroidDevice);

    const isIOSDevice =
      /ipad|iphone|ipod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Set debug info
    setDebugInfo({
      isPWA: window.matchMedia("(display-mode: standalone)").matches,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isAndroid: isAndroidDevice,
    });

    // Handle beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("Install prompt event captured");
    };

    // For Android Chrome, we want to be more aggressive in checking
    if (
      isAndroidDevice &&
      !window.matchMedia("(display-mode: standalone)").matches
    ) {
      setIsInstallable(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    console.log("Install clicked:", { deferredPrompt, isAndroid, isIOS });

    if (deferredPrompt) {
      try {
        const result = await deferredPrompt.prompt();
        console.log("Install prompt result:", result);
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error("Error showing install prompt:", error);
      }
    } else if (isAndroid) {
      // If we're on Android but don't have a deferredPrompt,
      // we can show instructions
      alert(t("androidInstallInstructions"));
    }
  };

  // Hide if already installed
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-custom-yellow text-custom-dark-blue font-semibold px-4 h-9 rounded-md shadow-md hover:bg-opacity-90 transition-all"
      >
        <FaDownload className="text-lg" />
        <span>{isIOS ? t("addToHomeScreen") : t("installApp")}</span>
      </button>

      {/* Debug info - you can remove this in production */}
      {/* <div className="text-xs text-gray-500">
        <div>
          {t("installable")}: {isInstallable ? t("yes") : t("no")}
        </div>
        <div>
          {t("iosDevice")}: {isIOS ? t("yes") : t("no")}
        </div>
        <div>
          {t("androidDevice")}: {isAndroid ? t("yes") : t("no")}
        </div>
        <div>
          {t("pwaMode")}: {debugInfo.isPWA ? t("yes") : t("no")}
        </div>
        <div>
          {t("platform")}: {debugInfo.platform}
        </div>
        <div>UA: {debugInfo.userAgent.slice(0, 50)}...</div>
      </div> */}
    </div>
  );
};

export default InstallationGuide;
