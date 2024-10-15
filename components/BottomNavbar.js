import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faEnvelope,
  faCompass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { PiSolarPanelFill } from "react-icons/pi";
import { useTranslation } from "next-i18next";

const BottomNavbar = ({ userId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentPath = usePathname();

  const icons = [
    {
      icon: <PiSolarPanelFill className="text-2xl" />,
      label: t("plants"),
      path: "/dashboard/[userId]/plants",
    },
    {
      icon: <FontAwesomeIcon icon={faWifi} className="text-2xl" />,
      label: t("wifi"),
      path: "/dashboard/[userId]/wifi",
    },
    {
      icon: <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />,
      label: t("message"),
      path: "/dashboard/[userId]/message",
    },
    {
      icon: <FontAwesomeIcon icon={faCompass} className="text-2xl" />,
      label: t("discovery"),
      path: "/dashboard/[userId]/discovery",
    },
    {
      icon: <FontAwesomeIcon icon={faUser} className="text-2xl" />,
      label: t("profile"),
      path: "/dashboard/[userId]/profile",
    },
  ];

  const handleNavigation = (path) => {
    const formattedPath = path.replace("[userId]", userId);
    router.push(formattedPath);
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
