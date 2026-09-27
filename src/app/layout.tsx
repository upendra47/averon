import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Averon Realty | Premier Real Estate Advisory",
  description:
    "Curated luxury real estate across Bengaluru, Mumbai, Pune, Hyderabad, Chennai, and Gurugram. Buy, sell, or lease premier residential and commercial properties.",
  keywords: [
    "Averon Realty",
    "Luxury Real Estate Bengaluru",
    "Mumbai Penthouses",
    "Pune Villas",
    "Commercial Real Estate",
    "Real Estate Advisory India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-brand-bg text-brand-fg`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
