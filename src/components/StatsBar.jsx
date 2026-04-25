const StatsBar = ({ stats, loading }) => {
  if (loading) return null; // SkeletonLoader handles this

  if (!stats) return null;

  const items = [
    { label: 'Toplam', value: stats.total, icon: '📋', color: 'text-neon-cyan' },
    { label: 'Çözülen', value: stats.solved, icon: '✅', color: 'text-neon-green' },
    { label: 'Kritik', value: stats.critical, icon: '🚨', color: 'text-neon-red' },
    { label: 'İncelenen', value: stats.investigating, icon: '🔎', color: 'text-neon-yellow' },
    { label: 'Düzeltilen İsim', value: stats.normalizedNames, icon: '🔧', color: 'text-neon-purple' },
  ];

  return (
    <div className="stats-bar" id="stats-bar">
      {items.map((item) => (
        <div key={item.label} className="stat-item">
          <span className="stat-icon">{item.icon}</span>
          <span className={`stat-value ${item.color} font-mono font-bold`}>{item.value}</span>
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
