-- Drop legacy tables
DROP TABLE IF EXISTS service_reviews CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS stripe_accounts CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS service_packages CASCADE;
DROP TABLE IF EXISTS availability CASCADE;
DROP TABLE IF EXISTS gamification_logs CASCADE;
DROP TABLE IF EXISTS promotional_codes CASCADE;
DROP TABLE IF EXISTS event_requests CASCADE;
DROP TABLE IF EXISTS consultation_requests CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Ensure auth trigger no longer references profiles
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
  END IF;
  -- No ELSE block for 'profiles' anymore

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
