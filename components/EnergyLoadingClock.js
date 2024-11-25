"use client";

import React, { useState, useEffect } from "react";

const EnergyLoadingClock = ({ duration, onComplete, isPaused }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPaused) {
      setProgress(0); // Reset clock when paused
      return;
    }

    const intervalId = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= duration) {
          onComplete();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [duration, onComplete, isPaused]);

  return (
    <div className="w-10 h-10 md:absolute md:top-4 md:right-4">
      <svg className="w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r="16"
          fill="none"
          stroke="rgba(200, 200, 200, 0.5)"
          strokeWidth="4"
        />
        <circle
          cx="50%"
          cy="50%"
          r="16"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="6"
          strokeDasharray="100"
          strokeDashoffset={`${(1 - progress / duration) * 100}`}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
    </div>
  );
};

export default EnergyLoadingClock;
