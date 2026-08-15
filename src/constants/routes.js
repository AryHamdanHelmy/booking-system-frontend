/** Path terpusat. Jangan tulis string path langsung di komponen. */
export const ROUTES = {
  // Publik
  BOOKING:        '/',
  BOOKING_STATUS: (code = ':code') => `/booking/${code}`,

  // Admin
  LOGIN:      '/masuk',
  DASHBOARD:  '/admin',
  SETTINGS:   '/admin/pengaturan',
  BOOKINGS:   '/admin/booking',
  REVENUE:    '/admin/laporan',
};