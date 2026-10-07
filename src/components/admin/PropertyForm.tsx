"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Property, State, City, PropertyType, ListingType, PropertyStatus } from "@/types";
import { DataService } from "@/lib/data-service";
import { compressImage } from "@/lib/image-compression";
import { parsePriceToNumber } from "@/lib/parse-price";
import { PropertyImageManager, ManagedImage } from "./PropertyImageManager";
import { ArrowLeft, Save, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PropertyFormProps {
  initialData?: Property;
  isEdit?: boolean;
}

/** Allowed characters in the price text field */
const PRICE_ALLOWED = /^[0-9a-zA-Z .,+\-/₹]*$/;
const MAX_CONCURRENT_UPLOADS = 3;

/** Convert existing PropertyImage rows into ManagedImage for the manager */
function existingToManaged(property: Property): ManagedImage[] {
  if (!property.images || property.images.length === 0) return [];
  return property.images.map((img, idx) => ({
    id: `existing-${img.id}`,
    previewUrl: img.image_url,
    source: "url" as const, // treat all existing as URL-type (don't re-upload)
    isPrimary: img.is_primary || idx === 0,
    finalUrl: img.image_url,
    storagePath: null,
  }));
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
  const [priceError, setPriceError] = useState("");
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
  const [amenitiesText, setAmenitiesText] = useState<string>(
    initialData?.amenities?.join(", ") ||
      "24/7 Security, Covered Parking, Power Backup, Clubhouse"
  );

  // Images
  const [images, setImages] = useState<ManagedImage[]>(() =>
    initialData ? existingToManaged(initialData) : []
  );
  const [imageError, setImageError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Track if a publish is in-flight (prevent double-submit)
  const publishingRef = useRef(false);

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

  // ── Price input validation ────────────────────────────────────────
  const handlePriceChange = (raw: string) => {
    // Block disallowed chars silently
    if (raw && !PRICE_ALLOWED.test(raw)) return;
    setPrice(raw);
    setPriceError("");
  };

  // ── Image upload logic ────────────────────────────────────────────
  /**
   * Runs parallel uploads (up to MAX_CONCURRENT_UPLOADS at a time).
   * Returns updated image list with finalUrl / storagePath set.
   * Throws if any upload fails (after setting error on the specific image).
   */
  async function uploadDeviceImages(
    userId: string,
    imgs: ManagedImage[]
  ): Promise<ManagedImage[]> {
    const supabase = createClient();
    if (!supabase) throw new Error("Supabase not available");

    const toUpload = imgs.filter((i) => i.source === "upload" && !i.finalUrl);
    const urlImages = imgs.filter((i) => i.source !== "upload" || i.finalUrl);

    const results: ManagedImage[] = [...urlImages];
    const errors: string[] = [];

    // Process in batches
    for (let i = 0; i < toUpload.length; i += MAX_CONCURRENT_UPLOADS) {
      const batch = toUpload.slice(i, i + MAX_CONCURRENT_UPLOADS);
      const batchResults = await Promise.all(
        batch.map(async (img) => {
          try {
            // Compress
            const blob = img.compressedBlob || (img.file ? await compressImage(img.file) : null);
            if (!blob) throw new Error("No file data");

            const ext = blob.type === "image/webp" ? "webp" : "jpg";
            const path = `property-images/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

            // Upload
            const { error: upErr } = await supabase.storage
              .from("property-images")
              .upload(path, blob, { contentType: blob.type, upsert: false });

            if (upErr) throw new Error(upErr.message);

            const { data: urlData } = supabase.storage
              .from("property-images")
              .getPublicUrl(path);

            return {
              ...img,
              finalUrl: urlData.publicUrl,
              storagePath: path,
              uploadProgress: 100,
              error: undefined,
            } as ManagedImage;
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Upload failed";
            errors.push(`"${img.file?.name || "image"}" — ${msg}`);

            // Clean up already-uploaded in this batch if some failed
            return { ...img, error: msg } as ManagedImage;
          }
        })
      );
      results.push(...batchResults);
    }

    if (errors.length > 0) {
      // Update images state to show per-image errors
      const updated = imgs.map((orig) => {
        const found = results.find((r) => r.id === orig.id);
        return found || orig;
      });
      setImages(updated);
      throw new Error(`Upload failed for: ${errors.join("; ")}`);
    }

    return imgs.map((orig) => results.find((r) => r.id === orig.id) || orig);
  }

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (publishingRef.current) return;

    setSubmitError("");
    setImageError("");
    setPriceError("");

    // Validate price
    if (!price.trim()) {
      setPriceError("Price is required.");
      return;
    }

    // Validate images
    if (images.length === 0) {
      setImageError("At least 1 image is required to publish.");
      return;
    }

    publishingRef.current = true;
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      let uploadedImages = images;

      // Upload device images if Supabase is available
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const uploadCount = images.filter(
            (i) => i.source === "upload" && !i.finalUrl
          ).length;
          if (uploadCount > 0) {
            setUploadingCount(uploadCount);
            uploadedImages = await uploadDeviceImages(user.id, images);
            setImages(uploadedImages);
            setUploadingCount(0);
          }
        }
      }

      const amenitiesList = amenitiesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // Build property_images rows from managed images
      const imageRows = uploadedImages.map((img, idx) => ({
        id: `img-${idx}`,
        property_id: initialData?.id || "temp",
        image_url: img.finalUrl || img.previewUrl,
        is_primary: img.isPrimary,
        sort_order: idx + 1,
      }));

      const priceValue = parsePriceToNumber(price.trim());

      const propData: Partial<Property> = {
        title,
        description,
        property_type: propertyType,
        listing_type: listingType,
        price: price.trim(),
        price_value: priceValue ?? undefined,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        area_sqft: areaSqft ? Number(areaSqft) : null,
        address,
        state_id: Number(stateId),
        city_id: Number(cityId),
        status,
        featured,
        images: imageRows,
        amenities: amenitiesList,
      };

      // Backward compat: keep primary_photo_url column in sync
      // The DataService.createProperty/updateProperty handles images via property_images table.
      // We pass images as the property_images rows.

      if (isEdit && initialData?.id) {
        // Delete removed uploaded images from Storage
        if (supabase) {
          const removedStorage = (initialData.images || [])
            .filter(
              (old) =>
                !uploadedImages.some(
                  (u) => u.finalUrl === old.image_url || u.previewUrl === old.image_url
                )
            )
            .filter((old) => old.image_url.includes("supabase.co"));

          if (removedStorage.length > 0) {
            // Best-effort delete — don't block save if this fails
            const paths = removedStorage.map((img) => {
              const match = img.image_url.match(/property-images\/.+$/);
              return match ? match[0] : null;
            }).filter(Boolean) as string[];

            if (paths.length > 0) {
              await supabase.storage.from("property-images").remove(paths);
            }
          }
        }

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
      const msg = err instanceof Error ? err.message : "An error occurred";
      setSubmitError(msg);
      setUploadingCount(0);
    } finally {
      setIsSubmitting(false);
      publishingRef.current = false;
    }
  };

  const isPublishing = isSubmitting || uploadingCount > 0;

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

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span>{submitError}</span>
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

        {/* Listing Type, Property Type, Price */}
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
              type="text"
              required
              maxLength={50}
              placeholder="e.g. 6.8 Cr, 85 Lakhs, Price on Request"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              onBlur={() => {
                if (price.trim() && !PRICE_ALLOWED.test(price)) {
                  setPriceError("Contains invalid characters.");
                }
              }}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none"
              aria-describedby={priceError ? "price-error" : undefined}
            />
            {priceError && (
              <p id="price-error" className="text-red-600 text-[10px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{priceError}
              </p>
            )}
            {price.trim() && parsePriceToNumber(price.trim()) !== null && (
              <p className="text-brand-muted text-[10px] mt-1">
                Parsed value: ₹{parsePriceToNumber(price.trim())!.toLocaleString("en-IN")}
              </p>
            )}
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

        {/* Property Image Manager */}
        <div className="border-t border-brand-border pt-6">
          <PropertyImageManager
            images={images}
            onChange={(updated) => {
              setImages(updated);
              if (updated.length > 0) setImageError("");
            }}
            error={imageError}
          />
          {uploadingCount > 0 && (
            <p className="text-xs text-brand-muted mt-2 animate-pulse">
              Uploading {uploadingCount} image{uploadingCount > 1 ? "s" : ""}…
            </p>
          )}
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
            disabled={isPublishing}
            className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>
              {uploadingCount > 0
                ? `Uploading ${uploadingCount} image${uploadingCount > 1 ? "s" : ""}…`
                : isSubmitting
                  ? "Saving…"
                  : isEdit
                    ? "Update Property"
                    : "Publish Property"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
