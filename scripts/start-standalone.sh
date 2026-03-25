#!/bin/bash

# GypsyCFG - Standalone Start Script (without Docker)
# For Oracle Cloud Free Tier or any Linux server

set -e

echo "=== GypsyCFG Standalone Deployment ==="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    echo "Please create .env file with your Supabase credentials:"
    echo ""
    echo "cp .env.example .env"
    echo "nano .env"
    echo ""
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Build the application
echo "Building application..."
pnpm build

# Copy static files to standalone
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# Start the server
echo ""
echo "=== Starting Server ==="
echo "Your app will be running on port 3000"
echo ""

cd .next/standalone
PORT=3000 HOSTNAME=0.0.0.0 node server.js
