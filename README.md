# 🐾 Podo Dedektif Paneli (Jotform Frontend Challenge 2026 - İzmir)

## 👤 Katılımcı Bilgileri (User Information)
- **İsim Soyisim (Name):** Görkem Utku Tatar

---

## 🕵️‍♂️ Proje Açıklaması (Project Description)
Bu proje, Jotform Frontend Hackathon İzmir için geliştirilmiş interaktif bir dedektif panosudur. Kayıp maskot Podo'yu bulmak amacıyla 5 farklı canlı Jotform'dan gelen gerçek verileri çeker, analiz eder, birleştirir ve görselleştirir.

## Özellikler
- 📡 **Canlı API Entegrasyonu:** Gerçek Jotform API'sinden 5 farklı form (Girişler, Mesajlar, Görüşler, Kişisel Notlar, Anonim İpuçları) `Promise.all` ile eşzamanlı çekilir.
- 🧹 **Dinamik Veri Algısı ve İsim Normalizasyonu:** Kullanıcı hataları (örn. "Alicann" -> "Alican", "Ayca" -> "Ayça") regex ve algoritmalarla temizlenir. Sistemde kayıtlı olmayan yeni isimler ve konumlar otomatik olarak algılanıp dinamik olarak ağa eklenir. Test/Spam (örn: "dd", "11") amaçlı boş veriler otomatik ayıklanır.
- 🔍 **Fuzzy Search:** `Fuse.js` ile bulanık arama; harf hatalarını ve eksik yazımları tolere ederek sonuç bulur.
- 🗺️ **Çapraz Sorgulama (Cross-referencing):** Farklı formlardaki ipuçları (aynı mekan, aynı kişi, 30 dk içindeki olaylar) otomatik olarak kırmızı iplerle birbirine ilişkilendirilir.
- 🎨 **Modern Tasarım:** Glassmorphism ve neon konseptli dedektif teması (TailwindCSS v4 + Vanilla CSS hybrid).

## Teknik Kararlar ve Ödünleşimler (Trade-offs)
Proje süresi ve gereksinimleri doğrultusunda alınan mimari kararlar:

1. **Tamamen Gerçek Zamanlı (Live) Veri Altyapısı:** 
   Proje başlangıcında kurgulanan sahte veriler (mockData) tamamen silinmiş, mimari doğrudan gerçek Jotform API Endpoint'lerinden beslenecek şekilde `src/services/api.js` üzerinde yapılandırılmıştır. Tüm paneller ve harita, API'den gelen dinamik verilere göre anlık şekillenir.
   
2. **Dinamik Harita (Map) Yaklaşımı:** 
   Harita bileşeni Jotform'dan gelen konum isimlerini dinamik olarak okur. Gerçek bir koordinat sistemi (Google Maps vb.) yerine hackathon konseptine uygun estetik bir grid-tabanlı konum haritası simülasyonu yapılmıştır.

3. **Veri Temizleme - Neden Backend Değil?** 
   Normalde bu tarz veri temizleme işleri backend'de yapılır. Ancak bu frontend hackathonu olduğu için logik `useInvestigation` hook'u içinde tamamen istemci (client) tarafında çözülmüş ve frontend'in gücü vurgulanmıştır.
   
4. **Gerçek Zamanlı Süre Yönetimi:**
   Jotform'a eklenen verilerdeki "gelecek zaman" veya kurgusal saat çatışmalarını engellemek için, verinin formda doldurulduğu metin yerine Jotform sunucusuna düştüğü orijinal `created_at` logları kullanılmıştır. Böylece son görülme süreleri ("10 dk önce", "2 gün önce") her zaman kusursuz çalışır.

## 🛠️ Kullanılan Teknolojiler ve Mimari Kararlar

Projede gereksiz bağımlılıklardan kaçınılarak hafif (lightweight) ve modern bir frontend altyapısı tercih edilmiştir.

- **React 19 & Vite 8:** Yüksek performanslı render, modern React hook'ları ve ultra hızlı derleme altyapısı için kullanıldı.
- **TailwindCSS v4:** Uygulamanın dedektif temalı neon ve glassmorphism (cam) tasarımlarını CSS dosyalarını şişirmeden utility-first yaklaşımıyla hızlıca inşa etmek için kullanıldı.
- **Fuse.js:** Dedektif panosunda birbiriyle bağlantılı veriler arasında hataya toleranslı (fuzzy) arama yapabilmek için eklendi.

### Neden Axios Yerine Native Fetch Tercih Edildi?
Projede dışa bağımlılığı (bundle size) minimumda tutmak adına `axios` gibi ekstra bir kütüphane kullanılmamıştır. Veri çekme (data fetching) işlemleri sadece Jotform API'sine yönelik okuma (GET) ağırlıklı olduğu için modern tarayıcıların sunduğu yerleşik `fetch` API'si fazlasıyla yeterli görülmüştür. 

Ayrıca network isteklerinin yönetimi özel bir `useInvestigation` hook'u içine soyutlanmış olup, bileşenlerin hızlıca unmount edilmesi durumunda ağ darboğazı (race conditions) ve hafıza sızıntılarını (memory leak) önlemek amacıyla native `AbortController` kullanılarak profesyonel bir istek iptal mekanizması kurulmuştur.

---

## 🚀 Kurulum

Projeyi kendi bilgisayarınızda (Node.js v18+ yüklü olmalıdır) çalıştırmak için aşağıdaki komutları terminalinize sırasıyla girin:

```bash
git clone https://github.com/Gorkemutku/2026-frontend-challenge-izmir.git
cd 2026-frontend-challenge-izmir
npm install
npm run dev
```
