"use client";

import React from "react";

const CustomButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative mt-4 flex mx-auto px-6 py-2 rounded-md font-secondary tracking-wide transition-all duration-300 ease-in-out
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
        ${disabled ? "bg-gray-300" : "bg-custom-yellow hover:bg-opacity-90"}
        text-custom-dark-blue font-semibold shadow-lg hover:shadow-white
        overflow-hidden ${className}`}
      style={{ perspective: "1000px" }}
    >
      <span
        className="absolute inset-0 transition-transform duration-500 ease-out
          transform scale-x-0 hover:scale-x-100 bg-custom-dark-blue opacity-20"
      ></span>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default CustomButton;
