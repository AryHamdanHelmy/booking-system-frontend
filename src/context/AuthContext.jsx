import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '@/api/authApi';
import { clearToken, getToken, setToken } from '@/api/client';
// Diberi nama lain agar tidak bentrok dengan properti isStaff di bawah.
import { isStaff as cekStaff, ROLE } from '@/constants/roles';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Wajib ada. Saat halaman di-refresh, pengecekan token ke server butuh
  // waktu sesaat — tanpa ini pengguna terlempar ke login padahal sudah login.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const me = await authApi.me();
        if (active) setUser(me);
      } catch {
        clearToken();
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user: loggedIn } = await authApi.login(credentials);
    setToken(token);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user: created, message } = await authApi.register(payload);
    setToken(token);
    setUser(created);
    return { user: created, message };
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearToken();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: user !== null,
      isStaff: cekStaff(user?.role),
      isCustomer: user?.role === ROLE.CUSTOMER,
    }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}