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
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getSession() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authUser.id)
          .is("revoked_at", null)
          .single();
          
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0],
          role: (data?.role as RoleType) || "user",
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
    
    getSession();

    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .is("revoked_at", null)
            .single();
            
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
            role: (data?.role as RoleType) || "user",
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    if (!supabase) {
      setIsLoading(false);
      return { error: new Error("Supabase client is not initialized") };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    return { error };
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    if (!supabase) {
      setIsLoading(false);
      return { error: new Error("Supabase client is not initialized") };
    }
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });
    setIsLoading(false);
    return { error };
  };

  const logout = async () => {
    setIsLoading(true);
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setIsLoading(false);
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
