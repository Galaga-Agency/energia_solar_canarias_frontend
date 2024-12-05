import React from "react";
import CustomSkeleton from "@/components/tempfolder/Skeleton";

const UsersListSkeleton = ({ theme, rows }) => {
  return (
    <div className="my-12 overflow-hidden">
      <table className="min-w-full border-collapse border border-gray-300 bg-white dark:bg-gray-800 shadow-md mb-12">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300">
            <th className="py-3 px-4 text-left">
              <CustomSkeleton width="100px" height="20px" theme={theme} />
            </th>
            <th className="py-3 px-4 text-left">
              <CustomSkeleton width="150px" height="20px" theme={theme} />
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, index) => (
            <tr
              key={index}
              className="hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200 border-b border-gray-300"
            >
              <td className="py-3 px-4">
                <CustomSkeleton width="80%" height="24px" theme={theme} />
              </td>
              <td className="py-3 px-4">
                <CustomSkeleton width="60%" height="24px" theme={theme} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersListSkeleton;
