import {
  Property,
  State,
  City,
  FilterParams,
  Inquiry,
  UserRole,
  AuditLog,
} from "@/types";
import { SEED_PROPERTIES, SEED_STATES, SEED_CITIES } from "./seed-data";
import { createClient } from "./supabase/client";

// In-memory runtime state for demonstration and testing when Supabase is offline
let localProperties: Property[] = [...SEED_PROPERTIES];
let localInquiries: Inquiry[] = [
  {
    id: "inq-1",
    property_id: "11111111-1111-1111-1111-111111111101",
    property_title: "The Glasshouse Sanctuary Villa",
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "+91 9845012345",
    message: "Interested in scheduling an in-person site inspection this Saturday.",
    created_at: "2026-09-20T11:30:00Z",
  },
  {
    id: "inq-2",
    property_id: "11111111-1111-1111-1111-111111111103",
    property_title: "The Meridian Sky Penthouse",
    name: "Pooja Hegde",
    email: "pooja.h@example.com",
    phone: "+91 9980123456",
    message: "Requesting lease terms for 2-year corporate agreement.",
    created_at: "2026-09-24T14:15:00Z",
  },
];

let localRoles: UserRole[] = [
  {
    id: "role-1",
    user_id: "dev-001",
    role: "developer",
    user_email: "dev@averonrealty.com",
    granted_at: "2026-01-01T00:00:00Z",
    revoked_at: null,
  },
  {
    id: "role-2",
    user_id: "admin-001",
    role: "admin",
    user_email: "propertys.bengaluru@gmail.com",
    granted_at: "2026-01-02T00:00:00Z",
    revoked_at: null,
  },
  {
    id: "role-3",
    user_id: "user-test-001",
    role: "user",
    user_email: "client@example.com",
    granted_at: "2026-09-15T09:00:00Z",
    revoked_at: null,
  },
];

let localAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    actor_id: "dev-001",
    actor_email: "dev@averonrealty.com",
    action: "GRANT_ROLE",
    target_table: "user_roles",
    target_id: "role-2",
    details: { role: "admin", user: "propertys.bengaluru@gmail.com" },
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "log-2",
    actor_id: "admin-001",
    actor_email: "propertys.bengaluru@gmail.com",
    action: "CREATE_PROPERTY",
    target_table: "properties",
    target_id: "11111111-1111-1111-1111-111111111101",
    details: { title: "The Glasshouse Sanctuary Villa", price: 68000000 },
    created_at: "2026-08-10T10:00:00Z",
  },
];

// Local favorites storage key
const FAVORITES_KEY = "averon_user_favorites";

