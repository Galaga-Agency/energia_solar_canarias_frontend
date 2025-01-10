import React from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  value,
  onChange,
  placeholder,
  showPassword,
  onTogglePassword,
  inputRef,
  register, // For React Hook Form
  error, // Validation error message
}) => {
  return (
    <div className="relative">
      {/* Input and Icon Wrapper */}
      <div
        className={`flex items-center border rounded-lg transition duration-300
          ${
            error
              ? "border-red-500 focus-within:ring-red-500"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue focus-within:ring-2 focus-within:ring-custom-yellow"
          }
        `}
      >
        {/* Input */}
        <input
          ref={inputRef}
          type={showPassword ? "text" : "password"}
          {...(register ? register() : {})}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          data-lpignore="true"
          data-form-type="other"
          className="flex-1 p-3 bg-transparent focus:outline-none dark:text-custom-yellow"
        />

        {/* Eye Icon */}
        <button
          type="button"
          onClick={onTogglePassword}
          className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
};

export default PasswordInput;
