import React from "react";
import CustomSkeleton from "@/components/LoadingSkeletons/Skeleton";

const PlantListSkeleton = ({ theme, rows, isAdmin }) => {
  return (
    <div className="my-12">
      {isAdmin ? (
        <table className="min-w-full border-collapse border border-gray-300 bg-white dark:bg-gray-800 shadow-md mb-12">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="py-3 px-4 text-left">
                <CustomSkeleton width="40%" height="20px" theme={theme} />
              </th>
              <th className="py-3 px-4 text-left">
                <CustomSkeleton width="40%" height="20px" theme={theme} />
              </th>
              <th className="py-3 px-4 text-left">
                <CustomSkeleton width="20%" height="20px" theme={theme} />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-3 px-4">
                  <CustomSkeleton width="80%" height="24px" theme={theme} />
                </td>
                <td className="py-3 px-4">
                  <CustomSkeleton width="70%" height="24px" theme={theme} />
                </td>
                <td className="py-3 px-4">
                  <CustomSkeleton width="50%" height="24px" theme={theme} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-10 w-full">
          {[...Array(rows)].map((_, index) => (
            <div
              key={index}
              className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-lg"
            >
              <CustomSkeleton
                width="100%"
                height="40px"
                className="mb-4"
                theme={theme}
              />
              <CustomSkeleton
                width="80%"
                height="30px"
                className="mb-2"
                theme={theme}
              />
              <CustomSkeleton
                width="90%"
                height="30px"
                className="mb-2"
                theme={theme}
              />
              <CustomSkeleton
                width="60%"
                height="30px"
                className="mb-2"
                theme={theme}
              />
              <CustomSkeleton
                width="50%"
                height="30px"
                className="mb-2"
                theme={theme}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantListSkeleton;
