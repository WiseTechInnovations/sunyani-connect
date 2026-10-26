-- Run once in your OWN Supabase SQL Editor.
-- Never add a service role key to your website. RLS applies to every table.
create extension if not exists pgcrypto;
create table if not exists public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.businesses (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null check(char_length(name) between 2 and 90),
 category text not null check(char_length(category) between 1 and 80),
 area text not null check(char_length(area) between 1 and 60),
 description text not null check(char_length(description) between 12 and 280),
 phone text default '' check(char_length(phone)<=30),
 whatsapp text default '' check(char_length(whatsapp)<=30),
 location text default '' check(char_length(location)<=150),
 website text default '' check(char_length(website)<=250),
 latitude double precision check(latitude between -90 and 90),
 longitude double precision check(longitude between -180 and 180),
 image_url text default '',
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 created_at timestamptz not null default now()
);
create index if not exists idx_businesses_status_created on public.businesses(status,created_at desc);
alter table public.admin_users enable row level security;
alter table public.businesses enable row level security;
-- Security definer prevents RLS recursion while checking admin membership.
create or replace function public.is_sunyani_admin() returns boolean language sql security definer stable set search_path = '' as $$
 select exists(select 1 from public.admin_users where user_id=(select auth.uid()));
$$;
revoke all on function public.is_sunyani_admin() from public;
grant execute on function public.is_sunyani_admin() to authenticated;
drop policy if exists admin_self_read on public.admin_users;
create policy admin_self_read on public.admin_users for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists business_public_read on public.businesses;
create policy business_public_read on public.businesses for select to anon, authenticated using (status='approved' or (select auth.uid())=owner_id or (select public.is_sunyani_admin()));
drop policy if exists business_owner_insert on public.businesses;
create policy business_owner_insert on public.businesses for insert to authenticated with check(owner_id=(select auth.uid()) and status='pending');
drop policy if exists business_admin_update on public.businesses;
create policy business_admin_update on public.businesses for update to authenticated using((select public.is_sunyani_admin())) with check((select public.is_sunyani_admin()));
-- Set your administrator only after signing up (replace email). Run in SQL Editor, NOT in front-end code:
-- insert into public.admin_users(user_id) select id from auth.users where email='YOUR_ADMIN_EMAIL@example.com' on conflict do nothing;
