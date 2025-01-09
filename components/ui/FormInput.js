import React from "react";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  className = "",
  placeholder,
  disabled = false,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full p-2 rounded-lg transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${
            error
              ? "border-2 border-red-500 focus:ring-red-500"
              : "border-2 border-gray-300 dark:border-gray-600 focus:ring-custom-yellow"
          }
          bg-white dark:bg-gray-800 
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2
        `}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
