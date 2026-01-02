const PGCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card">
      {/* Image skeleton */}
      <div className="skeleton aspect-[4/3]" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-6 w-1/3" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default PGCardSkeleton;
