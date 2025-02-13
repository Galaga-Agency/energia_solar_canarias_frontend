const CustomRadio = ({
  checked,
  onChange,
  label,
  value,
  name,
  className = "",
}) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <div className="relative">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          value={value}
          name={name}
          className="sr-only peer"
        />
        <div
          className={`
            w-5 h-5 rounded-full border-1 
            transition-all duration-200 ease-in-out
            ${
              checked
                ? "border-custom-yellow"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue"
            }
            peer-focus-visible:ring-2 
            peer-focus-visible:ring-custom-yellow 
            peer-focus-visible:ring-offset-2
            peer-focus-visible:ring-offset-white
            dark:peer-focus-visible:ring-offset-gray-800
            group-hover:border-custom-yellow/70
          `}
        >
          <div
            className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-2.5 h-2.5 rounded-full bg-custom-yellow
              transform transition-transform duration-200 ease-in-out
              ${checked ? "scale-100" : "scale-0"}
            `}
          />
        </div>
      </div>
      <span className={`ml-2 select-none ${className}`}>{label}</span>
    </label>
  );
};

export default CustomRadio;
