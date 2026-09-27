import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIndianPrice(amount: number, listingType?: string): string {
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
