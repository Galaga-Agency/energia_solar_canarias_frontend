import Cookies from "js-cookie";

export const storage = {
  setItem: (key, value, options = {}) => {
    try {
      // Store in both cookie and localStorage for redundancy
      Cookies.set(
        key,
        typeof value === "string" ? value : JSON.stringify(value),
        options
      );
      localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value)
      );
    } catch (error) {
      console.error("Storage set error:", error);
    }
  },

  getItem: (key) => {
    try {
      // Try cookie first, fall back to localStorage
      return Cookies.get(key) || localStorage.getItem(key);
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      Cookies.remove(key);
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Storage remove error:", error);
    }
  },
};
