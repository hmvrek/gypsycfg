-- Add short_id column for shortened URLs
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS short_id TEXT;

-- Create unique index on short_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_links_short_id ON public.links(short_id) WHERE short_id IS NOT NULL;
