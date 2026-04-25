import { locationRegistry } from '../data/mockData.js';

const ClueMap = ({ clues, onLocationFilter, activeLocationId }) => {
  // Konumlardaki ipucu sayılarını hesapla
  const locationClueCounts = {};
  const locationStatuses = {};

  for (const clue of (clues || [])) {
    if (!clue.locationId) continue;
    locationClueCounts[clue.locationId] = (locationClueCounts[clue.locationId] || 0) + 1;

    // En yüksek öncelikli statusü tut
    if (!locationStatuses[clue.locationId] || clue.status === 'Kritik') {
      locationStatuses[clue.locationId] = clue.status;
    }
    if (clue.isLastSighting) {
      locationStatuses[clue.locationId] = 'SON_GÖRÜLME';
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'SON_GÖRÜLME': return 'var(--color-neon-red)';
      case 'Kritik': return 'var(--color-neon-red)';
      case 'İnceleniyor': return 'var(--color-neon-yellow)';
      case 'Çözüldü': return 'var(--color-neon-green)';
      default: return 'var(--color-neon-cyan)';
    }
  };

  return (
    <div className="clue-map" id="clue-map">
      <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-3">
        📍 İpucu Haritası
      </h3>

      <div className="map-grid">
        {Object.entries(locationRegistry).map(([locId, loc]) => {
          const count = locationClueCounts[locId] || 0;
          const status = locationStatuses[locId];
          const isActive = activeLocationId === locId;
          const hasClues = count > 0;
          const isLastSeen = status === 'SON_GÖRÜLME';
          const color = getStatusColor(status);

          return (
            <button
              key={locId}
              id={`map-loc-${locId}`}
              className={`map-cell ${hasClues ? 'map-cell-active' : ''} ${isActive ? 'map-cell-selected' : ''} ${isLastSeen ? 'map-cell-critical' : ''}`}
              onClick={() => onLocationFilter?.(locId)}
              style={hasClues ? { borderColor: `${color}60` } : {}}
            >
              {/* Pulse dot */}
              {hasClues && (
                <span
                  className={`map-dot ${isLastSeen ? 'map-dot-critical' : ''}`}
                  style={{ backgroundColor: color }}
                />
              )}

              {/* Kat bilgisi */}
              <span className="map-floor">{loc.floor >= 0 ? `K${loc.floor}` : `B${Math.abs(loc.floor)}`}</span>

              {/* İsim */}
              <span className="map-name">{loc.name.split('—')[0].trim()}</span>

              {/* İpucu sayısı */}
              {hasClues && (
                <span className="map-count" style={{ color }}>{count}</span>
              )}

              {/* Son görülme etiketi */}
              {isLastSeen && (
                <span className="map-last-badge">🚨</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ClueMap;
