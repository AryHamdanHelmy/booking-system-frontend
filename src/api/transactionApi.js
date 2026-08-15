import client from "./client";

export const transactionApi = {
    checkout: (payload) =>
        client.post('/admin/transactions', payload).then ((r)=> r.data.data),

    list: (params) =>
        client.get('/admin/transactions', {params}).then((r)=> r.data),
};