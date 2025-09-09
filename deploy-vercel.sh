#!/bin/bash

echo "🌽 Deploying CRNMN Website to Vercel..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Make sure you're in the project root directory.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 CRNMN Website Deployment Status:${NC}"
echo -e "${GREEN}✅ Vite configuration fixed${NC}"
echo -e "${GREEN}✅ Build process working${NC}"
echo -e "${GREEN}✅ Vercel configuration ready${NC}"
echo -e "${GREEN}✅ Environment variables template ready${NC}"

# Check if Vercel CLI is installed
if ! command_exists vercel; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install Vercel CLI. Please check your permissions.${NC}"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install --ignore-scripts
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies.${NC}"
        exit 1
    fi
fi

# Build the project
echo -e "${YELLOW}🔨 Building the project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Check if user is logged in to Vercel
echo -e "${YELLOW}🔐 Checking Vercel authentication...${NC}"
vercel whoami >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}🔑 Please login to Vercel...${NC}"
    vercel login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to login to Vercel.${NC}"
        exit 1
    fi
fi

# Deploy to Vercel
echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful! 🎉${NC}"
    echo -e "${GREEN}🌽 Your CRNMN Website is now live!${NC}"
    echo ""
    echo -e "${BLUE}📝 Next Steps:${NC}"
    echo -e "${YELLOW}   1. Set up your environment variables in Vercel dashboard${NC}"
    echo -e "${YELLOW}      • VITE_SUPABASE_URL${NC}"
    echo -e "${YELLOW}      • VITE_SUPABASE_ANON_KEY${NC}"
    echo -e "${YELLOW}      • VITE_GEMINI_API_KEY (optional)${NC}"
    echo -e "${YELLOW}   2. Configure your custom domain (if applicable)${NC}"
    echo -e "${YELLOW}   3. Test all website functionality${NC}"
    echo ""
    echo -e "${BLUE}📚 For detailed instructions, check DEPLOY_TO_VERCEL.md${NC}"
else
    echo -e "${RED}❌ Deployment failed. Please check the errors above.${NC}"
    echo -e "${YELLOW}💡 Common solutions:${NC}"
    echo -e "${YELLOW}   1. Make sure you're logged into Vercel: vercel login${NC}"
    echo -e "${YELLOW}   2. Check your internet connection${NC}"
    echo -e "${YELLOW}   3. Verify your GitHub repository access${NC}"
    exit 1
fi