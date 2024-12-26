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

  const handleFetch = useCallback(
    async (params) => {
      if (!token) {
        console.error("Token is missing:", token);
        throw new Error("No authentication token available");
      }

      setIsLoading(true);

      try {
        // Create a complete params object with token
        const completeParams = {
          ...params,
          token,
        };

        // console.log("Fetching with complete params:", completeParams);

        const result = await dispatch(fetchAction(completeParams)).unwrap();
        // console.log("Fetch result:", result);

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
    if (!data || !validateData(data)) {
      if (retryCount < maxRetries) {
        setHasEmptyData(true);
        const retryTimer = setTimeout(() => {
          console.log(`Retry attempt ${retryCount + 1} of ${maxRetries}`);
          setRetryCount((prev) => prev + 1);
        }, retryDelay);

        return () => clearTimeout(retryTimer);
      }
    } else {
      setHasEmptyData(false);
      setRetryCount(0);
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
