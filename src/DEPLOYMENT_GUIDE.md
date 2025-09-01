# 🚀 THEFMSMKT CORNMAN - Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **Prerequisites**
- [ ] GitHub account (for code repository)
- [ ] Supabase project setup
- [ ] Domain name (optional but recommended)
- [ ] Payment gateway accounts (Stripe, etc.)

### ✅ **Environment Variables Required**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Payment Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Google APIs (Optional)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GOOGLE_PLACES_API_KEY=your-google-places-api-key

# External Services (Optional)
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
OPENAI_API_KEY=your-openai-api-key
```

---

## 🌟 **Recommended: Vercel Deployment**

### **Why Vercel?**
- ✅ Optimized for React/Next.js applications
- ✅ Automatic deployments from GitHub
- ✅ Global CDN and edge functions
- ✅ Built-in analytics and performance monitoring
- ✅ Free tier with generous limits

### **Step 1: Prepare Your Repository**

1. **Create GitHub Repository**
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit - THEFMSMKT CORNMAN app"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/thefmsmkt-cornman.git

# Push to GitHub
git push -u origin main
```

### **Step 2: Deploy to Vercel**

1. **Visit [vercel.com](https://vercel.com) and sign up/login**

2. **Import your GitHub repository:**
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure build settings:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

4. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all required environment variables from the checklist above

### **Step 3: Custom Domain Setup (Optional)**

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Add your custom domain (e.g., `cornman.my` or `thefmsmkt.com`)

2. **Update DNS Records:**
```dns
# For root domain (example.com)
A Record: @ → 76.76.19.19

# For subdomain (www.example.com)  
CNAME Record: www → cname.vercel-dns.com

# For custom subdomain (cornman.example.com)
CNAME Record: cornman → cname.vercel-dns.com
```

### **Step 4: Supabase Configuration**

1. **Update Supabase Site URL:**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL: `https://your-project.vercel.app`
   - Add your custom domain (if applicable)

2. **CORS Configuration:**
```sql
-- In Supabase SQL Editor
UPDATE auth.config 
SET site_url = 'https://your-domain.com',
    additional_redirect_urls = 'https://your-project.vercel.app,https://your-domain.com';
```

---

## 🔷 **Alternative: Netlify Deployment**

### **Step 1: Netlify Setup**

1. **Visit [netlify.com](https://netlify.com) and sign up**

2. **Connect GitHub repository:**
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository

### **Step 2: Build Configuration**

Create `netlify.toml` in your project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 3000

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

### **Step 3: Environment Variables**
- Go to Site Settings → Environment Variables
- Add all required environment variables

---

## 📱 **Mobile-First Deployment Checklist**

### **PWA Configuration**

Create `public/manifest.json`:
```json
{
  "name": "THEFMSMKT CORNMAN",
  "short_name": "CORNMAN",
  "description": "Gourmet corn delivered fresh",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#39FF14",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Add to `index.html`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#39FF14">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

---

## 🔧 **Production Optimizations**

### **Performance Configuration**

Update your build process for production:

**package.json additions:**
```json
{
  "scripts": {
    "build:prod": "NODE_ENV=production npm run build",
    "preview": "npm run build && npm run serve",
    "analyze": "npm run build -- --analyze"
  }
}
```

### **Vite Configuration (vite.config.ts)**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['./src/components/ui'],
          supabase: ['@supabase/supabase-js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js']
  }
})
```

---

## 🔐 **Security Configuration**

### **Supabase Row Level Security (RLS)**

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles  
  FOR UPDATE USING (auth.uid() = id);

-- Order policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### **Environment Security**
```bash
# Production environment variables (never commit these!)
# Use your deployment platform's secure environment variable system

# Example .env.production (DO NOT COMMIT)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 **Monitoring & Analytics**

### **Vercel Analytics Setup**
```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to App.tsx
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      {/* Your existing app */}
      <Analytics />
    </>
  )
}
```

### **Error Monitoring with Sentry**
```bash
# Install Sentry
npm install @sentry/react @sentry/tracing

# Configure in main.tsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
})
```

---

## 🚀 **Quick Deploy Commands**

### **One-Click Deployment Scripts**

Create `scripts/deploy.sh`:
```bash
#!/bin/bash

echo "🚀 Deploying THEFMSMKT CORNMAN..."

# Build the application
echo "📦 Building application..."
npm run build

# Run tests (if available)
echo "🧪 Running tests..."
npm run test -- --run

# Deploy based on platform
if [ "$1" = "vercel" ]; then
  echo "🌐 Deploying to Vercel..."
  npx vercel --prod
