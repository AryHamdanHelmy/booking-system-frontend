const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 120000 -> "Rp 120.000" */
export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }
  return formatter.format(Number(value)).replace(/\s/g, ' ');
}

/** Untuk input nominal: "120000" -> "120.000" */
export function formatNumberInput(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits === '') return '';
  return new Intl.NumberFormat('id-ID').format(Number(digits));
}

export function parseNumberInput(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits === '' ? 0 : Number(digits);
}