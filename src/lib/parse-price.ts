/**
 * Parses a human-readable Indian price string into a numeric value.
 *
 * Supported formats:
 * - Pure numbers: "68000000" → 68000000
 * - Crore shorthand: "6.8 Cr", "6.8cr", "6.8 Crore", "6.8 Crores" → 68000000
 * - Lakh shorthand: "85 Lakhs", "85L", "85 Lac", "85 Lacs" → 8500000
 * - With ₹ and commas: "₹6,80,00,000" → 68000000
 * - Unparseable: "Price on Request" → null
 */
export function parsePriceToNumber(text: string): number | null {
  if (!text || typeof text !== "string") return null;

  // Strip ₹, commas, and leading/trailing whitespace
  const cleaned = text.replace(/[₹,]/g, "").trim();

  // If it's already a plain number
  const plain = Number(cleaned);
  if (!isNaN(plain) && cleaned.length > 0 && /^[\d.]+$/.test(cleaned)) {
    return plain;
  }

  // Try Crore pattern: "6.8 Cr", "6.8cr", "6.8 Crore", "6.8 Crores"
  const crMatch = cleaned.match(/^([\d.]+)\s*(?:cr(?:ore)?s?)\b/i);
  if (crMatch) {
    const val = parseFloat(crMatch[1]);
    if (!isNaN(val)) return val * 10_000_000;
  }

  // Try Lakh pattern: "85 Lakhs", "85L", "85 Lac", "85 Lacs", "85 Lakh"
  const lakhMatch = cleaned.match(/^([\d.]+)\s*(?:l(?:akhs?|acs?|akh)?)\b/i);
  if (lakhMatch) {
    const val = parseFloat(lakhMatch[1]);
    if (!isNaN(val)) return val * 100_000;
  }

  // Try stripping all non-numeric characters and parsing
  const digitsOnly = cleaned.replace(/[^\d.]/g, "");
  if (digitsOnly.length > 0) {
    const val = Number(digitsOnly);
    if (!isNaN(val) && val > 0) return val;
  }

  return null;
}

/**
 * Formats a price for display. If the raw text is purely numeric,
 * apply Indian ₹ formatting. Otherwise show the text as entered.
 */
export function formatPriceDisplay(
  priceText: string,
  listingType?: string
): string {
  if (!priceText) return "₹0";

  // Check if it's a pure number
  const cleaned = priceText.replace(/[₹,]/g, "").trim();
  if (/^\d+(\.\d+)?$/.test(cleaned)) {
    const amount = Number(cleaned);
    if (isNaN(amount)) return priceText;

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

  // Non-numeric: show as entered
  return priceText;
}
