import React from "react";

const FormInput = ({
  label,
  error,
  register,
  name,
  type = "text",
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md dark:text-black ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...register(name)}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;
