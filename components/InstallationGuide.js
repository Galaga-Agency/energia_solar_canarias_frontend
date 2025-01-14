import React, { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const InstallationGuide = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    setIsPWAInstalled(isStandalone);

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("beforeinstallprompt event fired");
    });

    setDebugInfo({
      isStandalone,
      manifest: document.querySelector('link[rel="manifest"]')?.href,
      serviceWorker: !!navigator.serviceWorker.controller,
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error("Error showing install prompt:", error);
      }
    } else {
      alert(t("notInstallable"));
    }
  };

  if (isPWAInstalled) {
    return null;
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <div>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-custom-yellow text-custom-dark-blue font-semibold px-4 h-9 rounded-md shadow-md hover:bg-opacity-90 transition-all"
      >
        <FaDownload className="text-lg" />
        <span>{t("installApp")}</span>
      </button>

      {/* Debug Info */}
      {/* <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <div>Is installable: {isInstallable ? "Yes" : "No"}</div>
        <div>Is standalone: {isPWAInstalled ? "Yes" : "No"}</div>
        <div>Manifest linked: {debugInfo.manifest ? "Yes" : "No"}</div>
        <div>
          Service Worker active: {debugInfo.serviceWorker ? "Yes" : "No"}
        </div>
      </div> */}
    </div>
  );
};

export default InstallationGuide;
