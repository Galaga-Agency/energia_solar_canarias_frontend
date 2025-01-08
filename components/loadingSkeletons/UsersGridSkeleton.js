import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const UsersGridSkeleton = ({ theme, rows = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(rows)].map((_, index) => (
        <div
          key={index}
          className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <CustomSkeleton width="80px" height="80px" circle theme={theme} />

            {/* Name */}
            <CustomSkeleton width="180px" height="24px" theme={theme} />

            {/* Email */}
            <CustomSkeleton width="200px" height="20px" theme={theme} />

            {/* Role Badge */}
            <CustomSkeleton width="100px" height="24px" theme={theme} />

            {/* Action buttons */}
            <div className="flex gap-4 mt-4">
              <CustomSkeleton width="40px" height="40px" circle theme={theme} />
              <CustomSkeleton width="40px" height="40px" circle theme={theme} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersGridSkeleton;
