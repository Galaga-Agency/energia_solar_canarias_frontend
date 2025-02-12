const PrimaryButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={type === "button" ? onClick : undefined}
      disabled={disabled}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={`text-nowrap relative text-custom-dark-blue flex items-center backdrop-blur-sm justify-center mx-auto mt-5 mb-7 px-2 py-2 w-full max-w-[200px] h-10 rounded-lg font-secondary tracking-wide transition-all duration-300 ease-in-out bg-custom-yellow
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"} 
        ${
          !disabled
            ? "font-semibold shadow-lg hover:shadow-lg hover:shadow-white"
            : ""
        } 
        overflow-hidden ${className}`}
      style={{ perspective: "1000px" }}
    >
      <span
        className="absolute inset-0 transition-transform duration-500 ease-out
          transform scale-x-0 hover:scale-x-100 bg-custom-dark-blue opacity-20 pointer-events-none"
      ></span>
      <span className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-custom-dark-blue rounded-full animate-spin-fast"></div>
        ) : (
          children
        )}
      </span>
    </button>
  );
};

export default PrimaryButton;
