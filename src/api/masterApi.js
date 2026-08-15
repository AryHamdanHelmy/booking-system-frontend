import client from './client';

/** Data master untuk halaman Pengaturan. */
export const therapistApi = {
  list: () =>
    client.get('/admin/therapists').then((r) => r.data.data),

  create: (payload) =>
    client.post('/admin/therapists', payload).then((r) => r.data.data),

  update: (id, payload) =>
    client.patch(`/admin/therapists/${id}`, payload).then((r) => r.data.data),
};

export const serviceApi = {
  list: () =>
    client.get('/admin/services').then((r) => r.data.data),

  create: (payload) =>
    client.post('/admin/services', payload).then((r) => r.data.data),

  update: (id, payload) =>
    client.patch(`/admin/services/${id}`, payload).then((r) => r.data.data),
};

export const shiftApi = {
  list: (therapistId) =>
    client.get(`/admin/therapists/${therapistId}/shifts`).then((r) => r.data.data),

  /** Menyimpan tujuh hari sekaligus. */
  update: (therapistId, shifts) =>
    client.put(`/admin/therapists/${therapistId}/shifts`, { shifts })
      .then((r) => r.data.data),
};