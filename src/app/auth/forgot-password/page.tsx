"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/common/Wordmark";
import { Mail, ArrowRight, CheckCircle2, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        });
      }
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Wordmark />
        <h2 className="text-xl font-bold tracking-tight text-brand-fg">
          Reset Your Password
        </h2>
        <p className="text-xs text-brand-muted">
          Enter your registered email and we will send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-brand-border rounded-lg sm:px-10 space-y-5">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
              <h3 className="text-base font-semibold text-brand-fg">
                Reset Link Dispatched
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                If an account exists for <span className="font-semibold text-brand-fg">{email}</span>, you will receive a secure password recovery email shortly.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-fg hover:text-brand-accent"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                  Registered Email Address
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/auth/login"
                  className="text-xs text-brand-muted hover:text-brand-fg transition-colors"
                >
                  Remember your password? Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
