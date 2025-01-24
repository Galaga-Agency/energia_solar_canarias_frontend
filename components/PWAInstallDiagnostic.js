import React, { useState, useEffect } from "react";

const PlatformDiagnostic = () => {
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    browserSupport: false,
    httpsServed: false,
    manifestPresent: false,
    serviceWorkerRegistered: false,
    installPromptAvailable: false,
    platformDetails: {
      os: "Unknown",
      browser: "Unknown",
      browserVersion: "Unknown",
      deviceType: "Unknown",
    },
  });

  useEffect(() => {
    const runDiagnostics = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = navigator.platform.toLowerCase();

      // Comprehensive platform detection
      const platformDetails = {
        os: detectOS(userAgent, platform),
        browser: detectBrowser(userAgent),
        browserVersion: detectBrowserVersion(userAgent),
        deviceType: detectDeviceType(userAgent, platform),
      };

      // PWA Support Checks
      const checks = {
        browserSupport: "beforeinstallprompt" in window,
        httpsServed:
          window.location.protocol === "https:" ||
          window.location.hostname === "localhost",
        manifestPresent: !!document.querySelector('link[rel="manifest"]'),
        serviceWorkerRegistered: "serviceWorker" in navigator,
        installPromptAvailable: false,
        platformDetails,
      };

      // Detailed logging
      console.group("Comprehensive Platform Diagnostic");
      console.log("User Agent:", navigator.userAgent);
      console.log("Platform Checks:", checks);
      console.groupEnd();

      setDiagnosticInfo(checks);
    };

    // OS Detection
    const detectOS = (userAgent, platform) => {
      const osDetectors = [
        { name: "Windows", test: /win/.test(platform) },
        { name: "macOS", test: /mac/.test(platform) },
        { name: "Linux", test: /linux/.test(platform) },
        { name: "Android", test: /android/.test(userAgent) },
        { name: "iOS", test: /iphone|ipad|ipod/.test(userAgent) },
      ];

      const detectedOS = osDetectors.find((os) => os.test);
      return detectedOS ? detectedOS.name : "Unknown";
    };

    // Browser Detection
    const detectBrowser = (userAgent) => {
      const browserDetectors = [
        {
          name: "Chrome",
          test: /chrome/.test(userAgent) && !/edg/.test(userAgent),
        },
        { name: "Firefox", test: /firefox/.test(userAgent) },
        {
          name: "Safari",
          test: /safari/.test(userAgent) && !/chrome/.test(userAgent),
        },
        { name: "Edge", test: /edg/.test(userAgent) },
        { name: "Opera", test: /opr/.test(userAgent) },
      ];

      const detectedBrowser = browserDetectors.find((browser) => browser.test);
      return detectedBrowser ? detectedBrowser.name : "Unknown";
    };

    // Browser Version Detection
    const detectBrowserVersion = (userAgent) => {
      const versionMatch = userAgent.match(
        /(?:chrome|firefox|safari|edge|opr)\/(\d+)/i
      );
      return versionMatch ? versionMatch[1] : "Unknown";
    };

    // Device Type Detection
    const detectDeviceType = (userAgent, platform) => {
      if (/mobile|android|touch/i.test(userAgent)) return "Mobile";
      if (/tablet/i.test(userAgent)) return "Tablet";
      if (/win|mac|linux/i.test(platform)) return "Desktop";
      return "Unknown";
    };

    // Run diagnostics
    runDiagnostics();

    // Add event listener for installation prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDiagnosticInfo((prev) => ({
        ...prev,
        installPromptAvailable: true,
      }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded my-12">
      <h2 className="font-bold mb-2">Comprehensive Platform Diagnostic</h2>
      {Object.entries(diagnosticInfo).map(([key, value]) => {
        // Special handling for nested object
        if (typeof value === "object" && value !== null) {
          return (
            <div key={key} className="mb-2">
              <strong>{key}:</strong>
              {Object.entries(value).map(([subKey, subValue]) => (
                <div
                  key={subKey}
                  className={`ml-4 ${
                    typeof subValue === "boolean" && !subValue
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {subKey}: {subValue.toString()}
                </div>
              ))}
            </div>
          );
        }

        // Default rendering for non-object values
        return (
          <div
            key={key}
            className={`mb-1 ${
              typeof value === "boolean" && !value
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {key}: {value.toString()}
          </div>
        );
      })}
    </div>
  );
};

export default PlatformDiagnostic;
