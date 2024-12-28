import React, { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const InstallationGuide = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    isPWA: false,
    userAgent: "",
    platform: "",
  });

  useEffect(() => {
    // Debug information
    setDebugInfo({
      isPWA: window.matchMedia("(display-mode: standalone)").matches,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    });

    // Check if device is iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Log when the component mounts
    console.log("InstallationGuide mounted", {
      isIOSDevice,
      isStandalone: window.matchMedia("(display-mode: standalone)").matches,
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    console.log("Install button clicked", { deferredPrompt, isIOS });

    if (!deferredPrompt && !isIOS) {
      console.log("No installation prompt available");
      return;
    }

    if (deferredPrompt) {
      try {
        const result = await deferredPrompt.prompt();
        console.log("Install prompt result:", result);
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error("Error showing install prompt:", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-custom-yellow text-custom-dark-blue font-semibold px-4 h-9 rounded-md shadow-md hover:bg-opacity-90 transition-all"
      >
        <FaDownload className="text-lg" />
        <span>{isIOS ? t("addToHomeScreen") : t("installApp")}</span>
      </button>

      {/* Debug information - remove in production */}
      <div className="text-xs text-gray-500">
        <div>
          {t("installable")}: {isInstallable ? t("yes") : t("no")}
        </div>
        <div>
          {t("iosDevice")}: {isIOS ? t("yes") : t("no")}
        </div>
        <div>
          {t("pwaMode")}: {debugInfo.isPWA ? t("yes") : t("no")}
        </div>
        <div>
          {t("platform")}: {debugInfo.platform}
        </div>
      </div>
    </div>
  );
};

export default InstallationGuide;
