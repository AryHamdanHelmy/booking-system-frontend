import { IoQrCode, IoCash, IoCard, IoGlobe } from "react-icons/io5";

export const PAYMENT_METHOD = {
  CASH:     'cash',
  QRIS:     'qris',
  TRANSFER: 'transfer',
  ONLINE:   'online',
};

export const PAYMENT_METHOD_LABEL = {
  cash:     'Tunai',
  qris:     'QRIS',
  transfer: 'Transfer',
  online:   'Bayar online',
};

export const PAYMENT_METHOD_ICON = {
  cash:     IoCash,
  qris:     IoQrCode,
  transfer: IoCard,
  online:   IoGlobe,
};

/** Pilihan yang muncul di layar kasir. Online tidak termasuk —
 *  itu untuk pembayaran yang sudah lunas dari kanal lain. */
export const ON_SITE_METHODS = [
  PAYMENT_METHOD.CASH,
  PAYMENT_METHOD.QRIS,
  PAYMENT_METHOD.TRANSFER,
];