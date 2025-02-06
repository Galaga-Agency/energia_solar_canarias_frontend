"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faEnvelope, faUsers } from "@fortawesome/free-solid-svg-icons";
import { PiSolarPanelFill } from "react-icons/pi";
import { useTranslation } from "next-i18next";
import { FaUserCog } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/store/slices/userSlice";
import { selectActiveNotificationsCount } from "@/store/slices/notificationsSlice";

const BottomNavbar = ({ userId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentPath = usePathname();
  const isAdmin = useSelector(selectIsAdmin);
  const activeNotificationsCount = useSelector(selectActiveNotificationsCount);

  const icons = [
    {
      icon: <PiSolarPanelFill className="text-2xl" />,
      label: t("plants"),
      path: isAdmin
        ? "/dashboard/[userId]/admin"
        : "/dashboard/[userId]/plants",
    },
    {
      icon: (
        <div className="relative">
          <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />
          {activeNotificationsCount > 0 && (
            <div className="absolute -top-1 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {activeNotificationsCount}
            </div>
          )}
        </div>
      ),
      label: t("notifications"),
      path: "/dashboard/[userId]/notifications",
    },
    ...(isAdmin
      ? [
          {
            icon: <FontAwesomeIcon icon={faUsers} className="text-2xl" />,
            label: t("users"),
            path: "/dashboard/[userId]/users",
          },
        ]
      : []),
    {
      icon: isAdmin ? (
        <FontAwesomeIcon icon={faCog} className="text-2xl" />
      ) : (
        <FaUserCog className="text-2xl" />
      ),
      label: t("settings"),
      path: "/dashboard/[userId]/settings",
    },
  ];

  const handleNavigation = (path) => {
    router.push(path.replace("[userId]", userId));
  };

  return (
    <div className="footer fixed bottom-0 left-0 right-0 flex justify-around p-2 bg-custom-dark-blue shadow-dark-shadow z-[999]">
      {icons.map((item, index) => {
        const pathToMatch = item.path.replace("[userId]", userId);
        const isActive = currentPath === pathToMatch;

        return (
          <div
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`flex flex-col items-center justify-center cursor-pointer transition-transform transform duration-300 ${
              isActive ? "text-custom-yellow" : "text-custom-light-gray"
            } hover:rotate-6 hover:text-custom-yellow select-none`}
          >
            {item.icon}
            <span className="mt-1 text-sm">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNavbar;
