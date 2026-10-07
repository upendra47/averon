const MAX_DIMENSION = 1600;
const TARGET_QUALITY = 0.8;

/**
 * Client-side image compression using canvas.
 * Resizes so the longest edge ≤ 1600px and converts to WebP (JPEG fallback).
 * No external dependencies.
 */
export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Scale down if needed
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round(height * (MAX_DIMENSION / width));
          width = MAX_DIMENSION;
        } else {
          width = Math.round(width * (MAX_DIMENSION / height));
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Cannot get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first, fall back to JPEG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            // Fallback to JPEG
            canvas.toBlob(
              (jpegBlob) => {
                if (jpegBlob) resolve(jpegBlob);
                else reject(new Error("Image compression failed"));
              },
              "image/jpeg",
              TARGET_QUALITY
            );
          }
        },
        "image/webp",
        TARGET_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}
