# 🚀 Deploy to Vercel

This guide provides simple steps to deploy the CRNMN Website to Vercel.

## Quick Deployment Options

### Option 1: Using the Deploy Script (Recommended)

```bash
# Make sure you're in the project root
./deploy-to-vercel.sh
```

This script will:
- ✅ Install Vercel CLI if needed
- ✅ Install dependencies
- ✅ Build the project
- ✅ Deploy to Vercel

### Option 2: Manual CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 3: GitHub Integration (Web Dashboard)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import this GitHub repository
4. Vercel will auto-detect the settings from `vercel.json`
5. Click "Deploy"

## Environment Variables

After deployment, set up your environment variables in the Vercel dashboard:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Optional:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_GEMINI_API_KEY`

See `.env.example` for the complete list.

## Post-Deployment

1. **Update Supabase Settings:**
   - Add your Vercel URL to Supabase Authentication settings
   - Update CORS configuration

2. **Custom Domain (Optional):**
   - Configure in Vercel dashboard under Project Settings → Domains

## Troubleshooting

- **Build Failed?** Check `npm run build` works locally first
- **Environment Variables?** Ensure they start with `NEXT_PUBLIC_` for client-side access
- **Need Help?** Check the detailed guides in `src/DEPLOY_NOW.md` and `src/DEPLOYMENT_GUIDE.md`

---

🌽 **Your CORNMAN app will be live at:** `https://your-project.vercel.app`