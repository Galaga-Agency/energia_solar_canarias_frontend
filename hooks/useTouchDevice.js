import { useState, useEffect } from "react";

const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
      );
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  return isTouchDevice;
};

export default useTouchDevice;
