export const SkeletonBlock = ({ className = "" }) => (
  <div className={`shimmer rounded-lg ${className}`} />
);

export const SkeletonCard = () => (
  <div className="rounded-xl border border-borderColor bg-surface p-5 shadow-card">
    <SkeletonBlock className="h-4 w-24" />
    <SkeletonBlock className="mt-4 h-7 w-32" />
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 border-b border-borderColor px-4 py-4">
    <SkeletonBlock className="h-4 w-24" />
    <SkeletonBlock className="h-4 w-32" />
    <SkeletonBlock className="h-4 w-20" />
    <SkeletonBlock className="ml-auto h-6 w-16" />
  </div>
);
