import React from "react";

const FormInput = ({
  label,
  name,
  type = "text",
  register,
  validation = {},
  error,
  className = "",
  placeholder,
  disabled = false,
}) => {
  return (
    <div className={`space-y-2 mx-2 relative ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          {...register(name, validation)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full p-2 rounded-lg transition-colors 
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}
            ${
              error
                ? "border-1 border-red-500 focus:ring-red-500"
                : "border-1 border-gray-300 dark:border-gray-600 focus:ring-custom-yellow"
            }
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2
          `}
          style={{
            WebkitAppearance: "none", // Fix Safari appearance issues
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation", // Ensure taps work correctly
            pointerEvents: "auto", // Ensure clicks register
            position: "relative",
            zIndex: 50, // Fix layering issues
          }}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;
