-- Keep the existing anonymous INSERT grant and policy unchanged.
revoke select, update, delete on table public.contact_messages from anon;
revoke insert, update, delete on table public.contact_messages from authenticated;

grant select, delete on table public.contact_messages to authenticated;
grant update (status) on table public.contact_messages to authenticated;

drop policy if exists "Portfolio admins can read contact messages"
  on public.contact_messages;
create policy "Portfolio admins can read contact messages"
  on public.contact_messages for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true');

drop policy if exists "Portfolio admins can update contact message status"
  on public.contact_messages;
create policy "Portfolio admins can update contact message status"
  on public.contact_messages for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true')
  with check ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true');

drop policy if exists "Portfolio admins can delete contact messages"
  on public.contact_messages;
create policy "Portfolio admins can delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'portfolio_admin') = 'true');
