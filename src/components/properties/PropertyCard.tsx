"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types";
import { formatIndianPrice, formatArea, cn } from "@/lib/utils";
import { DataService } from "@/lib/data-service";
import {
  Heart,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Sparkles,
} from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: string, isFav: boolean) => void;
  className?: string;
}

export function PropertyCard({
  property,
  onFavoriteToggle,
  className,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(() =>
    DataService.isFavorite(property.id)
  );

  const primaryImage =
    property.images?.find((img) => img.is_primary)?.image_url ||
    property.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";

  const isClosed = property.status === "sold" || property.status === "rented";

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = DataService.toggleFavorite(property.id);
    setIsFavorite(updated);
    if (onFavoriteToggle) {
      onFavoriteToggle(property.id, updated);
    }
  };

  return (
    <div
      className={cn(
        "group bg-white rounded-lg border border-brand-border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col relative",
        isClosed && "opacity-95",
        className
      )}
    >
      {/* Sold / Rented Diagonal Ribbon (§8.1) */}
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

      {/* Image Thumbnail */}
      <Link
        href={`/properties/${property.id}`}
        className="relative block w-full aspect-[16/10] overflow-hidden bg-neutral-100"
      >
        <Image
          src={primaryImage}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            isClosed && "saturate-50 contrast-95"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="bg-brand-cta text-brand-ctaFg text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
            For {property.listing_type}
          </span>
          <span className="bg-white/95 backdrop-blur text-brand-fg text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded border border-neutral-200">
            {property.property_type}
          </span>
          {property.featured && !isClosed && (
            <span className="bg-brand-accent text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-neutral-800 transition-colors shadow-sm"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-neutral-700"
            )}
          />
        </button>

        {/* Price Pill over bottom of image */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-white text-lg font-bold tracking-tight drop-shadow-md">
            {formatIndianPrice(property.price, property.listing_type)}
          </span>
        </div>
      </Link>

      {/* Property Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* City / Address */}
          <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
            <span className="truncate font-medium">
              {property.city_name || "Bengaluru"}, {property.state_name || "Karnataka"}
            </span>
          </div>

          {/* Title */}
          <Link href={`/properties/${property.id}`}>
            <h3 className="text-base font-semibold text-brand-fg line-clamp-1 group-hover:text-brand-accent transition-colors">
              {property.title}
            </h3>
          </Link>

          {/* Specifics: Beds, Baths, Area */}
          <div className="flex items-center gap-4 py-3 my-2 border-y border-brand-border text-xs text-brand-fg font-medium">
            {property.bedrooms ? (
              <div className="flex items-center gap-1.5" title={`${property.bedrooms} Bedrooms`}>
                <Bed className="w-3.5 h-3.5 text-neutral-500" />
                <span>{property.bedrooms} Beds</span>
              </div>
            ) : null}

            {property.bathrooms ? (
              <div className="flex items-center gap-1.5" title={`${property.bathrooms} Bathrooms`}>
                <Bath className="w-3.5 h-3.5 text-neutral-500" />
                <span>{property.bathrooms} Baths</span>
              </div>
            ) : null}

            {property.area_sqft ? (
              <div className="flex items-center gap-1.5" title="Total Area">
                <Maximize2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>{formatArea(property.area_sqft)}</span>
              </div>
            ) : null}
          </div>

          <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-3 flex items-center justify-between border-t border-brand-border/60">
          <span className="text-[11px] text-brand-muted truncate max-w-[140px]">
            {property.address}
          </span>
          <Link
            href={`/properties/${property.id}`}
            className="text-xs font-semibold uppercase tracking-wider text-brand-fg hover:text-brand-accent transition-colors flex items-center gap-1"
          >
            <span>View Details</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
