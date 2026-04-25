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

// ─── FORM 1: Görgü Tanığı Raporları ───────────────────────────
export const sightings = [
  {
    id: "s1",
    formType: "sighting",
    timestamp: "2026-04-25T14:15:00+03:00",
    witnessName: "Alicann",  // kasıtlı typo
    witnessId: "w1",
    locationId: "loc1",
    locationName: "Jotform Ofis — Giriş Katı",
    coordinates: { lat: 38.4192, lng: 27.1287 },
    description: "Podo'yu ana girişte gördüm. Mutlu görünüyordu, etrafta zıplıyordu.",
    podoMood: "Mutlu",
    status: "Çözüldü",
    confidence: "high",
  },
  {
    id: "s2",
    formType: "sighting",
    timestamp: "2026-04-25T15:30:00+03:00",
    witnessName: "Elif Kaya",
    witnessId: "w2",
    locationId: "loc3",
    locationName: "Kafeterya",
    coordinates: { lat: 38.4195, lng: 27.1290 },
    description: "Podo kafeteryada yemek artıklarını kokluyordu. Yanında bilinmeyen biri vardı.",
    podoMood: "Meraklı",
    status: "İnceleniyor",
    confidence: "high",
  },
  {
    id: "s3",
    formType: "sighting",
    timestamp: "2026-04-25T17:45:00+03:00",
    witnessName: "Alican",  // doğru yazım — s1'deki Alicann ile aynı kişi
    witnessId: "w1",
    locationId: "loc5",
    locationName: "Otopark — B2 Katı",
    coordinates: { lat: 38.4188, lng: 27.1283 },
    description: "Podo B2'de koşuyordu. Çok telaşlı görünüyordu, sanki birinden kaçıyordu.",
    podoMood: "Telaşlı",
    status: "Kritik",
    confidence: "medium",
  },
  {
    id: "s4",
    formType: "sighting",
    timestamp: "2026-04-25T19:29:00+03:00",
    witnessName: "Mehmet Demir",
    witnessId: "w3",
    locationId: "loc7",
    locationName: "Asansör — 3. Kat",
    coordinates: { lat: 38.4191, lng: 27.1286 },
    description: "Podo asansöre bindi ve kapılar kapandı. Hangi kata gittiği bilinmiyor. BU PODO'NUN SON GÖRÜLDÜĞÜ AN.",
    podoMood: "Bilinmiyor",
    status: "Kritik",
    confidence: "high",
    isLastSighting: true,  // 🚨 En kritik ipucu
  },
];

// ─── FORM 2: Konum Kayıtları (Check-in'ler) ──────────────────
export const locations = [
  {
    id: "l1",
    formType: "location",
    timestamp: "2026-04-25T14:00:00+03:00",
    checkInBy: "Güvenlik Sistemi",
    locationId: "loc1",
    locationName: "Jotform Ofis — Giriş Katı",
    coordinates: { lat: 38.4192, lng: 27.1287 },
    sensorType: "Kartlı Geçiş",
    description: "Podo'nun yaka kartı giriş kapısında okutuldu.",
    status: "Çözüldü",
    confidence: "high",
  },
  {
    id: "l2",
    formType: "location",
    timestamp: "2026-04-25T15:10:00+03:00",
    checkInBy: "Güvenlik Kamerası",
    locationId: "loc2",
    locationName: "Toplantı Odası — Oda 4B",
    coordinates: { lat: 38.4193, lng: 27.1288 },
    sensorType: "CCTV",
    description: "Kamera kaydında Podo Oda 4B'den çıkarken görüldü.",
    status: "Çözüldü",
    confidence: "high",
  },
  {
    id: "l3",
    formType: "location",
    timestamp: "2026-04-25T16:20:00+03:00",
    checkInBy: "Güvenlik Sistemi",
    locationId: "loc4",
    locationName: "Merdiven Boşluğu — 2. Kat",
    coordinates: { lat: 38.4190, lng: 27.1285 },
    sensorType: "Hareket Sensörü",
    description: "2. kat merdiven boşluğunda hareket algılandı.",
    status: "İnceleniyor",
    confidence: "medium",
  },
  {
    id: "l4",
    formType: "location",
    timestamp: "2026-04-25T18:45:00+03:00",
    checkInBy: "Güvenlik Kamerası",
    locationId: "loc6",
    locationName: "Çatı Terası",
    coordinates: { lat: 38.4194, lng: 27.1291 },
    sensorType: "CCTV",
    description: "Çatı terasında belirsiz bir figür görüldü. Podo olabilir.",
    status: "İnceleniyor",
    confidence: "low",
  },
];

