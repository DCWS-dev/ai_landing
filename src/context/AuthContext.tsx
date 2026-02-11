import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const TOKEN_KEY = 'admin-auth-token';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(TOKEN_KEY);
  });

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) return false;

      const { token } = await res.json();
      localStorage.setItem(TOKEN_KEY, token);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  }, []);

  const getToken = useCallback((): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
