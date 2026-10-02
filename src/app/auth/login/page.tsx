"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/common/Wordmark";
import { useAuth } from "@/context/auth-context";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await login(email, password);
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      
      if (!supabase) {
        setErrorMsg("Supabase environment variables are missing.");
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .is("revoked_at", null)
        .single();
        
      const role = data?.role || "user";

      if (role === "developer") {
        router.push("/admin/manage-admins");
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Wordmark />
        <h2 className="text-xl font-bold tracking-tight text-brand-fg">
          Sign In to Averon Realty
        </h2>
        <p className="text-xs text-brand-muted">
          Access your saved portfolios, inquiries, or admin management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-brand-border rounded-lg sm:px-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-brand-accent hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-brand-border text-xs text-brand-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-brand-fg font-semibold hover:text-brand-accent transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
