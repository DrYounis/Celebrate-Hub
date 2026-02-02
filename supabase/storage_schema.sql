
-- Insert a new bucket for logos if it doesn't exist
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Set up RLS for storage.objects
alter table storage.objects enable row level security;

-- Policy: Publicly accessible logos
create policy "Public Logos"
  on storage.objects for select
  using ( bucket_id = 'logos' );

-- Policy: Authenticated users can upload/update their own files
-- We assume the folder structure is {userId}/*
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
