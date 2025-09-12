-- Fix RLS policies and permissions for newsletter_subscribers table
-- This migration was applied on 2025-01-13 to fix newsletter subscription issues

-- Grant necessary permissions to anon role
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT UPDATE ON public.newsletter_subscribers TO anon;
GRANT SELECT ON public.newsletter_subscribers TO anon;
GRANT ALL ON public.newsletter_subscribers TO authenticated;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anon users can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anon users can check their subscription status" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anon users can update their subscription" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can view all subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Service role can manage newsletter subscribers" ON public.newsletter_subscribers;

-- Create new RLS policies
CREATE POLICY "Anon users can subscribe to newsletter" 
    ON public.newsletter_subscribers 
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "Anon users can check their subscription status" 
    ON public.newsletter_subscribers 
    FOR SELECT 
    TO anon
    USING (true);

CREATE POLICY "Anon users can update their subscription" 
    ON public.newsletter_subscribers 
    FOR UPDATE 
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view all subscribers" 
    ON public.newsletter_subscribers 
    FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Service role can manage newsletter subscribers" 
    ON public.newsletter_subscribers 
    FOR ALL 
    TO service_role 
    USING (true)
    WITH CHECK (true);

-- Update table comment
COMMENT ON TABLE public.newsletter_subscribers IS 'Newsletter subscribers with fixed RLS policies for anon (public) access';