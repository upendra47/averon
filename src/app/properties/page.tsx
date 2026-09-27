"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Property, FilterParams, PropertyType, ListingType } from "@/types";
import { DataService } from "@/lib/data-service";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilterBar } from "@/components/properties/PropertyFilterBar";
import { Building, RotateCcw } from "lucide-react";

function PropertiesListContent() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract initial filters from searchParams
  const getFiltersFromURL = useCallback((): FilterParams => {
    const search = searchParams.get("search") || undefined;
    const listingType = (searchParams.get("listing_type") as ListingType | "all") || "all";
    const propertyTypes = searchParams.get("property_types")
      ? (searchParams.get("property_types")?.split(",") as PropertyType[])
      : undefined;
    const stateId = searchParams.get("state_id") ? Number(searchParams.get("state_id")) : undefined;
    const cityId = searchParams.get("city_id") ? Number(searchParams.get("city_id")) : undefined;
    const minPrice = searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined;
    const maxPrice = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined;
    const bedrooms = searchParams.get("bedrooms") || undefined;
    const minArea = searchParams.get("min_area") ? Number(searchParams.get("min_area")) : undefined;
    const maxArea = searchParams.get("max_area") ? Number(searchParams.get("max_area")) : undefined;
    const sort = (searchParams.get("sort") as "price_asc" | "price_desc" | "newest" | "featured") || "newest";
    const showSoldRented = searchParams.get("show_sold_rented") === "true";

    return {
      search,
      listing_type: listingType,
      property_types: propertyTypes,
      state_id: stateId,
      city_id: cityId,
      min_price: minPrice,
      max_price: maxPrice,
      bedrooms,
      min_area: minArea,
      max_area: maxArea,
      sort,
      show_sold_rented: showSoldRented,
    };
  }, [searchParams]);

  const loadProperties = async (filters: FilterParams) => {
    setLoading(true);
    try {
      const data = await DataService.getProperties(filters);
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filters = getFiltersFromURL();
    loadProperties(filters);
  }, [getFiltersFromURL]);

  return (
    <div className="bg-brand-bg min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Heading & Eyebrow */}
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-brand-accent font-bold block mb-1">
            AVERON MARKETPLACE
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-fg tracking-tight">
            Curated Real Estate Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl">
            Explore verified villas, penthouses, high-end apartments, plots, and commercial office suites across India&apos;s leading cities.
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-[69px] z-30 bg-white/95 backdrop-blur-md pt-2 pb-1 shadow-sm">
          <PropertyFilterBar
            initialFilters={getFiltersFromURL()}
            onFiltersChange={(filters) => loadProperties(filters)}
            totalResults={properties.length}
          />
        </div>

        {/* Listing Grid / Skeletons / Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-brand-border rounded-lg overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/10] bg-neutral-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-1/3" />
                  <div className="h-5 bg-neutral-200 rounded w-4/5" />
                  <div className="h-8 bg-neutral-100 rounded w-full" />
                  <div className="h-4 bg-neutral-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-neutral-50 border border-dashed border-brand-border rounded-lg p-12 text-center space-y-4 max-w-lg mx-auto">
            <Building className="w-12 h-12 text-neutral-400 mx-auto" />
            <h3 className="text-lg font-semibold text-brand-fg">
              No matching properties found
            </h3>
            <p className="text-xs text-brand-muted">
              We couldn&apos;t find any properties matching your current filter criteria. Try expanding your search terms, adjusting price or bedroom parameters, or checking &quot;Show Recently Sold/Rented&quot;.
            </p>
            <button
              onClick={() => {
                window.location.href = "/properties";
              }}
              className="inline-flex items-center gap-1.5 bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-brand-muted">
          Loading Averon Marketplace...
        </div>
      }
    >
      <PropertiesListContent />
    </Suspense>
  );
}
