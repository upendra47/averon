"use client";

import React, { useState } from "react";
import { Property } from "@/types";
import { DataService } from "@/lib/data-service";
import { X, Send, CheckCircle2, Phone, Mail, User } from "lucide-react";

interface InquiryModalProps {
  property?: Property;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InquiryModal({ property, isOpen, onClose, onSuccess }: InquiryModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    property
      ? `Hello Averon Realty, I am interested in "${property.title}" in ${property.city_name || "Bengaluru"}. Please contact me with more information.`
      : "Hello Averon Realty, I would like to consult with an advisor regarding available premium properties."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await DataService.submitInquiry({
      property_id: property?.id || null,
      property_title: property?.title || "General Advisory Inquiry",
      name,
      email,
      phone,
      message,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || "Submission failed. Please try again.");
    } else {
      setIsSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-lg border border-brand-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-brand-fg text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-accent font-semibold block">
              Direct Advisory Inquiry
            </span>
            <h3 className="text-base font-semibold text-white">
              {property ? property.title : "Contact Averon Realty"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h4 className="text-lg font-semibold text-brand-fg">
                Inquiry Transmitted Successfully
              </h4>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Thank you! Our senior property advisor will reach out to you within 2 hours. A confirmation has been logged.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                  Your Message
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col gap-3">
                {submitError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    ⚠ {submitError}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-brand-muted">
                    Advisor line: +91 7996379793
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
