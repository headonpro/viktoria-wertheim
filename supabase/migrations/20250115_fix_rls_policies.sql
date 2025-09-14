-- Fix RLS policies for admin operations
-- This migration fixes UPDATE policies that were missing WITH CHECK clauses
-- and removes overly permissive policies that allowed all authenticated users to modify data

-- Remove overly permissive policies from news table
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.news;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.news;

-- Fix NEWS table UPDATE policy with proper WITH CHECK
DROP POLICY IF EXISTS "Admins can update" ON public.news;
CREATE POLICY "Admins can update" ON public.news
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Fix NEWS table INSERT policy
DROP POLICY IF EXISTS "Admins can insert" ON public.news;
CREATE POLICY "Admins can insert" ON public.news
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Fix MATCHES table UPDATE policy with proper WITH CHECK
DROP POLICY IF EXISTS "Admins can update" ON public.matches;
CREATE POLICY "Admins can update" ON public.matches
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Fix TEAMS table UPDATE policy with proper WITH CHECK
DROP POLICY IF EXISTS "Admins can update" ON public.teams;
CREATE POLICY "Admins can update" ON public.teams
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);