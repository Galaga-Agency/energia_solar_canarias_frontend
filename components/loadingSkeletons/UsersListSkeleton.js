import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";
import useDeviceType from "@/hooks/useDeviceType";

const UsersListSkeleton = ({ theme, rows = 10 }) => {
  const { isMobile } = useDeviceType();

  return (
    <div className="mb-8 space-y-4">
      {[...Array(rows)].map((_, index) => (
        <div
          key={index}
          className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 p-4 grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_250px_auto] gap-4 max-w-[85vw] md:max-w-[92vw] mx-auto"
        >
          {/* Avatar Skeleton */}
          <div className="relative flex-shrink-0 w-[48px] h-[48px] md:w-[64px] md:h-[64px]">
            <CustomSkeleton width="100%" height="100%" circle theme={theme} />
            <div className="absolute -bottom-0 -right-0 w-4 h-4 rounded-full bg-gray-400"></div>
          </div>

          {/* User Info Skeleton */}
          <div className="flex flex-col min-w-0 space-y-2">
            <CustomSkeleton width="60%" height="20px" theme={theme} />
            <CustomSkeleton width="80%" height="14px" theme={theme} />
          </div>

          {/* Last Login Skeleton */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <CustomSkeleton width="16px" height="16px" circle theme={theme} />
              <div className="flex flex-col space-y-1">
                <CustomSkeleton width="80px" height="14px" theme={theme} />
                <CustomSkeleton width="100px" height="10px" theme={theme} />
              </div>
            </div>
          )}

          {/* Actions Skeleton */}
          <div className="flex items-center justify-end gap-2">
            <CustomSkeleton width="32px" height="32px" circle theme={theme} />
            <CustomSkeleton width="32px" height="32px" circle theme={theme} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersListSkeleton;
