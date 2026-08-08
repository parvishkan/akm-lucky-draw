import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {/* 1. Summary Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-[#1D0636] border border-[#FFD700]/15 rounded-2xl p-4 space-y-3">
            <div className="h-3 w-16 bg-[#0D021A] rounded" />
            <div className="h-6 w-24 bg-[#0D021A] rounded" />
          </div>
        ))}
      </div>

      {/* 2. Toolbar Skeleton */}
      <div className="h-16 bg-[#1D0636] border border-[#FFD700]/15 rounded-2xl" />

      {/* 3. Table Rows Skeleton */}
      <div className="bg-[#1D0636] border border-[#FFD700]/15 rounded-3xl p-4 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-12 bg-[#0D021A] rounded-xl w-full" />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
