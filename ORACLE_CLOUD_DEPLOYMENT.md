# GypsyCFG - Oracle Cloud Free Tier Deployment Guide

## Prerequisites

1. Oracle Cloud Free Tier account with a VM instance (Ubuntu 20.04+ recommended)
2. Supabase project with the database set up
3. SSH access to your Oracle Cloud VM

## Quick Setup

### 1. Clone the repository on your Oracle Cloud VM

```bash
git clone https://github.com/hmvrek/gypsycfg.git
cd gypsycfg
```

### 2. Create environment file

```bash
cp .env.example .env
nano .env
```

Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Deploy with Docker (Recommended)

```bash
chmod +x scripts/deploy-oracle.sh
./scripts/deploy-oracle.sh
```

### 4. Or deploy without Docker

```bash
chmod +x scripts/start-standalone.sh
./scripts/start-standalone.sh
```

## Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
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

-- Create unique index on short_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_links_short_id ON public.links(short_id) WHERE short_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.links 
  FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert" ON public.links 
  FOR INSERT WITH CHECK (true);

-- Allow public delete
CREATE POLICY "Allow public delete" ON public.links 
  FOR DELETE USING (true);
```

## Open Firewall Ports

On Oracle Cloud, you need to open ports in both the VM firewall and the subnet security list:

### VM Firewall (iptables)

```bash
sudo iptables -I INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT

# Redirect port 80 to 3000
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

# Save rules
sudo netfilter-persistent save
```

### Oracle Cloud Security List

1. Go to Oracle Cloud Console > Networking > Virtual Cloud Networks
2. Click on your VCN > Security Lists > Default Security List
3. Add Ingress Rules for ports 80, 443, and 3000

## Using PM2 for Production (Alternative to Docker)

```bash
# Install PM2
npm install -g pm2

# Build the app
pnpm install
pnpm build

# Copy static files
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# Start with PM2
cd .next/standalone
pm2 start server.js --name gypsycfg

# Save PM2 config
pm2 save
pm2 startup
```

## Custom Domain Setup

1. Point your domain (e.g., prodgypsy.xyz) to your Oracle Cloud VM's public IP
2. Install Nginx and Certbot for SSL:

```bash
sudo apt install nginx certbot python3-certbot-nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/gypsycfg
```

Add this config:
```nginx
server {
    listen 80;
    server_name prodgypsy.xyz www.prodgypsy.xyz;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and get SSL:
```bash
sudo ln -s /etc/nginx/sites-available/gypsycfg /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d prodgypsy.xyz -d www.prodgypsy.xyz
```

## URL Structure

- Main page: `https://prodgypsy.xyz/`
- Shortened link: `https://prodgypsy.xyz/abc123` (redirects to download page with ad)

## Troubleshooting

### Check if app is running
```bash
docker-compose logs -f
# or
pm2 logs gypsycfg
```

### Restart the app
```bash
docker-compose restart
# or
pm2 restart gypsycfg
```

### Check port is open
```bash
curl http://localhost:3000
```
