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

// ─── Gerçek API'ye Geçiş Notları ─────────────────────────────
/*
  Gerçek Jotform API ile çalışmak için:
  
  1. .env dosyasına API key'i ekleyin:
     VITE_JOTFORM_API_KEY=your_api_key
  
  2. Her fetchXxx fonksiyonunu gerçek fetch ile değiştirin:
     
     export const fetchSightings = async (signal) => {
       const res = await fetch(
         `https://api.jotform.com/form/FORM_ID/submissions?apiKey=${import.meta.env.VITE_JOTFORM_API_KEY}`,
         { signal }
       );
       const data = await res.json();
       return normalizeJotformData(data.content, 'sighting');
     };
  
  3. normalizeJotformData helper'ı ile form yanıtlarını
     ortak şemaya dönüştürün.
*/
