import { useState, useEffect } from "react";

const useDeviceType = (
  mobileBreakpoint = 767, // sm
  tabletBreakpoint = 1024, // md
  smallDesktopBreakpoint = 1536 // 2xl
) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isSmallDesktop, setIsSmallDesktop] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setIsMobile(width <= mobileBreakpoint);
      setIsTablet(width > mobileBreakpoint && width <= tabletBreakpoint);
      setIsSmallDesktop(
        width > tabletBreakpoint && width <= smallDesktopBreakpoint
      );
      setIsDesktop(width > smallDesktopBreakpoint);

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
  }, [mobileBreakpoint, tabletBreakpoint, smallDesktopBreakpoint]);

  return { isMobile, isTablet, isSmallDesktop, isDesktop, isLandscape };
};

export default useDeviceType;
