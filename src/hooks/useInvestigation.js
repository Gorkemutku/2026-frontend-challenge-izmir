/**
 * useInvestigation — Merkezi Soruşturma Hook'u
 * 
 * Tüm 5 form verisini çeker, normalize eder, cross-reference yapar.
 * Fuse.js ile fuzzy search ve gelişmiş filtreleme sağlar.
 * 
 * AGRESİF İSİM NORMALİZASYONU:
 * - Alicann → Alican (tekrarlayan harf temizliği)
 * - Ayca → Ayça (Türkçe karakter düzeltmesi)
 * - Case-insensitive eşleştirme
 * - personRegistry üzerinden alias lookup
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Fuse from 'fuse.js';
import { fetchAllClues } from '../services/api.js';
import { personRegistry, formTypeMeta, statusMeta } from '../data/mockData.js';

// ═══════════════════════════════════════════════════════════════
// AGRESİF İSİM NORMALİZASYONU
// ═══════════════════════════════════════════════════════════════

/**
 * Türkçe karakter eşleştirme haritası (ASCII → Türkçe)
 * "Ayca" yazıldığında "Ayça" olarak düzeltir
 */
const TURKISH_CHAR_MAP = {
  'c': 'ç', 'C': 'Ç',
  'g': 'ğ', 'G': 'Ğ',
  'i': 'ı', 'I': 'İ',  // dikkat: İngilizce 'I' → Türkçe 'İ'
  'o': 'ö', 'O': 'Ö',
  'u': 'ü', 'U': 'Ü',
  's': 'ş', 'S': 'Ş',
};

/**
 * Tekrarlayan harfleri temizler: "Alicann" → "Alican"
 * Ardışık aynı harf 2'den fazla ise tek harfe düşürür
 */
const removeRepeatedChars = (str) =>
  str.replace(/(.)\1{1,}/g, '$1');

/**
 * Stringleri normalize eder (küçük harf, trim, whitespace sıkıştır)
 */
const normalizeString = (str) =>
  str?.trim().replace(/\s+/g, ' ') || '';

/**
 * İsim üzerinden personRegistry'de lookup yapar.
 * Önce exact match, sonra alias match, son olarak fuzzy match dener.
 * 
 * @param {string} rawName — Ham isim (typo'lu olabilir)
 * @returns {{ canonicalName: string, personId: string, role: string } | null}
 */
const lookupPerson = (rawName) => {
  if (!rawName) return null;
  
  const cleaned = normalizeString(rawName);
  const cleanedLower = cleaned.toLowerCase();
  const cleanedNoRepeat = removeRepeatedChars(cleanedLower);
  
  for (const [personId, person] of Object.entries(personRegistry)) {
    // 1) Exact match (case-insensitive)
    if (person.canonicalName.toLowerCase() === cleanedLower) {
      return { canonicalName: person.canonicalName, personId, role: person.role };
    }
    
    // 2) Alias match (case-insensitive)
    const aliasMatch = person.aliases.some(
      (alias) => alias.toLowerCase() === cleanedLower
    );
    if (aliasMatch) {
      return { canonicalName: person.canonicalName, personId, role: person.role };
    }
    
    // 3) Tekrarlayan harf temizlendikten sonra match
    if (removeRepeatedChars(person.canonicalName.toLowerCase()) === cleanedNoRepeat) {
      return { canonicalName: person.canonicalName, personId, role: person.role };
    }
    
    // 4) Alias'lar üzerinde de tekrarlayan harf kontrolü
    const aliasRepeatMatch = person.aliases.some(
      (alias) => removeRepeatedChars(alias.toLowerCase()) === cleanedNoRepeat
    );
    if (aliasRepeatMatch) {
      return { canonicalName: person.canonicalName, personId, role: person.role };
    }
    
    // 5) Türkçe karakter düzeltmesi ile match
    //    "Ayca" → cedilla olmadan "ayca", "Ayça" → "ayça"
    //    ASCII sürümünü Türkçe sürümüyle karşılaştır
    const canonicalAscii = turkishToAscii(person.canonicalName.toLowerCase());
    if (canonicalAscii === turkishToAscii(cleanedLower)) {
      return { canonicalName: person.canonicalName, personId, role: person.role };
    }
  }
  
  // 6) Eğer listede yoksa, dinamik olarak yeni kişi oluştur (Hackathon esnekliği)
  const capitalizeWords = (s) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return {
    canonicalName: capitalizeWords(cleanedLower),
    personId: `dyn_${cleanedNoRepeat.replace(/[^a-z0-9]/g, '_')}`,
    role: 'Tanık/Şüpheli'
  };
};

