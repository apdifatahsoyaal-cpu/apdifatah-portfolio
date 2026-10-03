insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio media" on storage.objects;
create policy "Public can view portfolio media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio-media');

drop policy if exists "Portfolio admins can upload media" on storage.objects;
create policy "Portfolio admins can upload media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and (auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true'
  );

drop policy if exists "Portfolio admins can update media" on storage.objects;
create policy "Portfolio admins can update media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true'
  )
  with check (
    bucket_id = 'portfolio-media'
    and (auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true'
  );

drop policy if exists "Portfolio admins can delete media" on storage.objects;
create policy "Portfolio admins can delete media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true'
  );
