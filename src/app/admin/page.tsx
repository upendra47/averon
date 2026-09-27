"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { DataService } from "@/lib/data-service";
import { Property, Inquiry, PropertyStatus } from "@/types";
import { formatIndianPrice } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Building,
  CheckCircle2,
  Shield,
  ExternalLink,
} from "lucide-react";

export default function AdminPage() {
  const { role } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [activeTab, setActiveTab] = useState<"properties" | "inquiries">("properties");
  const [search, setSearch] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const isAuthorized = role === "admin" || role === "developer";

  const loadData = async () => {
    try {
      const allProps = await DataService.getProperties({ show_sold_rented: true });
      setProperties(allProps);
      const allInquiries = await DataService.getInquiries();
      setInquiries(allInquiries);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (propertyId: string, newStatus: PropertyStatus) => {
    await DataService.updateProperty(propertyId, { status: newStatus });
    setActionSuccess(`Property status updated to "${newStatus.replace("_", " ")}"`);
    setTimeout(() => setActionSuccess(""), 3000);
    loadData();
  };

  const handleDelete = async (propertyId: string, title: string) => {
    if (confirm(`Are you sure you want to delete listing "${title}"?`)) {
      await DataService.deleteProperty(propertyId);
      setActionSuccess(`Listing "${title}" removed successfully`);
      setTimeout(() => setActionSuccess(""), 3000);
      loadData();
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-brand-fg">Restricted Access</h2>
        <p className="text-xs text-brand-muted max-w-sm mx-auto">
          Admin desk access requires an active Admin or Developer role. Currently logged in as: <span className="font-semibold uppercase">{role}</span>.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="border border-brand-border px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider"
          >
            Go to User Dashboard
          </Link>
          <Link
            href="/auth/login"
            className="bg-brand-cta text-brand-ctaFg px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider"
          >
            Switch Role
          </Link>
        </div>
      </div>
    );
  }

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-brand-bg min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent">
                Management Desk
              </span>
              <span className="text-neutral-400">•</span>
              <span className="text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5 rounded">
                Logged in as: {role}
              </span>
              {role === "developer" && (
                <Link
                  href="/admin/manage-admins"
                  className="text-[10px] font-bold uppercase bg-brand-accent text-black px-2 py-0.5 rounded hover:bg-yellow-500 transition-colors"
                >
                  Manage Admins →
                </Link>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-fg">
              Averon Realty Admin Desk
            </h1>
          </div>

          <Link
            href="/admin/properties/new"
            className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Property</span>
          </Link>
        </div>

        {/* Action toast message */}
        {actionSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex items-center gap-4 border-b border-brand-border">
          <button
            onClick={() => setActiveTab("properties")}
            className={`pb-3 text-xs uppercase tracking-wider font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "properties"
                ? "text-brand-fg border-b-2 border-brand-accent"
                : "text-brand-muted hover:text-brand-fg"
            }`}
          >
            <Building className="w-4 h-4 text-brand-accent" />
            <span>Properties Portfolio ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`pb-3 text-xs uppercase tracking-wider font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "inquiries"
                ? "text-brand-fg border-b-2 border-brand-accent"
                : "text-brand-muted hover:text-brand-fg"
            }`}
          >
            <Mail className="w-4 h-4 text-brand-accent" />
            <span>Customer Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* Tab 1: Properties Table */}
        {activeTab === "properties" && (
          <div className="space-y-4">
            {/* Search Filter */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter table by title or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-brand-border rounded focus:border-brand-accent focus:outline-none"
                />
              </div>

              <span className="text-xs text-brand-muted">
                Showing {filteredProperties.length} listings
              </span>
            </div>

            {/* Table */}
            <div className="bg-white border border-brand-border rounded-lg overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-brand-border text-brand-muted uppercase font-bold tracking-wider text-[10px]">
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Valuation</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {filteredProperties.map((p) => {
                    const thumb =
                      p.images?.[0]?.image_url ||
                      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80";

                    return (
                      <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-10 rounded overflow-hidden bg-neutral-200 shrink-0">
                              <Image
                                src={thumb}
                                alt={p.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="max-w-xs">
                              <Link
                                href={`/properties/${p.id}`}
                                className="font-semibold text-brand-fg hover:text-brand-accent line-clamp-1"
                              >
                                {p.title}
                              </Link>
                              <span className="text-[11px] text-brand-muted truncate block">
                                {p.address}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 capitalize">
                          <span className="px-2 py-0.5 rounded border border-neutral-200 bg-neutral-50 text-[10px] font-semibold">
                            {p.listing_type} · {p.property_type}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-brand-fg">
                          {p.city_name}, {p.state_name}
                        </td>

                        <td className="py-3 px-4 font-bold text-brand-fg">
                          {formatIndianPrice(p.price, p.listing_type)}
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={p.status}
                            onChange={(e) =>
                              handleStatusChange(p.id, e.target.value as PropertyStatus)
                            }
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                              p.status === "available"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : p.status === "sold"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : p.status === "rented"
                                ? "bg-neutral-800 text-white border-neutral-700"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            <option value="available">Available</option>
                            <option value="sold">Sold</option>
                            <option value="rented">Rented</option>
                            <option value="under_negotiation">Under Negotiation</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/properties/${p.id}/edit`}
                              className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                              title="Edit listing"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/properties/${p.id}`}
                              target="_blank"
                              className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                              title="Preview live on marketplace"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDelete(p.id, p.title)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Inquiries Inbox */}
        {activeTab === "inquiries" && (
          <div className="bg-white border border-brand-border rounded-lg overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-brand-border text-brand-muted uppercase font-bold tracking-wider text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Prospect</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Target Listing</th>
                  <th className="py-3 px-4">Message / Requirements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 text-brand-muted whitespace-nowrap">
                      {new Date(inq.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-brand-fg">
                      {inq.name}
                    </td>
                    <td className="py-3 px-4 text-brand-muted">
                      <div>{inq.email}</div>
                      <div className="text-[11px] font-mono">{inq.phone || "N/A"}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-brand-fg">
                      {inq.property_title || "General Advisory"}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 max-w-md font-mono text-[11px]">
                      {inq.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
