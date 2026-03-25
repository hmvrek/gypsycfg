-- Full database setup script for GypsyCFG
-- Run this in Supabase SQL editor if starting fresh

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  file_size TEXT,
  short_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on short_id for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_links_short_id ON public.links(short_id) WHERE short_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access" ON public.links;
DROP POLICY IF EXISTS "Allow public insert" ON public.links;
DROP POLICY IF EXISTS "Allow public delete" ON public.links;

-- Allow anyone to read links (public download page)
CREATE POLICY "Allow public read access" ON public.links 
  FOR SELECT USING (true);

-- Allow anyone to insert links
CREATE POLICY "Allow public insert" ON public.links 
  FOR INSERT WITH CHECK (true);

-- Allow anyone to delete links
CREATE POLICY "Allow public delete" ON public.links 
  FOR DELETE USING (true);
