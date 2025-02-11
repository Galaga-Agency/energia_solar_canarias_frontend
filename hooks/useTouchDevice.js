import { useState, useEffect } from "react";

const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      // 1. Basic touch detection
      const hasTouchAPI =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;

      // 2. Media query for touch-capable devices
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

      // 3. Platform-specific checks
      const userAgent = navigator.userAgent.toLowerCase();
      const isTabletOrMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(
          userAgent
        );

      // 4. Screen size check for additional context
      const hasTouchScreenSize = window.screen.width <= 1280;

      // 5. Touch event behavior check
      const hasTouchBehavior = (() => {
        try {
          document.createEvent("TouchEvent");
          return true;
        } catch (e) {
          return false;
        }
      })();

      // Combine all checks for maximum coverage
      const isTouch =
        hasTouchAPI ||
        hasCoarsePointer ||
        isTabletOrMobile ||
        (hasTouchScreenSize && hasTouchBehavior);

      setIsTouchDevice(isTouch);
    };

    checkTouch();

    // Listen for changes using both resize and media query
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    window.addEventListener("resize", checkTouch);
    mediaQuery.addListener(checkTouch);

    return () => {
      window.removeEventListener("resize", checkTouch);
      mediaQuery.removeListener(checkTouch);
    };
  }, []);

  return isTouchDevice;
};

export default useTouchDevice;
