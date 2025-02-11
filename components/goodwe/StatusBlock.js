import React from "react";

const StatusBlock = ({ stats, onStatusClick }) => {
  return (
    <div className="flex gap-2 z-0">
      {["working", "disconnected", "waiting", "error"].map((status) => (
        <div
          key={status}
          className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => onStatusClick(status)}
        >
          <div
            className={`w-3 h-3 rounded-full bg-${
              status === "working"
                ? "green"
                : status === "disconnected"
                ? "gray"
                : status === "waiting"
                ? "yellow"
                : "red"
            }-500`}
          />
          <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {stats[status]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatusBlock;
