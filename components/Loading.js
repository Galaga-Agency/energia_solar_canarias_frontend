"use client";

import useLocalStorageState from "use-local-storage-state";

const Loading = () => {
  const [theme] = useLocalStorageState("theme", { defaultValue: "light" });

  return (
    <div
      className={`flex justify-center items-center min-h-screen w-screen
        ${
          theme === "dark"
            ? "bg-gray-800 bg-opacity-50"
            : "bg-gradient-to-b from-gray-200 to-custom-dark-gray bg-opacity-50"
        }
      `}
    >
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-4 border-custom-dark-gray animate-spin-slow border-t-custom-yellow"></div>
        <div
          className={`absolute inset-4 rounded-full border-4 border-custom-dark-blue dark:border-custom-light-gray border-t-transparent animate-spin-slow`}
        ></div>
        <div className="absolute inset-8 bg-custom-yellow rounded-full shadow-white-shadow animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loading;
