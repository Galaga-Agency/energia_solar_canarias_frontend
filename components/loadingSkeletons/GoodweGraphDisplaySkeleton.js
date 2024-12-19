import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const GoodweGraphDisplaySkeleton = ({ theme }) => {
  return (
    <div className="w-full h-[400px]">
      <CustomSkeleton width="100%" height="100%" theme={theme} />
    </div>
  );
};

export default GoodweGraphDisplaySkeleton;
