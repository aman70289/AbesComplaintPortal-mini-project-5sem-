/* ============================================
   SkeletonLoader — content placeholder
   ============================================ */

const Skeleton = ({ className = '', variant = 'text', width, height }) => {
  const variantClasses = {
    text: 'h-4 rounded',
    heading: 'h-6 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    card: 'rounded-xl',
  };

  return (
    <div
      className={`
        bg-[var(--bg-secondary)] relative overflow-hidden
        ${variantClasses[variant]}
        ${className}
      `}
      style={{ width, height }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );
};

// Pre-built skeleton patterns
export const CardSkeleton = () => (
  <div className="card-base p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton variant="circle" className="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-3/4" />
        <Skeleton className="w-1/2" />
      </div>
    </div>
    <Skeleton className="w-full h-20" variant="rect" />
    <div className="flex gap-2">
      <Skeleton className="w-16 h-6" variant="rect" />
      <Skeleton className="w-20 h-6" variant="rect" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    <Skeleton className="w-full h-10" variant="rect" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="w-full h-14" variant="rect" />
    ))}
  </div>
);

export const StatCardSkeleton = () => (
  <div className="card-base p-6 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="w-24" />
      <Skeleton variant="circle" className="w-10 h-10" />
    </div>
    <Skeleton variant="heading" className="w-16" />
    <Skeleton className="w-32" />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Stats row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    {/* Chart area */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card-base p-6">
        <Skeleton variant="heading" className="w-40 mb-4" />
        <Skeleton className="w-full h-64" variant="rect" />
      </div>
      <div className="card-base p-6">
        <Skeleton variant="heading" className="w-40 mb-4" />
        <Skeleton className="w-full h-64" variant="rect" />
      </div>
    </div>
  </div>
);

export default Skeleton;
