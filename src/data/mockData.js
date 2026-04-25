/**
 * Podo Detective Panel — Mock Data
 * 5 farklı Jotform form verisini simüle eder.
 * 
 * ÖNEMLİ: İsim alanlarında kasıtlı typo'lar var (ör: Alicann vs Alican)
 * Bu normalizasyon testleri için kullanılır.
 * 
 * Ortak Alanlar (her formda):
 * - id, timestamp, locationId, locationName, coordinates
 * - status: "Çözüldü" | "İnceleniyor" | "Kritik" | "Yeni"
 * - confidence: "high" | "medium" | "low"
 * - formType: "sighting" | "location" | "evidence" | "message" | "tip"
 */

// ─── ESKİ LOKAL VERİLER SİLİNDİ (ARTIK GERÇEK JOTFORM APISINDAN ÇEKİLİYOR) ───

// ─── KONUMLAR REFERANS TABLOSU ────────────────────────────────
export const locationRegistry = {
  loc1: { name: "Jotform Ofis — Giriş Katı", coordinates: { lat: 38.4192, lng: 27.1287 }, floor: 0, zone: "Ana Bina" },
  loc2: { name: "Toplantı Odası — Oda 4B", coordinates: { lat: 38.4193, lng: 27.1288 }, floor: 4, zone: "Ana Bina" },
  loc3: { name: "Kafeterya", coordinates: { lat: 38.4195, lng: 27.1290 }, floor: 0, zone: "Sosyal Alan" },
  loc4: { name: "Merdiven Boşluğu — 2. Kat", coordinates: { lat: 38.4190, lng: 27.1285 }, floor: 2, zone: "Ana Bina" },
  loc5: { name: "Otopark — B2 Katı", coordinates: { lat: 38.4188, lng: 27.1283 }, floor: -2, zone: "Alt Kat" },
  loc6: { name: "Çatı Terası", coordinates: { lat: 38.4194, lng: 27.1291 }, floor: 7, zone: "Üst Kat" },
  loc7: { name: "Asansör — 3. Kat", coordinates: { lat: 38.4191, lng: 27.1286 }, floor: 3, zone: "Ana Bina" },
};

// ─── KİŞİLER REFERANS TABLOSU ────────────────────────────────
// İsim normalizasyonu için kullanılır
export const personRegistry = {
  w1: { 
    canonicalName: "Alican", 
    aliases: ["Alicann", "alican", "Alıcan", "ALİCAN"], // bilinen yazım varyasyonları
    role: "Çalışan",
  },
  w2: { canonicalName: "Elif Kaya", aliases: ["elif kaya", "Elif"], role: "Çalışan" },
  w3: { canonicalName: "Mehmet Demir", aliases: ["mehmet demir", "Mehmet"], role: "Güvenlik" },
  w4: { canonicalName: "Zeynep Aydın", aliases: ["zeynep aydın", "Zeynep", "Zeynep Aydin"], role: "Çalışan" },
  w5: { canonicalName: "Emre Çelik", aliases: ["emre çelik", "Emre", "Emre Celik"], role: "Teknisyen" },
  w6: {
    canonicalName: "Ayça",
    aliases: ["Ayca", "ayça", "ayca", "AYÇA", "AYCA"], // Türkçe karakter varyasyonları
    role: "Çalışan",
  },
  podo: { canonicalName: "Podo", aliases: ["podo", "PODO"], role: "Maskot 🐾" },
  unknown1: { canonicalName: "Bilinmeyen Kişi", aliases: ["bilinmeyen"], role: "Şüpheli" },
  anon1: { canonicalName: "Anonim İhbarcı #1", aliases: [], role: "İhbarcı" },
  anon2: { canonicalName: "Anonim İhbarcı #2", aliases: [], role: "İhbarcı" },
  security: { canonicalName: "Güvenlik Birimi", aliases: ["güvenlik"], role: "Departman" },
  all: { canonicalName: "Herkes", aliases: [], role: "Genel" },
};

// ─── FORM TİPİ META DATA ─────────────────────────────────────
export const formTypeMeta = {
  sighting: {
    label: "Görgü Tanığı",
    icon: "👁️",
    color: "var(--color-sighting)",
    bgColor: "rgba(251, 146, 60, 0.15)",
  },
  location: {
    label: "Konum Kaydı",
    icon: "📍",
    color: "var(--color-checkin)",
    bgColor: "rgba(52, 211, 153, 0.15)",
  },
  evidence: {
    label: "Kanıt",
    icon: "🔍",
    color: "var(--color-message)",
    bgColor: "rgba(56, 189, 248, 0.15)",
  },
  message: {
    label: "Mesaj",
    icon: "💬",
    color: "var(--color-note)",
    bgColor: "rgba(167, 139, 250, 0.15)",
  },
  tip: {
    label: "İhbar",
    icon: "🚨",
    color: "var(--color-tip)",
    bgColor: "rgba(248, 113, 113, 0.15)",
  },
};

// ─── STATUS META DATA ─────────────────────────────────────────
export const statusMeta = {
  "Çözüldü": { color: "var(--color-neon-green)", icon: "✅", priority: 0 },
  "İnceleniyor": { color: "var(--color-neon-yellow)", icon: "🔎", priority: 1 },
  "Yeni": { color: "var(--color-neon-cyan)", icon: "🆕", priority: 2 },
  "Kritik": { color: "var(--color-neon-red)", icon: "🚨", priority: 3 },
};
