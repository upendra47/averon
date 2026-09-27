"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterParams, PropertyType, State, City } from "@/types";
import { DataService } from "@/lib/data-service";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

interface PropertyFilterBarProps {
  onFiltersChange?: (filters: FilterParams) => void;
  initialFilters?: FilterParams;
  totalResults?: number;
}

const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
  { label: "Apartments", value: "apartment" },
  { label: "Villas", value: "villa" },
  { label: "Plots", value: "plot" },
  { label: "Commercial", value: "commercial" },
  { label: "Office Spaces", value: "office" },
  { label: "Shops", value: "shop" },
];

const BEDROOM_OPTIONS = [
  { label: "Any", value: "any" },
  { label: "1 BHK", value: "1" },
  { label: "2 BHK", value: "2" },
  { label: "3 BHK", value: "3" },
  { label: "4+ BHK", value: "4+" },
];

const SORT_OPTIONS = [
  { label: "Newest Listings", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Featured First", value: "featured" },
];

export function PropertyFilterBar({
  onFiltersChange,
  initialFilters,
  totalResults,
}: PropertyFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Filter local state
  const [search, setSearch] = useState(searchParams.get("search") || initialFilters?.search || "");
  const [listingType, setListingType] = useState<string>(
    searchParams.get("listing_type") || initialFilters?.listing_type || "all"
  );
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>(() => {
    const p = searchParams.get("property_types");
    if (p) return p.split(",") as PropertyType[];
    return initialFilters?.property_types || [];
  });
  const [stateId, setStateId] = useState<number | undefined>(() => {
    const s = searchParams.get("state_id");
    return s ? Number(s) : initialFilters?.state_id;
  });
  const [cityId, setCityId] = useState<number | undefined>(() => {
    const c = searchParams.get("city_id");
    return c ? Number(c) : initialFilters?.city_id;
  });
  const [minPrice, setMinPrice] = useState<string>(
    searchParams.get("min_price") || (initialFilters?.min_price ? String(initialFilters.min_price) : "")
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    searchParams.get("max_price") || (initialFilters?.max_price ? String(initialFilters.max_price) : "")
  );
  const [bedrooms, setBedrooms] = useState<string>(
    searchParams.get("bedrooms") || initialFilters?.bedrooms || "any"
  );
  const [minArea, setMinArea] = useState<string>(
    searchParams.get("min_area") || (initialFilters?.min_area ? String(initialFilters.min_area) : "")
  );
  const [maxArea, setMaxArea] = useState<string>(
    searchParams.get("max_area") || (initialFilters?.max_area ? String(initialFilters.max_area) : "")
  );
  const [sort, setSort] = useState<string>(
    searchParams.get("sort") || initialFilters?.sort || "newest"
  );
  const [showSoldRented, setShowSoldRented] = useState<boolean>(
    searchParams.get("show_sold_rented") === "true" || !!initialFilters?.show_sold_rented
  );

  useEffect(() => {
    DataService.getStates().then(setStates);
    DataService.getCities().then((allCities) => {
      setCities(allCities);
      setFilteredCities(allCities);
    });
  }, []);

  // Update cities when state changes
  useEffect(() => {
    if (stateId) {
      setFilteredCities(cities.filter((c) => c.state_id === stateId));
      if (cityId && !cities.some((c) => c.id === cityId && c.state_id === stateId)) {
        setCityId(undefined);
      }
    } else {
      setFilteredCities(cities);
    }
  }, [stateId, cities]);

  // Synchronize with URL and parent
  const applyFilters = (overrides?: Partial<FilterParams>) => {
    const nextFilters: FilterParams = {
      search: search.trim() || undefined,
      listing_type: (listingType as any) || "all",
      property_types: selectedTypes.length > 0 ? selectedTypes : undefined,
      state_id: stateId,
      city_id: cityId,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms !== "any" ? bedrooms : undefined,
      min_area: minArea ? Number(minArea) : undefined,
      max_area: maxArea ? Number(maxArea) : undefined,
      sort: sort as any,
      show_sold_rented: showSoldRented,
      ...overrides,
    };

    // Build URL query string
    const params = new URLSearchParams();
    if (nextFilters.search) params.set("search", nextFilters.search);
    if (nextFilters.listing_type && nextFilters.listing_type !== "all") {
      params.set("listing_type", nextFilters.listing_type);
    }
    if (nextFilters.property_types && nextFilters.property_types.length > 0) {
      params.set("property_types", nextFilters.property_types.join(","));
    }
    if (nextFilters.state_id) params.set("state_id", String(nextFilters.state_id));
    if (nextFilters.city_id) params.set("city_id", String(nextFilters.city_id));
    if (nextFilters.min_price) params.set("min_price", String(nextFilters.min_price));
    if (nextFilters.max_price) params.set("max_price", String(nextFilters.max_price));
    if (nextFilters.bedrooms && nextFilters.bedrooms !== "any") {
      params.set("bedrooms", nextFilters.bedrooms);
    }
    if (nextFilters.min_area) params.set("min_area", String(nextFilters.min_area));
    if (nextFilters.max_area) params.set("max_area", String(nextFilters.max_area));
    if (nextFilters.sort && nextFilters.sort !== "newest") {
      params.set("sort", nextFilters.sort);
    }
    if (nextFilters.show_sold_rented) {
      params.set("show_sold_rented", "true");
    }

    const query = params.toString();
    router.replace(query ? `/properties?${query}` : `/properties`, { scroll: false });

    if (onFiltersChange) {
      onFiltersChange(nextFilters);
    }
  };

  const handleReset = () => {
    setSearch("");
    setListingType("all");
    setSelectedTypes([]);
    setStateId(undefined);
    setCityId(undefined);
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("any");
    setMinArea("");
    setMaxArea("");
    setSort("newest");
    setShowSoldRented(false);

    router.replace("/properties", { scroll: false });
    if (onFiltersChange) {
      onFiltersChange({
        listing_type: "all",
        sort: "newest",
        show_sold_rented: false,
      });
    }
  };

  const togglePropertyType = (type: PropertyType) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updated);
    applyFilters({ property_types: updated });
  };

  return (
    <div className="w-full bg-white border border-brand-border rounded-lg shadow-sm">
      {/* Primary Row: Search, Buy/Rent, City, Sort & Filter Trigger */}
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by locality, project name, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-brand-border rounded text-sm text-brand-fg placeholder:text-brand-muted focus:outline-none focus:border-brand-accent transition-all"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                applyFilters({ search: undefined });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Buy / Rent / All Segment */}
        <div className="flex items-center bg-neutral-100 p-1 rounded border border-brand-border shrink-0">
          {(["all", "sale", "rent"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setListingType(type);
                applyFilters({ listing_type: type });
              }}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                listingType === type
                  ? "bg-brand-cta text-brand-ctaFg shadow-sm"
                  : "text-brand-muted hover:text-brand-fg"
              }`}
            >
              {type === "all" ? "All" : type === "sale" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>

        {/* State -> City Dependent Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={stateId || ""}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : undefined;
              setStateId(val);
              applyFilters({ state_id: val, city_id: undefined });
            }}
            className="px-3 py-2 bg-white border border-brand-border rounded text-xs text-brand-fg focus:border-brand-accent focus:outline-none"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={cityId || ""}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : undefined;
              setCityId(val);
              applyFilters({ city_id: val });
            }}
            className="px-3 py-2 bg-white border border-brand-border rounded text-xs text-brand-fg focus:border-brand-accent focus:outline-none"
          >
            <option value="">All Cities</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            applyFilters({ sort: e.target.value as any });
          }}
          className="px-3 py-2 bg-white border border-brand-border rounded text-xs text-brand-fg focus:border-brand-accent focus:outline-none shrink-0"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Advanced Filters Toggle */}
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider border transition-all ${
            isAdvancedOpen || selectedTypes.length > 0 || bedrooms !== "any" || minPrice || maxPrice
              ? "border-brand-accent bg-brand-accent/5 text-brand-fg"
              : "border-brand-border text-brand-muted hover:border-brand-fg hover:text-brand-fg"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand-accent" />
          <span>Filters</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isAdvancedOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Quick Search Action */}
        <button
          type="button"
          onClick={() => applyFilters()}
          className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider shrink-0"
        >
          Search
        </button>
      </div>

      {/* Advanced Filter Drawer / Section */}
      {isAdvancedOpen && (
        <div className="border-t border-brand-border p-4 sm:p-6 bg-neutral-50/50 space-y-6 animate-fadeIn">
          {/* Property Types */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-brand-fg mb-2.5">
              Property Type (Multi-Select)
            </label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type.value);
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => togglePropertyType(type.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-brand-fg text-white shadow-sm"
                        : "bg-white border border-brand-border text-brand-fg hover:border-brand-fg"
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bedrooms */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-brand-fg mb-2">
                Bedrooms (BHK)
              </label>
              <div className="flex items-center gap-1.5">
                {BEDROOM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setBedrooms(opt.value);
                      applyFilters({ bedrooms: opt.value });
                    }}
                    className={`flex-1 py-1.5 rounded text-xs font-medium border text-center transition-all ${
                      bedrooms === opt.value
                        ? "bg-brand-fg text-white border-brand-fg"
                        : "bg-white border-brand-border text-brand-fg hover:border-brand-fg"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range (INR) */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-brand-fg mb-2">
                Price Range (₹ INR)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min (e.g. 5000000)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 px-3 py-1.5 text-xs bg-white border border-brand-border rounded focus:border-brand-accent focus:outline-none"
                />
                <span className="text-neutral-400 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max (e.g. 80000000)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 px-3 py-1.5 text-xs bg-white border border-brand-border rounded focus:border-brand-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Area (sqft) */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-brand-fg mb-2">
                Area (Sq. Ft.)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min Sqft"
                  value={minArea}
                  onChange={(e) => setMinArea(e.target.value)}
                  className="w-1/2 px-3 py-1.5 text-xs bg-white border border-brand-border rounded focus:border-brand-accent focus:outline-none"
                />
                <span className="text-neutral-400 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max Sqft"
                  value={maxArea}
                  onChange={(e) => setMaxArea(e.target.value)}
                  className="w-1/2 px-3 py-1.5 text-xs bg-white border border-brand-border rounded focus:border-brand-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Social Proof / Sold & Rented Toggle (§8.1) + Reset */}
          <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-brand-fg select-none">
              <input
                type="checkbox"
                checked={showSoldRented}
                onChange={(e) => {
                  setShowSoldRented(e.target.checked);
                  applyFilters({ show_sold_rented: e.target.checked });
                }}
                className="w-4 h-4 rounded border-brand-border text-brand-fg focus:ring-brand-accent accent-black cursor-pointer"
              />
              <span>
                Show Recently Sold & Rented Deals (§8.1 Verified Social Proof)
              </span>
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
              <button
                type="button"
                onClick={() => applyFilters()}
                className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-6 py-2 rounded text-xs font-semibold uppercase tracking-wider"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Pills Bar */}
      <div className="px-4 py-2.5 bg-neutral-50 border-t border-brand-border/60 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-brand-muted">
          <span className="font-semibold text-brand-fg">
            {totalResults !== undefined ? `${totalResults} Properties Found` : "Listings"}
          </span>
          {listingType !== "all" && (
            <span className="bg-white border border-brand-border px-2 py-0.5 rounded text-[11px] text-brand-fg">
              For {listingType}
            </span>
          )}
          {selectedTypes.map((t) => (
            <span
              key={t}
              className="bg-white border border-brand-border px-2 py-0.5 rounded text-[11px] text-brand-fg capitalize"
            >
              {t}
            </span>
          ))}
          {bedrooms !== "any" && (
            <span className="bg-white border border-brand-border px-2 py-0.5 rounded text-[11px] text-brand-fg">
              {bedrooms} BHK
            </span>
          )}
          {showSoldRented && (
            <span className="bg-neutral-800 text-white px-2 py-0.5 rounded text-[11px]">
              Including Sold/Rented
            </span>
          )}
        </div>

        {(search ||
          listingType !== "all" ||
          selectedTypes.length > 0 ||
          bedrooms !== "any" ||
          minPrice ||
          maxPrice ||
          showSoldRented) && (
          <button
            onClick={handleReset}
            className="text-[11px] text-brand-accent hover:underline font-semibold"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
