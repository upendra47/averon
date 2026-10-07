-- 1. Price field changes
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_value numeric;
UPDATE properties SET price_value = price;
ALTER TABLE properties ALTER COLUMN price TYPE text USING price::text;

-- 2. Images JSONB column
ALTER TABLE properties ADD COLUMN IF NOT EXISTS images jsonb not null default '[]'::jsonb;

-- 3. Backfill images from property_images table
UPDATE properties p
SET images = (
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'url', image_url,
        'source', 'upload',
        'storage_path', null,
        'is_primary', is_primary
      ) ORDER BY sort_order
    ),
    '[]'::jsonb
  )
  FROM property_images pi
  WHERE pi.property_id = p.id
)
WHERE EXISTS (SELECT 1 FROM property_images pi WHERE pi.property_id = p.id);

UPDATE properties SET images = '[]'::jsonb WHERE images IS NULL;

-- 4. Storage Bucket for property-images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  5242880, -- 5MB limit
  '{"image/jpeg","image/png","image/webp"}'
) on conflict (id) do nothing;

-- 5. Storage RLS Policies
create policy "Public SELECT on property-images"
  on storage.objects for select
  using ( bucket_id = 'property-images' );

create policy "Admins/Developers INSERT on property-images"
  on storage.objects for insert
  with check (
    bucket_id = 'property-images' and
    (auth.uid() = owner) and
    (public.is_admin_or_dev(auth.uid()))
  );

create policy "Admins/Developers UPDATE on property-images"
  on storage.objects for update
  using (
    bucket_id = 'property-images' and
    (auth.uid() = owner) and
    (public.is_admin_or_dev(auth.uid()))
  );

create policy "Admins/Developers DELETE on property-images"
  on storage.objects for delete
  using (
    bucket_id = 'property-images' and
    (auth.uid() = owner) and
    (public.is_admin_or_dev(auth.uid()))
  );
