-- COMPLETE DATABASE SETUP FOR DESIGN&CART
-- Run this entire script in Supabase SQL Editor to fix all authentication and project creation issues
-- URL: https://supabase.com/dashboard/project/wxbjunhkvhhfzvtaeypg/sql/new

-- ========================================
-- PART 1: CREATE DESIGNER_DETAILS TABLE
-- ========================================

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create designer_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.designer_details (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  name text not null,
  email text not null,
  profile_pic text null,
  specialization text null,
  studio text null,
  phone text null,
  address text null,
  experience text null,
  gst_id text null,
  about text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint designer_details_pkey primary key (id),
  constraint designer_details_user_id_unique unique (user_id),
  constraint designer_details_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete cascade
);

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_designer_details_updated_at ON public.designer_details;
CREATE TRIGGER update_designer_details_updated_at 
  BEFORE UPDATE ON public.designer_details 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- PART 2: ENABLE ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on designer_details table
ALTER TABLE public.designer_details ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own designer details" ON public.designer_details;
DROP POLICY IF EXISTS "Users can insert own designer details" ON public.designer_details;
DROP POLICY IF EXISTS "Users can update own designer details" ON public.designer_details;

-- Create RLS policies
CREATE POLICY "Users can read own designer details"
  ON public.designer_details FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own designer details"
  ON public.designer_details FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own designer details"
  ON public.designer_details FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS designer_details_user_id_idx ON public.designer_details(user_id);
CREATE INDEX IF NOT EXISTS designer_details_email_idx ON public.designer_details(email);

-- ========================================
-- PART 3: AUTO-CREATE DESIGNER_DETAILS ON SIGNUP
-- ========================================

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

-- ========================================
-- PART 4: BACKFILL EXISTING USERS
-- ========================================

-- Backfill existing users who don't have designer_details entries
-- This fixes project creation errors for existing users
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

-- ========================================
-- PART 5: VERIFICATION
-- ========================================

-- Verify the trigger is created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Verify backfill worked - should show all users have designer_details
SELECT 
  COUNT(*) as total_users,
  COUNT(dd.id) as users_with_details,
  COUNT(*) - COUNT(dd.id) as missing_details
FROM auth.users u
LEFT JOIN public.designer_details dd ON dd.user_id = u.id;

-- Show sample of designer_details entries
SELECT 
  dd.name,
  dd.email,
  dd.created_at,
  u.email_confirmed_at as email_verified
FROM public.designer_details dd
JOIN auth.users u ON u.id = dd.user_id
ORDER BY dd.created_at DESC
LIMIT 5;

-- ========================================
-- SETUP COMPLETE!
-- ========================================
-- After running this script:
-- 1. New users will automatically get designer_details entries
-- 2. Existing users will have their designer_details backfilled
-- 3. Project creation should work for all users
-- 4. Email verification should work properly
