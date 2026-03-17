'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  companyName: string | null;
  tier: string;
  emailVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name?: string, companyName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) { const data = await res.json(); if (data?.user) { setUser(data.user); return; } }
      setUser(null);
    } catch { setUser(null); }
  }, []);
  useEffect(() => { refreshUser().finally(() => setLoading(false)); }, [refreshUser]);
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    setUser(data.user);
    return {};
  }, []);
  const register = useCallback(async (email: string, password: string, name?: string, companyName?: string) => {
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name, companyName }) });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    setUser(data.user);
    return {};
  }, []);
  const logout = useCallback(async () => { await fetch('/api/auth/logout', { method: 'POST' }); setUser(null); }, []);
  return <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
