# 🚀 CRNMN Website - Complete Vercel Deployment Guide

## Quick Deployment (5 minutes)

### Step 1: Pre-flight Check ✅
```bash
# Verify build works locally
npm install
npm run build

# Should create 'dist' directory with optimized files
ls -la dist/
```

### Step 2: Deploy to Vercel 🚀

#### Option A: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"  
3. Import your `cornmankl/CRNMN-Website` repository
4. Vercel will auto-detect:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci --omit=dev`
5. Click "Deploy" ✨

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (run from project root)
vercel --prod
```

### Step 3: Configure Environment Variables 🔐

In Vercel Dashboard → Project Settings → Environment Variables, add:

**Required Variables:**
```bash
VITE_GEMINI_API_KEY=your_production_gemini_api_key
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

**Optional Variables (based on features used):**
```bash
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Step 4: Post-Deployment Setup 🔧

1. **Update Supabase Site URL:**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL: `https://your-project.vercel.app`

2. **Test Your Deployment:**
   - Visit your live URL
   - Test key features (login, navigation, etc.)
   - Check browser console for errors

## Advanced Configuration

### Custom Domain Setup
1. In Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `crnmn.com`)
3. Update DNS records as instructed by Vercel
4. Update Supabase site URL with your custom domain

### Performance Optimizations

The project is already optimized with:
- ✅ Code splitting by vendor
- ✅ Gzip & Brotli compression  
- ✅ Asset optimization
- ✅ Tree shaking
- ✅ Bundle analysis

### Troubleshooting

**Build Failed?**
```bash
# Test locally first
npm run build

# Check for missing environment variables
# Ensure all VITE_ prefixed variables are set in Vercel
```

**Environment Variables Not Working?**
- Variables must start with `VITE_` for client-side access
- Check spelling and values in Vercel dashboard
- Redeploy after adding variables

**Supabase Connection Issues?**
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Update Supabase site URL configuration
- Check CORS settings

## Deployment Architecture

```
GitHub Repository (cornmankl/CRNMN-Website)
    ↓ (Git Push)
Vercel Build System
    ↓ (npm run build)
Optimized Static Files (dist/)
    ↓ (Deploy)
Global CDN (Vercel Edge Network)
    ↓ (Serve)
Your Live Website 🌐
```

## Success Checklist ✅

After deployment, verify:
- [ ] Website loads correctly
- [ ] No console errors
- [ ] Environment variables working
- [ ] Supabase authentication working
- [ ] Mobile responsiveness
- [ ] Core features functional

---

**🎉 Your CRNMN Website is now live on Vercel!**

For updates, simply push to your GitHub repository - Vercel will automatically redeploy.