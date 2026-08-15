import client from "./client";

export const dashboardApi = {
    today: (date) =>
        client.get('/admin/dashboard', { params: {date}}).then((r)=> r.data),
};