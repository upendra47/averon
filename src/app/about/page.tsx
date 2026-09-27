import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, Users, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Hero Header */}
      <section className="bg-black text-white py-20 px-4 sm:px-8 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold block">
            ABOUT AVERON REALTY
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Curating India&apos;s Most Distinctive Real Estate
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Founded on transparency, architectural discernment, and rigorous title scrutiny, Averon Realty represents prime residential and commercial assets across Bengaluru, Mumbai, Pune, and India&apos;s leading high-growth corridors.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold block">
              Our Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-fg">
              A Bespoke Advisory, Not an Automated Classifieds Portal
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              In a crowded market plagued by unverified listings and duplicate broker syndications, Averon Realty was created to offer an editorial, high-contrast, and deeply curated experience.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Every villa, penthouse, land parcel, or commercial floor presented under the Averon portfolio undergoes exhaustive due diligence: 30-year title searches, RERA verification, sanctioned municipal floor plans, and micro-market appraisal.
            </p>
            <div className="pt-2">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider"
              >
                <span>Browse Curated Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-brand-border shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Averon Realty Architectural Estate"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-brand-border">
          <div className="p-6 rounded-lg border border-brand-border bg-neutral-50/50 space-y-3">
            <ShieldCheck className="w-8 h-8 text-brand-accent" />
            <h3 className="text-base font-bold text-brand-fg">
              100% Verified Deeds & Clear Titles
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              We eliminate title ambiguities before a property is ever showcased. Every seller&apos;s title deed and encumbrance record is legally certified.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-brand-border bg-neutral-50/50 space-y-3">
            <Users className="w-8 h-8 text-brand-accent" />
            <h3 className="text-base font-bold text-brand-fg">
              Direct Senior Advisory
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Work with experienced property partners who understand neighborhood micro-trends, future infrastructure developments, and realistic valuations.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-brand-border bg-neutral-50/50 space-y-3">
            <Award className="w-8 h-8 text-brand-accent" />
            <h3 className="text-base font-bold text-brand-fg">
              High-Velocity Closures
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              From token reservations to stamp duty registration and physical handover, our legal desk accelerates transaction completion smoothly.
            </p>
          </div>
        </div>

        {/* Metro Footprint */}
        <div className="bg-neutral-900 text-white rounded-xl p-8 sm:p-12 space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold block mb-1">
              National Presence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Active in India&apos;s Top 9 Metro Ecosystems
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Headquartered in Bengaluru with regional property specialists across Maharashtra, Telangana, Tamil Nadu, Haryana, West Bengal, Gujarat, and Rajasthan.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4 border-t border-neutral-800 text-xs">
            <div>
              <span className="text-brand-accent font-semibold block">Bengaluru</span>
              <span className="text-neutral-400">Indiranagar & Whitefield</span>
            </div>
            <div>
              <span className="text-brand-accent font-semibold block">Mumbai</span>
              <span className="text-neutral-400">Worli & Bandra West</span>
            </div>
            <div>
              <span className="text-brand-accent font-semibold block">Pune</span>
              <span className="text-neutral-400">Koregaon Park & Baner</span>
            </div>
            <div>
              <span className="text-brand-accent font-semibold block">Hyderabad</span>
              <span className="text-neutral-400">Jubilee Hills & Hitec</span>
            </div>
            <div>
              <span className="text-brand-accent font-semibold block">Gurugram</span>
              <span className="text-neutral-400">Golf Course Road</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
