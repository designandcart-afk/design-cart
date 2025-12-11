-- Auto-create designer_details entry when a new user signs up
-- Run this in Supabase SQL Editor
-- This works with the existing designer_details table structure

-- Create function to auto-populate designer_details on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into existing designer_details table with signup data
  -- Only populate name and email from signup, other fields remain NULL
  INSERT INTO public.designer_details (
    user_id,
    name,
    email,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING; -- Prevent duplicates if row already exists
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users who don't have designer_details entries
-- This fixes the 406 errors for existing users
INSERT INTO public.designer_details (user_id, name, email, created_at, updated_at)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as name,
  u.email,
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN public.designer_details dd ON dd.user_id = u.id
WHERE dd.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Verify the trigger is created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
