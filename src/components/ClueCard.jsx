import { formTypeMeta, statusMeta } from '../data/mockData.js';

/**
 * Bir ipucunun "High Priority" olup olmadığını belirler.
 * Alican veya Asansör içeren ipuçları + isLastSighting → High Priority
 */
const isHighPriority = (clue) => {
  if (clue.isLastSighting) return true;
  if (clue.status === 'Kritik') return true;

  const text = [
    clue.description,
    clue.locationName,
    clue.witnessName,
    clue.senderName,
    clue.recipientName,
    clue.foundBy,
    clue.tipsterName,
  ].filter(Boolean).join(' ').toLowerCase();

  return text.includes('alican') || text.includes('asansör');
};

const ClueCard = ({ clue, onClick, isSelected }) => {
  if (!clue) return null;

  const meta = formTypeMeta[clue.formType] || {};
  const status = statusMeta[clue.status] || {};
  const highPriority = isHighPriority(clue);
  const isLast = clue.isLastSighting;

  // Kişi bilgisi (normalize edilmiş)
  const personInfo = Object.values(clue._resolvedPersons || {})[0];

  const time = clue._parsedTime
    ? clue._parsedTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      id={`clue-${clue.id}`}
      className={`clue-card ${isSelected ? 'clue-card-selected' : ''} ${highPriority ? 'clue-card-critical' : ''} ${isLast ? 'clue-card-last-sighting' : ''}`}
      onClick={() => onClick?.(clue.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(clue.id)}
    >
      {/* Son Görülme Etiketi */}
      {isLast && (
        <div className="last-sighting-badge">
          🚨 SON GÖRÜLME
        </div>
      )}

      {/* High Priority Etiketi */}
      {highPriority && !isLast && (
        <div className="high-priority-badge">
          ⚡ KRİTİK KANITLAR
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="form-type-badge"
          style={{ backgroundColor: meta.bgColor, color: meta.color }}
        >
          {meta.icon} {meta.label}
        </span>
        <span className="text-xs text-gray-500 font-mono ml-auto">{time}</span>
      </div>

      {/* Konum */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xs">📍</span>
        <span className="text-xs text-neon-cyan font-mono truncate">{clue.locationName}</span>
      </div>

      {/* Açıklama */}
      <p className="text-sm text-gray-300 mb-2 line-clamp-2 leading-relaxed">
        {clue.description}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status */}
        <span
          className="status-badge"
          style={{ color: status.color, borderColor: `${status.color}40`, backgroundColor: `${status.color}15` }}
        >
          {status.icon} {clue.status}
        </span>

        {/* Confidence */}
        <span className={`confidence-dot ${clue.confidence}`} />

        {/* Normalize edilmiş kişi */}
        {personInfo?.wasNormalized && (
          <span className="normalized-badge" title={`Düzeltildi: ${personInfo.originalValue} → ${personInfo.canonicalName}`}>
            🔧 {personInfo.originalValue} → {personInfo.canonicalName}
          </span>
        )}
      </div>
    </div>
  );
};

export { isHighPriority };
export default ClueCard;
