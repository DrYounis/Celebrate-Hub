
-- 1. MESSAGES Table
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references event_requests(id) on delete cascade not null,
  sender_id uuid references profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable Realtime
-- Note: You might need to run this manually in the dashboard if the API doesn't support publication changes
alter publication supabase_realtime add table messages;

-- 3. RLS Policies
alter table messages enable row level security;

-- Policy: Users can view messages for requests they are part of (client or contractor)
create policy "Users can view messages for their requests"
  on messages for select
  using (
    exists (
      select 1 from event_requests
      where event_requests.id = messages.request_id
      and (event_requests.client_id = auth.uid() or event_requests.contractor_id = auth.uid())
    )
  );

-- Policy: Users can insert messages if they are part of the request
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
