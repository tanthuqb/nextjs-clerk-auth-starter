-- 002_clerk_rls_policies.sql
--
-- Replace the permissive `USING (true)` policies from 001 with policies that scope
-- every row to the signed-in Clerk user, using Clerk as a Supabase third-party
-- auth provider. The Clerk user ID is the `sub` claim of the Clerk session token.
--
-- PREREQUISITES (do these BEFORE applying this migration, or the app will stop
-- being able to read/write profiles):
--   1. Clerk Dashboard -> Integrations -> Supabase -> "Activate Supabase integration"
--      (adds the `role: authenticated` claim to Clerk session tokens) and copy the
--      Clerk domain.
--   2. Supabase Dashboard -> Authentication -> Sign In / Providers -> Third-party auth
--      -> Add provider -> Clerk -> paste the Clerk domain.
--   3. Set SUPABASE_CLERK_AUTH=true in the app environment and redeploy, so Supabase
--      requests carry the Clerk session token (see src/lib/supabase.ts).
--
-- Docs:
--   https://clerk.com/docs/guides/development/integrations/databases/supabase
--   https://supabase.com/docs/guides/auth/third-party/clerk

begin;

-- 1. Remove the old permissive policies ------------------------------------------
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can delete own profile" on public.profiles;

-- 2. Default the owner column to the caller's Clerk user ID ---------------------
alter table public.profiles
  alter column clerk_user_id set default (auth.jwt() ->> 'sub');

-- 3. Make sure RLS is on --------------------------------------------------------
alter table public.profiles enable row level security;

-- 4. Anonymous (signed-out) requests get no access at all -----------------------
revoke all on table public.profiles from anon;
grant select, insert, update, delete on table public.profiles to authenticated;

-- 5. Owner-only policies for signed-in Clerk users ------------------------------
-- `(select auth.jwt() ->> 'sub')` is wrapped in a sub-select so Postgres evaluates it
-- once per statement instead of once per row.
create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.jwt() ->> 'sub') = clerk_user_id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.jwt() ->> 'sub') = clerk_user_id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.jwt() ->> 'sub') = clerk_user_id)
  with check ((select auth.jwt() ->> 'sub') = clerk_user_id);

create policy "Users can delete own profile"
  on public.profiles
  for delete
  to authenticated
  using ((select auth.jwt() ->> 'sub') = clerk_user_id);

-- 6. Harden the updated_at trigger function (fixes the "function_search_path_mutable"
--    security advisor warning).
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

commit;
