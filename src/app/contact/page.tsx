"use client";

import React, { useState } from "react";
import { DataService } from "@/lib/data-service";
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Advisory Consultation");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await DataService.submitInquiry({
      name,
      email,
      phone,
      message: `Subject: ${subject}\n\n${message}`,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || "Submission failed. Please try again.");
    } else {
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Header Banner */}
      <section className="bg-black text-white py-16 px-4 sm:px-8 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold block">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Connect with Averon Realty Advisory
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto">
            Whether inquiring about an active listing, exploring off-market portfolios, or seeking valuation advisory, our team responds promptly.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details Column */}
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold block mb-1">
                Direct Channels
              </span>
              <h2 className="text-xl font-bold text-brand-fg">
                Averon Realty Bengaluru Desk
              </h2>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Connect directly with our senior advisors for confidential acquisition and leasing consultations.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg border border-brand-border bg-neutral-50/60 flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-fg block">
                    Official Email
                  </span>
                  <a
                    href="mailto:propertys.bengaluru@gmail.com"
                    className="text-neutral-600 hover:text-black font-medium transition-colors"
                  >
                    propertys.bengaluru@gmail.com
                  </a>
                  <span className="block text-[11px] text-brand-muted mt-0.5">
                    Replies typically within 2 hours
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-brand-border bg-neutral-50/60 flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-fg block">
                    Phone & WhatsApp Direct
                  </span>
                  <a
                    href="tel:+917996379793"
                    className="text-neutral-600 hover:text-black font-medium transition-colors"
                  >
                    +91 7996379793
                  </a>
                  <span className="block text-[11px] text-brand-muted mt-0.5">
                    Monday to Sunday: 9:00 AM – 8:00 PM IST
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-brand-border bg-neutral-50/60 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-fg block">
                    Headquarters
                  </span>
                  <p className="text-neutral-600 leading-snug">
                    100 Feet Road, HAL 2nd Stage, Indiranagar,
                    <br />
                    Bengaluru, Karnataka 560038
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-brand-border bg-neutral-50/60 flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-brand-fg block">
                    Advisory Hours
                  </span>
                  <p className="text-neutral-600">
                    7 Days a Week: 9:00 AM – 8:00 PM IST
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-brand-border p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-brand-fg mb-1">
                Send an Advisory Message
              </h2>
              <p className="text-xs text-brand-muted mb-6">
                Fill in the details below and an Averon advisor specializing in your area of interest will follow up.
              </p>

              {isSubmitted ? (
                <div className="p-8 text-center bg-green-50 border border-green-200 rounded-lg space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                  <h3 className="text-base font-semibold text-green-900">
                    Inquiry Received Successfully
                  </h3>
                  <p className="text-xs text-green-700 max-w-md mx-auto">
                    Thank you! Our senior property advisory desk at Averon Realty has logged your inquiry and will reach out to you directly at your provided phone and email.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-xs font-semibold text-green-900 underline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                        Subject / Interest
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
                      >
                        <option value="Buy a Property">Buy a Property</option>
                        <option value="Lease / Rent a Property">Lease / Rent a Property</option>
                        <option value="Sell / List My Property">Sell / List My Property</option>
                        <option value="Corporate Office Leasing">Corporate Office Leasing</option>
                        <option value="General Advisory Consultation">General Advisory Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                      Message / Property Requirements *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Specify preferred localities, budget range, BHK or commercial requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                      ⚠ {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Transmitting..." : "Send Inquiry"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
