import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPlantDetails,
  selectLoadingDetails,
  selectAlerts,
} from "@/store/slices/plantsSlice";
import { selectIsAdmin, selectUser } from "@/store/slices/userSlice";
import { IoArrowBackCircle } from "react-icons/io5";
import PageTransition from "@/components/PageTransition";
import Loading from "@/components/ui/Loading";
import VictronEnergyFlow from "@/components/victronenergy/VictronEnergyFlow";
import { useTranslation } from "next-i18next";
import Texture from "@/components/Texture";
import { selectTheme } from "@/store/slices/themeSlice";
import useDeviceType from "@/hooks/useDeviceType";
import WeatherWidget from "@/components/WeatherWidget";
import { PiSolarPanelFill } from "react-icons/pi";
import { useParams } from "next/navigation";
import TankData from "./TankData";
import VictronEnergyGraph from "./graphs/VictronEnergyGraph";
import VictronEnergyEquipmentDetails from "./VictronEnergyEquipmentDetails";
import DateRangeModal from "./DateRangeModal";
import VictronEnergyAlerts from "./VictronEnergyAlerts";
import VictronAlertsModal from "./VictronAlertsModal";
import useCSVExport from "@/hooks/useCSVExport";
import ExportModal from "../ExportModal";
import AssociatedUsers from "../AssociatedUsers";
import NotificationListItem from "@/components/notifications/NotificationListItem";

const VictronEnergyPlantDetails = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const plant = useSelector(selectPlantDetails);
  const isLoadingDetails = useSelector(selectLoadingDetails);
  const theme = useSelector(selectTheme);
  const { isMobile } = useDeviceType();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [hasCoordinates, setHasCoordinates] = useState(false);
  const isAdmin = useSelector(selectIsAdmin);
  const params = useParams();
  const plantId = params.plantId;
  const [loadTime] = useState(
    new Date().toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  );
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [currentRange, setCurrentRange] = useState({ type: "today" });
  const alertsData = useSelector(selectAlerts);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { downloadCSV } = useCSVExport();
  const [graphChartData, setGraphChartData] = useState([]);

  const handleRangeSelect = (range) => {
    setCurrentRange(range);
    setIsDateModalOpen(false);
  };

  useEffect(() => {
    if (latitude && longitude) {
      setHasCoordinates(true);
    }
  }, [latitude, longitude]);

  // Extract latitude and longitude from plant data
  useEffect(() => {
    if (plant) {
      const extended = plant?.data?.records?.[0]?.extended || [];
      setLatitude(extended.find((attr) => attr.code === "lt")?.rawValue);
      setLongitude(extended.find((attr) => attr.code === "lg")?.rawValue);
    }
  }, [plant]);

  const handleExportCSV = useCallback(
    (chartData) => {
      if (!chartData?.length) return;

      const exportData = chartData.map((dataPoint) => ({
        Timestamp: new Date(dataPoint.timestamp).toISOString(),
        "Consumo (kWh)": dataPoint.consumption || 0,
        "Solar (kWh)": dataPoint.solar || 0,
        "Batería (%)": dataPoint.battery || 0,
        ...(dataPoint.batteryVoltage
          ? {
              "Tensión Batería (V)": dataPoint.batteryVoltage,
              "Tensión Min (V)": dataPoint.batteryMin,
              "Tensión Max (V)": dataPoint.batteryMax,
            }
          : {}),
      }));

      downloadCSV(exportData, "victron_energy_data.csv");
      setIsExportModalOpen(false);
    },
    [downloadCSV]
  );

  const tankData = {
    tc: plant?.data?.records?.[0]?.extended?.find((item) => item.code === "tc"),
    tf: plant?.data?.records?.[0]?.extended?.find((item) => item.code === "tf"),
    tl: plant?.data?.records?.[0]?.extended?.find((item) => item.code === "tl"),
    tr: plant?.data?.records?.[0]?.extended?.find((item) => item.code === "tr"),
    tst: plant?.data?.records?.[0]?.extended?.find(
      (item) => item.code === "tst"
    ),
  };

  if (isLoadingDetails && !plant) {
    return (
      <PageTransition>
        <div className="h-screen flex items-center justify-center">
          <Loading />
        </div>
      </PageTransition>
    );
  }

  if (!plant) {
    return (
      <PageTransition>
        <div
          className={`min-h-screen p-6 ${
            theme === "dark"
              ? "dark:bg-gray-900"
              : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
          }`}
        >
          <Texture />
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = isAdmin
                ? `/dashboard/${user?.id}/admin/victronenergy`
                : `/dashboard/${user?.id}/plants`;
            }}
          >
            <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow mb-1 mr-4" />
          </button>
          <div className="h-auto w-full flex flex-col justify-center items-center">
            <PiSolarPanelFill className="mt-24 text-center text-9xl text-custom-dark-blue dark:text-custom-light-gray" />
            <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray mb-4">
              {t("plantDataNotFound")}
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div
        className={`min-h-screen p-6 ${
          theme === "dark"
            ? "dark:bg-gray-900"
            : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
        }`}
      >
        <Texture />
        <header className="flex justify-between items-center mb-6">
          <IoArrowBackCircle
            className="text-4xl text-custom-dark-blue dark:text-custom-yellow cursor-pointer"
            onClick={() => window.history.back()}
          />
          <div className="flex flex-col items-end  ml-auto">
            <h1 className="text-4xl text-custom-dark-blue dark:text-custom-yellow text-right max-w-[70vw] md:max-w-[80vw] pb-2 pl-6 overflow-hidden text-ellipsis whitespace-nowrap">
              {plant?.data?.records?.[0]?.name || t("loading")}
            </h1>
            <span className="text-sm text-gray-600 dark:text-gray-400 pr-1">
              {t("Local Time")}: {plant?.data?.records?.[0]?.current_time || ""}
            </span>
          </div>
        </header>

        {isAdmin && <AssociatedUsers plantId={plantId} isAdmin={isAdmin} />}

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 w-full">
          {/* Weather widget and tank data removed */}
        </div>

        <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6  backdrop-blur-sm shadow-lg mb-6">
          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
            {t("Real-Time Energy Flow")}
          </h2>
          <VictronEnergyFlow
            plantId={plantId}
            token={user?.tokenIdentificador}
          />
        </section>

        <div className="flex flex-col md:flex-row gap-6">
          <VictronEnergyEquipmentDetails token={user?.tokenIdentificador} />

          <section className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg">
            <VictronEnergyAlerts
              plantId={plantId}
              onViewAll={() => setIsAlertsModalOpen(true)}
            />
          </section>
        </div>

        <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mb-6 backdrop-blur-sm shadow-lg my-6">
          <VictronEnergyGraph
            plantId={plantId}
            currentRange={currentRange}
            setIsDateModalOpen={setIsDateModalOpen}
            onExportClick={() => setIsExportModalOpen(true)}
            onDataChange={setGraphChartData}
          />
        </section>

        <DateRangeModal
          isOpen={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
          onSelectRange={handleRangeSelect}
        />
      </div>

      <VictronAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={alertsData?.victronenergy?.records || []}
        plantId={plantId}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={() => handleExportCSV(graphChartData)}
        t={t}
        isLoading={isLoadingDetails}
        hasData={!!graphChartData?.length}
      />
    </PageTransition>
  );
};

export default VictronEnergyPlantDetails;
