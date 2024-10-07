"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-custom-dark-blue">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-4 border-custom-dark-gray animate-spin-slow border-t-custom-yellow"></div>
        <div className="absolute inset-4 rounded-full border-4 border-custom-light-gray border-t-transparent animate-spin-slow"></div>
        <div className="absolute inset-8 bg-custom-yellow rounded-full shadow-white-shadow animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loading;
