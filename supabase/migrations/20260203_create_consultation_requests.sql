-- Create the consultation_requests table if it doesn't exist
create table if not exists consultation_requests (
  id uuid primary key default uuid_generate_v4(),
  event_type text,
  city text,
  budget_range text,
  phone text,
  email text,
  services_needed jsonb default '[]'::jsonb,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table consultation_requests enable row level security;

-- Allow public inserts (so the form works for visitors)
create policy "Public can insert consultation_requests"
  on consultation_requests
  for insert
  with check (true);

-- Allow admins to view (optional, specific logic can start here)
create policy "Admins can view consultation_requests"
  on consultation_requests
  for select
  using (auth.role() = 'service_role' OR auth.jwt()->>'role' = 'admin');
