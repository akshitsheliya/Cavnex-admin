import React from "react";

const StatCardSkeleton = ({ count = 4, columns }) => {
  const cols = columns || count;

  const gridColsClass = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${gridColsClass[cols] || "lg:grid-cols-4"} gap-4`}
    >
      {[...Array(count)].map((_, index) => (
        <div key={index} className="glass-card p-5 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-white/10 rounded-xl" />
            <div className="w-16 h-6 bg-white/10 rounded-lg" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-white/10 rounded w-24" />
            <div className="h-8 bg-white/10 rounded w-20" />
          </div>
          <div className="mt-4 h-1 bg-white/5 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default StatCardSkeleton;
