"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/common/Wordmark";
import { useAuth } from "@/context/auth-context";
import { RoleType } from "@/types";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleType>("user");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, role);
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

  const handleQuickDemo = async (demoRole: RoleType) => {
    setLoading(true);
    try {
      const demoEmail =
        demoRole === "developer"
          ? "dev@averonrealty.com"
          : demoRole === "admin"
          ? "propertys.bengaluru@gmail.com"
          : "client@example.com";

      await login(demoEmail, demoRole);
      if (demoRole === "developer") {
        router.push("/admin/manage-admins");
      } else if (demoRole === "admin") {
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
          {/* Quick Demo Access Pills */}
          <div className="bg-neutral-50 p-3 rounded border border-brand-border">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-2">
              Instant 1-Click Role Login (Demo & Evaluation):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("developer")}
                className="py-1.5 px-2 bg-black text-brand-accent text-[11px] font-bold uppercase rounded border border-neutral-700 hover:border-brand-accent transition-colors"
                title="Full unconditional access + Manage Admins"
              >
                Developer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="py-1.5 px-2 bg-neutral-800 text-white text-[11px] font-semibold uppercase rounded hover:bg-neutral-700 transition-colors"
                title="Property CRUD + Inquiries"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("user")}
                className="py-1.5 px-2 bg-white text-brand-fg text-[11px] font-semibold uppercase rounded border border-brand-border hover:border-black transition-colors"
                title="Browse + Saved Favorites"
              >
                User
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleType)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none capitalize"
              >
                <option value="user">User / Client</option>
                <option value="admin">Admin (Broker Management)</option>
                <option value="developer">Developer (Full Access)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
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
