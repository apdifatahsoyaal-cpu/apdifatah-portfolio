insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'project-images',
    'project-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  ),
  (
    'skill-icons',
    'skill-icons',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  ),
  (
    'service-icons',
    'service-icons',
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

drop policy if exists "Public can read portfolio image buckets"
  on storage.objects;
create policy "Public can read portfolio image buckets"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id in ('project-images', 'skill-icons', 'service-icons')
  );

drop policy if exists "Portfolio admins can upload portfolio images"
  on storage.objects;
create policy "Portfolio admins can upload portfolio images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('project-images', 'skill-icons', 'service-icons')
    and (auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true'
  );

drop policy if exists "Portfolio admins can update portfolio images"
  on storage.objects;
create policy "Portfolio admins can update portfolio images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('project-images', 'skill-icons', 'service-icons')
    and (auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true'
  )
  with check (
    bucket_id in ('project-images', 'skill-icons', 'service-icons')
    and (auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true'
  );

drop policy if exists "Portfolio admins can delete portfolio images"
  on storage.objects;
create policy "Portfolio admins can delete portfolio images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('project-images', 'skill-icons', 'service-icons')
    and (auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true'
  );
