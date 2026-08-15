import axios from 'axios';

export const TOKEN_KEY = 'refleksi_token';

export const getToken   = () => localStorage.getItem(TOKEN_KEY);
export const setToken   = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Sisipkan token di setiap request admin.
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token kedaluwarsa atau dicabut: paksa login ulang.
    // 409 TIDAK ditangani di sini — itu peringatan bentrok
    // yang harus sampai ke pemanggilnya.
    if (status === 401) {
      clearToken();
      if (!window.location.pathname.startsWith('/masuk')) {
        window.location.href = '/masuk';
      }
    }

    return Promise.reject(error);
  },
);

export default client;

/** Ambil pesan error yang layak ditampilkan ke pengguna. */
export function errorMessage(error, fallback = 'Terjadi kesalahan. Coba lagi.') {
  const data = error?.response?.data;
  if (!data) return fallback;
  if (data.errors) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first[0]) return first[0];
  }
  return data.message || fallback;
}