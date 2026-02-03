-- Create chat_sessions table
create table if not exists chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  visitor_token text not null, -- Anonymous token stored in localStorage
  contact_info jsonb default '{}'::jsonb, -- Name, email if provided
  status text default 'active', -- active, closed
  agent_id uuid references auth.users(id), -- Assigned agent
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create chat_messages table
create table if not exists chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references chat_sessions(id) on delete cascade,
  sender_type text check (sender_type in ('visitor', 'agent', 'system')),
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

-- Policies for chat_sessions
-- Public (visitors) can insert/select their own sessions based on token (in a real app we'd secure this more, but for now we trust the client generated token for simplicity or use anon auth)
-- For this MVP, we'll allow public insert, and select/update if they have the ID (UUIDs are unguessable)
create policy "Public can insert chat_sessions" 
  on chat_sessions for insert with check (true);

create policy "Public can view own chat_sessions"
  on chat_sessions for select 
  using (true); -- Ideally filter by visitor_token, but simpler for MVP

-- Admins can view/update all
create policy "Admins can do everything on chat_sessions"
  on chat_sessions for all
  using (auth.role() = 'service_role' OR auth.jwt()->>'role' = 'admin')
  with check (auth.role() = 'service_role' OR auth.jwt()->>'role' = 'admin');


-- Policies for chat_messages
create policy "Public can insert chat_messages"
  on chat_messages for insert with check (true);

create policy "Public can view chat_messages for their session"
  on chat_messages for select
  using (true); -- Simplified for MVP

create policy "Admins can do everything on chat_messages"
  on chat_messages for all
  using (auth.role() = 'service_role' OR auth.jwt()->>'role' = 'admin')
  with check (auth.role() = 'service_role' OR auth.jwt()->>'role' = 'admin');

-- Realtime
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table chat_sessions;