// ─── FORM 3: Kanıt Dosyası (Fiziksel İpuçları) ───────────────
export const evidence = [
  {
    id: "e1",
    formType: "evidence",
    timestamp: "2026-04-25T14:30:00+03:00",
    foundBy: "Alicann",  // kasıtlı typo — w1 ile aynı kişi
    locationId: "loc1",
    locationName: "Jotform Ofis — Giriş Katı",
    coordinates: { lat: 38.4192, lng: 27.1287 },
    evidenceType: "Pati İzi",
    description: "Giriş holünde taze pati izleri bulundu. Yön: kafeteryaya doğru.",
    status: "Çözüldü",
    confidence: "high",
  },
  {
    id: "e2",
    formType: "evidence",
    timestamp: "2026-04-25T16:00:00+03:00",
    foundBy: "Zeynep Aydın",
    locationId: "loc3",
    locationName: "Kafeterya",
    coordinates: { lat: 38.4195, lng: 27.1290 },
    evidenceType: "Tüy",
    description: "Kafeterya masasının altında Podo'nun tüyleri bulundu.",
    status: "Çözüldü",
    confidence: "high",
  },
  {
    id: "e3",
    formType: "evidence",
    timestamp: "2026-04-25T17:30:00+03:00",
    foundBy: "Emre Çelik",
    locationId: "loc4",
    locationName: "Merdiven Boşluğu — 2. Kat",
    coordinates: { lat: 38.4190, lng: 27.1285 },
    evidenceType: "Çizik İzi",
    description: "Merdiven korkuluğunda tırnak çizikleri. Podo burada merdivenleri tırmanmış olabilir.",
    status: "İnceleniyor",
    confidence: "medium",
  },
  {
    id: "e4",
    formType: "evidence",
    timestamp: "2026-04-25T19:00:00+03:00",
    foundBy: "Mehmet Demir",
    locationId: "loc5",
    locationName: "Otopark — B2 Katı",
    coordinates: { lat: 38.4188, lng: 27.1283 },
    evidenceType: "Yaka Kartı",
    description: "Podo'nun yaka kartı otopark zemininde bulundu. Kart düşürülmüş görünüyor.",
    status: "Kritik",
    confidence: "high",
  },
];

// ─── FORM 4: İletişim Kayıtları (Mesajlar & Notlar) ──────────
export const messages = [
  {
    id: "m1",
    formType: "message",
    timestamp: "2026-04-25T13:50:00+03:00",
    senderName: "Podo",
    senderId: "podo",
    recipientName: "Alican",  // doğru yazım
    recipientId: "w1",
    locationId: "loc1",
    locationName: "Jotform Ofis — Giriş Katı",
    coordinates: { lat: 38.4192, lng: 27.1287 },
    messageType: "Slack Mesajı",
    description: "Podo, Alican'a 'Bugün bir sürprizim var, buluşalım!' yazmış.",
    status: "Çözüldü",
    confidence: "high",
  },
  {
    id: "m2",
    formType: "message",
    timestamp: "2026-04-25T16:45:00+03:00",
    senderName: "Bilinmeyen",
    senderId: "unknown1",
    recipientName: "Güvenlik",
    recipientId: "security",
    locationId: "loc4",
    locationName: "Merdiven Boşluğu — 2. Kat",
    coordinates: { lat: 38.4190, lng: 27.1285 },
    messageType: "Anonim Not",
    description: "Merdiven boşluğuna bırakılan el yazısı not: 'Podo'yu arıyorsan yukarı bak.'",
    status: "Kritik",
    confidence: "medium",
  },
  {
    id: "m3",
    formType: "message",
    timestamp: "2026-04-25T18:30:00+03:00",
    senderName: "Elif Kaya",
    senderId: "w2",
    recipientName: "Alicann",  // kasıtlı typo
    recipientId: "w1",
    locationId: "loc6",
    locationName: "Çatı Terası",
    coordinates: { lat: 38.4194, lng: 27.1291 },
    messageType: "SMS",
    description: "Elif, Alican'a 'Podo'yu çatıda gördüm sanki, gel kontrol edelim' yazmış.",
    status: "İnceleniyor",
    confidence: "medium",
  },
  {
    id: "m4",
    formType: "message",
    timestamp: "2026-04-25T19:15:00+03:00",
    senderName: "Podo",
    senderId: "podo",
    recipientName: "Herkes",
    recipientId: "all",
    locationId: "loc7",
    locationName: "Asansör — 3. Kat",
    coordinates: { lat: 38.4191, lng: 27.1286 },
    messageType: "Son Mesaj",
    description: "Podo'nun son Slack mesajı: 'Bir yere gitmem lazım... 🐾' — Bundan sonra sessizlik.",
    status: "Kritik",
    confidence: "high",
    isLastSighting: true,
  },
];

