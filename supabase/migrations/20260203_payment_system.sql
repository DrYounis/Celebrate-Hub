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
