const SkeletonLoader = ({ type = 'timeline' }) => {
  if (type === 'stats') {
    return (
      <div className="stats-skeleton" id="skeleton-stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-skeleton-item">
            <div className="skeleton-box w-8 h-8 rounded-lg mb-1" />
            <div className="skeleton-box w-12 h-4 rounded mb-1" />
            <div className="skeleton-box w-16 h-3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'timeline') {
    return (
      <div className="timeline-skeleton" id="skeleton-timeline">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="timeline-skeleton-item" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="skeleton-dot" />
            <div className="skeleton-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="skeleton-box w-16 h-5 rounded-full" />
                <div className="skeleton-box w-24 h-4 rounded" />
              </div>
              <div className="skeleton-box w-full h-3 rounded mb-1.5" />
              <div className="skeleton-box w-3/4 h-3 rounded mb-2" />
              <div className="flex gap-2">
                <div className="skeleton-box w-20 h-5 rounded-full" />
                <div className="skeleton-box w-16 h-5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className="space-y-4 p-4" id="skeleton-sidebar">
        {/* Profile skeleton */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="skeleton-box w-12 h-12 rounded-full" />
            <div>
              <div className="skeleton-box w-20 h-5 rounded mb-1" />
              <div className="skeleton-box w-28 h-3 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="skeleton-box w-full h-4 rounded" />
            <div className="skeleton-box w-full h-4 rounded" />
            <div className="skeleton-box w-full h-4 rounded" />
          </div>
        </div>
        {/* Search skeleton */}
        <div className="glass-card p-4">
          <div className="skeleton-box w-full h-9 rounded-lg mb-3" />
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-box w-20 h-6 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
