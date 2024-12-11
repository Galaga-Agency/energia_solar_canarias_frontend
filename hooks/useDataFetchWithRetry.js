import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

export const useDataFetchWithRetry = ({
  fetchAction,
  clearAction,
  data,
  maxRetries = 8,
  retryDelay = 1000,
  token,
  validateData = (data) => Boolean(data),
}) => {
  const dispatch = useDispatch();
  const [retryCount, setRetryCount] = useState(0);
  const [hasEmptyData, setHasEmptyData] = useState(false);

  const handleFetch = useCallback(
    async (...args) => {
      try {
        await dispatch(fetchAction(...args, token));
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasEmptyData(true);
      }
    },
    [dispatch, fetchAction]
  );

  // Check data and trigger retries if needed
  useEffect(() => {
    if (!data || !validateData(data)) {
      if (retryCount < maxRetries) {
        setHasEmptyData(true);
        const retryTimer = setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          handleFetch();
        }, retryDelay);

        return () => clearTimeout(retryTimer);
      }
    } else {
      setHasEmptyData(false);
      setRetryCount(0);
    }
  }, [data, retryCount, maxRetries, handleFetch, retryDelay, validateData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clearAction) {
        dispatch(clearAction());
      }
    };
  }, [dispatch, clearAction]);

  return {
    handleFetch,
    isLoading: hasEmptyData && retryCount < maxRetries,
    retryCount,
    hasEmptyData,
  };
};
