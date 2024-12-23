"use client";

import React, { useState, useEffect } from "react";

const EnergyLoadingClock = ({ duration = 15, onComplete, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Handle timer countdown
  useEffect(() => {
    let timer;

    if (!isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            // Call onComplete in the next tick to avoid state updates during render
            setTimeout(() => {
              onComplete?.();
            }, 0);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, isPaused, onComplete]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Calculate circumference (2 * π * r)
  const circumference = 2 * Math.PI * 16;

  // Calculate stroke-dashoffset
  const strokeDashoffset = ((duration - timeLeft) / duration) * circumference;

  return (
    <div className="w-10 h-10 md:absolute md:top-4 md:right-4">
      <svg className="w-full h-full" viewBox="0 0 40 40">
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
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="rgba(200, 200, 200, 0.5)"
          strokeWidth="4"
        />

        {/* Progress Circle */}
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="url(#gradient-stroke)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          transform="rotate(-90 20 20)"
        />

        {/* Counter Text */}
        <text
          x="20"
          y="20"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium fill-gray-700"
        >
          {timeLeft}
        </text>
      </svg>
    </div>
  );
};

export default EnergyLoadingClock;
