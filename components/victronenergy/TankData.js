import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { Clock } from "lucide-react";
import moment from "moment";
import "moment/locale/es";
import { selectTheme } from "@/store/slices/themeSlice";

const TankData = ({ tankData = {} }) => {
  const { t } = useTranslation();
  const theme = useSelector(selectTheme);

  const getTankInstances = () => {
    const tankInstances = [];

    if (tankData?.tf?.instances) {
      Object.keys(tankData.tf.instances)
        .filter((id) => tankData.tf.instances[id]?.formattedValue === "Fuel")
        .forEach((instanceId) => {
          const fluidLevel =
            tankData.tr?.instances?.[instanceId]?.formattedValue;
          const percentage = parseInt(fluidLevel?.replace("%", "") || 0);
          const timestamp = tankData.tr?.instances?.[instanceId]?.timestamp;

          tankInstances.push({
            id: instanceId,
            formattedValue:
              tankData.tl?.instances?.[instanceId]?.formattedValue,
            remainingFluid: fluidLevel,
            percentage: Math.min(percentage, 100),
            lastUpdate: timestamp ? parseInt(timestamp) : null,
          });
        });
    }

    return tankInstances;
  };

  const getFillGradient = (percentage) => {
    if (percentage <= 30) {
      return {
        gradient:
          theme === "dark" ? "tankLowGradientDark" : "tankLowGradientLight",
        animation: "0.8;0.9;0.8",
      };
    }
    return {
      gradient:
        theme === "dark" ? "tankNormalGradientDark" : "tankNormalGradientLight",
      animation: "0.9;1;0.9",
    };
  };

  const renderTankBlock = (instance) => {
    const { id, formattedValue, remainingFluid, percentage, lastUpdate } =
      instance;

    moment.locale("es");
    const timeAgo = lastUpdate ? moment(lastUpdate * 1000).fromNow() : null;

    const heightPercentage = Math.min(Math.max(0, percentage), 100);
    const fluidHeight = heightPercentage * 1.5;
    const yPosition = 175 - fluidHeight;
    const { gradient, animation } = getFillGradient(percentage);

    return (
      <div
        key={id}
        className="flex-1 bg-white/80 dark:bg-custom-dark-blue/80 rounded-lg p-4 backdrop-blur-sm shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-custom-dark-blue dark:text-custom-yellow">
            {t("Combustible")} #{id}
          </h3>
          {timeAgo !== null && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 justify-end">
              <Clock size={14} />
              {timeAgo && (
                <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[70%]">
                  {t("lastUpdated")} {timeAgo}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-8">
          <div className="w-20 flex-shrink-0">
            <svg
              viewBox="0 0 120 200"
              className="w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Gradients */}
                <linearGradient
                  id="tankNormalGradientLight"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#0B2738FF" />
                  <stop offset="100%" stopColor="#0B273833" />
                </linearGradient>
                <linearGradient
                  id="tankLowGradientLight"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFD57BFF" />
                  <stop offset="100%" stopColor="#FFD57B33" />
                </linearGradient>
                <linearGradient
                  id="tankNormalGradientDark"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFD57BFF" />
                  <stop offset="100%" stopColor="#FFD57B33" />
                </linearGradient>
                <linearGradient
                  id="tankLowGradientDark"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#FACC15" />
                </linearGradient>
              </defs>

              {/* Border stroke for the tank */}
              <rect
                x="20"
                y="20"
                width="80"
                height="160"
                rx="10"
                fill="none"
                stroke={theme === "dark" ? "#FFD57BFF" : "#0B2738FF"}
                strokeWidth="2"
                className="transition-all"
              />

              {/* Inner tank frame */}
              <rect
                x="20"
                y="20"
                width="80"
                height="160"
                rx="10"
                fill="#ffffff"
                className="dark:fill-gray-700"
              />

              {/* Level indicator background */}
              <rect
                x="25"
                y="25"
                width="70"
                height="150"
                rx="8"
                fill="#f8f9fa"
                className="dark:fill-gray-900"
              />

              {/* Fluid level with gradient */}
              <rect
                x="25"
                y={yPosition}
                width="70"
                height={fluidHeight}
                rx="8"
                fill={`url(#${gradient})`}
                filter="url(#liquidFilter)"
                className="transition-all duration-700"
              >
                <animate
                  attributeName="opacity"
                  values={animation}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </rect>
            </svg>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <div className="text-2xl font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {remainingFluid || "--"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t("Current Level")}
              </div>
            </div>
            <div>
              <div className="text-lg text-custom-dark-blue dark:text-custom-yellow">
                {formattedValue || "--"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t("Volume")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tankInstances = getTankInstances();

  if (tankInstances.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 min-h-0">
      {tankInstances.map(renderTankBlock)}
    </div>
  );
};

export default TankData;
