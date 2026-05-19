"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { AuthResponse, User } from "@/types/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (input: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
  refreshMe: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function refreshMe() {
    const res = await api.get<{ user: User }>("/auth/me");
    setUser(res.data.user);
  }

  useEffect(() => {
    api
      .get<{ user: User }>("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        window.localStorage.removeItem("teamflow_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        const res = await api.post<AuthResponse>("/auth/login", { email, password });
        window.localStorage.setItem("teamflow_token", res.data.token);
        window.localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        toast.success("Welcome back");
        router.push("/dashboard");
      },
      async signup(name, email, password) {
        const res = await api.post<AuthResponse>("/auth/signup", { name, email, password });
        window.localStorage.setItem("teamflow_token", res.data.token);
        window.localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        toast.success("Account created");
        router.push("/dashboard");
      },
      async updateProfile(input) {
        const res = await api.patch<AuthResponse>("/auth/me", input);
        window.localStorage.setItem("teamflow_token", res.data.token);
        window.localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        toast.success("Profile updated");
      },
      refreshMe,
      async logout() {
        await api.post("/auth/logout");
        window.localStorage.removeItem("teamflow_token");
        window.localStorage.removeItem("token");
        setUser(null);
        router.push("/auth/login");
      }
    }),
    [loading, router, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
