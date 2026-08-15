/**
 * Normalisasi ke format yang dipakai backend: 628xxx
 * Cermin dari Customer::normalizePhone() di Laravel.
 */
export function normalizePhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.startsWith('0'))  return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('8'))  return `62${digits}`;
  return digits;
}

/** Tampilan yang enak dibaca: "0812-3456-7890" */
export function displayPhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  const local = digits.startsWith('62') ? `0${digits.slice(2)}` : digits;
  return local.replace(/(\d{4})(?=\d)/g, '$1-');
}

/** Link WhatsApp untuk tombol hubungi tamu. */
export function whatsappLink(phone, message = '') {
  const to = normalizePhone(phone);
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${to}${text}`;
}