-- Rewrite the owner-only policies from 002 so the Supabase linter recognises the
-- auth.jwt() call as a per-statement initplan (`(select auth.jwt()) ->> 'sub'`),
-- and drop table privileges the app never needs.

begin;

alter policy "Users can view own profile" on public.profiles
  using (((select auth.jwt()) ->> 'sub') = clerk_user_id);

alter policy "Users can insert own profile" on public.profiles
  with check (((select auth.jwt()) ->> 'sub') = clerk_user_id);

alter policy "Users can update own profile" on public.profiles
  using (((select auth.jwt()) ->> 'sub') = clerk_user_id)
  with check (((select auth.jwt()) ->> 'sub') = clerk_user_id);

alter policy "Users can delete own profile" on public.profiles
  using (((select auth.jwt()) ->> 'sub') = clerk_user_id);

-- TRUNCATE ignores RLS; REFERENCES and TRIGGER are not used by the app.
revoke truncate, references, trigger on table public.profiles from authenticated;

-- The UNIQUE constraint on clerk_user_id already provides an index.
drop index if exists public.idx_profiles_clerk_user_id;

commit;
