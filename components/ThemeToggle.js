"use client";

import { useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const ThemeToggle = () => {
  const [theme, setTheme] = useLocalStorageState("theme", {
    defaultValue: "dark",
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 shadow-dark-shadow dark:shadow-white-shadow hover:shadow-hover-dark-shadow dark:hover:shadow-hover-white-shadow"
    >
      {theme === "dark" ? (
        <SunIcon className="h-6 w-6 text-yellow-500" />
      ) : (
        <MoonIcon className="h-6 w-6 text-custom-dark-blue" />
      )}
    </button>
  );
};

export default ThemeToggle;
