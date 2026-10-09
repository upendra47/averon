"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  Link2,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  ImageIcon,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
export type ImageSource = "upload" | "url";

export interface ManagedImage {
  /** Client-side temporary id */
  id: string;
  /** Preview URL (object URL for device files, original URL for url-source) */
  previewUrl: string;
  /** The source type */
  source: ImageSource;
  /** Original file (only for "upload" source) */
  file?: File;
  /** Compressed blob ready for upload (only for "upload" source) */
  compressedBlob?: Blob;
  /** Whether this is the primary image */
  isPrimary: boolean;
  /** Upload progress 0-100, only relevant during publish */
  uploadProgress?: number;
  /** Final public URL after Supabase upload */
  finalUrl?: string;
  /** Storage path for cleanup */
  storagePath?: string | null;
  /** Error message if upload failed */
  error?: string;
}

interface PropertyImageManagerProps {
  images: ManagedImage[];
  onChange: (images: ManagedImage[]) => void;
  maxImages?: number;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGES_DEFAULT = 10;

// ─── Component ───────────────────────────────────────────────────────
export function PropertyImageManager({
  images,
  onChange,
  maxImages = MAX_IMAGES_DEFAULT,
  error: externalError,
}: PropertyImageManagerProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAtLimit = images.length >= maxImages;

  // Clear toast after 3s
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(""), 3000);
    return () => clearTimeout(t);
  }, [toastMsg]);

  // ── Helpers ──────────────────────────────────────────────────
  const genId = () => `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const addImages = useCallback(
    (newImgs: ManagedImage[]) => {
      const remaining = maxImages - images.length;
      if (remaining <= 0) return;
      const accepted = newImgs.slice(0, remaining);
      if (newImgs.length > remaining) {
        setToastMsg(
          `Only ${remaining} slot${remaining > 1 ? "s" : ""} remaining — accepted ${accepted.length} of ${newImgs.length} images.`
        );
      }
      // First image added becomes primary
      const needPrimary = images.length === 0 && accepted.length > 0;
      if (needPrimary) accepted[0].isPrimary = true;
      onChange([...images, ...accepted]);
    },
    [images, maxImages, onChange]
  );

  // ── Device file handler ──────────────────────────────────────
  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      const newImgs: ManagedImage[] = [];

      for (const file of files) {
        // Type check
        if (!ALLOWED_TYPES.includes(file.type)) {
          setToastMsg(`"${file.name}" rejected — only JPG, PNG, WebP allowed.`);
          continue;
        }
        // HEIC detection by extension
        if (file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")) {
          setToastMsg(`"${file.name}" rejected — HEIC/HEIF not supported. Please convert to JPG or PNG.`);
          continue;
        }
        // Size check (pre-compression)
        if (file.size > MAX_FILE_SIZE) {
          setToastMsg(`"${file.name}" is over 5 MB and was rejected.`);
          continue;
        }

        const previewUrl = URL.createObjectURL(file);
        newImgs.push({
          id: genId(),
          previewUrl,
          source: "upload",
          file,
          isPrimary: false,
        });
      }

      addImages(newImgs);
    },
    [addImages]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  // ── Drag and drop ────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  // ── URL handler ──────────────────────────────────────────────
  const handleAddUrl = async () => {
    setUrlError("");
    const url = urlInput.trim();

    if (!url) return;
    if (!url.startsWith("https://")) {
      setUrlError("URL must start with https://");
      return;
    }
    try {
      new URL(url);
    } catch {
      setUrlError("Not a valid URL.");
      return;
    }
    // Duplicate check
    if (images.some((img) => img.previewUrl === url || img.finalUrl === url)) {
      setUrlError("This URL has already been added.");
      return;
    }

    // Verify it loads as an image
    setUrlLoading(true);
    const isValid = await new Promise<boolean>((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
    setUrlLoading(false);

    if (!isValid) {
      setUrlError("This link is not a valid image.");
      return;
    }

    addImages([
      {
        id: genId(),
        previewUrl: url,
        source: "url",
        isPrimary: false,
        finalUrl: url,
        storagePath: null,
      },
    ]);
    setUrlInput("");
  };

  // ── Image actions ────────────────────────────────────────────
  const removeImage = (id: string) => {
    const img = images.find((i) => i.id === id);
    // Revoke object URL to prevent memory leak
    if (img?.source === "upload" && img.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(img.previewUrl);
    }
    let updated = images.filter((i) => i.id !== id);
    // If removed was primary, make next one primary
    if (img?.isPrimary && updated.length > 0) {
      updated = updated.map((i, idx) =>
        idx === 0 ? { ...i, isPrimary: true } : i
      );
    }
    onChange(updated);
  };

  const setPrimary = (id: string) => {
    const target = images.find((i) => i.id === id);
    if (!target || target.isPrimary) return;
    const others = images.filter((i) => i.id !== id).map((i) => ({ ...i, isPrimary: false }));
    onChange([{ ...target, isPrimary: true }, ...others]);
  };

  const moveImage = (id: string, direction: "left" | "right") => {
    const idx = images.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const targetIdx = direction === "left" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const newList = [...images];
    [newList[idx], newList[targetIdx]] = [newList[targetIdx], newList[idx]];
    // Ensure first is always primary
    const updated = newList.map((i, j) => ({
      ...i,
      isPrimary: j === 0,
    }));
    onChange(updated);
  };

  // ── Cleanup previews on unmount ──────────────────────────────
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.source === "upload" && img.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-fg mb-1">
        Property Images *
      </label>

      {/* Toast */}
      {toastMsg && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-center gap-2 p-3 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded border border-brand-border">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === "upload"
              ? "bg-brand-cta text-brand-ctaFg shadow-sm"
              : "text-brand-muted hover:text-brand-fg"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload from device
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === "url"
              ? "bg-brand-cta text-brand-ctaFg shadow-sm"
              : "text-brand-muted hover:text-brand-fg"
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          Add via URL
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isAtLimit
              ? "border-neutral-200 bg-neutral-50 opacity-60 cursor-not-allowed"
              : isDragging
                ? "border-brand-accent bg-brand-accent/5"
                : "border-brand-border bg-neutral-50 hover:border-brand-accent/50"
          }`}
        >
          {isAtLimit ? (
            <p className="text-xs text-brand-muted font-medium">
              Maximum {maxImages} images reached
            </p>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 mx-auto text-brand-muted mb-2" />
              <p className="text-xs text-brand-muted mb-2">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-[11px] text-neutral-400">
                JPG, PNG, WebP · Max 5 MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Choose image files"
                disabled={isAtLimit}
              />
            </>
          )}
        </div>
      )}

      {/* URL Tab */}
      {activeTab === "url" && (
        <div className="space-y-2">
          {isAtLimit ? (
            <p className="text-xs text-brand-muted font-medium p-4 text-center bg-neutral-50 rounded border border-brand-border">
              Maximum {maxImages} images reached
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="https://..."
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
                className="flex-1 px-3 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none font-mono"
                aria-label="Image URL"
                disabled={isAtLimit}
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={isAtLimit || urlLoading || !urlInput.trim()}
                className="px-4 py-2 bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors rounded text-xs font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {urlLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Checking…
                  </>
                ) : (
                  "Add"
                )}
              </button>
            </div>
          )}
          {urlError && (
            <p role="alert" className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {urlError}
            </p>
          )}
        </div>
      )}

      {/* Counter */}
      <div className="flex items-center justify-between text-xs" aria-live="polite">
        <span className="text-brand-muted font-medium">
          {images.length} / {maxImages} images
        </span>
        {images.length > 0 && (
          <span className="text-brand-muted">
            Primary: {images.find((i) => i.isPrimary)?.previewUrl ? "✓ Set" : "Not set"}
          </span>
        )}
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative group rounded-lg overflow-hidden border border-brand-border bg-neutral-100 aspect-square"
            >
              {/* Thumbnail — use native img for both blob and URL previews */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl}
                alt={`Image ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
                }}
              />

              {/* Primary badge */}
              {img.isPrimary && (
                <div className="absolute top-1.5 left-1.5 bg-brand-accent text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                  Primary
                </div>
              )}

              {/* Source badge */}
              <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                {img.source === "upload" ? "Uploaded" : "URL"}
              </div>

              {/* Upload progress */}
              {img.uploadProgress !== undefined && img.uploadProgress < 100 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-white text-xs font-bold">
                    {img.uploadProgress}%
                  </div>
                </div>
              )}

              {/* Error overlay */}
              {img.error && (
                <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center p-2">
                  <p className="text-white text-[10px] text-center">{img.error}</p>
                </div>
              )}

              {/* Action buttons (hover) */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Set as primary */}
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(img.id)}
                      className="p-1 rounded bg-white/90 hover:bg-brand-accent hover:text-white text-brand-fg transition-colors"
                      title="Set as primary"
                      aria-label="Set as primary image"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="p-1 rounded bg-white/90 hover:bg-red-500 hover:text-white text-brand-fg transition-colors"
                    title="Remove image"
                    aria-label="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reorder arrows */}
                <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(img.id, "left")}
                      className="p-0.5 rounded bg-white/90 hover:bg-white text-brand-fg"
                      title="Move left"
                      aria-label="Move image left"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(img.id, "right")}
                      className="p-0.5 rounded bg-white/90 hover:bg-white text-brand-fg"
                      title="Move right"
                      aria-label="Move image right"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Validation error */}
      {externalError && (
        <p role="alert" className="text-xs text-red-600 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {externalError}
        </p>
      )}
    </div>
  );
}
