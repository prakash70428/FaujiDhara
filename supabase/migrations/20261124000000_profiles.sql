-- Phase 3: user profiles and roles.
--
-- Supabase Auth keeps login data (phone, sessions) in auth.users.
-- Our app data about a person lives here, in public.profiles, one row per user.
--
-- Run once: Supabase Dashboard → SQL Editor → paste this file → Run.
-- (Or with the Supabase CLI: `supabase db push`.)

-- ─────────────────────────────── Types ───────────────────────────────

create type public.user_role as enum ('FAUJI', 'KISAN', 'ADMIN');

-- ─────────────────────────────── Table ───────────────────────────────

create table public.profiles (
  -- Same id as the login user; deleting the login deletes the profile too.
  id          uuid primary key references auth.users (id) on delete cascade,
  role        public.user_role not null,
  full_name   text not null check (char_length(btrim(full_name)) between 2 and 60),
  -- Matches the state ids used in the app's Fasal Calendar (e.g. 'andhra-pradesh').
  state_id    text not null check (state_id ~ '^[a-z-]{2,40}$'),
  district    text not null check (char_length(btrim(district)) between 2 and 60),
  -- Set only by an admin (Phase 8: Fauji document verification).
  is_verified boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'One row per app user: role, name and location.';

-- Phase 5 listings will be filtered by location, so index it now.
create index profiles_state_district_idx on public.profiles (state_id, district);

-- ─────────────────────────────── Helpers ─────────────────────────────

-- True when the logged-in user is an admin. SECURITY DEFINER lets it read
-- profiles without going through RLS (otherwise policies calling it would loop).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'ADMIN'
  );
$$;

-- Keeps updated_at correct and stops users from giving themselves power.
-- A normal user may NOT: become ADMIN, change role after signup, or mark themselves verified.
create or replace function public.profiles_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();

  -- Dashboard / service-role / admin changes are trusted.
  if (select auth.uid()) is null or public.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.role = 'ADMIN' then
      raise exception 'Role ADMIN cannot be self-assigned' using errcode = '42501';
    end if;
    new.is_verified := false;
    new.created_at := now();
  else
    if new.role is distinct from old.role then
      raise exception 'Role cannot be changed after signup' using errcode = '42501';
    end if;
    new.is_verified := old.is_verified;
    new.created_at := old.created_at;
  end if;

  return new;
end;
$$;

create trigger profiles_guard
before insert or update on public.profiles
for each row execute function public.profiles_guard();

-- ─────────────────────────── Row Level Security ──────────────────────
-- With RLS on, every query is checked against these rules inside the database.
-- Even if someone copies the app's public key, they can only do what is allowed here.

alter table public.profiles enable row level security;

-- Logged-in users can see profiles (names on posts and listings in Phases 4-5).
create policy "profiles: logged-in users can read"
on public.profiles for select
to authenticated
using (true);

-- You can create only your own profile.
create policy "profiles: insert own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

-- You can edit only your own profile; admins can edit anyone's.
create policy "profiles: update own or admin"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id or public.is_admin())
with check ((select auth.uid()) = id or public.is_admin());

-- No delete policy: deleting the account (auth user) removes the profile via cascade.
