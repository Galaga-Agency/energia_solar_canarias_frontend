"use client";

import React from "react";
import { FaDownload } from "react-icons/fa";
import { toast } from "sonner";
import PrimaryButton from "@/components/ui/PrimaryButton";
import usePWADiagnostics from "@/hooks/usePWADiagnostics";
import { useTranslation } from "react-i18next";

const InstallationGuide = () => {
  const { deferredPrompt, isInstalled, showButton, isIOS } =
    usePWADiagnostics();
  const { t } = useTranslation();

  // console.log("Installation Guide States:");
  // console.log("isInstalled:", isInstalled);
  // console.log("deferredPrompt:", deferredPrompt);
  // console.log("showButton:", showButton);
  // console.log("isIOS:", isIOS);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show a custom instruction for iOS users to add to Home Screen
      toast.info(t("install_ios_message"));
    } else if (deferredPrompt && typeof deferredPrompt.prompt === "function") {
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

  // Hide the button if the app is already installed
  if (isInstalled) return null;

  return (
    showButton && (
      <div className="fixed bottom-4 right-4 z-50">
        <PrimaryButton onClick={handleInstallClick}>
          <FaDownload className="text-xl md:text-lg pl-2 shrink-0" />
          <span className="px-2">{t("install_app")}</span>
        </PrimaryButton>
      </div>
    )
  );
};

export default InstallationGuide;
