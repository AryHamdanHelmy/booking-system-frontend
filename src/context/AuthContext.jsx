import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '@/api/authApi';
import { clearToken, getToken, setToken } from '@/api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Wajib ada. Saat halaman di-refresh, pengecekan token ke server butuh
  // waktu sesaat — tanpa ini admin terlempar ke login padahal sudah login.
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

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearToken();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, isAuthenticated: user !== null }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}