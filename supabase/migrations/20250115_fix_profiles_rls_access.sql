-- Fix profiles table RLS to allow admin role checks
-- This migration ensures that authenticated users can read profiles
-- which is necessary for the admin role checks in other table policies

-- Drop conflicting/duplicate SELECT policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create clear SELECT policies
-- Allow authenticated users to read all profiles (needed for admin checks)
CREATE POLICY "Authenticated users can view all profiles" ON public.profiles
FOR SELECT TO authenticated
USING (true);

-- Allow public to view profiles (for public pages)
CREATE POLICY "Public can view profiles" ON public.profiles
FOR SELECT TO anon
USING (true);

-- Note: UPDATE policies remain restricted to own profile only
-- This maintains security while allowing role checks to work