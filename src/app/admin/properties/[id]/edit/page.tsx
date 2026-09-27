"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Property } from "@/types";
import { DataService } from "@/lib/data-service";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default function EditPropertyPage() {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    DataService.getPropertyById(id).then((p) => {
      setProperty(p);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center text-xs text-brand-muted">
        Loading property data...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-3">
        <h2 className="text-xl font-bold">Listing not found</h2>
      </div>
    );
  }

  return <PropertyForm initialData={property} isEdit={true} />;
}
