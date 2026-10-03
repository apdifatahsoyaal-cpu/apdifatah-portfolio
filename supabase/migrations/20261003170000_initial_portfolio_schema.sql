create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  image_url text,
  github_url text,
  live_url text,
  technologies text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null
    check (category in ('Frontend', 'Backend', 'Database', 'AI', 'Tools')),
  icon text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  icon text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now(),
  constraint contact_messages_name_not_blank check (length(btrim(name)) > 0),
  constraint contact_messages_message_not_blank check (length(btrim(message)) > 0)
);

create index if not exists projects_featured_created_at_idx
  on public.projects (featured desc, created_at desc);
create index if not exists skills_category_display_order_idx
  on public.skills (category, display_order);
create index if not exists services_display_order_idx
  on public.services (display_order);
create index if not exists social_links_display_order_idx
  on public.social_links (display_order);
create index if not exists contact_messages_status_created_at_idx
  on public.contact_messages (status, created_at desc);

alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.services enable row level security;
alter table public.social_links enable row level security;
alter table public.contact_messages enable row level security;

revoke all privileges on table
  public.projects,
  public.skills,
  public.services,
  public.social_links
from anon, authenticated;

grant select on table
  public.projects,
  public.skills,
  public.services,
  public.social_links
to anon, authenticated;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read skills" on public.skills;
create policy "Public can read skills"
  on public.skills for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read services" on public.services;
create policy "Public can read services"
  on public.services for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read social links" on public.social_links;
create policy "Public can read social links"
  on public.social_links for select
  to anon, authenticated
  using (true);

revoke all privileges on table public.contact_messages from anon, authenticated;
grant insert (name, email, phone, subject, message)
  on table public.contact_messages to anon;

drop policy if exists "Public can submit new contact messages"
  on public.contact_messages;
create policy "Public can submit new contact messages"
  on public.contact_messages for insert
  to anon
  with check (
    status = 'new'
    and length(btrim(name)) > 0
    and length(btrim(message)) > 0
  );
