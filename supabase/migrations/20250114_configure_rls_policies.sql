-- Disable RLS temporarily for setup
ALTER TABLE public.teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.news DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_standings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.players DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON public.teams;
DROP POLICY IF EXISTS "Allow public read access" ON public.matches;
DROP POLICY IF EXISTS "Allow public read access" ON public.news;
DROP POLICY IF EXISTS "Allow public read access" ON public.scorers;
DROP POLICY IF EXISTS "Allow public read access" ON public.sponsors;
DROP POLICY IF EXISTS "Allow public read access" ON public.league_standings;
DROP POLICY IF EXISTS "Allow public read access" ON public.players;
DROP POLICY IF EXISTS "Allow public read access" ON public.contacts;

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create public read policies for all tables
CREATE POLICY "Allow public read access" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.news FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.scorers FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.league_standings FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.contacts FOR SELECT USING (true);

-- Admin write policies for teams
CREATE POLICY "Admins can insert" ON public.teams FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can update" ON public.teams FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can delete" ON public.teams FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Admin write policies for matches
CREATE POLICY "Admins can insert" ON public.matches FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can update" ON public.matches FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can delete" ON public.matches FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Admin write policies for news
CREATE POLICY "Admins can insert" ON public.news FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can update" ON public.news FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can delete" ON public.news FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Newsletter subscribers policies
CREATE POLICY "Public can subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own subscription" ON public.newsletter_subscribers
  FOR SELECT USING (true);

CREATE POLICY "Users can unsubscribe themselves" ON public.newsletter_subscribers
  FOR UPDATE USING (true);

CREATE POLICY "Admins can manage all" ON public.newsletter_subscribers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );