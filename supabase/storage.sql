-- ============================================================
-- Supabase Storage — Product Images Bucket
-- Run in Supabase SQL Editor
-- ============================================================

-- Create the bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  array['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;

-- Allow authenticated users to upload
create policy "Authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

-- Allow authenticated users to update/delete
create policy "Authenticated users can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "Authenticated users can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- Public read access
create policy "Public can view product images"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');
