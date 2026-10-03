-- Only users with this trusted app_metadata claim can manage public content:
-- auth.jwt() -> 'app_metadata' ->> 'portfolio_admin' = 'true'.
-- Provision the claim from a trusted Supabase Dashboard or SQL session.
revoke insert, update, delete on table
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

grant insert, update, delete on table
  public.projects,
  public.skills,
  public.services,
  public.social_links
to authenticated;

drop policy if exists "Portfolio admins can manage projects" on public.projects;
create policy "Portfolio admins can manage projects"
  on public.projects for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true')
  with check ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true');

drop policy if exists "Portfolio admins can manage skills" on public.skills;
create policy "Portfolio admins can manage skills"
  on public.skills for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true')
  with check ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true');

drop policy if exists "Portfolio admins can manage services" on public.services;
create policy "Portfolio admins can manage services"
  on public.services for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true')
  with check ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true');

drop policy if exists "Portfolio admins can manage social links" on public.social_links;
create policy "Portfolio admins can manage social links"
  on public.social_links for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true')
  with check ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true');
