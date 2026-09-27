"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { RoleType } from "@/types";
import { createClient } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: RoleType;
}

interface AuthContextType {
  user: AuthUser | null;
  role: RoleType;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: RoleType) => Promise<void>;
  signup: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: RoleType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to developer in demo mode for full accessibility to all features
  const [user, setUser] = useState<AuthUser | null>({
    id: "dev-001",
    email: "dev@averonrealty.com",
    name: "Averon Developer",
    role: "developer",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user stored in localStorage
    const saved = localStorage.getItem("averon_auth_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          // fetch role from user_roles
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .is("revoked_at", null)
            .single()
            .then(({ data }) => {
              const currentRole = (data?.role as RoleType) || "user";
              setUser({
                id: user.id,
                email: user.email || "",
                name: user.user_metadata?.full_name || user.email?.split("@")[0],
                role: currentRole,
              });
            });
        }
      });
    }
  }, []);

  const login = async (email: string, chosenRole: RoleType = "user") => {
    setIsLoading(true);
    try {
      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        email,
        name: email.split("@")[0],
        role: chosenRole,
      };
      setUser(newUser);
      localStorage.setItem("averon_auth_user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string) => {
    setIsLoading(true);
    try {
      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: "user",
      };
      setUser(newUser);
      localStorage.setItem("averon_auth_user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem("averon_auth_user");
  };

  const switchRole = (newRole: RoleType) => {
    if (!user) {
      const demoUser: AuthUser = {
        id: `user-${newRole}`,
        email: `${newRole}@averonrealty.com`,
        name: `Averon ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`,
        role: newRole,
      };
      setUser(demoUser);
      localStorage.setItem("averon_auth_user", JSON.stringify(demoUser));
      return;
    }
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem("averon_auth_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "user",
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
