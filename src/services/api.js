/**
 * Podo Detective Panel — API Service Layer
 * 
 * Gerçek Jotform API entegrasyonu.
 */

// Form konfigürasyonları
const FORMS = {
  location: { id: '261134527667966', key: 'b119f8e8fd7fe6fbdb3aa032cef23299' }, // Girişler
  message:  { id: '261133651963962', key: 'd129baeb6efa832415911485ef5d6dc1' }, // Mesajlar
  sighting: { id: '261133720555956', key: '5bea83dbf561ba3190f27373831ac2a7' }, // Görüşler
  evidence: { id: '261134449238963', key: 'c3beedaed8344260d609b35b6437c604' }, // Kişisel Notlar
  tip:      { id: '261134430330946', key: '6de24ff899b00a30e23431f89aee9e9d' }, // Anonim İpuçları
};

// ─── API İSTEK FONKSİYONU ─────────────────────────────────
const fetchFromJotform = async (formType, signal) => {
  const form = FORMS[formType];
  if (!form) return [];
  
  try {
    const res = await fetch(
      `https://api.jotform.com/form/${form.id}/submissions?apiKey=${form.key}&limit=1000`,
      { signal }
    );
    const data = await res.json();
    return mapJotformSubmissions(data.content || [], formType);
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(`Error fetching ${formType}:`, error);
    }
    throw error;
  }
};

export const fetchLocations = (signal) => fetchFromJotform('location', signal);
export const fetchMessages = (signal) => fetchFromJotform('message', signal);
export const fetchSightings = (signal) => fetchFromJotform('sighting', signal);
export const fetchEvidence = (signal) => fetchFromJotform('evidence', signal);
export const fetchTips = (signal) => fetchFromJotform('tip', signal);

export const fetchAllClues = async (signal) => {
  const results = await Promise.all([
    fetchSightings(signal),
    fetchLocations(signal),
    fetchEvidence(signal),
    fetchMessages(signal),
    fetchTips(signal),
  ]);

  return results.flat();
};

// ═══════════════════════════════════════════════════════════════
// JOTFORM API FIELD MAPPING
// ═══════════════════════════════════════════════════════════════

const FORM_FIELD_MAPS = {
  sighting: {
    personname:  'witnessName',
    location:    'locationName',
    timestamp:   'timestamp',
    note:        'description',
    coordinates: 'rawCoordinates',
    seenwith:    'seenWith', 
  },
  location: {
    fullname:    'checkInBy',
    location:    'locationName',
    timestamp:   'timestamp',
    note:        'description',
    coordinates: 'rawCoordinates',
  },
  evidence: {
    fullname:    'foundBy',
    timestamp:   'timestamp',
    note:        'description',
  },
  message: {
    from:        'senderName',
    to:          'recipientName',
    message:     'description',
    timestamp:   'timestamp',
  },
  tip: {
    suspectname: 'tipsterName',
    location:    'locationName',
    timestamp:   'timestamp',
    tip:         'description',
    coordinates: 'rawCoordinates',
    confidence:  'confidence',
  },
};

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
      const rawName = (question.name || '').replace(/^q\d+_/, '').toLowerCase();
      const targetField = fieldMap[rawName];

      if (targetField && question.answer) {
        mapped[targetField] = question.answer;
      }
    }
  }

  // Konum adından benzersiz ID üretme (Harita gruplaması için)
  if (mapped.locationName) {
    mapped.locationId = mapped.locationName
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
  }

  // Koordinat Parse Etme ("38.4361,27.1436" -> {lat, lng})
  if (mapped.rawCoordinates) {
    const parts = mapped.rawCoordinates.split(',');
    if (parts.length === 2) {
      mapped.coordinates = { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
    }
    delete mapped.rawCoordinates;
  }
  
  // Görüşler formundaki seenWith alanını description'a ekle
  if (mapped.seenWith && mapped.description) {
    mapped.description += ` (Yanında: ${mapped.seenWith})`;
  } else if (mapped.seenWith) {
    mapped.description = `Yanında: ${mapped.seenWith}`;
  }

  // Tarih Parse Etme ("14-05-2026 18:07" -> ISO Format)
  if (mapped.timestamp && typeof mapped.timestamp === 'string' && mapped.timestamp.includes('-')) {
    const [datePart, timePart] = mapped.timestamp.split(' ');
    if (datePart && timePart) {
      const [dd, mm, yyyy] = datePart.split('-');
      if (dd && mm && yyyy) {
        mapped.timestamp = `${yyyy}-${mm}-${dd}T${timePart}:00+03:00`;
      }
    }
  }

  // Fallback: created_at -> timestamp
  if (!mapped.timestamp && submission.created_at) {
    mapped.timestamp = submission.created_at;
  }
  
  // Status ataması (hackathon demo için rastgele veya form tipine göre de verilebilir)
  if (formType === 'tip') mapped.status = 'Kritik';
  else if (formType === 'sighting') mapped.status = 'İnceleniyor';
  else if (formType === 'message') mapped.status = 'Çözüldü';

  return mapped;
};

export const mapJotformSubmissions = (submissions, formType) => {
  return (submissions || [])
    .map((sub) => mapJotformSubmission(sub, formType))
    .filter(clue => clue.description || clue.locationName || clue.timestamp);
};
