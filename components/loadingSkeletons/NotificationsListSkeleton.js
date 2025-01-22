import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";
import useDeviceType from "@/hooks/useDeviceType";

const NotificationsListSkeleton = ({ theme, rows = 6 }) => {
  const { isMobile } = useDeviceType();

  return (
    <div className="mb-8 space-y-4">
      {[...Array(rows)].map((_, index) => (
        <div
          key={index}
          className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 p-4 grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_250px_auto] gap-4 max-w-[85vw] md:max-w-[92vw] mx-auto"
        >
          {/* Icon Section */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-custom-yellow/10 rounded-full flex items-center justify-center">
              <CustomSkeleton
                width="24px"
                height="24px"
                className="rounded-full"
                theme={theme}
              />
            </div>
          </div>

          {/* User Info Skeleton */}
          <div className="flex flex-col min-w-0 space-y-2">
            <CustomSkeleton
              width={!isMobile ? "20%" : "100%"}
              height="14px"
              theme={theme}
            />
            <CustomSkeleton
              width={!isMobile ? "40%" : "100%"}
              height="14px"
              theme={theme}
            />
          </div>

          {/* Last Login Skeleton */}
          {!isMobile && (
            <div className="flex items-center gap-2 ml-auto">
              <CustomSkeleton width="80px" height="14px" theme={theme} />
              <CustomSkeleton width="80px" height="14px" theme={theme} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationsListSkeleton;
