# GypsyCFG - Oracle Cloud Free Tier Deployment Guide

Complete guide to deploy your URL shortener with ad monetization on Oracle Cloud Free Tier.

## Prerequisites

1. Oracle Cloud Free Tier account with a VM instance (Ubuntu 22.04 recommended)
2. Supabase project (free tier)
3. SSH access to your Oracle Cloud VM

## Quick Setup

### 1. Clone the repository on your Oracle Cloud VM

```bash
git clone https://github.com/hmvrek/gypsycfg.git
cd gypsycfg
```

### 2. Create environment file

```bash
nano .env
```

Add your Supabase credentials:
```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Deploy with Docker (Recommended)

```bash
# Install Docker if not installed
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Log out and back in, then:
docker compose up -d --build
```

### 4. Or deploy without Docker

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Build and run
pnpm install
pnpm build
pnpm start
```

## Database Setup (IMPORTANT)

Run this SQL in your Supabase SQL editor (Settings > SQL Editor):

```sql
-- Complete database schema for GypsyCFG URL Shortener
-- Run this to set up everything needed

-- Create links table
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

-- Create indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_links_short_id ON public.links(short_id);
CREATE INDEX IF NOT EXISTS idx_links_owner_token ON public.links(owner_token) WHERE owner_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_links_created_at ON public.links(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON public.links;
DROP POLICY IF EXISTS "Allow public insert" ON public.links;
DROP POLICY IF EXISTS "Allow public delete" ON public.links;

-- Allow public read (everyone can see links)
CREATE POLICY "Allow public read access" ON public.links 
  FOR SELECT USING (true);

-- Allow public insert (everyone can create links)
CREATE POLICY "Allow public insert" ON public.links 
  FOR INSERT WITH CHECK (true);

-- Note: Deletion is handled via API with owner_token validation
-- The service role key bypasses RLS for secure deletion
```

## Open Firewall Ports

### VM Firewall (Ubuntu)

```bash
# Allow ports
sudo iptables -I INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT

# Redirect port 80 to 3000 (so you can use port 80)
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

# Save rules
sudo apt install iptables-persistent -y
sudo netfilter-persistent save
```

### Oracle Cloud Security List

1. Go to Oracle Cloud Console > Networking > Virtual Cloud Networks
2. Click on your VCN > Security Lists > Default Security List
3. Add Ingress Rules:
   - **Port 80** - Source: 0.0.0.0/0, Protocol: TCP
   - **Port 443** - Source: 0.0.0.0/0, Protocol: TCP
   - **Port 3000** - Source: 0.0.0.0/0, Protocol: TCP (optional, for testing)

## Production Setup with Nginx + SSL

### Install Nginx

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/gypsycfg
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for ad scripts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable the config:
```bash
sudo ln -s /etc/nginx/sites-available/gypsycfg /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default
sudo nginx -t
sudo systemctl restart nginx
```

### Get SSL Certificate (Free with Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Features

- **Link Shortening**: Create short URLs with custom titles, descriptions, and optional images
- **Ad Monetization**: 5-second countdown with Adsterra integration
- **Owner-only Deletion**: Only the link creator can delete their links (secure token system)
- **Image Support**: Add optional preview images to links
- **Responsive Design**: Works on all devices
- **Oracle Cloud Optimized**: Runs perfectly on free tier resources

## How Owner Deletion Works

1. When you create a link, a unique `owner_token` is generated
2. This token is stored in your browser's localStorage
3. When viewing links, the delete button only appears for YOUR links
4. When deleting, the token is sent to the API for verification
5. Only matching tokens can delete links

This means:
- Everyone can see all links
- Only the creator (on the same browser) can delete their links
- If you clear localStorage, you lose the ability to delete your links

## Useful Commands

```bash
# View Docker logs
docker compose logs -f

# Restart application
docker compose restart

# Rebuild after code changes
docker compose up -d --build

# Stop application
docker compose down

# Check if running
docker compose ps
curl http://localhost:3000
```

## Troubleshooting

### App not accessible from internet
1. Check Oracle Cloud security rules (port 80/443/3000)
2. Check VM firewall: `sudo iptables -L -n`
3. Check app is running: `docker compose ps`

### Database connection errors
1. Verify Supabase credentials in `.env`
2. Check Supabase is not paused (free tier pauses after inactivity)
3. Test connection: Check Supabase dashboard for active connections

### Ads not showing
1. Ads may be blocked by adblockers
2. Adsterra script loads asynchronously - check browser console for errors
3. Some regions may not show ads

### Can't delete links
1. Make sure you're using the same browser where you created the link
2. Check localStorage: Open DevTools > Application > Local Storage
3. Look for `link_owner_tokens` key

## Resource Usage

Optimized for Oracle Cloud Free Tier (VM.Standard.E2.1.Micro):
- **Memory**: ~150-250MB
- **CPU**: Minimal
- **Storage**: Minimal (all data in Supabase)
- **Network**: Within free tier limits
