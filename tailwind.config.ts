import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "var(--color-bg)",
          fg: "var(--color-fg)",
          accent: "var(--color-accent)",
          accentSoft: "var(--color-accent-soft)",
          cta: "var(--color-cta-bg)",
          ctaFg: "var(--color-cta-fg)",
          ctaSecBg: "var(--color-cta-secondary-bg)",
          ctaSecBorder: "var(--color-cta-secondary-border)",
          footer: "var(--color-footer-bg)",
          footerFg: "var(--color-footer-fg)",
          footerMuted: "var(--color-footer-muted)",
          border: "var(--color-border)",
          muted: "var(--color-muted-text)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
