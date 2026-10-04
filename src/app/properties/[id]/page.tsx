"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Property } from "@/types";
import { DataService } from "@/lib/data-service";
import { formatIndianPrice, formatArea, cn } from "@/lib/utils";
import { InquiryModal } from "@/components/properties/InquiryModal";
import { PropertyCard } from "@/components/properties/PropertyCard";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sparkles,
  Calendar,
} from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(true);
  const [hasSubmittedInquiry, setHasSubmittedInquiry] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    DataService.getPropertyById(id).then((data) => {
      setProperty(data);
      if (data) {
        setIsFavorite(DataService.isFavorite(data.id));
        // fetch related
        DataService.getProperties({ state_id: data.state_id, show_sold_rented: false }).then(
          (all) => {
            setRelatedProperties(all.filter((p) => p.id !== data.id).slice(0, 3));
          }
        );
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 animate-pulse space-y-8">
        <div className="h-8 bg-neutral-200 rounded w-1/4" />
        <div className="aspect-[21/9] bg-neutral-200 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-10 bg-neutral-200 rounded w-3/4" />
            <div className="h-32 bg-neutral-100 rounded" />
          </div>
          <div className="h-80 bg-neutral-100 rounded" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-brand-fg">Property Not Found</h2>
        <p className="text-xs text-brand-muted">
          The property listing you requested could not be located. It may have been archived.
        </p>
        <Link
          href="/properties"
          className="inline-block bg-brand-cta text-brand-ctaFg px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : [
        {
          id: "fallback",
          property_id: property.id,
          image_url:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
          is_primary: true,
          sort_order: 1,
        },
      ];

  const handleFavorite = () => {
    const updated = DataService.toggleFavorite(property.id);
    setIsFavorite(updated);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const isClosed = property.status === "sold" || property.status === "rented";

  return (
    <div className="bg-brand-bg min-h-screen pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-brand-border bg-neutral-50/50 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-brand-muted">
          <Link
            href="/properties"
            className="flex items-center gap-1 hover:text-black font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Properties</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-black transition-colors"
              title="Copy link to clipboard"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copySuccess ? "Copied!" : "Share"}</span>
            </button>
            <span className="text-neutral-300">|</span>
            <button
              onClick={handleFavorite}
              className="flex items-center gap-1.5 hover:text-black transition-colors"
            >
              <Heart
                className={cn(
                  "w-3.5 h-3.5",
                  isFavorite ? "fill-red-500 text-red-500" : "text-neutral-600"
                )}
              />
              <span>{isFavorite ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Main Gallery Section */}
        <div className="space-y-3">
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-lg overflow-hidden bg-neutral-900 border border-brand-border shadow-sm">
            <Image
              src={images[activeImageIndex].image_url}
              alt={property.title}
              fill
              priority
              className={cn(
                "object-cover transition-opacity duration-300",
                isClosed && "saturate-60"
              )}
            />

            {/* Sold / Rented Ribbons (§8.1) */}
            {property.status === "sold" && (
              <div className="ribbon-wrapper">
                <div className="ribbon-sold">SOLD</div>
              </div>
            )}
            {property.status === "rented" && (
              <div className="ribbon-wrapper">
                <div className="ribbon-rented">RENTED</div>
              </div>
            )}

            {/* Gallery Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex(
                      (prev) => (prev - 1 + images.length) % images.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev + 1) % images.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur text-white text-xs px-3 py-1 rounded">
              {activeImageIndex + 1} / {images.length} Photos
            </div>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "relative w-24 h-16 rounded overflow-hidden border-2 shrink-0 transition-all",
                    activeImageIndex === idx
                      ? "border-brand-accent scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img.image_url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Main Header & Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column: Description, Specs, Amenities */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-brand-cta text-brand-ctaFg text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  For {property.listing_type}
                </span>
                <span className="bg-neutral-100 text-brand-fg text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded border border-brand-border">
                  {property.property_type}
                </span>
                {property.featured && !isClosed && (
                  <span className="bg-brand-accent text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
                {property.status === "under_negotiation" && (
                  <span className="bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                    Under Negotiation
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-brand-fg tracking-tight">
                {property.title}
              </h1>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-brand-muted mt-2">
                <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
                <span>
                  {property.address}, {property.city_name}, {property.state_name}
                </span>
              </div>
            </div>

            {/* Quick Specs Strip */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-5 rounded-lg border border-brand-border bg-neutral-50/70 text-center">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-brand-muted block mb-1">
                  Bedrooms
                </span>
                <div className="flex items-center justify-center gap-1.5 text-base font-bold text-brand-fg">
                  <Bed className="w-4 h-4 text-brand-accent" />
                  <span>{property.bedrooms ? `${property.bedrooms} BHK` : "N/A"}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-brand-muted block mb-1">
                  Bathrooms
                </span>
                <div className="flex items-center justify-center gap-1.5 text-base font-bold text-brand-fg">
                  <Bath className="w-4 h-4 text-brand-accent" />
                  <span>{property.bathrooms ?? "N/A"}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-brand-muted block mb-1">
                  Super Built Area
                </span>
                <div className="flex items-center justify-center gap-1.5 text-base font-bold text-brand-fg">
                  <Maximize2 className="w-4 h-4 text-brand-accent" />
                  <span>{formatArea(property.area_sqft)}</span>
                </div>
              </div>

              <div className="hidden sm:block">
                <span className="text-[11px] uppercase tracking-wider text-brand-muted block mb-1">
                  Status
                </span>
                <div className="flex items-center justify-center gap-1.5 text-base font-bold text-brand-fg capitalize">
                  <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                  <span>{property.status.replace("_", " ")}</span>
                </div>
              </div>
            </div>

            {/* Overview / Narrative */}
            <div className="space-y-3">
              <h2 className="font-bold uppercase tracking-wider text-xs text-brand-accent">
                Property Overview
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line font-normal">
                {property.description}
              </p>
            </div>

            {/* Amenities List */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-brand-border">
                <h2 className="text-xs uppercase tracking-wider text-brand-accent font-bold">
                  Curated Amenities & Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 p-3 rounded border border-brand-border bg-white text-xs font-medium text-brand-fg shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Micro-Location & Map Coordinates */}
            <div className="space-y-4 pt-4 border-t border-brand-border">
              <h2 className="text-xs uppercase tracking-wider text-brand-accent font-bold">
                Location & Accessibility
              </h2>
              <div className="p-5 rounded-lg border border-brand-border bg-neutral-50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-muted">Micro-Market Locality:</span>
                  <span className="font-semibold text-brand-fg">{property.address}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-muted">City / Region:</span>
                  <span className="font-semibold text-brand-fg">
                    {property.city_name}, {property.state_name}
                  </span>
                </div>
                {property.latitude && property.longitude && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brand-muted">Coordinates:</span>
                    <span className="font-mono text-neutral-600">
                      {property.latitude}° N, {property.longitude}° E
                    </span>
                  </div>
                )}
                <div className="pt-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      `${property.address}, ${property.city_name}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-fg hover:text-brand-accent underline"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Open in Google Maps Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action & Advisory Box */}
          <div className="lg:col-span-1 sticky top-24 space-y-6">
            <div className="bg-white rounded-lg border border-brand-border p-6 shadow-xl space-y-6">
              {/* Pricing Display */}
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-brand-muted font-semibold block">
                  Listing Valuation
                </span>
                <div className="text-3xl font-extrabold text-brand-fg">
                  {formatIndianPrice(property.price, property.listing_type)}
                </div>
                <span className="text-[11px] text-brand-muted block">
                  {property.listing_type === "rent"
                    ? "Excludes maintenance & utility charges"
                    : "Includes 1 covered parking slot · Title verified"}
                </span>
              </div>

              {/* Main CTAs */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="w-full py-3.5 px-4 bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors rounded text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Enquire About Property</span>
                </button>



                <a
                  href="tel:+917996379793"
                  className="w-full py-3 px-4 border border-brand-border hover:border-black transition-colors rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 text-brand-fg"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Call +91 7996379793</span>
                </a>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 border-t border-brand-border space-y-2 text-xs text-brand-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>Clean title & legal deed checked</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>RERA compliant brokerage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>Private site inspection on demand</span>
                </div>
              </div>
            </div>

            {/* Direct Broker Contact Card */}
            <div className="bg-neutral-900 text-white rounded-lg p-5 space-y-3 border border-neutral-800">
              <span className="text-[10px] text-brand-accent uppercase tracking-widest font-semibold block">
                Lead Portfolio Advisor
              </span>
              <div className="text-sm font-semibold">Averon Realty Bengaluru Desk</div>
              <p className="text-xs text-neutral-400">
                Direct inquiries handled within 2 hours. Available 7 days a week.
              </p>
              <div className="text-xs text-neutral-300 pt-1 space-y-1">
                <div>Email: propertys.bengaluru@gmail.com</div>
                <div>Direct: +91 7996379793</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="pt-16 border-t border-brand-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-accent font-semibold block">
                  Similar Opportunities
                </span>
                <h3 className="text-xl font-bold text-brand-fg">
                  More in {property.state_name}
                </h3>
              </div>
              <Link
                href={`/properties?state_id=${property.state_id}`}
                className="text-xs font-semibold uppercase tracking-wider text-brand-fg hover:text-brand-accent"
              >
                View State Portfolio →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        property={property}
        isOpen={isInquiryModalOpen}
        onClose={() => router.push("/properties")}
        onSuccess={() => setHasSubmittedInquiry(true)}
        onSuccessClose={() => setIsInquiryModalOpen(false)}
      />
    </div>
  );
}
