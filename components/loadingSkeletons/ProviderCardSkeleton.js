import CustomSkeleton from "@/components/loadingSkeletons/Skeleton";

const ProviderCardSkeleton = ({ theme }) => {
  return (
    <div className="relative w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg">
      <CustomSkeleton width="100%" height="100%" theme={theme} />
      <div className="absolute inset-0 flex justify-center items-center text-white text-2xl font-bold">
        <CustomSkeleton width="60%" height="20px" theme={theme} />
      </div>
    </div>
  );
};

export default ProviderCardSkeleton;
