"use client";

import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { toast } from "sonner";
import PrimaryButton from "./ui/PrimaryButton";

const InstallationGuide = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  // Listen for the `beforeinstallprompt` event
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Detect if the app is already installed
  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone;

    if (isStandalone) {
      setCanInstall(false); // Hide the button if the app is already installed
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error("Installation prompt is not available.");
      return;
    }

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        toast.success("App installed successfully!");
        setDeferredPrompt(null); // Reset the deferred prompt
        setCanInstall(false); // Hide the button after installation
      } else {
        toast.info("Installation canceled.");
      }
    } catch (error) {
      console.error("Installation error:", error);
      toast.error("Failed to install the app.");
    }
  };

  if (!canInstall) return null; // Don't render the button if installation is not possible

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <PrimaryButton onClick={handleInstallClick}>
        <FaDownload className="text-lg" />
        <span className="px-2">Install App</span>
      </PrimaryButton>
    </div>
  );
};

export default InstallationGuide;
