
--MASTER SCHEMA: RUN THIS ENTIRE SCRIPT TO SETUP THE FULL DATABASE
-- This version handles existing objects and permissions safely.

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. PROFILES Table (Unified for Users & Vendors)
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  role text check (role in ('free', 'pro')) default 'free',
  
  -- Pro-specific fields (Contractors/Vendors)
  business_name text,
  category text, -- e.g., 'Logistics', 'Catering'
  pricing_model jsonb, -- To store dynamic price lists
  is_verified boolean default false,
  
  -- Gamification field
  total_points integer default 0,
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- RLS for Profiles
alter table profiles enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);


-- 3. GAMIFICATION LOGS Table
create table if not exists gamification_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  action_type text not null, -- e.g., 'compare_services', 'send_request', 'daily_login'
  points_earned integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  
  metadata jsonb 
);

-- RLS for Gamification
alter table gamification_logs enable row level security;

drop policy if exists "Users can view their own gamification logs." on gamification_logs;
drop policy if exists "Users can insert their own gamification logs." on gamification_logs;

create policy "Users can view their own gamification logs." on gamification_logs
  for select using (auth.uid() = user_id);
create policy "Users can insert their own gamification logs." on gamification_logs
  for insert with check (auth.uid() = user_id);


-- 4. EVENT REQUESTS Table (The Core Table)
create table if not exists event_requests (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references profiles(id) not null, -- Requestor (Free)
  contractor_id uuid references profiles(id) not null, -- Service Provider (Pro)
  
  event_name text not null,
  event_date date not null,
  budget_range text,
  status text check (status in ('pending', 'accepted', 'rejected', 'completed')) default 'pending',
  
  details text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Event Requests
alter table event_requests enable row level security;

drop policy if exists "Users can view their own related requests." on event_requests;
drop policy if exists "Clients can insert requests." on event_requests;
drop policy if exists "Contractors can update status of their requests." on event_requests;

create policy "Users can view their own related requests." on event_requests
  for select using (auth.uid() = client_id or auth.uid() = contractor_id);

create policy "Clients can insert requests." on event_requests
  for insert with check (auth.uid() = client_id);

create policy "Contractors can update status of their requests." on event_requests
  for update using (auth.uid() = contractor_id);


-- 5. REVIEWS Table
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references event_requests(id) on delete cascade unique, -- One review per request
  client_id uuid references profiles(id),
  contractor_id uuid references profiles(id),
  
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Reviews
alter table reviews enable row level security;

drop policy if exists "Reviews are viewable by everyone." on reviews;
drop policy if exists "Clients can insert reviews for their requests." on reviews;

create policy "Reviews are viewable by everyone." on reviews
  for select using (true);

create policy "Clients can insert reviews for their requests." on reviews
  for insert with check (auth.uid() = client_id);


-- 6. MESSAGES Table (Chat System)
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references event_requests(id) on delete cascade not null,
  sender_id uuid references profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Realtime for Messages (Ignore if error/platform specific)
do $$
begin
  alter publication supabase_realtime add table messages;
exception when others then
  raise notice 'Could not enable realtime publication (might be managed by platform)';
end;
$$;

-- RLS for Messages
alter table messages enable row level security;

drop policy if exists "Users can view messages for their requests" on messages;
drop policy if exists "Users can send messages for their requests" on messages;

create policy "Users can view messages for their requests"
  on messages for select
  using (
    exists (
      select 1 from event_requests
      where event_requests.id = messages.request_id
      and (event_requests.client_id = auth.uid() or event_requests.contractor_id = auth.uid())
    )
  );

create policy "Users can send messages for their requests"
  on messages for insert
  with check (
    exists (
      select 1 from event_requests
      where event_requests.id = request_id
      and (event_requests.client_id = auth.uid() or event_requests.contractor_id = auth.uid())
    )
    and auth.uid() = sender_id
  );


-- 7. STORAGE BUCKETS (Logos)
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- RLS for Storage (Do NOT run ALTER TABLE here as it requires superuser)
-- alter table storage.objects enable row level security; -- usually enabled by default

-- Drop existing policies first to be safe
drop policy if exists "Public Logos" on storage.objects;
drop policy if exists "Users can upload own logos" on storage.objects;
drop policy if exists "Users can update own logos" on storage.objects;

create policy "Public Logos"
  on storage.objects for select
  using ( bucket_id = 'logos' );

create policy "Users can upload own logos"
  on storage.objects for insert
  with check (
    bucket_id = 'logos' 
    and auth.role() = 'authenticated'
  );

create policy "Users can update own logos"
  on storage.objects for update
  using (
    bucket_id = 'logos' 
    and auth.uid() = owner
  );


-- 8. TRIGGERS (Auto-create Profile on Signup)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'free');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to allow idempotent runs
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
