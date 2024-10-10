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

      setIsMobile(width <= mobileBreakpoint);
      setIsTablet(width > mobileBreakpoint && width <= tabletBreakpoint);
      setIsDesktop(width > tabletBreakpoint);

      const landscape = width > height;
      setIsLandscape(landscape);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [mobileBreakpoint, tabletBreakpoint]);

  return { isMobile, isTablet, isDesktop, isLandscape };
};

export default useDeviceType;
