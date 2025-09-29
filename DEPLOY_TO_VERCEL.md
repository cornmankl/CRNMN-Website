# 🚀 CRNMN Website - Deploy to Vercel Guide

## ✅ Prerequisites Fixed

This repository is now ready for Vercel deployment with the following fixes applied:

- ✅ **Index.html**: Created missing `index.html` file at root (required for Vite)
- ✅ **Build Configuration**: Updated `vite.config.ts` with proper global definitions
- ✅ **Vercel Configuration**: Optimized `vercel.json` with caching and security headers
- ✅ **Deploy Script**: Made executable and copied to root directory

## 🚀 Quick Deploy Options

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```

### Option 2: Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Click "New Project"**

3. **Import your GitHub repository:**
   - Select `cornmankl/CRNMN-Website`
   - Click "Import"

4. **Vercel will auto-detect:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

5. **Click "Deploy"** ✨

## 🔧 Environment Variables (Optional)

The app will work with default Supabase configuration, but you can add these optional variables:

```bash
# AI Services (Optional)
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_OPENAI_API_KEY=your-openai-api-key

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Payment (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
```

## ✅ Deployment Verification

After deployment:

1. **Check build output** - Should show ~5 chunks with proper sizes
2. **Verify live URL** - Site should load without errors
3. **Test core features:**
   - Navigation menu
   - Food delivery interface
   - Responsive design

## 🛠️ Troubleshooting

### Build Fails?
```bash
# Test locally first
npm install
npm run build

# Check for any TypeScript errors
npm run type-check
```

### Deployment Issues?

1. **Check Vercel build logs** in the dashboard
2. **Verify `vercel.json` configuration**
3. **Ensure all dependencies are in `package.json`**

### Performance Optimization

The build is already optimized with:
- Code splitting (vendor, UI, Supabase chunks)
- Asset caching headers
- Gzip compression
- Security headers

## 📊 Expected Build Output

```
dist/index.html                   ~1.76 kB
dist/assets/index-*.css          ~117 kB (18.57 kB gzipped)
dist/assets/ui-*.js              ~65.5 kB (23.67 kB gzipped)
dist/assets/supabase-*.js        ~123 kB (34.19 kB gzipped)
dist/assets/vendor-*.js          ~142 kB (45.62 kB gzipped)
dist/assets/index-*.js           ~815 kB (218.23 kB gzipped)
```

## 🎉 Success!

Your CRNMN Website should now be live on Vercel! 

The deployment URL will be something like: `https://crnmn-website-xxx.vercel.app`

---

**Need help?** Check the [Vercel Documentation](https://vercel.com/docs) or create an issue in this repository.