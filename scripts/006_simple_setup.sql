-- Simple setup for links table
-- Run this script to set up the database

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'My Link',
  description TEXT DEFAULT '',
  url TEXT NOT NULL,
  file_size TEXT DEFAULT 'Unknown',
  short_id TEXT NOT NULL UNIQUE,
  image_url TEXT,
  owner_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read
CREATE POLICY "public_read" ON public.links FOR SELECT USING (true);

-- Allow everyone to insert
CREATE POLICY "public_insert" ON public.links FOR INSERT WITH CHECK (true);

-- Allow everyone to delete (validation done in API)
CREATE POLICY "public_delete" ON public.links FOR DELETE USING (true);