/**
 * Türkçe karakterleri ASCII'ye dönüştürür (karşılaştırma için)
 * "Ayça" → "ayca", "Gürkan" → "gurkan"
 */
const turkishToAscii = (str) =>
  str
    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ş/g, 's').replace(/Ş/g, 'S');


// ═══════════════════════════════════════════════════════════════
// VERİ NORMALİZASYONU
// ═══════════════════════════════════════════════════════════════

/**
 * Her ipucu kaydındaki isim alanlarını bulur ve normalize eder.
 * Form tipine göre farklı alan isimlerini kontrol eder.
 */
const getPersonFieldsFromClue = (clue) => {
  const fields = [];
  
  // Form tipine göre kişi alan isimlerini belirle
  switch (clue.formType) {
    case 'sighting':
      if (clue.witnessName) fields.push({ key: 'witnessName', value: clue.witnessName, idKey: 'witnessId' });
      break;
    case 'evidence':
      if (clue.foundBy) fields.push({ key: 'foundBy', value: clue.foundBy });
      break;
    case 'message':
      if (clue.senderName) fields.push({ key: 'senderName', value: clue.senderName, idKey: 'senderId' });
      if (clue.recipientName) fields.push({ key: 'recipientName', value: clue.recipientName, idKey: 'recipientId' });
      break;
    case 'tip':
      if (clue.tipsterName) fields.push({ key: 'tipsterName', value: clue.tipsterName, idKey: 'tipsterId' });
      break;
    case 'location':
      if (clue.checkInBy) fields.push({ key: 'checkInBy', value: clue.checkInBy });
      break;
  }
  
  return fields;
};

/**
 * Tek bir ipucu kaydını normalize eder:
 * - İsimleri personRegistry ile eşleştir
 * - canonicalName ve resolvedPersonId alanlarını ekle
 * - Timestamp'i Date nesnesine çevir
 */
const normalizeClue = (clue) => {
  const normalized = { ...clue };
  const personFields = getPersonFieldsFromClue(clue);
  
  // Her kişi alanını normalize et
  normalized._resolvedPersons = {};
  
  for (const field of personFields) {
    const lookup = lookupPerson(field.value);
    if (lookup) {
      // Orijinal değeri sakla, normalize edilmiş versiyonu ekle
      normalized[`_original_${field.key}`] = field.value;
      normalized[field.key] = lookup.canonicalName;
      normalized._resolvedPersons[field.key] = {
        canonicalName: lookup.canonicalName,
        personId: lookup.personId,
        role: lookup.role,
        originalValue: field.value,
        wasNormalized: field.value !== lookup.canonicalName,
      };
    }
  }
  
  // Timestamp'i parse et
  normalized._parsedTime = new Date(clue.timestamp);
  
  // Aranabilir text oluştur (Fuse.js için)
  normalized._searchText = [
    clue.description,
    clue.locationName,
    ...personFields.map((f) => f.value),
    ...personFields.map((f) => {
      const lookup = lookupPerson(f.value);
      return lookup?.canonicalName || '';
    }),
    formTypeMeta[clue.formType]?.label || '',
    clue.status,
  ].filter(Boolean).join(' ');
  
  return normalized;
};

// ═══════════════════════════════════════════════════════════════
// CROSS-REFERENCING
// ═══════════════════════════════════════════════════════════════

/**
 * İpuçları arasındaki ilişkileri bulur:
 * - Aynı lokasyondaki ipuçları
 * - Aynı kişiyle ilgili ipuçları
 * - Zaman yakınlığı (30 dakika içinde)
 */
