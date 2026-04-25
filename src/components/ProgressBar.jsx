const ProgressBar = ({ stats }) => {
  if (!stats) return null;

  const { total, solved, investigating, critical, newClues, progress } = stats;

  const segments = [
    { label: 'Çözüldü', count: solved, color: 'var(--color-neon-green)', pct: total ? (solved / total) * 100 : 0 },
    { label: 'İnceleniyor', count: investigating, color: 'var(--color-neon-yellow)', pct: total ? (investigating / total) * 100 : 0 },
    { label: 'Kritik', count: critical, color: 'var(--color-neon-red)', pct: total ? (critical / total) * 100 : 0 },
    { label: 'Yeni', count: newClues, color: 'var(--color-neon-cyan)', pct: total ? (newClues / total) * 100 : 0 },
  ];

  return (
    <div className="glass-card p-4" id="progress-bar">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Soruşturma İlerlemesi</h3>
        <span className="text-sm font-bold font-mono text-neon-green">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="progress-track mb-3">
        {segments.map((seg) => (
          seg.count > 0 && (
            <div
              key={seg.label}
              className="progress-segment"
              style={{
                width: `${seg.pct}%`,
                backgroundColor: seg.color,
              }}
              title={`${seg.label}: ${seg.count}`}
            />
          )
        ))}
      </div>

      {/* Legends */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-gray-400">{seg.label}</span>
            <span className="ml-auto font-mono text-gray-300">{seg.count}</span>
          </div>
        ))}
      </div>

      {/* Bulunan vs Kayıp */}
      <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-neon-green">✅</span>
          <span className="text-gray-400">Çözülen:</span>
          <span className="text-neon-green font-bold">{solved}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-neon-red">❓</span>
          <span className="text-gray-400">Çözülmemiş İpucu:</span>
          <span className="text-neon-red font-bold">{total - solved}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
