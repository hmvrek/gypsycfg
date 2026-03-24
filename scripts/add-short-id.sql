-- Add short_id column to links table for short URLs
ALTER TABLE links ADD COLUMN IF NOT EXISTS short_id VARCHAR(8) UNIQUE;

-- Generate short_id for existing rows that don't have one
UPDATE links 
SET short_id = SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)
WHERE short_id IS NULL;

-- Make short_id NOT NULL after populating existing rows
ALTER TABLE links ALTER COLUMN short_id SET NOT NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_links_short_id ON links(short_id);
