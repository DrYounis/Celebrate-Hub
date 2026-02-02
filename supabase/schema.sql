-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES Table (Unified for Users & Vendors)
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
  
  -- Gamification field (added check to avoid error if re-running)
  total_points integer default 0,
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- RLS for Profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);


-- 2. GAMIFICATION LOGS Table
create table if not exists gamification_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  action_type text not null, -- e.g., 'compare_services', 'send_request', 'daily_login'
  points_earned integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  
  metadata jsonb 
);

-- RLS for Gamification (Users can read their own logs)
alter table gamification_logs enable row level security;

create policy "Users can view their own gamification logs." on gamification_logs
  for select using (auth.uid() = user_id);


-- 3. EVENT REQUESTS Table (The Bridge)
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

create policy "Users can view their own related requests." on event_requests
  for select using (auth.uid() = client_id or auth.uid() = contractor_id);

create policy "Clients can insert requests." on event_requests
  for insert with check (auth.uid() = client_id);

create policy "Contractors can update status of their requests." on event_requests
  for update using (auth.uid() = contractor_id);


-- 4. TRIGGERS (Auto-create Profile)
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
