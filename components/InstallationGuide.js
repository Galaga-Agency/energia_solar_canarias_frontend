"use client";

import React from "react";
import { FaDownload } from "react-icons/fa";
import { toast } from "sonner";
import PrimaryButton from "@/components/ui/PrimaryButton";
import usePWADiagnostics from "@/hooks/usePWADiagnostics";
import { useTranslation } from "react-i18next";

const InstallationGuide = () => {
  const { deferredPrompt, isInstalled, showButton } = usePWADiagnostics();
  const { t } = useTranslation();

  console.log("Installation Guide States:");
  console.log("isInstalled:", isInstalled);
  console.log("deferredPrompt:", deferredPrompt);
  console.log("showButton:", showButton);

  const handleInstallClick = async () => {
    if (deferredPrompt && typeof deferredPrompt.prompt === "function") {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;

        if (choiceResult.outcome === "accepted") {
          toast.success(
            `${t("installation.success.title")}: ${t(
              "installation.success.description"
            )}`
          );
        } else {
          toast.info(t("installation.unavailable"));
        }
      } catch (error) {
        console.error("Installation error:", error);
        toast.error(t("installation.error.description"));
      }
    } else {
      console.error("No valid deferredPrompt available.");
      toast.error("Failed to trigger install prompt.");
    }
  };

  // Hide the button if the app is already installed
  if (isInstalled) return null;

  console.log("showButton", showButton);
  return (
    showButton && (
      <div className="fixed bottom-4 right-4 z-50">
        <PrimaryButton onClick={handleInstallClick}>
          <FaDownload className="text-lg" />
          <span className="px-2">{t("install_app")}</span>
        </PrimaryButton>
      </div>
    )
  );
};

export default InstallationGuide;
