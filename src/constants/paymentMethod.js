export const PAYMENT_METHOD = {
  CASH:     'cash',
  QRIS:     'qris',
  TRANSFER: 'transfer',
  ONLINE:   'online',
};

export const PAYMENT_METHOD_LABEL = {
  cash:     'Tunai',
  qris:     'QRIS',
  transfer: 'Transfer bank',
  online:   'Bayar online',
};

/** Pilihan yang muncul di layar kasir. */
export const ON_SITE_METHODS = [
  PAYMENT_METHOD.CASH,
  PAYMENT_METHOD.QRIS,
  PAYMENT_METHOD.TRANSFER,
];