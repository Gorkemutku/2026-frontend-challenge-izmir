import { formTypeMeta, statusMeta } from '../data/mockData.js';
import ClueCard from './ClueCard.jsx';

const ClueDetailModal = ({ clue, relatedClues, onClose }) => {
  if (!clue) return null;

  const meta = formTypeMeta[clue.formType] || {};
  const time = clue._parsedTime
    ? clue._parsedTime.toLocaleString('tr-TR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '';

  // Tüm kişi bilgileri
  const persons = Object.entries(clue._resolvedPersons || {});

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()} id="clue-detail-modal">
      <div className={`modal-content ${clue.isLastSighting ? 'modal-critical' : ''}`}>
        {/* Close */}
        <button className="modal-close" onClick={onClose} aria-label="Kapat">✕</button>

        {/* Header */}
        <div className="modal-header">
          {clue.isLastSighting && (
            <div className="last-sighting-badge mb-3" style={{ fontSize: '14px' }}>
              🚨 SON GÖRÜLME — KRİTİK İPUCU
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="form-type-badge" style={{ backgroundColor: meta.bgColor, color: meta.color }}>
              {meta.icon} {meta.label}
            </span>
            <span className="text-sm text-gray-400 font-mono">{time}</span>
          </div>

          <h2 className="text-lg font-bold text-white mb-1">{clue.locationName}</h2>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Açıklama */}
          <div className="mb-4">
            <h4 className="text-xs font-mono text-gray-500 uppercase mb-1">Açıklama</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{clue.description}</p>
          </div>

          {/* Kişi Bilgileri */}
          {persons.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">İlgili Kişiler</h4>
              <div className="space-y-1.5">
                {persons.map(([field, person]) => (
                  <div key={field} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 capitalize">{field.replace(/Name$/, '')}:</span>
                    <span className="text-neon-cyan font-mono">{person.canonicalName}</span>
                    <span className="text-xs text-gray-600">({person.role})</span>
                    {person.wasNormalized && (
                      <span className="normalized-badge text-xs">
                        🔧 {person.originalValue}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Durum & Güven */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <h4 className="text-xs font-mono text-gray-500 uppercase mb-1">Durum</h4>
              <span className="status-badge" style={{
                color: statusMeta[clue.status]?.color,
                borderColor: `${statusMeta[clue.status]?.color}40`,
                backgroundColor: `${statusMeta[clue.status]?.color}15`,
              }}>
                {statusMeta[clue.status]?.icon} {clue.status}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-mono text-gray-500 uppercase mb-1">Güven Seviyesi</h4>
              <span className={`confidence-label ${clue.confidence}`}>
                {clue.confidence === 'high' ? '🟢 Yüksek' : clue.confidence === 'medium' ? '🟡 Orta' : '🔴 Düşük'}
              </span>
            </div>
          </div>

          {/* İlişkili İpuçları */}
          {relatedClues && (
            <div>
              {relatedClues.sameLocation?.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">
                    📍 Aynı Konumdaki İpuçları ({relatedClues.sameLocation.length})
                  </h4>
                  <div className="related-clues-list">
                    {relatedClues.sameLocation.slice(0, 3).map((c) => (
                      <div key={c.id} className="related-clue-mini">
                        <span className="text-xs">{formTypeMeta[c.formType]?.icon}</span>
                        <span className="text-xs text-gray-400 truncate flex-1">{c.description?.slice(0, 60)}...</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {relatedClues.samePerson?.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">
                    👤 Aynı Kişiyle İlgili ({relatedClues.samePerson.length})
                  </h4>
                  <div className="related-clues-list">
                    {relatedClues.samePerson.slice(0, 3).map((c) => (
                      <div key={c.id} className="related-clue-mini">
                        <span className="text-xs">{formTypeMeta[c.formType]?.icon}</span>
                        <span className="text-xs text-gray-400 truncate flex-1">{c.description?.slice(0, 60)}...</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClueDetailModal;
