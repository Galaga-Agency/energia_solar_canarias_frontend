import React, { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const InstallationGuide = ({ debug = false }) => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installState, setInstallState] = useState({
    isInstallable: false,
    isInstalled: false,
    isIOS: false,
  });
  const [debugInfo, setDebugInfo] = useState({
    userAgent: "",
    platform: "",
    displayMode: "",
    manifestSupport: false,
    serviceWorkerSupport: false,
    installPromptSupport: false,
    installHistory: [],
  });

  const logDebugInfo = (message, data = {}) => {
    if (debug) {
      console.log(`[PWA Install Debug] ${message}`, data);
      setDebugInfo((prev) => ({
        ...prev,
        installHistory: [
          ...prev.installHistory,
          {
            timestamp: new Date().toISOString(),
            message,
            data,
          },
        ],
      }));
    }
  };

  useEffect(() => {
    // Initialize debug information
    const initDebugInfo = () => {
      const manifest = document.querySelector('link[rel="manifest"]');
      const swSupport = "serviceWorker" in navigator;

      setDebugInfo((prev) => ({
        ...prev,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        displayMode: window.matchMedia("(display-mode: standalone)").matches
          ? "standalone"
          : "browser",
        manifestSupport: !!manifest,
        serviceWorkerSupport: swSupport,
        installPromptSupport: "BeforeInstallPromptEvent" in window,
      }));

      logDebugInfo("Initial debug info collected", {
        userAgent: navigator.userAgent,
        manifest: manifest?.href,
        serviceWorker: swSupport,
      });
    };

    initDebugInfo();

    // Check if running on iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    logDebugInfo("Platform detection", { isIOS });

    // Multiple methods to detect if PWA is installed
    const checkInstallation = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone ||
        document.referrer.includes("android-app://");

      logDebugInfo("Installation check", {
        isStandalone,
        navigatorStandalone: window.navigator.standalone,
        referrer: document.referrer,
      });

      setInstallState((prev) => ({
        ...prev,
        isInstalled: isStandalone,
        isIOS,
      }));
    };

    checkInstallation();

    // Listen for display mode changes
    const displayModeQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = (e) => {
      logDebugInfo("Display mode changed", { matches: e.matches });
      checkInstallation();
    };
    displayModeQuery.addListener(handleDisplayModeChange);

    // Handle installation prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      logDebugInfo("Install prompt received", {
        prompt: "beforeinstallprompt",
      });
      setDeferredPrompt(e);
      setInstallState((prev) => ({ ...prev, isInstallable: true }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Handle successful installation
    const handleAppInstalled = (event) => {
      logDebugInfo("App installed successfully");
      setInstallState((prev) => ({ ...prev, isInstalled: true }));
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Monitor service worker registration
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          logDebugInfo("Service Worker ready", {
            scope: registration.scope,
            state: registration.active?.state,
          });
        })
        .catch((error) => {
          logDebugInfo("Service Worker error", { error: error.message });
        });
    }

    return () => {
      displayModeQuery.removeListener(handleDisplayModeChange);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [debug]);

  const handleInstallClick = async () => {
    logDebugInfo("Install button clicked", {
      deferredPrompt: !!deferredPrompt,
      isIOS: installState.isIOS,
    });

    if (!deferredPrompt) {
      if (installState.isIOS) {
        logDebugInfo("Showing iOS instructions");
        alert(
          t(
            "iosInstallInstructions",
            "Add to Home Screen by tapping the share button and selecting 'Add to Home Screen'"
          )
        );
        return;
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      logDebugInfo("Installation prompt result", {
        outcome: choiceResult.outcome,
        platform: navigator.platform,
      });

      if (choiceResult.outcome === "accepted") {
        setInstallState((prev) => ({ ...prev, isInstalled: true }));
      }

      setDeferredPrompt(null);
      setInstallState((prev) => ({ ...prev, isInstallable: false }));
    } catch (error) {
      logDebugInfo("Installation error", { error: error.message });
      console.error("Installation failed:", error);
    }
  };

  // Render debug information if debug mode is enabled
  const renderDebugInfo = () => {
    if (!debug) return null;

    return (
      <div className="fixed top-4 right-4 p-4 bg-gray-100 rounded shadow-lg max-w-md overflow-auto max-h-96">
        <h3 className="font-bold mb-2">PWA Debug Info</h3>
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(
            {
              ...debugInfo,
              currentState: installState,
              hasInstallPrompt: !!deferredPrompt,
            },
            null,
            2
          )}
        </pre>
      </div>
    );
  };

  if (installState.isInstalled) {
    logDebugInfo("Component hidden - PWA already installed");
    return debug ? renderDebugInfo() : null;
  }

  const buttonText = installState.isIOS
    ? t("addToHomeScreen", "Add to Home Screen")
    : t("installApp", "Install App");
  const shouldShowButton = installState.isInstallable || installState.isIOS;

  if (!shouldShowButton) {
    logDebugInfo("Component hidden - PWA not installable");
    return debug ? renderDebugInfo() : null;
  }

  return (
    <>
      {renderDebugInfo()}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 bg-custom-yellow text-custom-dark-blue font-semibold px-4 h-9 rounded-md shadow-md hover:bg-opacity-90 transition-all"
          aria-label={buttonText}
        >
          <FaDownload className="text-lg" aria-hidden="true" />
          <span>{buttonText}</span>
        </button>
      </div>
    </>
  );
};

export default InstallationGuide;
