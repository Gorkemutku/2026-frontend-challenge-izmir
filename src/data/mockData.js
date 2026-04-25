/**
 * Podo Detective Panel — Mock Data
 * 5 farklı Jotform form verisini simüle ediyor.
 
 * Ortak Alanlar (her formda):
 * - id, timestamp, locationId, locationName, coordinates
 * - status: "Çözüldü" | "İnceleniyor" | "Kritik" | "Yeni"
 * - confidence: "high" | "medium" | "low"
 * - formType: "sighting" | "location" | "evidence" | "message" | "tip"
 */



// ─── KONUMLAR REFERANS TABLOSU ────────────────────────────────
export const locationRegistry = {};

// ─── KİŞİLER REFERANS TABLOSU ────────────────────────────────
// İsim normalizasyonu 
export const personRegistry = {
  podo: { canonicalName: "Podo", aliases: ["podo", "PODO"], role: "Maskot 🐾" },
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
