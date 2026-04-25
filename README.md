# 🐾 Podo Dedektif Paneli (Jotform İzmir Hackathon)

Bu proje, Jotform Frontend Hackathon İzmir için geliştirilmiş interaktif bir dedektif panosudur. Kayıp maskot Podo'yu bulmak amacıyla 5 farklı formdan gelen verileri analiz eder, birleştirir ve görselleştirir.

## Özellikler
- 📡 **Paralel Veri Çekme:** 5 farklı Jotform (simülasyon) ucundan veriler `Promise.all` ile eşzamanlı çekilir.
- 🧹 **Agresif İsim Normalizasyonu:** Kullanıcı hataları (örn. "Alicann" -> "Alican", "Ayca" -> "Ayça") merkezi bir kayıt defteri (`personRegistry`) yardımıyla temizlenir.
- 🔍 **Fuzzy Search:** `Fuse.js` ile bulanık arama, harf hatalarını tolere ederek sonuç bulur.
- 🗺️ **Çapraz Sorgulama (Cross-referencing):** Farklı formlardaki ipuçları (aynı mekan, aynı kişi, 30 dk içindeki olaylar) otomatik olarak ilişkilendirilir.
- 🎨 **Modern Tasarım:** Glassmorphism ve neon konseptli dedektif teması (TailwindCSS v4 + Vanilla CSS hybrid).

## Teknik Ödünleşimler (Trade-offs)
Proje süresi ve gereksinimleri doğrultusunda alınan mimari kararlar:

1. **Mock Data Kullanımı:** 
   Gerçek Jotform API anahtarları verilmediği için `src/data/mockData.js` üzerinde 5 formu simüle eden bir yapı kuruldu. Ancak `src/services/api.js` gerçek API'ye geçiş yapılacak şekilde (Jotform submission mapping logic dahil) kurgulandı.
   
2. **Harita (Map) Yaklaşımı:** 
   Gerçek bir koordinat sistemi (Google Maps / Leaflet vb.) yerine hackathon konseptine uygun olarak grid-tabanlı bir ofis/kampüs haritası simülasyonu yapıldı. Bu, UI/UX açısından daha estetik ve yönetilebilir bir alan sağladı.

3. **İsim Normalizasyonu - Neden Backend Değil?** 
   Normalde bu tarz veri temizleme işleri backend'de yapılır. Ancak bu frontend hackathonu olduğu için algoritma `useInvestigation` hook'u içinde regex ve ASCII mapping kuralları ile tamamen istemci (client) tarafında çözüldü.
   
4. **CSS Hibrit Yapısı:**
   Ana iskelet ve layout için TailwindCSS v4, karmaşık animasyonlar (scan line, neon glow, shimmer) ve spesifik bileşenler (.glass-card, .podo-avatar) için `index.css` ve `App.css` tercih edildi.

## Kurulum
```bash
npm install
npm run dev
```

> **Not:** React 19 ve Vite 8 altyapısı kullanılmıştır. Node.js'in güncel (v18+) bir sürümünü kullandığınızdan emin olun.
