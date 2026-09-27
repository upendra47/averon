import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  variant?: "dark" | "light";
  className?: string;
  showSubtitle?: boolean;
}

export function Wordmark({
  variant = "dark",
  className,
  showSubtitle = true,
}: WordmarkProps) {
  const isDarkBg = variant === "light"; // on dark footer, text is white
  const baseColor = isDarkBg ? "text-white" : "text-brand-fg";

  return (
    <Link href="/" className={cn("inline-flex flex-col group", className)}>
      <div className="flex items-center tracking-[0.25em] text-xl font-bold font-sans">
        <span className={baseColor}>AVE</span>
        <span className="text-brand-accent">R</span>
        <span className={baseColor}>ON</span>
      </div>
      {showSubtitle && (
        <span
          className={cn(
            "text-[9px] uppercase tracking-[0.35em] font-medium -mt-0.5",
            isDarkBg ? "text-brand-footerMuted" : "text-brand-muted"
          )}
        >
          Realty
        </span>
      )}
    </Link>
  );
}
