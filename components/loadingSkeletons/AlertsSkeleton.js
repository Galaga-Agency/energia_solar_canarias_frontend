const AlertsSkeleton = ({ theme }) => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white/30 dark:bg-slate-700/30 animate-pulse rounded-lg p-4"
        >
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertsSkeleton;
