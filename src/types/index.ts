export type RoleType = 'developer' | 'admin' | 'user';

export type PropertyType =
  | 'apartment'
  | 'villa'
  | 'plot'
  | 'commercial'
  | 'office'
  | 'shop';

export type ListingType = 'sale' | 'rent';

export type PropertyStatus =
  | 'available'
  | 'sold'
  | 'rented'
  | 'under_negotiation';

export interface State {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface PropertyAmenity {
  id: string;
  property_id: string;
  amenity: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  property_type: PropertyType;
  listing_type: ListingType;
  price: number;
  price_unit: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_sqft?: number | null;
  address: string;
  city_id: number;
  state_id: number;
  city_name?: string;
  state_name?: string;
  latitude?: number | null;
  longitude?: number | null;
  status: PropertyStatus;
  featured: boolean;
  created_by?: string | null;
  last_edited_by?: string | null;
  created_at: string;
  updated_at: string;
  images?: PropertyImage[];
  amenities?: string[];
}

export interface UserRole {
  id: string;
  user_id: string;
  role: RoleType;
  granted_by?: string | null;
  granted_at: string;
  revoked_at?: string | null;
  user_email?: string;
}

export interface Inquiry {
  id: string;
  property_id?: string | null;
  property_title?: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string | null;
  actor_email?: string;
  action: string;
  target_table?: string | null;
  target_id?: string | null;
  details?: Record<string, any> | null;
  created_at: string;
}

export interface FilterParams {
  search?: string;
  listing_type?: ListingType | 'all';
  property_types?: PropertyType[];
  state_id?: number;
  city_id?: number;
  min_price?: number;
  max_price?: number;
  bedrooms?: string; // '1' | '2' | '3' | '4+' | 'any'
  min_area?: number;
  max_area?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'featured';
  show_sold_rented?: boolean;
}
