import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { PiSolarPanelFill } from "react-icons/pi";
import { useTranslation } from "next-i18next";
import { FaUserCog } from "react-icons/fa";

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
      icon: <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />,
      label: t("notifications"),
      path: "/dashboard/[userId]/notifications",
    },
    {
      icon: <FaUserCog className="text-2xl" />,
      label: t("settings"),
      path: "/dashboard/[userId]/settings",
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
