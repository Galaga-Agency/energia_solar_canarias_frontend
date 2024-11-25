import React from "react";
import CustomSkeleton from "@/components/LoadingSkeletons/Skeleton";

const EnergyFlowSkeleton = ({ theme }) => {
  return (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-6 mb-6">
      <div className="w-40 h-6 mb-6">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>
      <div className="w-full h-80">
        <CustomSkeleton width="100%" height="100%" theme={theme} />
      </div>
    </div>
  );
};

export default EnergyFlowSkeleton;
