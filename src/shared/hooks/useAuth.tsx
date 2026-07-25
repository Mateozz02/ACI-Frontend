"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { login as apiLogin, register as apiRegister } from "@/features/auth/api";
import { getClientToken, setClientToken, removeClientToken } from "@/shared/lib/cookies";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getClientToken();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setToken(stored);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setClientToken(res.access_token);
    setToken(res.access_token);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const res = await apiRegister(email, password, name);
    setClientToken(res.access_token);
    setToken(res.access_token);
  }, []);

  const logout = useCallback(() => {
    removeClientToken();
    setToken(null);
  }, []);

  return (
    <AuthContext value={{ token, isAuthenticated: !!token, loading, login, register, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
