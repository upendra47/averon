"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Wordmark } from "@/components/common/Wordmark";
import { Mail, ArrowRight } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email address";

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Wordmark />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-brand-border rounded-lg sm:px-10 text-center space-y-5">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-brand-accent">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-brand-fg">
            Check Your Email
          </h2>

          <p className="text-xs text-brand-muted leading-relaxed">
            We sent a verification link to{" "}
            <span className="font-semibold text-brand-fg">{email}</span>. Please click the link to confirm your account and activate your Averon profile.
          </p>

          <div className="p-3 bg-neutral-50 border border-brand-border rounded text-xs text-neutral-600">
            Once confirmed, you will be redirected to your personal dashboard where you can browse and save listings.
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors rounded text-xs font-semibold uppercase tracking-wider"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="text-[11px] text-brand-muted">
            Did not receive the email? Check your spam folder or{" "}
            <Link href="/contact" className="text-brand-accent hover:underline font-semibold">
              contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading verification info...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
