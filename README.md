# 🐾 Podo Dedektif Paneli (Jotform İzmir Hackathon)

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

## 🛠️ Kullanılan Teknolojiler ve Kütüphaneler

Projenin bilgisayarınızda sorunsuz çalışması için `package.json` dosyasına tüm gereksinimler tanımlanmıştır. Proje ayağa kalktığında şu kütüphaneler otomatik olarak yüklenecektir:

- **React 19 & Vite 8:** Yüksek performanslı render ve ultra hızlı derleme altyapısı.
- **TailwindCSS v4:** Utility-first yaklaşımıyla özel tasarımlar ve neon/glassmorphism efektleri.
- **Fuse.js:** Dedektif arama motoru için güçlü ve hataya toleranslı (fuzzy) metin arama kütüphanesi.
- **React Leaflet / Leaflet:** İpuçlarının görselleştirildiği konum haritası (kapsam dahilinde).

## 🚀 Jüri İçin Detaylı Kurulum Rehberi

Projeyi kendi bilgisayarınızda (Mac, Windows veya Linux fark etmeksizin) sorunsuz bir şekilde çalıştırmak için aşağıdaki adımları sırasıyla uygulamanız yeterlidir.

### 📋 Ön Koşullar (Prerequisites)
Projeyi çalıştırmadan önce bilgisayarınızda **Node.js**'in güncel bir sürümünün (v18 veya üzeri) yüklü olduğundan emin olun. Kurulu olup olmadığını terminale `node -v` yazarak kontrol edebilirsiniz.

---

### Adım 1: Projeyi Bilgisayarınıza İndirin (Clone)
Terminalinizi (veya komut satırınızı) açın ve projenin kaynak kodlarını GitHub'dan bilgisayarınıza çekmek için şu komutu yapıştırıp *Enter*'a basın:

```bash
git clone https://github.com/Gorkemutku/2026-frontend-challenge-izmir.git
```
*(Bu komut, bulunduğunuz dizine projenin adıyla yeni bir klasör oluşturur ve tüm dosyaları içine indirir.)*

### Adım 2: Proje Klasörünün İçine Girin
Dosyalar indikten sonra, işlemlere proje klasörünün içinde devam etmemiz gerekiyor. Bunun için:

```bash
cd 2026-frontend-challenge-izmir
```

### Adım 3: Gerekli Kütüphaneleri (Bağımlılıkları) Yükleyin
Projemiz React, TailwindCSS ve Fuse.js gibi modern teknolojiler kullanmaktadır. Bu araçların bilgisayarınıza otomatik olarak inip kurulması için şu komutu çalıştırın:

```bash
npm install
```
*(Bu işlem internet hızınıza bağlı olarak birkaç saniye ile bir dakika arasında sürebilir. Lütfen tamamlanana kadar bekleyin.)*

### Adım 4: Projeyi Başlatın (Geliştirici Sunucusu)
Her şey kuruldu! Artık projeyi ayağa kaldırmak için tek yapmanız gereken:

```bash
npm run dev
```

Bu komutu çalıştırdığınızda terminalinizde `http://localhost:5173/` (veya benzeri) bir link belirecektir. Bu linke tıklayarak (Mac için `Cmd + Click`, Windows için `Ctrl + Click`) veya tarayıcınıza kopyalayarak **Podo Dedektif Paneli**'ne anında giriş yapabilirsiniz. 

🕵️‍♂️ **Keyifli incelemeler ve iyi eğlenceler!** 🐾
