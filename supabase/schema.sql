-- ========================================================
-- Averon Realty Database Schema
-- Supabase / PostgreSQL Schema with Row Level Security (RLS)
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. User Roles Table
create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('developer','admin','user')) not null default 'user',
  granted_by uuid references auth.users(id),
  granted_at timestamptz default now(),
  revoked_at timestamptz
);

-- 2. States Table
create table if not exists states (
  id serial primary key,
  name text unique not null
);

-- 3. Cities Table
create table if not exists cities (
  id serial primary key,
  name text not null,
  state_id int references states(id) on delete cascade
);

-- 4. Properties Table
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  property_type text check (property_type in ('apartment','villa','plot','commercial','office','shop')) not null,
  listing_type text check (listing_type in ('sale','rent')) not null,
  price numeric not null,
  price_unit text default 'INR',
  bedrooms int,
  bathrooms int,
  area_sqft numeric,
  address text,
  city_id int references cities(id),
  state_id int references states(id),
  latitude numeric,
  longitude numeric,
  status text check (status in ('available','sold','rented','under_negotiation')) default 'available',
  featured boolean default false,
  created_by uuid references auth.users(id),
  last_edited_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Property Images Table
create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  image_url text not null,
  is_primary boolean default false,
  sort_order int default 0
);

-- 6. Property Amenities Table
create table if not exists property_amenities (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  amenity text not null
);

-- 7. Inquiries Table
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete set null,
  name text not null,
  email text,
  phone text,
  message text,
  created_at timestamptz default now(),
  constraint inquiries_phone_format check (phone ~ '^[0-9]{10}$')
);

-- 8. Favorites Table
create table if not exists favorites (
  user_id uuid references auth.users(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  primary key (user_id, property_id)
);

-- 9. Audit Log Table
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text,
  target_id text,
  details jsonb,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_properties_city on properties(city_id);
create index if not exists idx_properties_state on properties(state_id);
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_properties_listing_type on properties(listing_type);
create index if not exists idx_properties_property_type on properties(property_type);
create index if not exists idx_properties_price on properties(price);
create index if not exists idx_property_images_prop on property_images(property_id);
create index if not exists idx_property_amenities_prop on property_amenities(property_id);
create index if not exists idx_user_roles_user on user_roles(user_id);

-- ========================================================
-- Security Helpers & Functions
-- ========================================================

create or replace function is_admin_or_dev(uid uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from user_roles
    where user_roles.user_id = uid
      and role in ('admin', 'developer')
      and revoked_at is null
  );
$$;

create or replace function is_developer(uid uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from user_roles
    where user_roles.user_id = uid
      and role = 'developer'
      and revoked_at is null
  );
$$;

-- Auto update updated_at on properties
create or replace function update_modified_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_properties_updated_at
before update on properties
for each row
execute procedure update_modified_column();

-- ========================================================
-- Row Level Security (RLS) Policies
-- ========================================================

alter table states enable row level security;
alter table cities enable row level security;
alter table properties enable row level security;
alter table property_images enable row level security;
alter table property_amenities enable row level security;
alter table user_roles enable row level security;
alter table inquiries enable row level security;
alter table favorites enable row level security;
alter table audit_log enable row level security;

-- States & Cities: Public read, admin write
create policy "States are viewable by everyone" on states for select using (true);
create policy "Cities are viewable by everyone" on cities for select using (true);

-- Properties: Public read; admin/developer write
create policy "Properties are viewable by everyone" on properties
  for select using (true);

create policy "Admins and developers can insert properties" on properties
  for insert with check (is_admin_or_dev(auth.uid()));

create policy "Admins and developers can update properties" on properties
  for update using (is_admin_or_dev(auth.uid()));

create policy "Admins and developers can delete properties" on properties
  for delete using (is_admin_or_dev(auth.uid()));

-- Property Images: Public read; admin/developer write
create policy "Property images viewable by everyone" on property_images
  for select using (true);

create policy "Admins/devs insert images" on property_images
  for insert with check (is_admin_or_dev(auth.uid()));

create policy "Admins/devs update images" on property_images
  for update using (is_admin_or_dev(auth.uid()));

create policy "Admins/devs delete images" on property_images
  for delete using (is_admin_or_dev(auth.uid()));

-- Property Amenities: Public read; admin/developer write
create policy "Property amenities viewable by everyone" on property_amenities
  for select using (true);

create policy "Admins/devs insert amenities" on property_amenities
  for insert with check (is_admin_or_dev(auth.uid()));

create policy "Admins/devs update amenities" on property_amenities
  for update using (is_admin_or_dev(auth.uid()));

create policy "Admins/devs delete amenities" on property_amenities
  for delete using (is_admin_or_dev(auth.uid()));

-- User Roles: View own role or admins view all; Developer inserts/updates
create policy "Users can view their own role or admins can view all" on user_roles
  for select using (auth.uid() = user_id or is_admin_or_dev(auth.uid()));

create policy "Only developers can insert user roles" on user_roles
  for insert with check (is_developer(auth.uid()));

create policy "Only developers can update user roles" on user_roles
  for update using (is_developer(auth.uid()));

-- Inquiries: Public can insert; Admin/Developer can select
create policy "Anyone can submit an inquiry" on inquiries
  for insert with check (true);

create policy "Only admins and developers can view inquiries" on inquiries
  for select using (is_admin_or_dev(auth.uid()));

-- Favorites: Authenticated users manage their own
create policy "Users can view their own favorites" on favorites
  for select using (auth.uid() = user_id);

create policy "Users can add their own favorites" on favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own favorites" on favorites
  for delete using (auth.uid() = user_id);

-- Audit Log: Admin/Developer select
create policy "Admins and developers can view audit log" on audit_log
  for select using (is_admin_or_dev(auth.uid()));

create policy "Admins and developers can create audit log entries" on audit_log
  for insert with check (is_admin_or_dev(auth.uid()));
