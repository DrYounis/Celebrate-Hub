
-- 1. REVIEWS Table
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references event_requests(id) unique, -- One review per request
  client_id uuid references profiles(id),
  contractor_id uuid references profiles(id),
  
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Reviews
alter table reviews enable row level security;

create policy "Reviews are viewable by everyone." on reviews
  for select using (true);

create policy "Clients can insert reviews for their requests." on reviews
  for insert with check (auth.uid() = client_id);

-- Optional: View to calculate average ratings easily
create or replace view contractor_ratings as
select 
  contractor_id,
  avg(rating)::numeric(10,1) as average_rating,
  count(*) as review_count
from reviews
group by contractor_id;
