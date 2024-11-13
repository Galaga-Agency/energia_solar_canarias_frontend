"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { PiSolarPanelFill } from "react-icons/pi";
import { useTranslation } from "next-i18next";
import { FaUserCog } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/store/slices/userSlice";

const BottomNavbar = ({ userId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentPath = usePathname();
  const isAdmin = useSelector(selectIsAdmin);

  const icons = [
    {
      icon: <PiSolarPanelFill className="text-2xl" />,
      label: t("plants"),
      path: isAdmin
        ? "/dashboard/[userId]/admin"
        : "/dashboard/[userId]/plants",
    },
    {
      icon: isAdmin ? (
        <FontAwesomeIcon icon={faUser} className="text-2xl" />
      ) : (
        <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />
      ),
      label: isAdmin ? t("users") : t("notifications"),
      path: isAdmin
        ? "/dashboard/[userId]/users"
        : "/dashboard/[userId]/notifications",
    },
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
    <div className="fixed bottom-0 left-0 right-0 flex justify-around p-2 bg-custom-dark-blue shadow-dark-shadow z-[999]">
      {icons.map((item, index) => {
        const pathToMatch = item.path.replace("[userId]", userId);
        const isActive = currentPath === pathToMatch;

        return (
          <div
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`flex flex-col items-center justify-center cursor-pointer transition-transform transform duration-300 ${
              isActive ? "text-custom-yellow" : "text-custom-light-gray"
            } hover:rotate-6 hover:text-custom-yellow`}
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
