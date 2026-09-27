import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DataService } from "@/lib/data-service";
import { PropertyCard } from "@/components/properties/PropertyCard";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  TrendingUp,
} from "lucide-react";

export const revalidate = 60; // revalidate at most once every minute

export default async function HomePage() {
  const featured = await DataService.getFeaturedProperties();
  const soldOrRented = await DataService.getRecentlySoldOrRented();

  const metroShortcuts = [
    {
      name: "Bengaluru",
      sub: "Indiranagar, Whitefield, Koramangala",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
      cityId: 1,
      count: "8 Listings",
    },
    {
      name: "Mumbai",
      sub: "Worli, Bandra, Powai, Juhu",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
      cityId: 2,
      count: "6 Listings",
    },
    {
      name: "Pune",
      sub: "Koregaon Park, Baner, Kharadi",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      cityId: 3,
      count: "4 Listings",
    },
    {
      name: "Hyderabad",
      sub: "Jubilee Hills, Financial District",
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
      cityId: 4,
      count: "5 Listings",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative bg-black text-white pt-24 pb-32 px-4 sm:px-8 overflow-hidden">
        {/* Subtle architectural backdrop */}
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="Averon Architectural Background"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-700 bg-neutral-900/80 backdrop-blur text-xs tracking-widest text-brand-accent uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
            Curated Real Estate Advisory
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Where Architecture Meets <span className="text-brand-accent">Distinction</span>.
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Representing Bengaluru, Mumbai, and India&apos;s prime urban sanctuaries.
            Bespoke villas, high-rise penthouses, and high-yield commercial assets.
          </p>

          {/* Quick Hero Search Bar */}
          <div className="pt-6 max-w-3xl mx-auto">
            <div className="bg-white p-2.5 sm:p-3 rounded-lg shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-brand-border">
              <div className="flex items-center gap-2 w-full sm:w-auto px-2">
                <span className="text-xs uppercase font-bold text-neutral-400">Find:</span>
                <div className="flex items-center bg-neutral-100 p-0.5 rounded">
                  <Link
                    href="/properties?listing_type=sale"
                    className="px-3 py-1.5 rounded text-xs font-semibold text-black hover:bg-white transition-all"
                  >
                    Buy
                  </Link>
                  <Link
                    href="/properties?listing_type=rent"
                    className="px-3 py-1.5 rounded text-xs font-semibold text-neutral-600 hover:bg-white hover:text-black transition-all"
                  >
                    Rent
                  </Link>
                </div>
              </div>

              <div className="h-6 w-px bg-neutral-200 hidden sm:block" />

              <div className="flex-1 w-full text-left px-2">
                <form action="/properties" method="get" className="flex items-center">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search Bengaluru, Indiranagar, Worli, Villa..."
                    className="w-full text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider shrink-0"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            {/* Quick popular tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-neutral-400">
              <span>Popular:</span>
              <Link href="/properties?city_id=1" className="hover:text-white underline underline-offset-4">
                Bengaluru Villas
              </Link>
              <span>•</span>
              <Link href="/properties?city_id=2" className="hover:text-white underline underline-offset-4">
                Mumbai Sea Face
              </Link>
              <span>•</span>
              <Link href="/properties?property_types=apartment" className="hover:text-white underline underline-offset-4">
                Sky Penthouses
              </Link>
              <span>•</span>
              <Link href="/properties?show_sold_rented=true" className="text-brand-accent hover:underline">
                Closed Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Pillars / Metrics */}
      <section className="bg-white border-b border-brand-border py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="border-l-2 border-brand-accent pl-4 space-y-1">
            <span className="text-2xl sm:text-3xl font-bold text-brand-fg">₹500+ Cr</span>
            <p className="text-xs text-brand-muted uppercase tracking-wider font-semibold">
              Transaction Volume
            </p>
          </div>
          <div className="border-l-2 border-brand-accent pl-4 space-y-1">
            <span className="text-2xl sm:text-3xl font-bold text-brand-fg">100%</span>
            <p className="text-xs text-brand-muted uppercase tracking-wider font-semibold">
              Title-Verified Portfolios
            </p>
          </div>
          <div className="border-l-2 border-brand-accent pl-4 space-y-1">
            <span className="text-2xl sm:text-3xl font-bold text-brand-fg">9 Metros</span>
            <p className="text-xs text-brand-muted uppercase tracking-wider font-semibold">
              Across India
            </p>
          </div>
          <div className="border-l-2 border-brand-accent pl-4 space-y-1">
            <span className="text-2xl sm:text-3xl font-bold text-brand-fg">14 Days</span>
            <p className="text-xs text-brand-muted uppercase tracking-wider font-semibold">
              Average Deal Velocity
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Properties */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold block mb-1">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-fg">
              Featured Properties
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              Handpicked high-value residences and investment opportunities with verified legal documentation.
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-brand-fg hover:text-brand-accent transition-colors"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* 4. Section 8.1: Dedicated "Recently Sold / Rented" Social Proof Strip */}
      <section className="bg-neutral-50 border-y border-brand-border py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-black text-white text-[10px] uppercase font-bold tracking-wider mb-2">
                <TrendingUp className="w-3 h-3 text-brand-accent" />
                Proven Track Record
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-fg">
                Recently Sold & Rented Deals
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl">
                Demonstrated deal velocity and trust. See how Averon Realty consistently closes premier transactions for buyers, sellers, and corporate tenants.
              </p>
            </div>
            <Link
              href="/properties?show_sold_rented=true"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-brand-fg hover:text-brand-accent transition-colors"
            >
              <span>Explore All Closed Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldOrRented.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. City Shortcuts */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold block mb-1">
            Regional Presence
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-fg">
            Explore Prime Metros
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Direct access to localized market intelligence, price trends, and off-market inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metroShortcuts.map((metro) => (
            <Link
              key={metro.name}
              href={`/properties?city_id=${metro.cityId}`}
              className="group relative h-80 rounded-lg overflow-hidden border border-brand-border shadow-sm block"
            >
              <Image
                src={metro.image}
                alt={metro.name}
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent">
                  {metro.count}
                </span>
                <h3 className="text-xl font-bold mt-0.5">{metro.name}</h3>
                <p className="text-xs text-neutral-300 truncate mt-1">{metro.sub}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:text-brand-accent transition-colors">
                  <span>Browse Listings</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Why Averon Realty */}
      <section className="bg-brand-footer text-white py-20 px-4 sm:px-8 border-t border-[#1C2028]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold block">
                The Averon Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                An Editorial, High-Trust Approach to Indian Real Estate
              </h2>
              <p className="text-sm text-brand-footerMuted leading-relaxed">
                Unlike generic classifieds cluttered with unverified listings, Averon Realty operates as a bespoke brokerage. Every property undergoes comprehensive legal scrutiny, title verification, and architectural assessment before joining our portfolio.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      100% Verified Titles & RERA Sanctioned
                    </h4>
                    <p className="text-xs text-brand-footerMuted mt-0.5">
                      No ambiguity. Every legal deed, sanctioned plan, and encumbrance certificate is verified by our legal counsel.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Dedicated Senior Advisory
                    </h4>
                    <p className="text-xs text-brand-footerMuted mt-0.5">
                      You are paired directly with a senior property advisor with deep micro-market insight, not an automated call center.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Confidential & Efficient Closures
                    </h4>
                    <p className="text-xs text-brand-footerMuted mt-0.5">
                      Streamlined documentation, transparent negotiation, and private handling for high-net-worth clients.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#2a2a2a] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
                alt="Averon Luxury Estate"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/80 backdrop-blur border border-white/10 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-brand-accent uppercase font-bold tracking-wider">
                      Headquarters
                    </span>
                    <h4 className="text-sm font-semibold text-white">
                      Averon Realty Bengaluru Desk
                    </h4>
                  </div>
                  <Link
                    href="/contact"
                    className="text-xs font-semibold text-white hover:text-brand-accent uppercase tracking-wider"
                  >
                    Contact →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Lead Capture Banner */}
      <section className="bg-white py-16 px-4 sm:px-8 border-b border-brand-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-brand-accent font-semibold">
            Need Expert Assistance?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-fg">
            Schedule a Private Property Tour Today
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto">
            Our Bengaluru, Mumbai, and Pune advisors arrange tailored visits, virtual walkthroughs, and legal document reviews.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider shadow-sm"
            >
              Enquire About Properties
            </Link>
            <a
              href="tel:+917996379793"
              className="border border-brand-border hover:border-black text-brand-fg px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Call +91 7996379793
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
