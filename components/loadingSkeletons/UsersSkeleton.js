import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const UsersListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex items-center gap-4"
        >
          <CustomSkeleton
            width={60}
            height={60}
            circle
            className="flex-shrink-0"
          />
          <div className="flex-1 space-y-2">
            <CustomSkeleton width="50%" height={16} />
            <CustomSkeleton width="30%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersListSkeleton;
