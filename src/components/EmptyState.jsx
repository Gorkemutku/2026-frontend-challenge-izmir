const EmptyState = ({ type = 'search' }) => {
  const messages = {
    search: {
      icon: '🔍',
      title: "Podo'ya dair bir iz bulunamadı!",
      subtitle: 'Farklı anahtar kelimelerle aramaya devam et.',
      tip: 'İpucu: Konum adı veya kişi ismi ile aramayı dene.',
    },
    error: {
      icon: '⚠️',
      title: 'Bir hata oluştu!',
      subtitle: 'Veriler yüklenirken sorun yaşandı.',
      tip: 'Sayfayı yenileyerek tekrar dene.',
    },
    noData: {
      icon: '📭',
      title: 'Henüz ipucu yok',
      subtitle: 'Soruşturma başlatılıyor...',
      tip: 'Veriler yüklendikçe ipuçları burada görünecek.',
    },
  };

  const msg = messages[type] || messages.search;

  return (
    <div className="empty-state" id="empty-state">
      <div className="empty-state-icon">{msg.icon}</div>
      <h3 className="text-lg font-bold text-gray-300 mb-1">{msg.title}</h3>
      <p className="text-sm text-gray-500 mb-3">{msg.subtitle}</p>
      <p className="text-xs text-gray-600 font-mono">
        💡 {msg.tip}
      </p>
      <div className="paw-prints">
        {['🐾', '🐾', '🐾'].map((paw, i) => (
          <span
            key={i}
            className="paw-print"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            {paw}
          </span>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
