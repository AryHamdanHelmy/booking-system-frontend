import client from "./client";

export const bookingApi = {
    list: (params) =>
        client.get('/admin/bookings', { params }).then((r)=> r.data),
    show: (id) =>
        client.get(`/admin/bookings/${id}`).then ((r)=> r.data.data),
    updateStatus: (id, status)=>
        client.patch(`/admin/bookings/${id}/status`).then ((r)=> r.data.data),
    markNoShow: (id)=>
        client.post(`/admin/bookings/${id}/no-show`).then((r)=> r.data.data),
    cancel: (id, reason)=>
        client.post(`/admin/bookings/${id}/cancel`, { reason }).then ((r)=> r.data.data),
};