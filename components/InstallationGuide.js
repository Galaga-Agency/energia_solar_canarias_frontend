"use client";

import React, { useState, useEffect } from "react";
import { BsDownload } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import { toast } from "sonner";
import usePWADiagnostics from "@/hooks/usePWADiagnostics";
import usePlatformDetection from "@/hooks/usePlatformDetection";
import { useTranslation } from "react-i18next";
import useDeviceType from "@/hooks/useDeviceType";

// App store and deep link URLs
const APP_LINKS = {
  ANDROID: {
    STORE:
      "https://play.google.com/store/apps/details?id=com.galaga.esc_android&pli=1",
    DEEP_LINK: "energiasolarcanaria://open", // Your Android deep link
  },
  IOS: {
    STORE:
      "https://apps.apple.com/es/app/energ%C3%ADa-solar-canarias/id6744018149",
    DEEP_LINK: "energiasolarcanaria://open", // Your iOS deep link
  },
};

const InstallationGuide = () => {
  const { deferredPrompt, isInstalled, showButton } = usePWADiagnostics();
  const { deviceType, os } = usePlatformDetection();
  const { t } = useTranslation();
  const { isDesktop } = useDeviceType();
  const [isNativeAppInstalled, setIsNativeAppInstalled] = useState(false);
  const [isCheckingForApp, setIsCheckingForApp] = useState(false);

  // Try to detect if the app is already installed
  useEffect(() => {
    const checkAppInstalled = async () => {
      if (isDesktop || isCheckingForApp) return;

      setIsCheckingForApp(true);

      try {
        if (os === "iOS" || os === "Android") {
          // Try to detect by using localStorage to remember if the user successfully opened the app before
          const hasOpenedNativeApp = localStorage.getItem("hasOpenedNativeApp");
          if (hasOpenedNativeApp === "true") {
            setIsNativeAppInstalled(true);
            setIsCheckingForApp(false);
            return;
          }

          // For a more sophisticated check on Android, we could try to detect intent availability,
          // but it's not 100% reliable across browsers
        }
      } catch (error) {
        console.error("Error checking for installed app:", error);
      }

      setIsCheckingForApp(false);
    };

    checkAppInstalled();
  }, [os, isDesktop, isCheckingForApp]);

  const handleInstallClick = async () => {
    // For mobile or tablet devices
    if (deviceType === "Mobile" || deviceType === "Tablet") {
      try {
        const appLinks = os === "iOS" ? APP_LINKS.IOS : APP_LINKS.ANDROID;

        // If we think the app is installed, try to open it directly
        if (isNativeAppInstalled) {
          toast.info(t("opening_app") || "Opening app...");

          // Create an iframe to try opening the app via deep link
          const appOpenTime = Date.now();
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = appLinks.DEEP_LINK;
          document.body.appendChild(iframe);

          // Set a timeout to check if we're still in the browser after a short delay
          setTimeout(() => {
            document.body.removeChild(iframe);
            // If we're still here after the timeout, the app might not be installed
            if (Date.now() - appOpenTime > 1500) {
              // App didn't open, redirect to store
              window.location.href = appLinks.STORE;
            } else {
              // Mark as successfully opened for future reference
              localStorage.setItem("hasOpenedNativeApp", "true");
            }
          }, 1000);

          return;
        }

        // If the app is not (known to be) installed, go to the store
        toast.info(t("redirecting_to_store") || "Redirecting to app store...");
        window.location.href = appLinks.STORE;
      } catch (error) {
        console.error("App interaction error:", error);
        toast.error(t("interaction_error") || "Error interacting with the app");
      }
      return;
    }

    // For desktop, keep the existing PWA installation
    if (deferredPrompt && typeof deferredPrompt.prompt === "function") {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;

        if (choiceResult.outcome === "accepted") {
          toast.success(
            `${t("installation_success_title")}: ${t(
              "installation_success_description"
            )}`
          );
        }
      } catch (error) {
        console.error("Installation error:", error);
        toast.error(t("installation_error_description"));
      }
    } else {
      console.error("No valid deferredPrompt available.");
      toast.error(t("installation_error_description"));
    }
  };

  // Don't show the button for desktop if PWA is already installed
  if (isDesktop && (isInstalled || !showButton)) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-custom-yellow hover:bg-custom-yellow/90 transition-all duration-300 text-custom-dark-blue shadow-lg hover:shadow-xl p-3 flex items-center justify-center gap-3 group"
    >
      {isNativeAppInstalled ? (
        <FaExternalLinkAlt className="text-xl shrink-0 group-hover:scale-110 transition-transform duration-300" />
      ) : (
        <BsDownload className="text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300" />
      )}

      <span className="pr-3 font-medium">
        {isDesktop
          ? t("install_app")
          : isNativeAppInstalled
          ? t("open_in_app") || "Abrir en la app"
          : t("get_app") || "Get App"}
      </span>
    </button>
  );
};

export default InstallationGuide;
