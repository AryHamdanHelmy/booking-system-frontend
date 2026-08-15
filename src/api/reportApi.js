import client from "./client";

export const reportApi = {
    revenue: (params) =>
        client.get('/admin/reports/revenue', { params }).then((r)=> r.data),
};