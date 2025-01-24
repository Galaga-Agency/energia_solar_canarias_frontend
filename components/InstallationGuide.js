import React, { useState, useEffect } from "react";
import { FaDownload, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import PrimaryButton from "./ui/PrimaryButton";

const InstallationGuide = ({ debug = true }) => {
  const { t } = useTranslation();
  const [installState, setInstallState] = useState({
    deferredPrompt: null,
    canInstall: false,
    browserSupport: false,
  });

  useEffect(() => {
    // Extremely detailed logging
    const logBrowserCapabilities = () => {
      console.group("PWA Installation Diagnostic");
      console.log("Window Object:", !!window);
      console.log(
        "beforeinstallprompt in window:",
        "beforeinstallprompt" in window
      );
      console.log("Full User Agent:", navigator.userAgent);
      console.log("Platform:", navigator.platform);
      console.log(
        "Manifest Present:",
        !!document.querySelector('link[rel="manifest"]')
      );
      console.log("Service Worker Supported:", "serviceWorker" in navigator);
      console.groupEnd();
    };

    // Initial comprehensive check
    const checkInstallationSupport = () => {
      logBrowserCapabilities();

      // Explicit support detection
      const browserSupport = "beforeinstallprompt" in window;
      const manifestPresent = !!document.querySelector('link[rel="manifest"]');

      console.warn("Browser PWA Support Check:", {
        browserSupport,
        manifestPresent,
      });

      return { browserSupport, manifestPresent };
    };

    // Installation Prompt Handler
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();

      console.log("Installation Prompt Captured:", e);

      setInstallState((prev) => ({
        ...prev,
        deferredPrompt: e,
        canInstall: true,
        browserSupport: true,
      }));
    };

    // Perform initial checks
    const supportStatus = checkInstallationSupport();

    // Add event listener
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

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
