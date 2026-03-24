-- Create links table for permanent storage
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  file_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read links (public download page)
CREATE POLICY "Allow public read access" ON public.links 
  FOR SELECT USING (true);

-- Allow anyone to insert links (for now - you can add auth later)
CREATE POLICY "Allow public insert" ON public.links 
  FOR INSERT WITH CHECK (true);

-- Allow anyone to delete links (for now - you can add auth later)
CREATE POLICY "Allow public delete" ON public.links 
  FOR DELETE USING (true);
