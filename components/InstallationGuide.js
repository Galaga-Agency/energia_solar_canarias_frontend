"use client";

import React from "react";
import { FaDownload } from "react-icons/fa";
import { toast } from "sonner";
import PrimaryButton from "@/components/ui/PrimaryButton";
import usePWADiagnostics from "@/hooks/usePWADiagnostics";
import usePlatformDetection from "@/hooks/usePlatformDetection";
import { useTranslation } from "react-i18next";
import { downloadMobileAppAPI } from "@/services/shared-api";
import useDeviceType from "@/hooks/useDeviceType";
import { BsDownload } from "react-icons/bs";

const InstallationGuide = () => {
  const { deferredPrompt, isInstalled, showButton } = usePWADiagnostics();
  const { deviceType } = usePlatformDetection();
  const { t } = useTranslation();
  const { isDesktop } = useDeviceType();

  const handleInstallClick = async () => {
    if (deviceType === "Mobile" || deviceType === "Tablet") {
      try {
        toast.info(t("downloading_message"));
        await downloadMobileAppAPI();
        toast.success(t("download_complete"));
      } catch (error) {
        console.error("Download error:", error);
        toast.error(t("download_error"));
      }
      return;
    }

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

  if (!showButton || isInstalled) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-custom-yellow hover:bg-custom-yellow/90 transition-all duration-300 text-custom-dark-blue shadow-lg hover:shadow-xl p-3 flex items-center justify-center gap-3 group"
    >
      <BsDownload className="text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300" />
      {isDesktop && (
        <span className="pr-3 font-medium">{t("install_app")}</span>
      )}
    </button>
  );
};

export default InstallationGuide;
