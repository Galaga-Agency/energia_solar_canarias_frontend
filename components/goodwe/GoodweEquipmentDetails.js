import React, { useEffect, useState } from "react";
import { ChevronDown, Info, Battery, Cpu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGoodweEquipmentDetails,
  selectEquipmentDetails,
  selectEquipmentLoading,
  selectEquipmentError,
} from "@/store/slices/plantsSlice";
import EquipmentDetailsSkeleton from "../loadingSkeletons/EquipmentDetailsSkeleton";
import { useParams } from "next/navigation";
import { selectUser } from "@/store/slices/userSlice";

const GoodweEquipmentDetails = ({ t }) => {
  const dispatch = useDispatch();

  // Selectors
  const equipmentDetails = useSelector(selectEquipmentDetails);
  const isLoading = useSelector(selectEquipmentLoading);
  const error = useSelector(selectEquipmentError);
  const params = useParams();
  const plantId = params.plantId;
  const user = useSelector(selectUser);
  const token = user.tokenIdentificador;

  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (plantId && token) {
      dispatch(fetchGoodweEquipmentDetails({ plantId, token }));
    }
  }, [plantId, token, dispatch]);

  const toggleSection = (key) => {
    setActiveSection(activeSection === key ? null : key);
  };

  const getEquipmentIcon = (type) => {
    const iconClass = "text-custom-dark-blue dark:text-custom-yellow text-xl";
    switch (type) {
      case "inverter":
        return <Cpu className={iconClass} />;
      case "battery":
        return <Battery className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  if (isLoading) {
    return <EquipmentDetailsSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">{t("Error loading equipment")}</div>;
  }

  if (!equipmentDetails || !equipmentDetails.length) {
    return (
      <div className="text-gray-500">{t("No equipment data available")}</div>
    );
  }

  return (
    <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl mb-6 text-custom-dark-blue dark:text-custom-yellow">
        {t("Equipment Details")}
      </h2>
      <div className="space-y-4">
        {equipmentDetails.map((inverter, idx) => (
          <div
            key={idx}
            className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md"
          >
            <button
              onClick={() => toggleSection(idx)}
              className="w-full flex justify-between items-center p-4 hover:bg-slate-100 dark:hover:bg-slate-600/50"
            >
              <div className="flex items-center gap-3">
                {getEquipmentIcon("inverter")}
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  {inverter.serialNumber || t("Unknown")}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 dark:text-slate-300 transition-transform ${
                  activeSection === idx ? "-rotate-180" : ""
                }`}
              />
            </button>
            {activeSection === idx && (
              <div className="p-4 space-y-2 bg-slate-100/50 dark:bg-slate-800/50">
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">
                    {t("Specifications")}
                  </h3>
                  {inverter.dictLeft.map((item, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-slate-600 dark:text-slate-400"
                    >
                      {t(item.key)}: {item.value} {item.unit}
                    </p>
                  ))}
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">
                    {t("Status")}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("SOC")}: {inverter.soc}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("Last Refresh")}: {inverter.lastRefresh}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoodweEquipmentDetails;
