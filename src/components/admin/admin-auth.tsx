"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearAdminToken,
  getAdminSession,
  getStoredAdminToken,
  loginAdmin,
  logoutAdmin,
  storeAdminToken,
} from "@/lib/api";

type AdminAuthContextValue = {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const storedToken = getStoredAdminToken();
    if (!storedToken) {
      clearAdminToken();
      setToken(null);
      setUsername(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const session = await getAdminSession();
      setToken(storedToken);
      setUsername(session.username);
    } catch {
      clearAdminToken();
      setToken(null);
      setUsername(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (nextUsername: string, password: string) => {
    const normalizedUsername = nextUsername.trim();
    const nextToken = await loginAdmin({ username: normalizedUsername, password });
    storeAdminToken(nextToken);
    setToken(nextToken);
    const session = await getAdminSession();
    setUsername(session.username);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      clearAdminToken();
      setToken(null);
      setUsername(null);
    }
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      token,
      username,
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
      refresh,
    }),
    [token, username, loading, login, logout, refresh],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider.");
  }
  return context;
}