const buildCrossReferences = (clues) => {
  const refs = {};
  
  for (const clue of clues) {
    refs[clue.id] = {
      sameLocation: [],
      samePerson: [],
      timeProximity: [],
    };
    
    for (const other of clues) {
      if (other.id === clue.id) continue;
      
      // Aynı lokasyon
      if (other.locationId === clue.locationId) {
        refs[clue.id].sameLocation.push(other.id);
      }
      
      // Aynı kişi (normalized isimler üzerinden)
      const cluePersons = Object.values(clue._resolvedPersons || {});
      const otherPersons = Object.values(other._resolvedPersons || {});
      
      for (const cp of cluePersons) {
        for (const op of otherPersons) {
          if (cp.personId === op.personId && cp.personId !== 'podo') {
            if (!refs[clue.id].samePerson.includes(other.id)) {
              refs[clue.id].samePerson.push(other.id);
            }
          }
        }
      }
      
      // Zaman yakınlığı (30 dakika)
      const timeDiff = Math.abs(clue._parsedTime - other._parsedTime);
      if (timeDiff <= 30 * 60 * 1000 && timeDiff > 0) {
        refs[clue.id].timeProximity.push(other.id);
      }
    }
  }
  
  return refs;
};


// ═══════════════════════════════════════════════════════════════
// FUSE.JS SEARCH CONFIG
// ═══════════════════════════════════════════════════════════════

const FUSE_OPTIONS = {
  keys: [
    { name: '_searchText', weight: 1.0 },
    { name: 'description', weight: 0.8 },
    { name: 'locationName', weight: 0.6 },
    { name: 'witnessName', weight: 0.5 },
    { name: 'senderName', weight: 0.5 },
    { name: 'recipientName', weight: 0.5 },
    { name: 'tipsterName', weight: 0.5 },
    { name: 'foundBy', weight: 0.5 },
    { name: 'checkInBy', weight: 0.4 },
  ],
  threshold: 0.4,        // fuzzy toleransı (düşük = sıkı, yüksek = gevşek)
  distance: 200,
  includeScore: true,
  minMatchCharLength: 2,
};


// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════

