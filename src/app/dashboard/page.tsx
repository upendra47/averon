"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { DataService } from "@/lib/data-service";
import { Property, Inquiry } from "@/types";
import { PropertyCard } from "@/components/properties/PropertyCard";
import {
  Heart,
  Mail,
  ArrowRight,
  LogOut,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const { user, role, logout } = useAuth();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"favorites" | "inquiries">("favorites");

  const loadData = async () => {
    setLoading(true);
    try {
      const favIds = DataService.getFavorites();
      const allProps = await DataService.getProperties({ show_sold_rented: true });
      const favs = allProps.filter((p) => favIds.includes(p.id));
      setFavoriteProperties(favs);

      const allInquiries = await DataService.getInquiries();
      setInquiries(allInquiries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFavoriteToggle = () => {
    loadData();
  };

  return (
    <div className="bg-brand-bg min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* User Profile Welcome Header */}
        <div className="bg-neutral-900 text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm border border-neutral-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent">
                Client Portal
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-[10px] uppercase font-bold bg-neutral-800 px-2 py-0.5 rounded text-white border border-neutral-700 capitalize">
                Role: {role}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || "Client"}
            </h1>
            <p className="text-xs text-neutral-400">
              {user?.email || "client@example.com"} · Registered Averon Realty Member
            </p>
          </div>

          <div className="flex items-center gap-3">
            {(role === "admin" || role === "developer") && (
              <Link
                href="/admin"
                className="bg-brand-accent text-black font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded hover:bg-yellow-500 transition-colors"
              >
                Go to Admin Desk
              </Link>
            )}
            <button
              onClick={() => logout()}
              className="border border-neutral-700 hover:border-neutral-500 text-neutral-300 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 border-b border-brand-border">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`pb-3 text-xs uppercase tracking-wider font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "favorites"
                ? "text-brand-fg border-b-2 border-brand-accent"
                : "text-brand-muted hover:text-brand-fg"
            }`}
          >
            <Heart className="w-4 h-4 text-brand-accent" />
            <span>Saved Favorites ({favoriteProperties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`pb-3 text-xs uppercase tracking-wider font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "inquiries"
                ? "text-brand-fg border-b-2 border-brand-accent"
                : "text-brand-muted hover:text-brand-fg"
            }`}
          >
            <Mail className="w-4 h-4 text-brand-accent" />
            <span>Submitted Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* Tab 1: Favorites Grid */}
        {activeTab === "favorites" && (
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-neutral-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : favoriteProperties.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-brand-border rounded-lg bg-neutral-50/50 space-y-3">
                <Heart className="w-10 h-10 text-neutral-400 mx-auto" />
                <h3 className="text-base font-semibold text-brand-fg">
                  No saved properties yet
                </h3>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Click the heart icon on any listing in the marketplace to bookmark properties here for quick comparison.
                </p>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-1.5 bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider mt-2"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProperties.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Inquiries List */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-brand-border rounded-lg bg-neutral-50/50 space-y-3">
                <Mail className="w-10 h-10 text-neutral-400 mx-auto" />
                <h3 className="text-base font-semibold text-brand-fg">
                  No inquiries submitted yet
                </h3>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Inquiries you submit via property pages or the contact desk will appear here with advisor follow-up status.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-lg border border-brand-border bg-white shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-brand-border pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-accent block">
                          Property Advisory Inquiry
                        </span>
                        <h4 className="text-sm font-bold text-brand-fg">
                          {inq.property_title || "General Advisory Inquiry"}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-brand-muted">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>
                          {new Date(inq.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-semibold uppercase rounded">
                          Transmitted
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded border border-neutral-100 leading-relaxed font-mono">
                      &quot;{inq.message}&quot;
                    </p>

                    <div className="flex items-center justify-between text-xs text-brand-muted pt-1">
                      <span>Sender: {inq.name} ({inq.email})</span>
                      {inq.property_id && (
                        <Link
                          href={`/properties/${inq.property_id}`}
                          className="font-semibold text-brand-fg hover:text-brand-accent underline text-xs"
                        >
                          View Property Listing →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
