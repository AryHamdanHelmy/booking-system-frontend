import client from './client';

export const publicApi = {
  services: () => client.get('/services').then((r) => r.data.data),

  therapists: () => client.get('/therapists').then((r) => r.data.data),

  availability: (params) =>
    client.get('/availability', { params }).then((r) => r.data.data),

  createBooking: (payload) =>
    client.post('/bookings', payload).then((r) => r.data.data),

  /** Halaman status publik, dicari lewat kode booking. */
  showBooking: (code) =>
    client.get(`/bookings/${code}`).then((r) => r.data.data),

  cancelBooking: (code, reason) =>
    client.post(`/bookings/${code}/cancel`, { reason }).then((r) => r.data.data),
};