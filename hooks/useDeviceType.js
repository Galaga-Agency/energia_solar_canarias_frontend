import { useState, useEffect } from "react";

const useDeviceType = (mobileBreakpoint = 767, tabletBreakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Detect device type
      setIsMobile(width <= mobileBreakpoint);
      setIsTablet(width > mobileBreakpoint && width <= tabletBreakpoint);
      setIsDesktop(width > tabletBreakpoint);

      // Detect landscape mode
      const landscape = width > height;
      setIsLandscape(landscape);

      // Log landscape changes for debugging
      console.log(
        `Width: ${width}, Height: ${height}, Landscape: ${landscape}`
      );
    };

    // Initial check
    handleResize();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [mobileBreakpoint, tabletBreakpoint]);

  return { isMobile, isTablet, isDesktop, isLandscape };
};

export default useDeviceType;
