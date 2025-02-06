import React from "react";
import { Info } from "lucide-react";

const EmptyState = ({
  icon: Icon = Info,
  title,
  description,
  className = "",
}) => {
  return (
    <div
      className={`w-full mb-3 max-w-[85vw] md:max-w-[92vw] mx-auto ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-custom-yellow/10 rounded-full flex items-center justify-center mb-4">
          <Icon className="text-2xl text-custom-yellow drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]" />
        </div>
        <h3 className="text-lg font-medium text-custom-dark-blue dark:text-custom-yellow mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
