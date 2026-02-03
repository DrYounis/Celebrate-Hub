
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

-- End of schema

-- ============================================
-- SERVICE MARKETPLACE SCHEMA
-- ============================================

-- 5. SERVICES Table (Service Catalog)
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid references profiles(id) on delete cascade not null,
  
  title text not null,
  description text,
  category text not null check (category in ('venue', 'catering', 'photography', 'decoration', 'entertainment', 'planning', 'other')),
  
  base_price decimal(10,2),
  currency text default 'SAR',
  
  images jsonb default '[]'::jsonb, -- Array of image URLs
  features jsonb default '[]'::jsonb, -- Array of feature strings
  
  location text,
  capacity integer, -- Max guests for venues
  
  is_active boolean default true,
  average_rating decimal(3,2) default 0,
  total_reviews integer default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Services
alter table services enable row level security;

create policy "Services are viewable by everyone" on services
  for select using (is_active = true or auth.uid() = provider_id);

create policy "Providers can insert their own services" on services
  for insert with check (auth.uid() = provider_id);

create policy "Providers can update their own services" on services
  for update using (auth.uid() = provider_id);

create policy "Providers can delete their own services" on services
  for delete using (auth.uid() = provider_id);


-- 6. SERVICE PACKAGES Table (Pricing Tiers)
create table if not exists service_packages (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid references services(id) on delete cascade not null,
  
  name text not null, -- e.g., 'Basic', 'Standard', 'Premium'
  description text,
  price decimal(10,2) not null,
  
  features jsonb default '[]'::jsonb,
  max_guests integer,
  duration_hours integer,
  
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table service_packages enable row level security;

create policy "Packages are viewable by everyone" on service_packages
  for select using (true);

create policy "Service owners can manage packages" on service_packages
  for all using (
    exists (
      select 1 from services 
      where services.id = service_packages.service_id 
      and services.provider_id = auth.uid()
    )
  );


-- 7. BOOKINGS Table (Customer Reservations)
create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  
  service_id uuid references services(id) not null,
  package_id uuid references service_packages(id),
  customer_id uuid references profiles(id) not null,
  provider_id uuid references profiles(id) not null,
  
  event_date date not null,
  event_time time,
  guest_count integer,
  
  total_amount decimal(10,2) not null,
  payment_status text check (payment_status in ('pending', 'paid', 'refunded', 'failed')) default 'pending',
  booking_status text check (booking_status in ('pending', 'confirmed', 'cancelled', 'completed')) default 'pending',
  
  customer_notes text,
  provider_notes text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table bookings enable row level security;

create policy "Users can view their own bookings" on bookings
  for select using (auth.uid() = customer_id or auth.uid() = provider_id);

create policy "Customers can create bookings" on bookings
  for insert with check (auth.uid() = customer_id);

create policy "Providers can update booking status" on bookings
  for update using (auth.uid() = provider_id);


-- 8. TRANSACTIONS Table (Payment Records)
create table if not exists transactions (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) not null,
  
  amount decimal(10,2) not null,
  currency text default 'SAR',
  
  payment_method text, -- 'stripe', 'card', 'cash'
  stripe_payment_id text,
  
  status text check (status in ('pending', 'completed', 'failed', 'refunded')) default 'pending',
  
  created_at timestamp with time zone default timezone('utc'::text, now()),
  
  unique(booking_id) -- Ensure one transaction per booking
);

alter table transactions enable row level security;

create policy "Users can view their own transactions" on transactions
  for select using (
    exists (
      select 1 from bookings 
      where bookings.id = transactions.booking_id 
      and (bookings.customer_id = auth.uid() or bookings.provider_id = auth.uid())
    )
  );


