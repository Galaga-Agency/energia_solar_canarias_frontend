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
  const [isLoading, setIsLoading] = useState(false);

  // Fetch function
  const handleFetch = useCallback(
    async (params) => {
      if (!token) {
        console.error("Token is missing:", token);
        throw new Error("No authentication token available");
      }

      setIsLoading(true);

      try {
        const completeParams = { ...params, token };
        const result = await dispatch(fetchAction(completeParams)).unwrap();

        if (!validateData(result)) {
          setHasEmptyData(true);
          throw new Error("Invalid or empty data received");
        }

        setHasEmptyData(false);
        setIsLoading(false);
        return result;
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasEmptyData(true);
        setIsLoading(false);
        throw error;
      }
    },
    [dispatch, fetchAction, token, validateData]
  );

  // Retry mechanism
  useEffect(() => {
    if (retryCount < maxRetries && (!data || !validateData(data))) {
      const retryTimer = setTimeout(() => {
        setRetryCount((prev) => prev + 1); // Increment retry count
      }, retryDelay);

      return () => clearTimeout(retryTimer); // Clear timer
    }

    // Stop retries once valid data is received
    if (data && validateData(data)) {
      setRetryCount(0);
      setHasEmptyData(false);
    }
  }, [data, retryCount, maxRetries, retryDelay, validateData]);

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
    isLoading,
    retryCount,
    hasEmptyData,
  };
};
