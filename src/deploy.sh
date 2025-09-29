#!/bin/bash

echo "🌽 Deploying THEFMSMKT CORNMAN to Vercel..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Make sure you're in the project root directory.${NC}"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Build the project
echo -e "${YELLOW}🔨 Building the project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

# Deploy to Vercel
echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful! 🎉${NC}"
    echo -e "${GREEN}🌽 Your CORNMAN app is now live!${NC}"
    echo -e "${YELLOW}📝 Don't forget to:${NC}"
    echo -e "${YELLOW}   1. Set up your environment variables in Vercel dashboard${NC}"
    echo -e "${YELLOW}   2. Configure your custom domain (if applicable)${NC}"
    echo -e "${YELLOW}   3. Update Supabase URL configuration${NC}"
else
    echo -e "${RED}❌ Deployment failed. Please check the errors above.${NC}"
    exit 1
fi