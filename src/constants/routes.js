/** Path terpusat. Jangan tulis string path langsung di komponen. */
export const ROUTES = {
  // Publik
  BOOKING:        '/',
  BOOKING_STATUS: (code = ':code') => `/booking/${code}`,

  //Pelanggan
  REGISTER: '/daftar',
  CUSTOMER_LOGIN: '/masuk-pelanggan',
  MY_BOOKINGS: '/booking-saya',

  // Admin
  LOGIN:      '/masuk',
  DASHBOARD:  '/admin',
  SETTINGS:   '/admin/pengaturan',
  BOOKINGS:   '/admin/booking',
  REVENUE:    '/admin/laporan',
};