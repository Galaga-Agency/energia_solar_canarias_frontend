import { useCallback } from "react";

const useRefresh = () => {
  const refreshPage = useCallback(() => {
    window.location.reload();
  }, []);

  const refreshCallback = useCallback((callback) => {
    if (typeof callback === "function") {
      callback();
    } else {
      console.warn("refreshCallback expects a function");
    }
  }, []);

  return { refreshPage, refreshCallback };
};

export default useRefresh;
