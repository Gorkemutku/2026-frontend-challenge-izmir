import { useState } from 'react';
import './App.css';
import useInvestigation from './hooks/useInvestigation.js';
import PodoProfileCard from './components/PodoProfileCard.jsx';
import SearchEngine from './components/SearchEngine.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import Timeline from './components/Timeline.jsx';
import ClueMap from './components/ClueMap.jsx';
import StatsBar from './components/StatsBar.jsx';
import ClueDetailModal from './components/ClueDetailModal.jsx';
import SkeletonLoader from './components/SkeletonLoader.jsx';

function App() {
  const {
    clues,
    allClues,
    loading,
    error,
    selectedClue,
    selectedClueRefs,
    setSelectedClueId,
    searchQuery,
    setSearchQuery,
    filters,
    setFormTypeFilter,
    setStatusFilter,
    setConfidenceFilter,
    setLocationFilter,
    clearFilters,
    stats,
    refetch,
  } = useInvestigation();

  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <div className="app-layout">
      {/* ═══ Header ═══ */}
      <header className="app-header glass-panel flex items-center justify-between px-6 rounded-none border-t-0 border-x-0" id="app-header">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐾</span>
          <div>
            <h1 className="text-xl font-bold text-neon-cyan font-mono tracking-wider">
              PODO DEDEKTİF PANELİ
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Kayıp Maskot Soruşturma Merkezi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Stats Bar (inline in header) */}
          {!loading && <StatsBar stats={stats} loading={loading} />}

          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
            <span className="text-xs text-gray-400 font-mono">CANLI</span>
          </div>
        </div>
      </header>

      {/* ═══ Sidebar ═══ */}
      <aside className="app-sidebar" id="app-sidebar">
        {loading ? (
          <SkeletonLoader type="sidebar" />
        ) : (
          <div className="p-4 space-y-4">
            <PodoProfileCard stats={stats} />

            <SearchEngine
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFormTypeFilter={setFormTypeFilter}
              setStatusFilter={setStatusFilter}
              setConfidenceFilter={setConfidenceFilter}
              clearFilters={clearFilters}
              resultCount={clues.length}
              totalCount={allClues.length}
            />

            <ProgressBar stats={stats} />
          </div>
        )}
      </aside>

      {/* ═══ Main Content ═══ */}
      <main className="app-main" id="app-main">
        {/* Error State */}
        {error && (
          <div className="glass-card p-4 mb-4 border-red-500/30 bg-red-500/10">
            <div className="flex items-center gap-2 text-red-400">
              <span>⚠️</span>
              <span className="text-sm font-mono">{error}</span>
              <button
                onClick={refetch}
                className="ml-auto text-xs text-neon-cyan hover:text-white font-mono"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="tab-switcher mb-4" id="tab-switcher">
          <button
            className={`tab-btn ${activeTab === 'timeline' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            🕐 Zaman Çizelgesi
          </button>
          <button
            className={`tab-btn ${activeTab === 'map' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            🗺️ İpucu Haritası
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'timeline' && (
          <Timeline
            clues={clues}
            loading={loading}
            onClueSelect={setSelectedClueId}
            selectedClueId={selectedClue?.id}
          />
        )}

        {activeTab === 'map' && (
          <ClueMap
            clues={allClues}
            onLocationFilter={setLocationFilter}
            activeLocationId={filters.locationId}
          />
        )}
      </main>

      {/* ═══ Detail Modal ═══ */}
      {selectedClue && (
        <ClueDetailModal
          clue={selectedClue}
          relatedClues={selectedClueRefs}
          onClose={() => setSelectedClueId(null)}
        />
      )}

      {/* ═══ Scan Line Effect ═══ */}
      <div className="scan-line" />
    </div>
  );
}

export default App;
