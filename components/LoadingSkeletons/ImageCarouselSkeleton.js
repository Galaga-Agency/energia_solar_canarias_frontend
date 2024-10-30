import React from "react";
import CustomSkeleton from "@/components/LoadingSkeletons/Skeleton";

const ImageCarouselSkeleton = ({ theme }) => {
  return (
    <div className="w-full h-full min-h-[400px] -mt-1 shadow-lg rounded-lg">
      <CustomSkeleton
        width="100%"
        height="100%"
        borderRadius="0.5rem"
        theme={theme}
      />
    </div>
  );
};

export default ImageCarouselSkeleton;
