const AlertIcon = ({ level }) => {
  const colors = {
    1: "bg-yellow-500",
    2: "bg-orange-500",
    3: "bg-red-400",
    4: "bg-red-500",
    5: "bg-red-600",
  };

  return (
    <div
      className={`${colors[level]} w-6 h-6 rounded-full flex items-center justify-center text-white font-medium`}
    >
      {level}
    </div>
  );
};

export default AlertIcon;