export const DataService = {
  async getStates(): Promise<State[]> {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("states").select("*").order("name");
      if (!error && data && data.length > 0) return data;
    }
    return SEED_STATES;
  },

  async getCities(stateId?: number): Promise<City[]> {
    const supabase = createClient();
    if (supabase) {
      let query = supabase.from("cities").select("*").order("name");
      if (stateId) query = query.eq("state_id", stateId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    }
    if (stateId) {
      return SEED_CITIES.filter((c) => c.state_id === stateId);
    }
    return SEED_CITIES;
  },

  async getProperties(filters?: FilterParams): Promise<Property[]> {
    const supabase = createClient();

    if (supabase) {
      let query = supabase.from("properties").select(`
        *,
        cities (name),
        states (name),
        property_images (id, image_url, is_primary, sort_order),
        property_amenities (amenity)
      `);

      if (!filters?.show_sold_rented) {
        query = query.eq("status", "available");
      }
      if (filters?.listing_type && filters.listing_type !== "all") {
        query = query.eq("listing_type", filters.listing_type);
      }
      if (filters?.property_types && filters.property_types.length > 0) {
        query = query.in("property_type", filters.property_types);
      }
      if (filters?.state_id) {
        query = query.eq("state_id", filters.state_id);
      }
      if (filters?.city_id) {
        query = query.eq("city_id", filters.city_id);
      }
      if (filters?.min_price) {
        query = query.gte("price", filters.min_price);
      }
      if (filters?.max_price) {
        query = query.lte("price", filters.max_price);
      }
      if (filters?.min_area) {
        query = query.gte("area_sqft", filters.min_area);
      }
      if (filters?.max_area) {
        query = query.lte("area_sqft", filters.max_area);
      }

      if (filters?.sort === "price_asc") {
        query = query.order("price", { ascending: true });
      } else if (filters?.sort === "price_desc") {
        query = query.order("price", { ascending: false });
      } else if (filters?.sort === "featured") {
        query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          city_name: item.cities?.name,
          state_name: item.states?.name,
          images: item.property_images?.sort((a: any, b: any) => a.sort_order - b.sort_order),
          amenities: item.property_amenities?.map((a: any) => a.amenity),
        }));
      }
    }

    // High performance in-memory filter matching all requirements
    let results = [...localProperties];

    // Status filter (§8.1: Main grid defaults to status = available only)
    if (!filters?.show_sold_rented) {
      results = results.filter((p) => p.status === "available");
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.city_name?.toLowerCase().includes(q) ||
          p.state_name?.toLowerCase().includes(q)
      );
    }

    if (filters?.listing_type && filters.listing_type !== "all") {
      results = results.filter((p) => p.listing_type === filters.listing_type);
    }

    if (filters?.property_types && filters.property_types.length > 0) {
      results = results.filter((p) => filters.property_types!.includes(p.property_type));
    }

    if (filters?.state_id) {
      results = results.filter((p) => p.state_id === Number(filters.state_id));
    }

    if (filters?.city_id) {
      results = results.filter((p) => p.city_id === Number(filters.city_id));
    }

    if (filters?.min_price) {
      results = results.filter((p) => p.price >= Number(filters.min_price));
    }

    if (filters?.max_price) {
      results = results.filter((p) => p.price <= Number(filters.max_price));
    }

    if (filters?.bedrooms && filters.bedrooms !== "any") {
      if (filters.bedrooms === "4+") {
        results = results.filter((p) => (p.bedrooms || 0) >= 4);
      } else {
        const beds = parseInt(filters.bedrooms, 10);
        results = results.filter((p) => p.bedrooms === beds);
      }
    }

    if (filters?.min_area) {
      results = results.filter((p) => (p.area_sqft || 0) >= Number(filters.min_area));
    }

    if (filters?.max_area) {
      results = results.filter((p) => (p.area_sqft || 0) <= Number(filters.max_area));
    }

    // Sorting
    if (filters?.sort === "price_asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (filters?.sort === "price_desc") {
      results.sort((a, b) => b.price - a.price);
    } else if (filters?.sort === "featured") {
      results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      // Newest
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return results;
  },

  async getPropertyById(id: string): Promise<Property | null> {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          cities (name),
          states (name),
          property_images (id, image_url, is_primary, sort_order),
          property_amenities (amenity)
        `)
        .eq("id", id)
        .single();

      if (!error && data) {
        return {
          ...data,
          city_name: data.cities?.name,
          state_name: data.states?.name,
          images: data.property_images?.sort((a: any, b: any) => a.sort_order - b.sort_order),
          amenities: data.property_amenities?.map((a: any) => a.amenity),
        };
      }
    }

    const found = localProperties.find((p) => p.id === id);
    return found || null;
  },

  async getFeaturedProperties(): Promise<Property[]> {
    const properties = await this.getProperties({ show_sold_rented: false });
    return properties.filter((p) => p.featured);
  },

  async getRecentlySoldOrRented(): Promise<Property[]> {
    // Section 8.1: Dedicated Sold/Rented section
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          cities (name),
          states (name),
          property_images (id, image_url, is_primary, sort_order)
        `)
        .in("status", ["sold", "rented"])
        .order("updated_at", { ascending: false })
        .limit(6);

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          city_name: item.cities?.name,
          state_name: item.states?.name,
          images: item.property_images?.sort((a: any, b: any) => a.sort_order - b.sort_order),
        }));
      }
    }

    return localProperties.filter((p) => p.status === "sold" || p.status === "rented");
  },

  // Inquiries
  async submitInquiry(inquiry: {
    property_id?: string | null;
    property_title?: string;
    name: string;
    email: string;
    phone?: string | null;
    message: string;
  }): Promise<{ success: boolean; id?: string }> {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("inquiries")
        .insert({
          property_id: inquiry.property_id || null,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          message: inquiry.message,
        })
        .select()
        .single();

      if (!error && data) {
        return { success: true, id: data.id };
      }
    }

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      property_id: inquiry.property_id || null,
      property_title: inquiry.property_title,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      created_at: new Date().toISOString(),
    };

    localInquiries = [newInquiry, ...localInquiries];
    return { success: true, id: newInquiry.id };
  },

  async getInquiries(): Promise<Inquiry[]> {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("inquiries")
        .select(`
          *,
          properties (title)
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((i: any) => ({
          ...i,
          property_title: i.properties?.title || "General Inquiry",
        }));
      }
    }
    return localInquiries;
  },

  // Favorites
  getFavorites(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : ["11111111-1111-1111-1111-111111111101"];
    } catch {
      return [];
    }
  },

  toggleFavorite(propertyId: string): boolean {
    if (typeof window === "undefined") return false;
    const current = this.getFavorites();
    const index = current.indexOf(propertyId);
    let updated: string[];
    let isFav = false;

    if (index >= 0) {
      updated = current.filter((id) => id !== propertyId);
      isFav = false;
    } else {
      updated = [...current, propertyId];
      isFav = true;
    }

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return isFav;
  },

  isFavorite(propertyId: string): boolean {
    return this.getFavorites().includes(propertyId);
  },

  // Admin / Developer features
  async createProperty(property: Partial<Property>): Promise<{ success: boolean; data?: Property; error?: string }> {
    const supabase = createClient();
    if (supabase) {
      const { data: { user: actor } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("properties")
        .insert({
          title: property.title || "Untitled Property",
          description: property.description || "",
          property_type: property.property_type || "apartment",
          listing_type: property.listing_type || "sale",
          price: property.price || 0,
          price_unit: "INR",
          bedrooms: property.bedrooms ?? 2,
          bathrooms: property.bathrooms ?? 2,
          area_sqft: property.area_sqft ?? 1200,
          address: property.address || "",
          city_id: property.city_id || null,
          state_id: property.state_id || null,
          latitude: property.latitude || null,
          longitude: property.longitude || null,
          status: property.status || "available",
          featured: property.featured || false,
          created_by: actor?.id,
          last_edited_by: actor?.id,
        })
        .select()
        .single();

      if (error) return { success: false, error: error.message };

      // Insert images
      if (property.images && property.images.length > 0) {
        await supabase.from("property_images").insert(
          property.images.map((img, i) => ({
            property_id: data.id,
            image_url: img.image_url,
            is_primary: i === 0,
            sort_order: i + 1,
          }))
        );
      }

      // Insert amenities
      if (property.amenities && property.amenities.length > 0) {
        await supabase.from("property_amenities").insert(
          property.amenities.map((a) => ({ property_id: data.id, amenity: a }))
        );
      }

      // Audit log
      await supabase.from("audit_log").insert({
        actor_id: actor?.id,
        action: "CREATE_PROPERTY",
        target_table: "properties",
        target_id: data.id,
        details: { title: data.title, price: data.price },
      });

      return { success: true, data };
    }

    // Local fallback
    const newId = `prop-${Date.now()}`;
    const city = SEED_CITIES.find((c) => c.id === property.city_id);
    const state = SEED_STATES.find((s) => s.id === property.state_id);
    const fullProp: Property = {
      id: newId,
      title: property.title || "Untitled Property",
      description: property.description || "",
      property_type: property.property_type || "apartment",
      listing_type: property.listing_type || "sale",
      price: property.price || 0,
      price_unit: "INR",
      bedrooms: property.bedrooms ?? 2,
      bathrooms: property.bathrooms ?? 2,
      area_sqft: property.area_sqft ?? 1200,
      address: property.address || "",
      city_id: property.city_id || 1,
      state_id: property.state_id || 1,
      city_name: city?.name || "Bengaluru",
      state_name: state?.name || "Karnataka",
      latitude: property.latitude || 12.9716,
      longitude: property.longitude || 77.5946,
      status: property.status || "available",
      featured: property.featured || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: property.images && property.images.length > 0 ? property.images : [{ id: `img-${Date.now()}`, property_id: newId, image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80", is_primary: true, sort_order: 1 }],
      amenities: property.amenities || ["24/7 Security", "Covered Parking"],
    };
    localProperties = [fullProp, ...localProperties];
    localAuditLogs.unshift({ id: `log-${Date.now()}`, actor_id: "local", actor_email: "local", action: "CREATE_PROPERTY", target_table: "properties", target_id: newId, details: { title: fullProp.title, price: fullProp.price }, created_at: new Date().toISOString() });
    return { success: true, data: fullProp };
  },

  async updateProperty(id: string, property: Partial<Property>): Promise<{ success: boolean; data?: Property; error?: string }> {
    const supabase = createClient();
    if (supabase) {
      const { data: { user: actor } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("properties")
        .update({
          ...property,
          last_edited_by: actor?.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) return { success: false, error: error.message };

      // Delete-then-reinsert amenities & images for MVP simplicity
      if (property.amenities !== undefined) {
        await supabase.from("property_amenities").delete().eq("property_id", id);
        if (property.amenities.length > 0) {
          await supabase.from("property_amenities").insert(
            property.amenities.map((a) => ({ property_id: id, amenity: a }))
          );
        }
      }

      if (property.images !== undefined) {
        await supabase.from("property_images").delete().eq("property_id", id);
        if (property.images.length > 0) {
          await supabase.from("property_images").insert(
            property.images.map((img, i) => ({
              property_id: id,
              image_url: img.image_url,
              is_primary: i === 0,
              sort_order: i + 1,
            }))
          );
        }
      }

      await supabase.from("audit_log").insert({
        actor_id: actor?.id,
        action: "UPDATE_PROPERTY",
        target_table: "properties",
        target_id: id,
        details: { updated_fields: Object.keys(property) },
      });

      return { success: true, data };
    }

    // Local fallback
    const idx = localProperties.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, error: "Property not found" };
    const updated = { ...localProperties[idx], ...property, updated_at: new Date().toISOString() };
    localProperties[idx] = updated;
    localAuditLogs.unshift({ id: `log-${Date.now()}`, actor_id: "local", actor_email: "local", action: "UPDATE_PROPERTY", target_table: "properties", target_id: id, details: { updated_fields: Object.keys(property) }, created_at: new Date().toISOString() });
    return { success: true, data: updated };
  },

  async deleteProperty(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    if (supabase) {
      const { data: { user: actor } } = await supabase.auth.getUser();

      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) return { success: false, error: error.message };

      await supabase.from("audit_log").insert({
        actor_id: actor?.id,
        action: "DELETE_PROPERTY",
        target_table: "properties",
        target_id: id,
        details: { deleted_property_id: id },
      });

      return { success: true };
    }

    // Local fallback
    localProperties = localProperties.filter((p) => p.id !== id);
    localAuditLogs.unshift({ id: `log-${Date.now()}`, actor_id: "local", actor_email: "local", action: "DELETE_PROPERTY", target_table: "properties", target_id: id, details: { deleted_property_id: id }, created_at: new Date().toISOString() });
    return { success: true };
  },

  // Roles & Admin Management
  async getUserRoles(): Promise<UserRole[]> {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("user_roles_view")
        .select("*")
        .order("granted_at", { ascending: false });
      if (!error && data) return data as UserRole[];
    }
    return localRoles;
  },

  async grantUserRole(_userId: string, email: string, role: "admin" | "user"): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    if (supabase) {
      // Look up the user id from email via secure RPC
      const { data: lookupData, error: lookupError } = await supabase
        .rpc("get_user_id_by_email", { lookup_email: email });
      if (lookupError || !lookupData) {
        return { success: false, error: "No account found with that email address." };
      }
      const { data: { user: actor } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("user_roles")
        .insert({ user_id: lookupData, role, granted_by: actor?.id })
        .select()
        .single();

      if (error) return { success: false, error: error.message };

      // Audit log
      await supabase.from("audit_log").insert({
        actor_id: actor?.id,
        action: "GRANT_ROLE",
        target_table: "user_roles",
        target_id: data.id,
        details: { role, email },
      });

      return { success: true };
    }

    // Local fallback
    const existing = localRoles.find((r) => r.user_email === email);
    if (existing) {
      existing.role = role;
      existing.revoked_at = null;
      existing.granted_at = new Date().toISOString();
    } else {
      localRoles = [...localRoles, {
        id: `role-${Date.now()}`,
        user_id: `user-${Date.now()}`,
        user_email: email,
        role,
        granted_at: new Date().toISOString(),
        revoked_at: null,
      }];
    }
    localAuditLogs.unshift({ id: `log-${Date.now()}`, actor_id: "dev-001", actor_email: "dev@averonrealty.com", action: "GRANT_ROLE", target_table: "user_roles", target_id: email, details: { role, email }, created_at: new Date().toISOString() });
    return { success: true };
  },

  async revokeUserRole(roleId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    if (supabase) {
      const { data: { user: actor } } = await supabase.auth.getUser();

      // Get email before revoking for audit log
      const { data: roleRow } = await supabase.from("user_roles").select("user_id").eq("id", roleId).single();

      const { error } = await supabase
        .from("user_roles")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", roleId);

      if (error) return { success: false, error: error.message };

      await supabase.from("audit_log").insert({
        actor_id: actor?.id,
        action: "REVOKE_ROLE",
        target_table: "user_roles",
        target_id: roleId,
        details: { revoked_user_id: roleRow?.user_id },
      });

      return { success: true };
    }

    // Local fallback
    const roleObj = localRoles.find((r) => r.id === roleId);
    if (roleObj) {
      roleObj.revoked_at = new Date().toISOString();
      localAuditLogs.unshift({ id: `log-${Date.now()}`, actor_id: "dev-001", actor_email: "dev@averonrealty.com", action: "REVOKE_ROLE", target_table: "user_roles", target_id: roleId, details: { revoked_role_for: roleObj.user_email }, created_at: new Date().toISOString() });
    }
    return { success: true };
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as AuditLog[];
    }
    return localAuditLogs;
  },
};
