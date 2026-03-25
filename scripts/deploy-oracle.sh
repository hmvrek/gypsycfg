#!/bin/bash

# GypsyCFG - Oracle Cloud Free Tier Deployment Script
# Run this script on your Oracle Cloud VM

set -e

echo "=== GypsyCFG Oracle Cloud Deployment ==="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    echo "Docker installed. Please log out and back in, then run this script again."
    exit 0
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

# Build and start the container
echo "Building Docker image..."
docker-compose build

echo "Starting container..."
docker-compose up -d

echo ""
echo "=== Deployment Complete! ==="
echo "Your app is running on port 3000"
echo ""
echo "To make it accessible on port 80/443, run:"
echo "sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000"
echo ""
echo "Check logs with: docker-compose logs -f"
echo "Stop with: docker-compose down"