elif [ "$1" = "netlify" ]; then
  echo "🌐 Deploying to Netlify..."
  npx netlify deploy --prod --dir=dist
else
  echo "❌ Please specify deployment platform: vercel or netlify"
  exit 1
fi

echo "✅ Deployment completed!"
echo "🔗 Your CORNMAN app is now live!"
```

Make it executable:
```bash
chmod +x scripts/deploy.sh

# Deploy to Vercel
./scripts/deploy.sh vercel

# Deploy to Netlify  
./scripts/deploy.sh netlify
```

---

## 🔄 **Continuous Deployment**

### **GitHub Actions Workflow**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy CORNMAN App

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm run test

    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 📝 **Post-Deployment Testing**

### **Production Testing Checklist**

- [ ] **Homepage loads correctly**
- [ ] **Menu section displays all items**
- [ ] **Cart functionality works**
- [ ] **Authentication flow works**
- [ ] **Mobile responsiveness**
- [ ] **Payment processing (test mode)**
- [ ] **Order tracking**
- [ ] **Performance (PageSpeed Insights)**
- [ ] **SEO optimization**

### **Load Testing**
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test config
# artillery-test.yml
config:
  target: 'https://your-domain.com'
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Homepage flow"
    requests:
      - get:
          url: "/"
      - get:
          url: "/menu"

# Run load test
artillery run artillery-test.yml
```

---

## 🌐 **Domain & SSL Setup**

### **Custom Domain Configuration**

1. **Purchase Domain** (recommended providers):
   - Namecheap
   - GoDaddy  
   - Cloudflare

2. **DNS Configuration:**
```dns
# Root domain setup
Type: A
Name: @
Value: 76.76.19.19 (Vercel IP)

# WWW subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com

# API subdomain (for future scaling)
Type: CNAME  
Name: api
Value: your-backend-url.com
```

3. **SSL Certificate:**
   - Automatic with Vercel/Netlify
   - Let's Encrypt for custom setups

---

## 🔧 **Troubleshooting Common Issues**

### **Build Failures**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit
```

### **Environment Variable Issues**
```bash
# Verify environment variables are loaded
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

# Ensure variables start with NEXT_PUBLIC_ for client-side access
# NEXT_PUBLIC_SUPABASE_URL=... ✅
# SUPABASE_URL=... ❌ (server-side only)
```

### **Supabase Connection Issues**
```typescript
// Test Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Test connection
async function testConnection() {
  const { data, error } = await supabase.from('profiles').select('count')
  if (error) console.error('Supabase connection failed:', error)
  else console.log('Supabase connected successfully')
}
```

---

## 📱 **Malaysia-Specific Deployment Considerations**

### **Local Hosting Providers**
- **Exabytes** - Malaysian web hosting
- **ServerFreaks** - Local dedicated servers  
- **Shinjiru** - Regional data centers

### **Payment Gateway Setup**
```typescript
// Malaysian payment methods configuration
const paymentMethods = {
  fpx: {
    enabled: true,
    banks: ['maybank', 'cimb', 'public_bank', 'rhb', 'hong_leong']
  },
  grabpay: {
    enabled: true,
    merchant_id: process.env.GRABPAY_MERCHANT_ID
  },
  boost: {
    enabled: true,
    api_key: process.env.BOOST_API_KEY
  }
}
```

### **CDN Optimization for Malaysia**
- Use Singapore/Hong Kong edge locations
- Enable Cloudflare for Malaysian users
- Optimize images for slower connections

---

## 🎉 **Launch Checklist**

### **Pre-Launch (T-1 Week)**
- [ ] Domain purchased and configured
- [ ] SSL certificate active
- [ ] All environment variables set
- [ ] Database migrations completed
- [ ] Payment gateways tested
- [ ] Performance optimized

### **Launch Day (T-0)**
- [ ] Final deployment completed  
- [ ] DNS propagation verified
- [ ] All features tested in production
- [ ] Monitoring systems active
- [ ] Support team briefed

### **Post-Launch (T+1 Week)**
- [ ] Analytics data flowing
- [ ] User feedback collected
- [ ] Performance monitoring
- [ ] Bug fixes deployed
- [ ] Marketing campaigns launched

---

## 🔗 **Quick Links**

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Supabase Dashboard**: [app.supabase.com](https://app.supabase.com)
- **Domain Management**: Your domain registrar
- **Analytics**: Your deployment platform's analytics section

---

**🌽 Your THEFMSMKT CORNMAN application is now ready for the world! 🚀**

*For additional support or advanced deployment scenarios, refer to the advanced-features.md guide or contact the development team.*