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

  const showSuccessMessage = useCallback(() => {
    toast.success(t("install_success"), {
      description: t("install_success_description"),
      duration: 6000,
      className:
        "bg-white/90 dark:bg-custom-dark-blue/90 backdrop-blur-lg text-custom-dark-blue dark:text-custom-light-gray",
    });
  }, [t]);

  const handleClick = useCallback(async () => {
    log("Install button clicked", { hasPrompt: !!deferredPrompt });

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      log("User choice", choiceResult);

      setDeferredPrompt(null);

      if (choiceResult.outcome === "accepted") {
        setInstallState((prev) => ({ ...prev, isInstalled: true }));
        showSuccessMessage();
      }
    } catch (error) {
      log("Installation error", error);
    }
  }, [deferredPrompt, log, showSuccessMessage]);

  useEffect(() => {
    if (!isBrowser) return;

    setMounted(true);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      log("Install prompt captured");
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      log("App installed successfully");
      setInstallState((prev) => ({ ...prev, isInstalled: true }));
      setDeferredPrompt(null);
      showSuccessMessage();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isBrowser, log, showSuccessMessage]);

  if (!mounted || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <PrimaryButton onClick={handleClick} aria-label={t("install_app")}>
        <FaPlus className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <FaDownload className="text-lg" aria-hidden="true" />
        <span className="px-2">{t("install_app")}</span>
      </PrimaryButton>
    </div>
  );
};

export default InstallationGuide;
