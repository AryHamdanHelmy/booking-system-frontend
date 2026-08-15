import client from "./client";

export const walkinApi = {
    create: (payload, { force = false } ={}) =>
        client
            .post('/admin/bookings', { ...payload, force })
            .then((r)=> r.data.data),
};

export function isConflictWarning(error) {
    return error?.response?.status === 409;
}

export function conflictsFrom(error) {
    return error?.response?.data?.conflict ?? [];
}