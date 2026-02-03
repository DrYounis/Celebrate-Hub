-- Create Investors Table
create table if not exists investors (
  id uuid references auth.users(id) primary key,
  full_name text,
  email text,
  investment_range text,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create Entrepreneurs Table
create table if not exists entrepreneurs (
  id uuid references auth.users(id) primary key,
  full_name text,
  email text,
  startup_stage text,
  is_marfa_enrolled boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table investors enable row level security;
alter table entrepreneurs enable row level security;

-- Policies
create policy "Investors can read own data" on investors for select using (auth.uid() = id);
create policy "Entrepreneurs can read own data" on entrepreneurs for select using (auth.uid() = id);

-- Admins can do everything
create policy "Admins can manage investors" on investors for all 
  using (auth.role() = 'service_role' OR auth.jwt()->>'role' = 'admin')
  with check (auth.role() = 'service_role' OR auth.jwt()->>'role' = 'admin');

create policy "Admins can manage entrepreneurs" on entrepreneurs for all
  using (auth.role() = 'service_role' OR auth.jwt()->>'role' = 'admin')
  with check (auth.role() = 'service_role' OR auth.jwt()->>'role' = 'admin');

-- UPDATE TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check Metadata for Role
  IF new.raw_user_meta_data->>'role' = 'investor' THEN
    INSERT INTO public.investors (id, full_name, email)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  
  ELSIF new.raw_user_meta_data->>'role' = 'entrepreneur' THEN
    INSERT INTO public.entrepreneurs (id, full_name, email, is_marfa_enrolled)
    VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      new.email,
      (new.raw_user_meta_data->>'is_marfa_enrolled')::boolean
    );
    
  ELSE
    -- Default to profiles for Organizer/Pro
    INSERT INTO public.profiles (id, full_name, avatar_url, role)
    VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'avatar_url', 
      new.raw_user_meta_data->>'role'
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
