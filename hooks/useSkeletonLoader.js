"use client";
import { useState, useEffect } from "react";

export const useSkeletonLoader = (loading, content) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  return isLoading ? content : null;
};
