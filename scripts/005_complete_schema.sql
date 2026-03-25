-- Complete database schema for GypsyCFG URL Shortener
-- This script sets up everything needed for the application

-- Create links table if not exists
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'My Link',
  description TEXT DEFAULT '',
  url TEXT NOT NULL,
  file_size TEXT DEFAULT 'Unknown',
  short_id TEXT NOT NULL,
  image_url TEXT DEFAULT NULL,
  owner_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns if they don't exist (for existing tables)
DO $$ 
BEGIN
  -- Add image_url column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'links' 
    AND column_name = 'image_url') 
  THEN
    ALTER TABLE public.links ADD COLUMN image_url TEXT DEFAULT NULL;
  END IF;
  
  -- Add owner_token column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'links' 
    AND column_name = 'owner_token') 
  THEN
    ALTER TABLE public.links ADD COLUMN owner_token TEXT;
  END IF;
END $$;

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_links_short_id ON public.links(short_id);
CREATE INDEX IF NOT EXISTS idx_links_owner_token ON public.links(owner_token) WHERE owner_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_links_created_at ON public.links(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON public.links;
DROP POLICY IF EXISTS "Allow public insert" ON public.links;
DROP POLICY IF EXISTS "Allow public delete" ON public.links;
DROP POLICY IF EXISTS "Allow public update" ON public.links;

-- Create new policies
-- Anyone can read links (for public download page)
CREATE POLICY "Allow public read access" ON public.links 
  FOR SELECT USING (true);

-- Anyone can insert links (creating new links)
CREATE POLICY "Allow public insert" ON public.links 
  FOR INSERT WITH CHECK (true);

-- Deletion is handled via API with owner_token validation
-- No RLS policy for DELETE - we use service role key in API
