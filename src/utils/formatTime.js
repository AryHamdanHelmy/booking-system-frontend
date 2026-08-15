/** "2026-08-06T14:00:00+07:00" -> "14:00" */
export function formatTime(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Rentang sesi, sudah termasuk buffer: "14:00 – 15:15" */
export function formatTimeRange(startIso, endIso) {
  return `${formatTime(startIso)} – ${formatTime(endIso)}`;
}

/** "Kamis, 6 Agustus 2026" */
export function formatDateLong(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Untuk query param API: "2026-08-06" */
export function toDateParam(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Sisa waktu sesi, untuk papan status: "23 menit lagi" */
export function minutesUntil(iso) {
  if (!iso) return null;
  const diff = Math.round((new Date(iso) - new Date()) / 60000);
  return diff;
}