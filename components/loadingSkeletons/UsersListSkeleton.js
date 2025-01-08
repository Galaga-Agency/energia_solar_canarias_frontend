import React from "react";
import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";
import useDeviceType from "@/hooks/useDeviceType";

const UsersListSkeleton = ({ theme, rows }) => {
  const { isMobile } = useDeviceType();

  return (
    <div className="my-12 overflow-hidden">
      <table className="min-w-full border-collapse border border-gray-300 bg-white dark:bg-gray-800 shadow-md mb-12">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300">
            <th className="py-3 px-4 lg:pl-12 lg:pr-4 text-left">
              <CustomSkeleton width="120px" height="20px" theme={theme} />
            </th>
            {!isMobile && (
              <th className="py-3 px-4 lg:pr-12 lg:pl-4 text-left">
                <CustomSkeleton width="150px" height="20px" theme={theme} />
              </th>
            )}
            <th className="py-3 px-4 text-left">
              <CustomSkeleton width="100px" height="20px" theme={theme} />
            </th>
            <th className="py-3 px-6 text-right">
              <CustomSkeleton width="80px" height="20px" theme={theme} />
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, index) => (
            <tr
              key={index}
              className="hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200 border-b border-gray-300"
            >
              <td className="py-3 px-4 lg:pl-12 lg:pr-4">
                <div className="flex items-center gap-4">
                  <CustomSkeleton
                    width="40px"
                    height="40px"
                    circle
                    theme={theme}
                  />
                  <CustomSkeleton width="150px" height="24px" theme={theme} />
                </div>
              </td>
              {!isMobile && (
                <td className="py-3 px-4 lg:pr-12 lg:pl-4">
                  <CustomSkeleton width="200px" height="24px" theme={theme} />
                </td>
              )}
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <CustomSkeleton width="80px" height="24px" theme={theme} />
                  <CustomSkeleton width="60px" height="24px" theme={theme} />
                </div>
              </td>
              <td className="py-3 px-6 text-right">
                <div className="flex items-center justify-end gap-4">
                  <CustomSkeleton
                    width="32px"
                    height="32px"
                    circle
                    theme={theme}
                  />
                  <CustomSkeleton
                    width="32px"
                    height="32px"
                    circle
                    theme={theme}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersListSkeleton;
