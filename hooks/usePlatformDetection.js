import { useEffect, useState } from "react";

const usePlatformDetection = () => {
  const [platformInfo, setPlatformInfo] = useState({
    os: "Unknown",
    platform: "Unknown",
    browser: "Unknown",
    browserVersion: "Unknown",
    deviceType: "Unknown",
  });

  useEffect(() => {
    const detectOS = (userAgent, platform) => {
      const osMatchers = [
        { name: "Windows", test: /win/.test(platform) },
        { name: "macOS", test: /mac/.test(platform) },
        { name: "Linux", test: /linux/.test(platform) },
        { name: "Android", test: /android/.test(userAgent) },
        { name: "iOS", test: /iphone|ipad|ipod/.test(userAgent) },
      ];
      const detectedOS = osMatchers.find((os) => os.test);
      return detectedOS ? detectedOS.name : "Unknown";
    };

    const detectBrowser = (userAgent) => {
      const browserMatchers = [
        {
          name: "Chrome",
          test: /chrome/.test(userAgent) && !/edg|opr/.test(userAgent),
        },
        { name: "Firefox", test: /firefox/.test(userAgent) },
        {
          name: "Safari",
          test: /safari/.test(userAgent) && !/chrome/.test(userAgent),
        },
        { name: "Edge", test: /edg/.test(userAgent) },
        { name: "Opera", test: /opr/.test(userAgent) },
      ];
      const detectedBrowser = browserMatchers.find((browser) => browser.test);
      return detectedBrowser ? detectedBrowser.name : "Unknown";
    };

    const detectBrowserVersion = (userAgent) => {
      const versionMatch = userAgent.match(
        /(?:chrome|firefox|safari|edg|opr)\/(\d+)/i
      );
      return versionMatch ? versionMatch[1] : "Unknown";
    };

    const detectDeviceType = (userAgent, platform) => {
      if (/mobile|android|touch/.test(userAgent)) return "Mobile";
      if (/tablet/.test(userAgent)) return "Tablet";
      if (/win|mac|linux/.test(platform)) return "Desktop";
      return "Unknown";
    };

    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    const os = detectOS(userAgent, platform);
    const browser = detectBrowser(userAgent);
    const browserVersion = detectBrowserVersion(userAgent);
    const deviceType = detectDeviceType(userAgent, platform);

    setPlatformInfo({
      os,
      platform: navigator.platform,
      browser,
      browserVersion,
      deviceType,
    });
  }, []);

  return platformInfo;
};

export default usePlatformDetection;
