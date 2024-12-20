const VictronEquipmentDetailsSkeleton = ({ theme }) => {
  return (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg">
      <div className="h-8 w-36 bg-slate-200 dark:bg-slate-700 rounded mb-6 animate-pulse" />

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-full animate-pulse" />
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-600 rounded animate-pulse" />
              </div>
            </div>

            <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50">
              {[1, 2].map((j) => (
                <div
                  key={j}
                  className="bg-white/70 dark:bg-slate-700/70 p-4 rounded-lg mb-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-48 bg-slate-200 dark:bg-slate-600 rounded animate-pulse" />
                    <div className="h-5 w-24 bg-slate-200 dark:bg-slate-600 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VictronEquipmentDetailsSkeleton;
