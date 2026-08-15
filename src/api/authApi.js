import client from './client';

export const authApi = {
    login: (credentials) =>
        client.post('/admin/login', credentials).then((r)=> r.data),

    me: ()=> client.get('/admin/me').then((r)=> r.data),
    logout: ()=> client.post('/admin/logout').then ((r)=> r.data),
};