import { useMemo } from 'react';
import podoAvatar from '../assets/podo-avatar.png';

const PodoProfileCard = ({ stats }) => {
  const timeSinceLastSeen = useMemo(() => {
    if (!stats?.lastSighting?._parsedTime) return null;
    const diff = Math.abs(Date.now() - stats.lastSighting._parsedTime.getTime());
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours} saat ${minutes % 60} dk önce`;
    return `${minutes} dk önce`;
  }, [stats]);

  if (!stats) return null;

  return (
    <div className="glass-card p-4 mb-4" id="podo-profile-card">
      {/* Avatar & İsim */}
      <div className="flex items-center gap-3 mb-4">
        <div className="podo-avatar p-0.5">
          <img src={podoAvatar} alt="Podo Avatar" className="w-full h-full object-cover rounded-full" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-neon-cyan font-mono">PODO</h2>
          <p className="text-xs text-gray-400">Jotform Maskotu</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-mono bg-red-500/20 text-red-400 border border-red-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-glow" />
          KAYIP
        </span>
      </div>

      {/* Son Görülme */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Son Görülme</span>
          <span className="font-mono text-neon-orange text-xs">
            {timeSinceLastSeen || '—'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Son Konum</span>
          <span className="font-mono text-neon-cyan text-xs truncate ml-2 max-w-[160px] text-right">
            {stats.lastSighting?.locationName || '—'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Güven</span>
          <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
            stats.lastSighting?.confidence === 'high'
              ? 'bg-green-500/20 text-green-400'
              : stats.lastSighting?.confidence === 'medium'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {stats.lastSighting?.confidence === 'high' ? 'Yüksek' :
             stats.lastSighting?.confidence === 'medium' ? 'Orta' : 'Düşük'}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 pt-2.5 mt-1">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="px-2 py-1.5 rounded-lg bg-panel-light/50">
              <p className="text-lg font-bold text-neon-cyan font-mono">{stats.uniqueLocations}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Konum</p>
            </div>
            <div className="px-2 py-1.5 rounded-lg bg-panel-light/50">
              <p className="text-lg font-bold text-neon-purple font-mono">{stats.uniquePersons}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Tanık</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodoProfileCard;
