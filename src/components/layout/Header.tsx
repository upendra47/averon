"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/common/Wordmark";
import { useAuth } from "@/context/auth-context";
import {
  Phone,
  Mail,
  Heart,
  Menu,
  X,
  Shield,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { RoleType } from "@/types";

export function Header() {
  const pathname = usePathname();
  const { user, role, switchRole, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Explore All", href: "/properties" },
    { name: "Buy", href: "/properties?listing_type=sale" },
    { name: "Rent", href: "/properties?listing_type=rent" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleRoleChange = (newRole: RoleType) => {
    switchRole(newRole);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="w-full bg-brand-bg border-b border-brand-border sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-[#111111] text-[#9CA3AF] text-xs py-2 px-4 sm:px-8 border-b border-[#222]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <span className="text-brand-accent tracking-widest uppercase font-semibold text-[10px]">
              AVERON MARKETPLACE
            </span>
            <div className="hidden md:flex items-center gap-4 text-[11px]">
              <a
                href="mailto:propertys.bengaluru@gmail.com"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Mail className="w-3 h-3 text-brand-accent" />
                propertys.bengaluru@gmail.com
              </a>
              <span className="text-[#333]">|</span>
              <a
                href="tel:+917996379793"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-brand-accent" />
                +91 7996379793
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {/* Quick Role Tester / Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-[#333] hover:border-brand-accent transition-colors bg-[#1A1A1A] text-white"
                title="Switch role for testing capabilities"
              >
                <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="uppercase text-[10px] tracking-wider font-semibold">
                  Role: {role}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-[#1A1A1A] border border-[#333] rounded shadow-xl py-1 z-50 text-left">
                  <div className="px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wider border-b border-[#2a2a2a]">
                    Test Permissions
                  </div>
                  {(["developer", "admin", "user"] as RoleType[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#252525] transition-colors ${
                        role === r ? "text-brand-accent font-semibold" : "text-gray-200"
                      }`}
                    >
                      <span className="capitalize">{r}</span>
                      {role === r && <span className="text-[10px]">●</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {role === "developer" && (
              <Link
                href="/admin/manage-admins"
                className="text-brand-accent hover:underline flex items-center gap-1 font-semibold"
              >
                <Shield className="w-3 h-3" />
                Manage Admins
              </Link>
            )}

            {(role === "admin" || role === "developer") && (
              <Link
                href="/admin"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <LayoutDashboard className="w-3 h-3" />
                Admin Desk
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Wordmark */}
        <Wordmark />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm tracking-wide transition-colors relative py-1 ${
                  isActive
                    ? "text-brand-fg font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-brand-accent"
                    : "text-brand-muted hover:text-brand-fg"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 text-brand-fg hover:text-brand-accent transition-colors relative"
            title="Saved Favorites & Inquiries"
          >
            <Heart className="w-5 h-5" />
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-fg hover:text-brand-accent px-3 py-2 border border-brand-border rounded"
              >
                <User className="w-3.5 h-3.5" />
                <span>{user?.name || "Account"}</span>
              </Link>
              <button
                onClick={() => logout()}
                className="p-2 text-brand-muted hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-xs uppercase tracking-wider font-semibold text-brand-fg hover:text-brand-accent px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded"
              >
                Sign Up
              </Link>
            </div>
          )}

          <Link
            href="/contact"
            className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors text-xs uppercase tracking-widest font-semibold px-5 py-2.5 rounded shadow-sm"
          >
            Schedule Visit
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-3">
          <Link href="/dashboard" className="p-2 text-brand-fg" title="Saved Favorites">
            <Heart className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-brand-fg hover:text-brand-accent"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-bg border-b border-brand-border px-6 py-5 shadow-lg space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-brand-fg hover:text-brand-accent py-1"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-brand-border space-y-3">
            {(role === "admin" || role === "developer") && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-brand-fg hover:text-brand-accent"
              >
                Admin Desk
              </Link>
            )}
            {role === "developer" && (
              <Link
                href="/admin/manage-admins"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-brand-accent"
              >
                Developer: Manage Admins
              </Link>
            )}
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-brand-fg hover:text-brand-accent"
            >
              Saved Favorites & Inquiries
            </Link>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-brand-cta text-brand-ctaFg py-2.5 rounded font-semibold text-xs tracking-wider uppercase"
              >
                Schedule Visit
              </Link>
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center border border-brand-border py-2 text-xs font-semibold uppercase"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-black text-white py-2 text-xs font-semibold uppercase"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-xs text-red-600 font-semibold py-1"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
