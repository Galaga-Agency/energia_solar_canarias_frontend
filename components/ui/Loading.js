const Loading = () => {
  return (
    <div
      className={`flex flex-col justify-center items-center h-full w-full p-8 bg-transparent`}
    >
      <div className="relative w-32 h-32 mb-4">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-custom-yellow animate-spin-slow opacity-75 blur-[2px]"></div>

        {/* Middle Rotating Ring */}
        <div className="absolute inset-4 rounded-full border-4 border-custom-dark-gray dark:border-custom-light-gray animate-spin-fast border-t-custom-yellow border-b-transparent"></div>

        {/* Inner Rotating Ring */}
        <div className="absolute inset-8 rounded-full border-4 border-transparent border-t-custom-yellow animate-spin border-b-custom-dark-gray"></div>

        {/* Centered Pulsing Dot */}
        <div className="absolute inset-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-custom-yellow rounded-full h-8 w-8 shadow-dark-shadow animate-pulse"></div>

        {/* Orbiting Dots with Uneven Paths */}
        <div className="absolute w-full h-full flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-custom-yellow rounded-full animate-orbit-path-1"></div>
          <div className="absolute w-3 h-3 bg-custom-light-gray rounded-full animate-orbit-path-2"></div>
          <div className="absolute w-3 h-3 bg-custom-dark-gray rounded-full animate-orbit-path-3"></div>
          <div className="absolute w-3 h-3 bg-white rounded-full animate-orbit-path-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
