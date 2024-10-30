import React from "react";
import CustomSkeleton from "@/components/LoadingSkeletons/Skeleton";

const WeatherWidgetSkeleton = ({ theme, isDesktop }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6">
      <div className="w-full mb-4">
        <CustomSkeleton width="40%" height="30px" theme={theme} />
      </div>
      <div className="flex justify-between">
        <div className="flex items-center mb-4">
          <CustomSkeleton width="64px" height="64px" theme={theme} />
          <div className="ml-4 space-y-2">
            <CustomSkeleton width="180px" height="24px" theme={theme} />
            <CustomSkeleton width="120px" height="20px" theme={theme} />
            <CustomSkeleton width="120px" height="20px" theme={theme} />
            <CustomSkeleton width="120px" height="20px" theme={theme} />
            <CustomSkeleton width="120px" height="20px" theme={theme} />
          </div>
        </div>
        {isDesktop && (
          <div className="flex flex-col">
            <CustomSkeleton
              width="150px"
              height="30px"
              className="mb-4"
              theme={theme}
            />
            <CustomSkeleton width="100px" height="64px" theme={theme} />
          </div>
        )}
      </div>
      <div className="w-full my-2 mt-4">
        <CustomSkeleton width="30%" height="30px" theme={theme} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: isDesktop ? 3 : 2 }).map((_, index) => (
          <div
            key={index}
            className="p-2 bg-gray-200 dark:bg-custom-dark-blue rounded-lg text-center"
          >
            <CustomSkeleton
              width="80px"
              height="24px"
              theme={theme}
              className="mx-auto mb-2"
            />
            <CustomSkeleton
              width="40px"
              height="40px"
              theme={theme}
              className="mx-auto"
            />
            <div className="flex justify-center mt-2">
              <CustomSkeleton width="60px" height="20px" theme={theme} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default WeatherWidgetSkeleton;
