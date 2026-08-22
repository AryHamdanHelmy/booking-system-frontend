import client from './client';

export const authApi = {
  /** Registrasi pelanggan. Riwayat booking dari nomor yang sama ikut terhubung. */
  register: (payload) =>
    client.post('/auth/register', payload).then((r) => r.data),

  /** Dipakai admin maupun pelanggan — role dikembalikan dalam response. */
  login: (credentials) =>
    client.post('/auth/login', credentials).then((r) => r.data),

  me: () => client.get('/auth/me').then((r) => r.data),

  logout: () => client.post('/auth/logout').then((r) => r.data),
};

export const myBookingApi = {
  list: (params) =>
    client.get('/my/bookings', { params }).then((r) => r.data),

  cancel: (code, reason) =>
    client.post(`/my/bookings/${code}/cancel`, { reason }).then((r) => r.data.data),
};