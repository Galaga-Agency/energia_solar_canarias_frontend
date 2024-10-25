import React from "react";
import useDeviceType from "@/hooks/useDeviceType";
import useLocalStorageState from "use-local-storage-state";

const Texture = () => {
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });

  // Set zoom levels based on device type
  const getScale = () => {
    if (isMobile) return 8; // Zoom out more for mobile
    if (isTablet) return 12; // Medium zoom for tablets
    if (isDesktop) return 15; // Zoom in more for desktop
    return 8; // Default scale
  };

  const scale = getScale();

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <svg
        id="patternId"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="a"
            patternUnits="userSpaceOnUse"
            width="48"
            height="48"
            patternTransform={`scale(${scale}) rotate(150)`}
          >
            <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
            <path
              d="M15.986 4.186 4.1 16.072v.58L16.566 4.186Zm7.62 0 12.38 12.38v-.58l-11.8-11.8Zm12.38 19.248L23.52 35.9h.58l11.886-11.886ZM4.1 23.52v.58l11.8 11.8h.58z"
              transform="translate(4,0)"
              strokeLinecap="square"
              strokeWidth="1"
              stroke="rgba(255, 255, 255, 0.3)"
              fill="none"
              opacity={theme === "dark" ? "0.1" : "0.5"}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#a)" />
      </svg>
    </div>
  );
};

export default Texture;
