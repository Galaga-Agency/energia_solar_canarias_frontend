"use client";

import React, { useState, useEffect } from "react";

const EnergyLoadingClock = ({ duration, onComplete, isPaused }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPaused) {
      setProgress(0);
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
        {/* Gradient Definition */}
        <defs>
          <linearGradient
            id="gradient-stroke"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FACC15" /> {/* Yellow */}
            <stop offset="100%" stopColor="#22C55E" /> {/* Green */}
          </linearGradient>
        </defs>

        {/* Background Circle */}
        <circle
          cx="50%"
          cy="50%"
          r="16"
          fill="none"
          stroke="rgba(200, 200, 200, 0.5)"
          strokeWidth="4"
        />

        {/* Progress Circle */}
        <circle
          cx="50%"
          cy="50%"
          r="16"
          fill="none"
          stroke="url(#gradient-stroke)" // Use gradient as stroke
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
