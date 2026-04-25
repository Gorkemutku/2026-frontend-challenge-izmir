/**
 * Podo Detective Panel — API Service Layer
 * 
 * Mock data ile çalışır, gerçek Jotform API'lerine kolayca geçiş yapılabilir.
 * Her fonksiyon simülasyonlu network delay içerir.
 * AbortController desteği vardır.
 */

import { sightings, locations, evidence, messages, tips } from '../data/mockData.js';

// ─── Simülasyonlu Network Delay ───────────────────────────────
const simulateDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ─── Abort-safe fetch wrapper ─────────────────────────────────
const fetchWithAbort = async (data, signal, delayMs = 400) => {
  await simulateDelay(delayMs);
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
  return structuredClone(data);
};

// ─── Individual Form Fetchers ─────────────────────────────────

/** Form 1: Görgü tanığı raporları */
export const fetchSightings = (signal) =>
  fetchWithAbort(sightings, signal, 300);

/** Form 2: Konum kayıtları (check-in'ler) */
export const fetchLocations = (signal) =>
  fetchWithAbort(locations, signal, 350);

/** Form 3: Kanıt dosyası */
export const fetchEvidence = (signal) =>
  fetchWithAbort(evidence, signal, 400);

/** Form 4: İletişim kayıtları */
export const fetchMessages = (signal) =>
  fetchWithAbort(messages, signal, 320);

/** Form 5: İhbar hattı */
export const fetchTips = (signal) =>
  fetchWithAbort(tips, signal, 380);

// ─── Aggregate Fetcher ────────────────────────────────────────

/**
 * Tüm 5 formu paralel olarak çeker ve birleştirir.
 * @param {AbortSignal} signal — İptal sinyali
 * @returns {Promise<Array>} — Tüm ipuçları tek dizide
 */
export const fetchAllClues = async (signal) => {
  const [s, l, e, m, t] = await Promise.all([
    fetchSightings(signal),
    fetchLocations(signal),
    fetchEvidence(signal),
    fetchMessages(signal),
    fetchTips(signal),
  ]);

  return [...s, ...l, ...e, ...m, ...t];
};

// ═══════════════════════════════════════════════════════════════
// JOTFORM API FIELD MAPPING
// ═══════════════════════════════════════════════════════════════
//
// Jotform submissions verisini temiz modele dönüştürür.
// Jotform ham veri formatı:
//   submission.answers = {
//     "1": { name: "fullname", answer: "Alican", ... },
//     "4": { name: "message",  answer: "Podo'yu gördüm", ... }
//   }
// Bu helper, q1_fullname → name, q4_message → description şeklinde eşler.

/**
 * Her form tipi için Jotform alan adı → bizim model eşlemesi.
 * key = Jotform'daki "name" alanı, value = bizim modeldeki alan adı.
 */
const FORM_FIELD_MAPS = {
  sighting: {
    fullname:    'witnessName',
    location:    'locationName',
    datetime:    'timestamp',
    textarea:    'description',
    mood:        'podoMood',
    confidence:  'confidence',
  },
  location: {
    sensor:      'sensorType',
    checkinby:   'checkInBy',
    location:    'locationName',
    datetime:    'timestamp',
    textarea:    'description',
    confidence:  'confidence',
  },
  evidence: {
    fullname:    'foundBy',
    location:    'locationName',
    datetime:    'timestamp',
    textarea:    'description',
    evidencetype:'evidenceType',
    confidence:  'confidence',
  },
  message: {
    sender:      'senderName',
    recipient:   'recipientName',
    location:    'locationName',
    datetime:    'timestamp',
    textarea:    'description',
    messagetype: 'messageType',
    confidence:  'confidence',
  },
  tip: {
    fullname:    'tipsterName',
    location:    'locationName',
    datetime:    'timestamp',
    textarea:    'description',
    tiptype:     'tipType',
    confidence:  'confidence',
  },
};

/**
 * Tek bir Jotform submission'ı temiz veri modeline dönüştürür.
 * 
 * @param {Object} submission — Jotform submission objesi
 * @param {string} formType — 'sighting' | 'location' | 'evidence' | 'message' | 'tip'
 * @returns {Object} — Normalize edilmiş veri
 * 
 * Jotform answers yapısı:
 *   answers[questionId].name  → alan adı (ör: "fullname")
 *   answers[questionId].answer → değer (ör: "Alican")
 */
export const mapJotformSubmission = (submission, formType) => {
  const fieldMap = FORM_FIELD_MAPS[formType] || {};
  const mapped = {
    id: `${formType[0]}${submission.id}`,
    formType,
    status: 'Yeni',
    confidence: 'medium',
  };

  // answers objesi içindeki her soruyu gez
  if (submission.answers) {
    for (const [, question] of Object.entries(submission.answers)) {
      // question.name → "fullname", "q1_fullname" vb.
      // Prefix'i temizle: "q1_fullname" → "fullname"
      const rawName = (question.name || '').replace(/^q\d+_/, '').toLowerCase();
      const targetField = fieldMap[rawName];

      if (targetField && question.answer) {
        mapped[targetField] = question.answer;
      }
    }
  }

  // Fallback: created_at → timestamp
  if (!mapped.timestamp && submission.created_at) {
    mapped.timestamp = submission.created_at;
  }

  return mapped;
};

/**
 * Birden fazla Jotform submission'ı toplu dönüştürür.
 * 
 * @param {Array} submissions — Jotform submissions dizisi (data.content)
 * @param {string} formType
 * @returns {Array}
 */
export const mapJotformSubmissions = (submissions, formType) =>
  (submissions || []).map((sub) => mapJotformSubmission(sub, formType));

// ─── Gerçek API'ye Geçiş ─────────────────────────────────────
/*
  Gerçek Jotform API ile çalışmak için:

  1. .env → VITE_JOTFORM_API_KEY=your_key

  2. Fetch fonksiyonlarını değiştirin:

     const API_KEY = import.meta.env.VITE_JOTFORM_API_KEY;
     const FORM_IDS = {
       sighting: 'FORM_ID_1',
       location: 'FORM_ID_2',
       evidence: 'FORM_ID_3',
       message:  'FORM_ID_4',
       tip:      'FORM_ID_5',
     };

     export const fetchSightings = async (signal) => {
       const res = await fetch(
         `https://api.jotform.com/form/${FORM_IDS.sighting}/submissions?apiKey=${API_KEY}`,
         { signal }
       );
       const data = await res.json();
       return mapJotformSubmissions(data.content, 'sighting');
     };

  3. fetchAllClues zaten Promise.all kullanıyor — değişiklik gerekmez.
*/
