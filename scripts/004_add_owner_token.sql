-- Add owner_token column for secure deletion
-- Only the person who created the link (and has the token) can delete it

-- Add owner_token column
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS owner_token TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_links_owner_token ON public.links(owner_token) WHERE owner_token IS NOT NULL;

-- Drop old permissive delete policy
DROP POLICY IF EXISTS "Allow public delete" ON public.links;

-- Note: We will NOT create a new DELETE policy via RLS
-- Instead, deletion will be handled through a secure API route
-- that validates the owner_token before deleting
