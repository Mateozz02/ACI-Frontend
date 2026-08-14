"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { login as apiLogin, register as apiRegister } from "@/features/auth/api";
import type { User } from "@/features/auth/types";
import { getClientToken, setClientToken, removeClientToken } from "@/shared/lib/cookies";
import { getAuthHeaders } from "@/shared/lib/api";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type AuthContextType = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (t: string) => {
    try {
      const res = await fetch(`${BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const u = await res.json();
        setUser(u);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = getClientToken();
    if (stored) {
      setToken(stored);
      fetchUser(stored);
    }
    setLoading(false);
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setClientToken(res.access_token);
    setToken(res.access_token);
    await fetchUser(res.access_token);
  }, [fetchUser]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const res = await apiRegister(email, password, name);
    setClientToken(res.access_token);
    setToken(res.access_token);
    await fetchUser(res.access_token);
  }, [fetchUser]);

  const logout = useCallback(() => {
    removeClientToken();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext value={{ token, user, isAuthenticated: !!token, loading, login, register, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
