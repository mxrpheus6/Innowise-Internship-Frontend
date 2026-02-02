import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const navigate = useNavigate();

  const setToken = useCallback((value: string | null) => {
    setTokenState(value);
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setTokenState(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      setToken,
      logout,
    }),
    [token, setToken, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
