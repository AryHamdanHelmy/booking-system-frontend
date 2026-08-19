import { OUTLET } from '@/constants/outlet';

/** Format waktu untuk file .ics: 20260815T093000Z */
function toIcsDate(iso) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/** Menghindari koma dan titik koma merusak format .ics. */
function escape(text = '') {
  return String(text).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
}

/**
 * Membuat file .ics di sisi browser lalu memicu unduhan.
 * Tidak butuh backend — cukup teks yang dibungkus Blob.
 */
export function downloadIcs(booking) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Refleksi//Booking//ID',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${booking.booking_code}@refleksi`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(booking.start_at)}`,
    `DTEND:${toIcsDate(booking.end_at)}`,
    `SUMMARY:${escape(`${booking.service?.name ?? 'Sesi'} · ${OUTLET.name}`)}`,
    `DESCRIPTION:${escape(
      [
        `Kode booking: ${booking.booking_code}`,
        booking.therapist?.name ? `Terapis: ${booking.therapist.name}` : '',
      ].filter(Boolean).join('\n'),
    )}`,
    OUTLET.address ? `LOCATION:${escape(OUTLET.address)}` : '',
    // Pengingat 1 jam sebelum sesi.
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escape(`Sesi di ${OUTLET.name} 1 jam lagi`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  const blob = new Blob([lines.join('\r\n')], {
    type: 'text/calendar;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${booking.booking_code}.ics`;
  link.click();

  URL.revokeObjectURL(url);
}