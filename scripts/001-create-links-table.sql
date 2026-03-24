-- Create links table for GypsyCFG
CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'My Link',
  description TEXT DEFAULT 'Click the button below to access your content.',
  url TEXT NOT NULL,
  file_size TEXT DEFAULT 'Unknown',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read links
CREATE POLICY "Allow public read access" ON links
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert links
CREATE POLICY "Allow public insert access" ON links
  FOR INSERT WITH CHECK (true);

-- Create index for faster sorting by created_at
CREATE INDEX IF NOT EXISTS links_created_at_idx ON links (created_at DESC);
