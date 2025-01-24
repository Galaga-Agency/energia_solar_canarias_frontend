import React from "react";
import { FaDownload } from "react-icons/fa";
import { toast } from "sonner";
import PrimaryButton from "./ui/PrimaryButton";
import usePWADiagnostics from "@/hooks/usePWADiagnostics";

const InstallationGuide = () => {
  const {
    isHTTPS,
    hasManifest,
    supportsBeforeInstallPrompt,
    hasServiceWorker,
    isStandalone,
    canInstall,
    deferredPrompt,
  } = usePWADiagnostics();

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.error("No installation prompt available");
      return;
    }

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        toast.success("App installed successfully!");
      } else {
        toast.info("App installation canceled.");
      }
    } catch (error) {
      console.error("Error during installation:", error);
      toast.error("Installation failed.");
    }
  };

  return (
    <div>
      {canInstall && (
        <PrimaryButton onClick={handleInstallClick}>
          <FaDownload className="text-lg" /> Install App
        </PrimaryButton>
      )}
    </div>
  );
};

export default InstallationGuide;
