import React from "react";
import Link from "next/link";
import { Wordmark } from "@/components/common/Wordmark";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-footer text-brand-footerFg border-t border-[#1C2028]">
      {/* Top Banner / Lead Section */}
      <div className="border-b border-[#1C2028] py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-brand-accent uppercase tracking-widest text-xs font-semibold">
              Premier Real Estate Advisory
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white mt-1">
              Looking to Buy, Sell or Lease Elite Real Estate?
            </h3>
            <p className="text-brand-footerMuted text-sm mt-2 max-w-xl">
              Connect directly with our senior property advisors across Bengaluru, Mumbai, Pune, and India&apos;s leading high-growth corridors.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-white text-black hover:bg-neutral-200 transition-colors font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded"
            >
              Consult an Advisor
            </Link>
            <a
              href="tel:+917996379793"
              className="border border-[#333] hover:border-brand-accent text-white transition-colors font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-brand-accent" />
              +91 7996379793
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand column */}
        <div className="lg:col-span-2 space-y-4">
          <Wordmark variant="light" />
          <p className="text-brand-footerMuted text-sm leading-relaxed max-w-sm pt-2">
            Averon Realty represents India&apos;s finest residential sanctuaries, modern penthouses, prime land parcels, and Grade-A commercial spaces.
          </p>

          <div className="space-y-2 pt-2 text-xs text-brand-footerMuted">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-accent shrink-0" />
              <a
                href="mailto:propertys.bengaluru@gmail.com"
                className="hover:text-white transition-colors"
              >
                propertys.bengaluru@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-accent shrink-0" />
              <a
                href="tel:+917996379793"
                className="hover:text-white transition-colors"
              >
                +91 7996379793
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
              <span>Bengaluru · Mumbai · Pune · Hyderabad · Gurugram</span>
            </div>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">
            Explore
          </h4>
          <ul className="space-y-2.5 text-xs text-brand-footerMuted">
            <li>
              <Link href="/properties?listing_type=sale" className="hover:text-white transition-colors">
                Properties for Sale
              </Link>
            </li>
            <li>
              <Link href="/properties?listing_type=rent" className="hover:text-white transition-colors">
                Luxury Rentals
              </Link>
            </li>
            <li>
              <Link href="/properties?property_types=villa" className="hover:text-white transition-colors">
                Exclusive Villas
              </Link>
            </li>
            <li>
              <Link href="/properties?property_types=apartment" className="hover:text-white transition-colors">
                Penthouses & Apartments
              </Link>
            </li>
            <li>
              <Link href="/properties?property_types=office" className="hover:text-white transition-colors">
                Commercial & Tech Parks
              </Link>
            </li>
            <li>
              <Link href="/properties?show_sold_rented=true" className="hover:text-white transition-colors">
                Recently Closed Deals
              </Link>
            </li>
          </ul>
        </div>

        {/* Major Cities */}
        <div>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">
            Metros
          </h4>
          <ul className="space-y-2.5 text-xs text-brand-footerMuted">
            <li>
              <Link href="/properties?city_id=1" className="hover:text-white transition-colors">
                Bengaluru Realty
              </Link>
            </li>
            <li>
              <Link href="/properties?city_id=2" className="hover:text-white transition-colors">
                Mumbai Oceanfront
              </Link>
            </li>
            <li>
              <Link href="/properties?city_id=3" className="hover:text-white transition-colors">
                Pune High Streets
              </Link>
            </li>
            <li>
              <Link href="/properties?city_id=4" className="hover:text-white transition-colors">
                Hyderabad Jubilee Hills
              </Link>
            </li>
            <li>
              <Link href="/properties?city_id=6" className="hover:text-white transition-colors">
                Gurugram Golf Course
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Support */}
        <div>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">
            Company
          </h4>
          <ul className="space-y-2.5 text-xs text-brand-footerMuted">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Averon Realty
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Advisory
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Client Portal
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white transition-colors">
                Broker / Admin Desk
              </Link>
            </li>
            <li>
              <Link href="/admin/manage-admins" className="hover:text-white transition-colors">
                Developer Console
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1C2028] py-8 px-4 sm:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Averon Realty. All rights reserved. RERA Registered Brokerage.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">RERA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