// ─── FORM 5: İhbar Hattı (Anonim/Resmi İhbarlar) ─────────────
export const tips = [
  {
    id: "t1",
    formType: "tip",
    timestamp: "2026-04-25T15:00:00+03:00",
    tipsterName: "Anonim",
    tipsterId: "anon1",
    locationId: "loc2",
    locationName: "Toplantı Odası — Oda 4B",
    coordinates: { lat: 38.4193, lng: 27.1288 },
    tipType: "Telefon İhbarı",
    description: "Bir çalışan Podo'nun toplantı odasında saklandığını bildirdi.",
    status: "Çözüldü",
    confidence: "medium",
  },
  {
    id: "t2",
    formType: "tip",
    timestamp: "2026-04-25T17:00:00+03:00",
    tipsterName: "Zeynep Aydın",
    tipsterId: "w4",
    locationId: "loc3",
    locationName: "Kafeterya",
    coordinates: { lat: 38.4195, lng: 27.1290 },
    tipType: "Yüz Yüze Bildirim",
    description: "Zeynep, Podo'nun kafeteryada tanımadığı biriyle konuştuğunu söyledi.",
    status: "İnceleniyor",
    confidence: "high",
  },
  {
    id: "t3",
    formType: "tip",
    timestamp: "2026-04-25T18:00:00+03:00",
    tipsterName: "Anonim",
    tipsterId: "anon2",
    locationId: "loc5",
    locationName: "Otopark — B2 Katı",
    coordinates: { lat: 38.4188, lng: 27.1283 },
    tipType: "Online Form",
    description: "Otopark B2'de şüpheli sesler duyuldu. Podo'nun çığlığına benziyordu.",
    status: "Kritik",
    confidence: "low",
  },
  {
    id: "t4",
    formType: "tip",
    timestamp: "2026-04-25T19:45:00+03:00",
    tipsterName: "Emre Çelik",
    tipsterId: "w5",
    locationId: "loc7",
    locationName: "Asansör — 3. Kat",
    coordinates: { lat: 38.4191, lng: 27.1286 },
    tipType: "Acil İhbar",
    description: "Emre, asansör kamerasında Podo'yu gördüğünü iddia ediyor. 3. katta inmiş olabilir.",
    status: "Yeni",
    confidence: "medium",
  },
];

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
    aliases: ["Alicann", "alican", "Alıcan"], // bilinen yazım varyasyonları
    role: "Çalışan",
  },
  w2: { canonicalName: "Elif Kaya", aliases: ["elif kaya", "Elif"], role: "Çalışan" },
  w3: { canonicalName: "Mehmet Demir", aliases: ["mehmet demir", "Mehmet"], role: "Güvenlik" },
  w4: { canonicalName: "Zeynep Aydın", aliases: ["zeynep aydın", "Zeynep"], role: "Çalışan" },
  w5: { canonicalName: "Emre Çelik", aliases: ["emre çelik", "Emre"], role: "Teknisyen" },
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
