"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faWifi,
  faEnvelope,
  faCompass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const icons = [
  { icon: faLeaf, label: "Plants", path: "/dashboard/[userId]/plants" },
  { icon: faWifi, label: "Wifi", path: "/dashboard/[userId]/wifi" },
  { icon: faEnvelope, label: "Message", path: "/dashboard/[userId]/message" },
  {
    icon: faCompass,
    label: "Discovery",
    path: "/dashboard/[userId]/discovery",
  },
  { icon: faUser, label: "Profile", path: "/dashboard/[userId]/profile" },
];

const BottomNavbar = ({ userId }) => {
  const router = useRouter();
  const currentPath = usePathname();

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
            <FontAwesomeIcon icon={item.icon} className="text-2xl" />
            <span className="mt-1 text-sm">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNavbar;
