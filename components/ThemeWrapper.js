"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";

const ThemeWrapper = ({ children }) => {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    // Apply the "dark" class based on the theme value
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeWrapper;
