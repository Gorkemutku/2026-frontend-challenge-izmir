import { formTypeMeta, statusMeta } from '../data/mockData.js';

const SearchEngine = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFormTypeFilter,
  setStatusFilter,
  setConfidenceFilter,
  clearFilters,
  resultCount,
  totalCount,
}) => {
  const hasActiveFilters = filters.formType || filters.status || filters.confidence || searchQuery.trim();

  return (
    <div className="glass-card p-4 mb-4" id="search-engine">
      {/* Arama Input */}
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
        <input
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="İpucu, konum veya kişi ara..."
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
            aria-label="Aramayı temizle"
          >
            ✕
          </button>
        )}
      </div>

      {/* Sonuç Sayısı */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-gray-400 font-mono">
            <span className="text-neon-cyan font-bold">{resultCount}</span>
            <span className="mx-1">/</span>
            <span>{totalCount}</span>
            {' '}ipucu bulundu
          </span>
          <button
            onClick={clearFilters}
            className="text-neon-orange hover:text-neon-red transition-colors font-mono"
          >
            Temizle
          </button>
        </div>
      )}

      {/* Form Tipi Filtreleri */}
      <div className="mb-3">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 font-mono">Kaynak</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(formTypeMeta).map(([key, meta]) => (
            <button
              key={key}
              id={`filter-form-${key}`}
              onClick={() => setFormTypeFilter(key)}
              className={`filter-chip ${filters.formType === key ? 'filter-chip-active' : ''}`}
              style={filters.formType === key ? { borderColor: meta.color, color: meta.color } : {}}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status Filtreleri */}
      <div className="mb-3">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 font-mono">Durum</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(statusMeta).map(([key, meta]) => (
            <button
              key={key}
              id={`filter-status-${key}`}
              onClick={() => setStatusFilter(key)}
              className={`filter-chip ${filters.status === key ? 'filter-chip-active' : ''}`}
              style={filters.status === key ? { borderColor: meta.color, color: meta.color } : {}}
            >
              <span>{meta.icon}</span>
              <span>{key}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Güven Seviyesi */}
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 font-mono">Güven</p>
        <div className="flex gap-1.5">
          {[
            { key: 'high', label: 'Yüksek', color: 'var(--color-confidence-high)' },
            { key: 'medium', label: 'Orta', color: 'var(--color-confidence-medium)' },
            { key: 'low', label: 'Düşük', color: 'var(--color-confidence-low)' },
          ].map((item) => (
            <button
              key={item.key}
              id={`filter-confidence-${item.key}`}
              onClick={() => setConfidenceFilter(item.key)}
              className={`filter-chip ${filters.confidence === item.key ? 'filter-chip-active' : ''}`}
              style={filters.confidence === item.key ? { borderColor: item.color, color: item.color } : {}}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchEngine;
