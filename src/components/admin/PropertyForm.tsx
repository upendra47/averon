"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Property, State, City, PropertyType, ListingType, PropertyStatus } from "@/types";
import { DataService } from "@/lib/data-service";
import { ArrowLeft, Save, Sparkles, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface PropertyFormProps {
  initialData?: Property;
  isEdit?: boolean;
}

export function PropertyForm({ initialData, isEdit }: PropertyFormProps) {
  const router = useRouter();

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [propertyType, setPropertyType] = useState<PropertyType>(
    initialData?.property_type || "apartment"
  );
  const [listingType, setListingType] = useState<ListingType>(
    initialData?.listing_type || "sale"
  );
  const [price, setPrice] = useState<string>(
    initialData?.price ? String(initialData.price) : ""
  );
  const [bedrooms, setBedrooms] = useState<string>(
    initialData?.bedrooms !== undefined ? String(initialData.bedrooms) : "3"
  );
  const [bathrooms, setBathrooms] = useState<string>(
    initialData?.bathrooms !== undefined ? String(initialData.bathrooms) : "3"
  );
  const [areaSqft, setAreaSqft] = useState<string>(
    initialData?.area_sqft ? String(initialData.area_sqft) : "1800"
  );
  const [address, setAddress] = useState(initialData?.address || "");
  const [stateId, setStateId] = useState<number>(initialData?.state_id || 1);
  const [cityId, setCityId] = useState<number>(initialData?.city_id || 1);
  const [status, setStatus] = useState<PropertyStatus>(
    initialData?.status || "available"
  );
  const [featured, setFeatured] = useState<boolean>(initialData?.featured || false);
  const [imageUrl, setImageUrl] = useState<string>(
    initialData?.images?.[0]?.image_url ||
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
  );
  const [amenitiesText, setAmenitiesText] = useState<string>(
    initialData?.amenities?.join(", ") ||
      "24/7 Security, Covered Parking, Power Backup, Clubhouse"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    DataService.getStates().then(setStates);
    DataService.getCities().then((all) => {
      setCities(all);
      setFilteredCities(all.filter((c) => c.state_id === stateId));
    });
  }, []);

  useEffect(() => {
    if (stateId) {
      const match = cities.filter((c) => c.state_id === stateId);
      setFilteredCities(match);
      if (match.length > 0 && !match.some((c) => c.id === cityId)) {
        setCityId(match[0].id);
      }
    }
  }, [stateId, cities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amenitiesList = amenitiesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const propData: Partial<Property> = {
        title,
        description,
        property_type: propertyType,
        listing_type: listingType,
        price: Number(price),
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        area_sqft: areaSqft ? Number(areaSqft) : null,
        address,
        state_id: Number(stateId),
        city_id: Number(cityId),
        status,
        featured,
        images: [
          {
            id: `img-${Date.now()}`,
            property_id: initialData?.id || "temp",
            image_url: imageUrl,
            is_primary: true,
            sort_order: 1,
          },
        ],
        amenities: amenitiesList,
      };

      if (isEdit && initialData?.id) {
        await DataService.updateProperty(initialData.id, propData);
        setSuccessMsg("Listing updated successfully!");
      } else {
        await DataService.createProperty(propData);
        setSuccessMsg("New property listing created!");
      }

      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-8 space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-black transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Desk</span>
      </button>

      <div className="flex items-center justify-between pb-4 border-b border-brand-border">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent">
            {isEdit ? "Update Listing" : "New Listing Submission"}
          </span>
          <h1 className="text-2xl font-bold text-brand-fg">
            {isEdit ? `Edit: ${title || "Property"}` : "Create Property Listing"}
          </h1>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span>{successMsg} Redirecting to admin directory...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
            Listing Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. The Glasshouse Sanctuary Villa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
          />
        </div>

        {/* Listing Type, Property Type, Valuation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
              Listing Category *
            </label>
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value as ListingType)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
              Property Type *
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none capitalize"
            >
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot / Land</option>
              <option value="commercial">Commercial</option>
              <option value="office">Office Space</option>
              <option value="shop">Retail Shop</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
              Price (INR ₹) *
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 68000000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Bedrooms, Bathrooms, Area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
              Bedrooms (BHK)
            </label>
            <input
              type="number"
              placeholder="e.g. 4"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
              Bathrooms
            </label>
            <input
              type="number"
              placeholder="e.g. 5"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
              Super Built Area (Sq.Ft.)
            </label>
            <input
              type="number"
              placeholder="e.g. 4800"
              value={areaSqft}
              onChange={(e) => setAreaSqft(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
            />
          </div>
        </div>

        {/* State and City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
              State *
            </label>
            <select
              value={stateId}
              onChange={(e) => setStateId(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
            >
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
              City *
            </label>
            <select
              value={cityId}
              onChange={(e) => setCityId(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
            >
              {filteredCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
            Locality Address *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 100 Feet Road, HAL 2nd Stage, Indiranagar"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
            Detailed Narrative / Overview *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Highlight architecture, fittings, view, and unique features..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
          />
        </div>

        {/* Primary Image URL */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
            Primary Photo URL (Unsplash or Supabase Storage)
          </label>
          <input
            type="url"
            required
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none font-mono"
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
            Amenities (Comma Separated)
          </label>
          <input
            type="text"
            placeholder="Private Pool, Smart Automation, Gym, Tennis Court"
            value={amenitiesText}
            onChange={(e) => setAmenitiesText(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
          />
        </div>

        {/* Status and Featured Controls */}
        <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
                Listing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="px-3 py-1.5 text-xs bg-white border border-brand-border rounded capitalize font-semibold"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="under_negotiation">Under Negotiation</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-fg mt-4 select-none">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-accent accent-black cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                Featured Property
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving..." : isEdit ? "Update Property" : "Publish Property"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
