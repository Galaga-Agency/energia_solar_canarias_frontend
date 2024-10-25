import React from "react";

const NotificationCard = ({ message }) => {
  return (
    <div className="bg-white/50 dark:bg-gray-800/60 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
      <p className="text-gray-800 dark:text-gray-200">{message}</p>
    </div>
  );
};

export default NotificationCard;