-- 9. SERVICE REVIEWS Table
create table if not exists service_reviews (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid references services(id) on delete cascade not null,
  booking_id uuid references bookings(id) unique, -- One review per booking
  customer_id uuid references profiles(id) not null,
  
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table service_reviews enable row level security;

create policy "Reviews are viewable by everyone" on service_reviews
  for select using (true);

create policy "Customers can create reviews for their bookings" on service_reviews
  for insert with check (auth.uid() = customer_id);


-- 10. AVAILABILITY Table (Provider Schedules)
create table if not exists availability (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid references services(id) on delete cascade not null,
  
  date date not null,
  is_available boolean default true,
  time_slots jsonb default '[]'::jsonb, -- Array of available time slots
  
  created_at timestamp with time zone default timezone('utc'::text, now()),
  
  unique(service_id, date)
);

alter table availability enable row level security;

create policy "Availability is viewable by everyone" on availability
  for select using (true);

create policy "Service owners can manage availability" on availability
  for all using (
    exists (
      select 1 from services 
      where services.id = availability.service_id 
      and services.provider_id = auth.uid()
    )
  );


-- 11. PROMOTIONAL CODES Table
create table if not exists promotional_codes (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  
  discount_type text check (discount_type in ('percentage', 'fixed')) not null,
  discount_value decimal(10,2) not null,
  
  min_purchase decimal(10,2),
  max_uses integer,
  current_uses integer default 0,
  
  valid_from timestamp with time zone default timezone('utc'::text, now()),
  valid_until timestamp with time zone,
  
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table promotional_codes enable row level security;

create policy "Active promo codes are viewable by everyone" on promotional_codes
  for select using (is_active = true and valid_until > now());


-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update service rating when review is added
create or replace function update_service_rating()
returns trigger as $$
begin
  update services
  set 
    average_rating = (
      select avg(rating)::decimal(3,2) 
      from service_reviews 
      where service_id = NEW.service_id
    ),
    total_reviews = (
      select count(*) 
      from service_reviews 
      where service_id = NEW.service_id
    )
  where id = NEW.service_id;
  
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_review_created
  after insert on service_reviews
  for each row execute procedure update_service_rating();


-- Function to award points for bookings
create or replace function award_booking_points()
returns trigger as $$
begin
  if NEW.booking_status = 'completed' and OLD.booking_status != 'completed' then
    -- Award 100 points to customer
    update profiles
    set total_points = total_points + 100
    where id = NEW.customer_id;
    
    -- Log the action
    insert into gamification_logs (user_id, action_type, points_earned, metadata)
    values (
      NEW.customer_id,
      'booking_completed',
      100,
      jsonb_build_object('booking_id', NEW.id)
    );
  end if;
  
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_booking_completed
  after update on bookings
  for each row execute procedure award_booking_points();


-- Helper function to award points (can be called from app)
create or replace function award_points(
  p_user_id uuid,
  p_points integer,
  p_action text
)
returns void as $$
begin
  -- Update user's total points
  update profiles
  set total_points = total_points + p_points
  where id = p_user_id;
  
  -- Log the action
  insert into gamification_logs (user_id, action_type, points_earned)
  values (p_user_id, p_action, p_points);
end;
$$ language plpgsql security definer;

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
  insert into public.profiles (id, full_name, avatar_url, role, total_points)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    coalesce(new.raw_user_meta_data->>'role', 'free'),
    coalesce((new.raw_user_meta_data->>'total_points')::integer, 50)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to allow idempotent runs
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
-- Payment System Migration
-- Adds Stripe Connect integration for marketplace payments

-- ============================================
-- 1. STRIPE ACCOUNTS TABLE
-- ============================================
-- Tracks vendor Stripe Connect accounts for payouts
create table if not exists stripe_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade unique not null,
  stripe_account_id text unique not null,
  
  -- Onboarding status
  onboarding_completed boolean default false,
  payouts_enabled boolean default false,
  charges_enabled boolean default false,
  
  -- Account details
  country text default 'SA',
  currency text default 'SAR',
  
  -- Metadata
  details_submitted boolean default false,
  requirements jsonb, -- Store Stripe requirements object
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast lookups
create index if not exists idx_stripe_accounts_user_id on stripe_accounts(user_id);
create index if not exists idx_stripe_accounts_stripe_id on stripe_accounts(stripe_account_id);

-- RLS Policies
alter table stripe_accounts enable row level security;

create policy "Users can view their own stripe account"
  on stripe_accounts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own stripe account"
  on stripe_accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own stripe account"
  on stripe_accounts for update
  using (auth.uid() = user_id);

-- ============================================
-- 2. TRANSACTIONS TABLE
-- ============================================
-- Records all payment activities with escrow status
create table if not exists transactions (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) on delete cascade unique not null,
  
  -- Stripe references
  stripe_payment_intent_id text unique,
  stripe_charge_id text,
  stripe_transfer_id text, -- Transfer to vendor
  
  -- Amounts (stored in halalas for precision, 1 SAR = 100 halalas)
  amount_total integer not null check (amount_total > 0), -- Total charged to client
  platform_fee integer not null check (platform_fee >= 0), -- Our 12% commission
  stripe_fee integer not null default 0, -- Stripe's processing fee
  vendor_payout integer not null check (vendor_payout >= 0), -- Amount vendor receives
  
  -- Escrow & Release
  status text check (status in (
    'pending',      -- Payment initiated
    'held',         -- Payment successful, funds held
    'released',     -- Funds transferred to vendor
    'refunded',     -- Refunded to client
    'failed',       -- Payment failed
    'disputed'      -- Chargeback/dispute
  )) default 'pending',
  
  held_until timestamptz, -- Auto-release date (7 days after event)
  released_at timestamptz,
  refunded_at timestamptz,
  
  -- Additional info
  currency text default 'SAR',
  payment_method_type text, -- 'card', 'apple_pay', etc.
  client_ip text,
  
  -- Metadata
  metadata jsonb,
  stripe_metadata jsonb, -- Full Stripe response
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_transactions_booking_id on transactions(booking_id);
create index if not exists idx_transactions_status on transactions(status);
create index if not exists idx_transactions_held_until on transactions(held_until) where status = 'held';
create index if not exists idx_transactions_payment_intent on transactions(stripe_payment_intent_id);

-- RLS Policies
alter table transactions enable row level security;

create policy "Users can view transactions for their bookings"
  on transactions for select
  using (
    exists (
      select 1 from bookings b
      where b.id = transactions.booking_id
      and (b.client_id = auth.uid() or b.provider_id = auth.uid())
    )
  );

-- Only system can insert/update transactions (via Edge Functions)
create policy "Service role can manage transactions"
  on transactions for all
  using (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- 3. MODIFY BOOKINGS TABLE
-- ============================================
-- Add payment-related fields
alter table bookings 
  add column if not exists payment_status text 
    check (payment_status in ('unpaid', 'paid', 'refunded')) 
    default 'unpaid',
  add column if not exists payment_required boolean default true,
  add column if not exists requires_deposit boolean default false,
  add column if not exists deposit_percentage integer default 30 
    check (deposit_percentage between 0 and 100);

-- Index for filtering by payment status
create index if not exists idx_bookings_payment_status on bookings(payment_status);

-- ============================================
-- 4. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to calculate platform fee (12%)
create or replace function calculate_platform_fee(amount integer)
returns integer
language plpgsql
as $$
begin
  return floor(amount * 0.12); -- 12% commission
end;
$$;

-- Function to auto-release escrowed payments
create or replace function auto_release_escrow()
returns void
language plpgsql
security definer
as $$
begin
  -- Release payments that are past their hold date
  update transactions
  set 
    status = 'released',
    released_at = now()
  where 
    status = 'held'
    and held_until < now();
end;
$$;

-- Trigger to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_stripe_accounts_updated_at
  before update on stripe_accounts
  for each row
  execute function update_updated_at_column();

create trigger update_transactions_updated_at
  before update on transactions
  for each row
  execute function update_updated_at_column();

-- ============================================
-- 5. VIEWS FOR ANALYTICS
-- ============================================

-- View for vendor earnings summary
create or replace view vendor_earnings as
select 
  sa.user_id,
  p.business_name,
  count(t.id) as total_transactions,
  sum(case when t.status = 'held' then t.vendor_payout else 0 end) as pending_balance,
  sum(case when t.status = 'released' then t.vendor_payout else 0 end) as available_balance,
  sum(case when t.status = 'released' then t.vendor_payout else 0 end) as lifetime_earnings
from stripe_accounts sa
join profiles p on p.id = sa.user_id
left join bookings b on b.provider_id = sa.user_id
left join transactions t on t.booking_id = b.id
where sa.payouts_enabled = true
group by sa.user_id, p.business_name;

-- View for platform revenue
create or replace view platform_revenue as
select 
  date_trunc('month', t.created_at) as month,
  count(t.id) as transaction_count,
  sum(t.amount_total) as gross_volume,
  sum(t.platform_fee) as platform_revenue,
  sum(t.stripe_fee) as stripe_costs,
  sum(t.platform_fee - t.stripe_fee) as net_revenue
from transactions t
where t.status in ('held', 'released')
group by date_trunc('month', t.created_at)
order by month desc;

-- Grant access to views
grant select on vendor_earnings to authenticated;
grant select on platform_revenue to authenticated;

-- ============================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================
comment on table stripe_accounts is 'Tracks vendor Stripe Connect accounts for marketplace payouts';
comment on table transactions is 'Records all payment transactions with escrow and commission tracking';
comment on column transactions.amount_total is 'Total amount in halalas (1 SAR = 100 halalas)';
comment on column transactions.platform_fee is 'Platform commission (12% of total)';
comment on column transactions.held_until is 'Auto-release date (typically 7 days after event)';
comment on function calculate_platform_fee is 'Calculates 12% platform commission';
comment on function auto_release_escrow is 'Releases held payments past their hold date';

-- Payment system migration applied on Tue Feb  3 11:59:02 +03 2026
