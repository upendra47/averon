"use client";

import React from "react";
import { Property } from "@/types";
import { formatIndianPrice } from "@/lib/utils";
import { X, Lock, AlertCircle, CreditCard, ShieldCheck } from "lucide-react";

interface PaymentStubModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentStubModal({
  property,
  isOpen,
  onClose,
}: PaymentStubModalProps) {
  if (!isOpen) return null;

  // Typical Indian real estate earnest token amount
  const tokenAmount = property.listing_type === "rent" ? 25000 : 100000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-lg border border-brand-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-brand-fg text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-accent" />
            <div>
              <span className="text-[10px] uppercase tracking-widest text-brand-accent font-semibold block">
                Official Booking
              </span>
              <h3 className="text-sm font-semibold text-white">Pay Token Amount</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase 5 Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 leading-snug">
            <span className="font-semibold">Demo / UI Stub Only:</span> Real Razorpay &
            Stripe payment gateway integration is scheduled for Phase 5. This form
            demonstrates the reservation flow.
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div className="bg-neutral-50 p-3.5 rounded border border-brand-border space-y-1">
            <div className="text-xs text-brand-muted">Booking Property:</div>
            <div className="text-sm font-semibold text-brand-fg truncate">
              {property.title}
            </div>
            <div className="flex justify-between items-center pt-2 text-xs border-t border-neutral-200 mt-2">
              <span className="text-neutral-500">Token Deposit Required:</span>
              <span className="font-bold text-brand-fg">
                {formatIndianPrice(tokenAmount)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
                Cardholder Name (Disabled Demo)
              </label>
              <input
                type="text"
                disabled
                value="Vikram Malhotra"
                className="w-full px-3 py-2 text-xs bg-neutral-100 border border-neutral-200 rounded text-neutral-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
                Card Number / UPI (Disabled Demo)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value="•••• •••• •••• 4242"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-100 border border-neutral-200 rounded text-neutral-400 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
                  Expiry
                </label>
                <input
                  type="text"
                  disabled
                  value="12 / 28"
                  className="w-full px-3 py-2 text-xs bg-neutral-100 border border-neutral-200 rounded text-neutral-400 cursor-not-allowed text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  disabled
                  value="•••"
                  className="w-full px-3 py-2 text-xs bg-neutral-100 border border-neutral-200 rounded text-neutral-400 cursor-not-allowed text-center"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled
              className="w-full py-3 bg-neutral-300 text-neutral-600 text-xs font-bold uppercase tracking-wider rounded cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Gateway Locked (Phase 5 Feature)</span>
            </button>
            <p className="text-[10px] text-center text-brand-muted mt-2">
              For immediate priority reservation, please contact Averon Realty Advisory at +91 7996379793.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
