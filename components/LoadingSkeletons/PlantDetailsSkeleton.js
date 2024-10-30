import React from "react";
import CustomSkeleton from "@/components/LoadingSkeletons/Skeleton";

const PlantDetailsSkeleton = ({ theme }) => {
  return (
    <div className="min-h-screen w-auto flex flex-col  relative overflow-y-auto">
      <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6 mb-6">
        <CustomSkeleton
          width="60%"
          height="30px"
          className="mb-4"
          theme={theme}
        />
        <div className="flex items-start justify-between gap-2 mb-4">
          <CustomSkeleton
            width="30px"
            height="30px"
            className="mr-2"
            theme={theme}
          />
          <CustomSkeleton width="120px" height="24px" theme={theme} />
          <CustomSkeleton width="80px" height="24px" theme={theme} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6">
          <CustomSkeleton
            width="60%"
            height="30px"
            className="mb-4"
            theme={theme}
          />
          <CustomSkeleton
            width="80%"
            height="24px"
            className="mb-4"
            theme={theme}
          />
          <CustomSkeleton
            width="80%"
            height="24px"
            className="mb-4"
            theme={theme}
          />
          <CustomSkeleton width="80%" height="24px" theme={theme} />
        </div>
        <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6">
          <CustomSkeleton
            width="60%"
            height="30px"
            className="mb-4"
            theme={theme}
          />
          <CustomSkeleton
            width="80%"
            height="24px"
            className="mb-4"
            theme={theme}
          />
          <CustomSkeleton
            width="80%"
            height="24px"
            className="mb-4"
            theme={theme}
          />
          <CustomSkeleton width="80%" height="24px" theme={theme} />
        </div>
      </div>
      <br />
      <div className="bg-white dark:bg-custom-dark-blue shadow-lg rounded-lg p-6">
        <CustomSkeleton
          width="60%"
          height="30px"
          className="mb-4"
          theme={theme}
        />
        <CustomSkeleton width="100%" height="300px" theme={theme} />
      </div>
    </div>
  );
};

export default PlantDetailsSkeleton;
