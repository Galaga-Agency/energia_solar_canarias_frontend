"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import NotificationCard from "./NotificationCard";
import { selectUser } from "@/store/slices/userSlice";

const NotificationsTab = () => {
  const user = useSelector(selectUser);
  const userId = user?.id;
  const notificationsRef = useRef(null);

  const notifications = [
    { id: 1, message: "Inversor - se ha detectado un problema de producción" },
    { id: 2, message: "Fallo ventilador" },
    { id: 3, message: "Inversor: temperatura elevada" },
    { id: 4, message: "Batería por debajo del SOE mínimo" },
  ];

  // Scroll to notifications card if coming from settings
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#notifications") {
      notificationsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="p-8 text-white">
      <h2 className="text-4xl dark:text-custom-yellow text-custom-dark-blue">
        Notifications
      </h2>
      <p className="text-custom-dark-gray dark:text-custom-light-gray mt-4">
        View your Notifications here.
      </p>

      <Link href={`/dashboard/${userId}/settings#notifications`}>
        <span className="text-custom-yellow underline hover:opacity-80 cursor-pointer">
          Go to Notifications Settings
        </span>
      </Link>

      <div className="mt-6 space-y-4" ref={notificationsRef}>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            message={notification.message}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;
