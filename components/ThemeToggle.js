import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, setTheme, selectTheme } from "@/store/slices/themeSlice";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    // Check if a theme is already stored in localStorage
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      // If a stored theme exists, set it in Redux
      dispatch(setTheme(storedTheme));
      console.log("Found theme in localStorage: ", storedTheme);
    } else {
      // If no stored theme, default to dark mode and store it
      const defaultTheme = "dark";
      localStorage.setItem("theme", defaultTheme);
      dispatch(setTheme(defaultTheme));
      console.log("No theme found, setting default theme: ", defaultTheme);
    }
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggleTheme}
      className="fixed z-50 p-1 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 button-shadow"
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
