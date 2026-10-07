import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIndianPrice(amount: number | string, listingType?: string): string {
  // If it's a string, try to parse as number; if not numeric show as-is
  if (typeof amount === "string") {
    const cleaned = amount.replace(/[₹,]/g, "").trim();
    if (/^\d+(\.\d+)?$/.test(cleaned)) {
      amount = Number(cleaned);
    } else {
      // Non-numeric price like "6.8 Cr" or "Price on Request"
      return amount;
    }
  }

  if (isNaN(amount)) return "₹0";

  if (listingType === "rent") {
    return `₹${amount.toLocaleString("en-IN")} / mo`;
  }

  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, "");
    return `₹${cr} Cr`;
  }
  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2).replace(/\.00$/, "");
    return `₹${lakh} Lakhs`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatArea(sqft?: number | null): string {
  if (!sqft) return "N/A";
  return `${sqft.toLocaleString("en-IN")} sq.ft`;
}
