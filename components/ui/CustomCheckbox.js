import React from "react";
import { Check } from "lucide-react";

const CustomCheckbox = ({ checked, onChange, label, className = "" }) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div
          className={`
          w-6 h-6 rounded-md border-2 
          transition-all duration-200 ease-in-out
          ${
            checked
              ? "bg-custom-yellow border-custom-yellow"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue"
          }
          peer-focus-visible:ring-2 
          peer-focus-visible:ring-custom-yellow 
          peer-focus-visible:ring-offset-2
          peer-focus-visible:ring-offset-white
          dark:peer-focus-visible:ring-offset-gray-800
          group-hover:border-custom-yellow/70
        `}
        />

        <div
          className={`
          absolute inset-0 flex items-center justify-center
          transform transition-transform duration-200 ease-in-out
          ${checked ? "scale-100" : "scale-0"}
        `}
        >
          <Check className="w-4 h-4 text-custom-dark-blue" strokeWidth={3} />
        </div>
      </div>
      <span className={`ml-2 select-none ${className}`}>{label}</span>
    </label>
  );
};

export default CustomCheckbox;