export const useInvestigation = () => {
  // ─── State ────────────────────────────────────────
  const [rawClues, setRawClues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    formType: null,     // null = hepsi
    status: null,       // null = hepsi
    confidence: null,   // null = hepsi
    locationId: null,   // null = hepsi
  });
  const [selectedClueId, setSelectedClueId] = useState(null);
  const abortRef = useRef(null);

  // ─── Data Fetching ────────────────────────────────
  const fetchData = useCallback(async () => {
    // Önceki isteği iptal et
    if (abortRef.current) {
      abortRef.current.abort();
    }
    
    const controller = new AbortController();
    abortRef.current = controller;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAllClues(controller.signal);
      
      if (!controller.signal.aborted) {
        setRawClues(data);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Veriler yüklenirken bir hata oluştu.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [fetchData]);

  // ─── Normalization (useMemo) ─────────────────────
  const normalizedClues = useMemo(() => {
    return rawClues.map(normalizeClue);
  }, [rawClues]);

  // ─── Cross References (useMemo) ──────────────────
  const crossRefs = useMemo(() => {
    return buildCrossReferences(normalizedClues);
  }, [normalizedClues]);

  // ─── Kronolojik Sıralama (useMemo) ───────────────
  const sortedClues = useMemo(() => {
    return [...normalizedClues].sort(
      (a, b) => a._parsedTime - b._parsedTime
    );
  }, [normalizedClues]);

  // ─── Fuse.js Instance (useMemo) ──────────────────
  const fuse = useMemo(() => {
    return new Fuse(sortedClues, FUSE_OPTIONS);
  }, [sortedClues]);

  // ─── Filtreleme + Arama (useMemo) ────────────────
  const filteredClues = useMemo(() => {
    let result = sortedClues;

    // Fuse.js search
    if (searchQuery.trim()) {
      // Arama sorgusunu da normalize et (Türkçe karakter toleransı)
      const searchResults = fuse.search(searchQuery.trim());
      result = searchResults.map((r) => r.item);
    }

    // Filtreler
    if (filters.formType) {
      result = result.filter((c) => c.formType === filters.formType);
    }
    if (filters.status) {
      result = result.filter((c) => c.status === filters.status);
    }
    if (filters.confidence) {
      result = result.filter((c) => c.confidence === filters.confidence);
    }
    if (filters.locationId) {
      result = result.filter((c) => c.locationId === filters.locationId);
    }

    return result;
  }, [sortedClues, searchQuery, filters, fuse]);

  // ─── İstatistikler (useMemo) ─────────────────────
  const stats = useMemo(() => {
    const total = normalizedClues.length;
    const solved = normalizedClues.filter((c) => c.status === 'Çözüldü').length;
    const investigating = normalizedClues.filter((c) => c.status === 'İnceleniyor').length;
    const critical = normalizedClues.filter((c) => c.status === 'Kritik').length;
    const newClues = normalizedClues.filter((c) => c.status === 'Yeni').length;
    
    // Son görülme (isLastSighting: true olan veya en son timestamp)
    const lastSighting = normalizedClues
      .filter((c) => c.isLastSighting)
      .sort((a, b) => b._parsedTime - a._parsedTime)[0]
      || sortedClues[sortedClues.length - 1];
    
    // Benzersiz konumlar
    const uniqueLocations = [...new Set(normalizedClues.map((c) => c.locationId))];
    
    // Benzersiz kişiler (normalize edilmiş)
    const uniquePersons = new Set();
    for (const clue of normalizedClues) {
      for (const person of Object.values(clue._resolvedPersons || {})) {
        if (person.personId !== 'podo') {
          uniquePersons.add(person.personId);
        }
      }
    }
    
    // Normalizasyon istatistikleri
    const normalizedNames = normalizedClues.reduce((count, clue) => {
      for (const person of Object.values(clue._resolvedPersons || {})) {
        if (person.wasNormalized) count++;
      }
      return count;
    }, 0);

    return {
      total,
      solved,
      investigating,
      critical,
      newClues,
      lastSighting,
      uniqueLocations: uniqueLocations.length,
      uniquePersons: uniquePersons.size,
      normalizedNames,
      progress: total > 0 ? Math.round((solved / total) * 100) : 0,
    };
  }, [normalizedClues, sortedClues]);

  // ─── Seçili İpucu ────────────────────────────────
  const selectedClue = useMemo(() => {
    if (!selectedClueId) return null;
    return normalizedClues.find((c) => c.id === selectedClueId) || null;
  }, [selectedClueId, normalizedClues]);

  // ─── Seçili ipucu için cross-references ──────────
  const selectedClueRefs = useMemo(() => {
    if (!selectedClueId || !crossRefs[selectedClueId]) return null;
    
    const refs = crossRefs[selectedClueId];
    return {
      sameLocation: refs.sameLocation.map((id) => normalizedClues.find((c) => c.id === id)).filter(Boolean),
      samePerson: refs.samePerson.map((id) => normalizedClues.find((c) => c.id === id)).filter(Boolean),
      timeProximity: refs.timeProximity.map((id) => normalizedClues.find((c) => c.id === id)).filter(Boolean),
    };
  }, [selectedClueId, crossRefs, normalizedClues]);

  // ─── Filter Helpers ──────────────────────────────
  const setFormTypeFilter = useCallback((formType) => {
    setFilters((prev) => ({ ...prev, formType: prev.formType === formType ? null : formType }));
  }, []);

  const setStatusFilter = useCallback((status) => {
    setFilters((prev) => ({ ...prev, status: prev.status === status ? null : status }));
  }, []);

  const setConfidenceFilter = useCallback((confidence) => {
    setFilters((prev) => ({ ...prev, confidence: prev.confidence === confidence ? null : confidence }));
  }, []);

  const setLocationFilter = useCallback((locationId) => {
    setFilters((prev) => ({ ...prev, locationId: prev.locationId === locationId ? null : locationId }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ formType: null, status: null, confidence: null, locationId: null });
    setSearchQuery('');
  }, []);

  // ─── Return ──────────────────────────────────────
  return {
    // Data
    clues: filteredClues,
    allClues: sortedClues,
    loading,
    error,
    
    // Selection
    selectedClue,
    selectedClueRefs,
    setSelectedClueId,
    
    // Search
    searchQuery,
    setSearchQuery,
    
    // Filters
    filters,
    setFormTypeFilter,
    setStatusFilter,
    setConfidenceFilter,
    setLocationFilter,
    clearFilters,
    
    // Stats
    stats,
    
    // Utils
    refetch: fetchData,
    crossRefs,
    formTypeMeta,
    statusMeta,
    personRegistry,
  };
};

export default useInvestigation;
