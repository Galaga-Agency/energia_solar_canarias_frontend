"use client";

import React from "react";
import {
  FaExclamationTriangle,
  FaBell,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { LuUndo2 } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
import { IoArchiveOutline } from "react-icons/io5";

const NotificationCard = ({
  type,
  message,
  timestamp,
  read,
  plantName,
  undoArchive,
  onClick,
  onClose,
  onDelete,
}) => {
  let icon;
  let bgColor;

  switch (type) {
    case "error":
      icon = (
        <FaExclamationTriangle
          className={` ${read ? "text-gray-500" : "text-red-500"}`}
        />
      );
      bgColor = read ? "bg-gray-100/30" : "bg-red-100/50";
      break;
    case "warning":
      icon = (
        <FaBell className={` ${read ? "text-gray-500" : "text-yellow-500"}`} />
      );
      bgColor = read ? "bg-gray-100/30" : "bg-yellow-100/50";
      break;
    case "alert":
      icon = (
        <FaInfoCircle
          className={` ${read ? "text-gray-500" : "text-blue-500"}`}
        />
      );
      bgColor = read ? "bg-gray-100/30" : "bg-blue-100/50";
      break;
    case "info":
      icon = (
        <FaCheckCircle
          className={` ${read ? "text-gray-500" : "text-green-500"}`}
        />
      );
      bgColor = read ? "bg-gray-100/30" : "bg-green-100/50";
      break;
    default:
      icon = null;
      bgColor = "bg-white";
  }

  return (
    <div
      className={`flex items-center p-4 rounded-lg shadow-lg backdrop-blur-sm ${bgColor} ${
        read ? "" : "cursor-pointer"
      }`}
      onClick={onClick}
    >
      <div className={`mr-4 ${read ? "opacity-50" : ""}`}>{icon}</div>
      <div className="flex flex-col flex-1">
        <span
          className={`text-sm text-gray-600 dark:text-gray-200 mb-2 ${
            read ? "opacity-50" : ""
          }`}
        >
          {plantName}
        </span>
        <p
          className={`text-gray-800 dark:text-white ${
            read ? "opacity-50" : ""
          }`}
        >
          {message}
        </p>
        <span
          className={`text-sm mt-2 text-gray-600 dark:text-gray-200 ${
            read ? "opacity-50" : ""
          }`}
        >
          {timestamp}
        </span>
      </div>
      {read ? (
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              undoArchive();
            }}
            aria-label="Undo Archive"
            className="ml-6"
          >
            <LuUndo2 className="text-gray-500 dark:text-white text-xl" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete notification"
            className="ml-6"
          >
            <AiOutlineDelete className="text-gray-500 dark:text-white text-xl" />
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Mark as archived"
          className="ml-6"
        >
          <IoArchiveOutline className="text-gray-500 dark:text-white text-xl" />
        </button>
      )}
    </div>
  );
};

export default NotificationCard;
