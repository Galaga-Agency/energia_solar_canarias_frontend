const SecondaryButton = ({
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
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden text-red-500 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto px-6 py-2 w-full max-w-[200px] h-10 rounded-md font-secondary tracking-wide transition-all duration-300 ease-in-out
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
        font-semibold shadow-lg hover:shadow-white ${className}`}
      style={{ perspective: "1000px" }}
    >
      <span className="relative z-10 flex items-center justify-center text-red-500 transition-colors duration-300 ease-in-out [text-shadow:_0_4px_4px_rgb(0,0,0,0.6)]">
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-red-500 rounded-full animate-spin-fast"></div>
        ) : (
          children
        )}
      </span>
    </button>
  );
};

export default SecondaryButton;
