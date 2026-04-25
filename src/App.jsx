import './App.css'

function App() {
  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header glass-panel flex items-center justify-between px-6 rounded-none border-t-0 border-x-0">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐾</span>
          <div>
            <h1 className="text-xl font-bold text-neon-cyan font-mono tracking-wider">
              PODO DETECTIVE PANEL
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Kayıp Maskot Soruşturma Merkezi
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
          <span className="text-xs text-gray-400 font-mono">CANLI</span>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="app-sidebar p-4">
        <p className="text-gray-500 text-sm font-mono">Sidebar yükleniyor...</p>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        <p className="text-gray-500 text-sm font-mono">Ana içerik yükleniyor...</p>
      </main>
    </div>
  )
}

export default App
