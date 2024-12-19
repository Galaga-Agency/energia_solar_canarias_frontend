import React, { useState, useEffect, useRef } from "react";
import { Info, Battery, Cpu, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
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
  const equipmentDetails = useSelector(selectEquipmentDetails);
  const isLoading = useSelector(selectEquipmentLoading);
  const error = useSelector(selectEquipmentError);
  const params = useParams();
  const plantId = params.plantId;
  const user = useSelector(selectUser);
  const token = user.tokenIdentificador;

  const [expanded, setExpanded] = useState(false);
  const specsRef = useRef(null);
  const statusRef = useRef(null);
  const itemHeight = 44;
  const previewItems = 3;

  useEffect(() => {
    if (plantId && token) {
      dispatch(fetchGoodweEquipmentDetails({ plantId, token }));
    }
  }, [plantId, token, dispatch]);

  if (isLoading) return <EquipmentDetailsSkeleton />;
  if (error) {
    return (
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg">
        <div className="text-red-500 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
          {t("Error loading equipment")}
        </div>
      </div>
    );
  }

  if (!equipmentDetails?.inverterPoints?.[0]) {
    return (
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg">
        <div className="text-gray-500 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
          {t("No equipment data available")}
        </div>
      </div>
    );
  }

  const inverter = equipmentDetails.inverterPoints[0];
  const deviceType = inverter.dict.left.find(
    (item) => item.key === "dmDeviceType"
  )?.value;
  const deviceCapacity =
    inverter.dict.left.find((item) => item.key === "DeviceParameter_capacity")
      ?.value || "";
  const serialNumber = inverter.dict.left.find(
    (item) => item.key === "serialNum"
  )?.value;
  const deviceTitle = `${t("Inverter")} (${deviceType})`;
  const hasMoreItems =
    inverter.dict.left.length > previewItems ||
    inverter.dict.right.length > previewItems;

  return (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
          <Cpu className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg text-custom-dark-blue dark:text-custom-yellow">
              {deviceTitle}
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400 dark:text-slate-500 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-white p-2 rounded-lg shadow-xl">
                  <div className="text-sm space-y-1">
                    <p>
                      {t(
                        "An inverter converts DC power from solar panels into AC power for your home"
                      )}
                    </p>
                    <p>
                      {t("Model")}: {deviceType}
                    </p>
                    <p>
                      {t("Capacity")}: {deviceCapacity}kW
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Specifications Section */}
        <div className="flex-1 relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md transform transition-transform duration-700">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
            {t("Specifications")}
          </h3>
          <div
            ref={specsRef}
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              height: expanded
                ? `${Math.min(inverter.dict.left.length * itemHeight, 400)}px`
                : `${previewItems * itemHeight}px`,
            }}
          >
            <div className="space-y-1">
              {inverter.dict.left.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-600 last:border-0 transition-all duration-500 ease-in-out ${
                    idx >= previewItems
                      ? expanded
                        ? "opacity-100"
                        : "opacity-0"
                      : "opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 dark:text-slate-300 text-sm">
                      {t(item.key)}
                    </span>
                  </div>
                  <span className="text-custom-dark-blue dark:text-custom-yellow text-sm">
                    {item.value || "--"} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="flex-1 relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md transform transition-transform duration-700">
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
            {t("Status")}
          </h3>
          <div
            ref={statusRef}
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              height: expanded
                ? `${Math.min(inverter.dict.right.length * itemHeight, 400)}px`
                : `${previewItems * itemHeight}px`,
            }}
          >
            <div className="space-y-1">
              {inverter.dict.right.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-600 last:border-0 transition-all duration-500 ease-in-out ${
                    idx >= previewItems
                      ? expanded
                        ? "opacity-100"
                        : "opacity-0"
                      : "opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 dark:text-slate-300 text-sm">
                      {t(item.key)}
                    </span>
                  </div>
                  <span className="text-custom-dark-blue dark:text-custom-yellow text-sm">
                    {item.value || "--"} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {hasMoreItems && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="font-secondary w-full mt-4 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
        >
          {expanded ? t("Show less") : t("Show more")}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-500 group-hover:scale-110 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      )}
    </div>
  );
};

export default GoodweEquipmentDetails;
