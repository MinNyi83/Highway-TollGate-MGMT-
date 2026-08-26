#!/bin/bash

# Cloudflare Pages Deployment Script for TollGate Customer Portal

set -e

echo "=== TollGate Customer Portal - Cloudflare Pages Deployment ==="

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Wrangler not found. Installing..."
    npm install -g wrangler
fi

# Build the customer portal
echo "Building customer portal..."
cd packages/customer-portal
npm run build

# Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=tollgate-portal

echo "=== Deployment Complete ==="
echo "Portal URL: https://tollgate-portal.pages.dev"
