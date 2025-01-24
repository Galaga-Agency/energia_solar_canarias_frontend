import { useEffect, useState } from "react";

const usePWADiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    deferredPrompt: null,
    isInstalled: false,
    showButton: true,
    isIOS: false,
  });

  const persistDeferredPrompt = (prompt) => {
    if (prompt) {
      // Persisting deferredPrompt using localStorage
      localStorage.setItem("deferredPrompt", JSON.stringify(prompt));
    } else {
      localStorage.removeItem("deferredPrompt");
    }
  };

  const reloadManifest = () => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      const newManifest = document.createElement("link");
      newManifest.rel = "manifest";
      newManifest.href = `${manifestLink.href.split("?")[0]}?t=${Date.now()}`;

      // Safely remove the existing manifest link if it exists
      document.head.removeChild(manifestLink);

      document.head.appendChild(newManifest);
      console.log("Manifest reloaded.");
    } else {
      console.log("Manifest link not found in the DOM.");
    }
  };

  const checkStandalone = () => {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone ||
      false
    );
  };

  const isIOS = () => {
    // Detect iOS device
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log("beforeinstallprompt fired");

      persistDeferredPrompt(e);

      setDiagnostics((prev) => ({
        ...prev,
        deferredPrompt: e,
        showButton: "currentTarget" in e, // Update showButton when event is fired
      }));
    };

    const checkInstalledStatus = () => {
      setDiagnostics((prev) => ({
        ...prev,
        isInstalled: checkStandalone(),
      }));
    };

    const loadDeferredPromptFromStorage = () => {
      const savedPrompt = localStorage.getItem("deferredPrompt");
      if (savedPrompt) {
        console.log("DeferredPrompt loaded from localStorage.");
        return JSON.parse(savedPrompt);
      }
      return null;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", checkInstalledStatus);

    // Detect iOS
    setDiagnostics((prev) => ({
      ...prev,
      isIOS: isIOS(),
    }));

    // Initial checks
    const storedPrompt = loadDeferredPromptFromStorage();
    if (storedPrompt) {
      setDiagnostics((prev) => ({
        ...prev,
        deferredPrompt: storedPrompt,
        showButton: "currentTarget" in storedPrompt,
      }));
    }

    checkInstalledStatus();

    // Force re-triggering `beforeinstallprompt` by reloading manifest
    reloadManifest();

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", checkInstalledStatus);
    };
  }, []);

  return diagnostics;
};

export default usePWADiagnostics;
