# CRNMN Website - Vercel Deployment Guide

## Quick Deployment to Vercel

This project is ready for deployment to Vercel. Follow these steps:

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Connection**: Connect your GitHub account to Vercel
3. **Environment Variables**: Prepare your production environment variables

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Import Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from your GitHub repository: `cornmankl/CRNMN-Website`

2. **Configure Build Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci --omit=dev`
   
   *(These are pre-configured in `vercel.json`)*

3. **Set Environment Variables**:
   Add the following environment variables in Vercel Dashboard:
   
   **Required AI Service Variables:**
   ```
   VITE_GEMINI_API_KEY=your_production_gemini_api_key
   VITE_OPENAI_API_KEY=your_production_openai_api_key
   VITE_ANTHROPIC_API_KEY=your_production_anthropic_api_key
   VITE_GLM_API_KEY=your_production_glm_api_key
   ```
   
   **Supabase Variables:**
   ```
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   ```
   
   **Optional Services:**
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build completion (typically 2-3 minutes)
   - Your site will be live at `https://your-project-name.vercel.app`

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Build Configuration

The project includes optimized build settings:

- **Code Splitting**: Automatic chunk splitting for better loading performance
- **Compression**: Gzip and Brotli compression enabled
- **PWA Support**: Service worker and manifest included
- **Security Headers**: CSP and security headers configured
- **Asset Optimization**: Images and fonts optimized for web

### Environment Variables Reference

See `.env.example` for a complete list of available environment variables.

**Critical for Production:**
- `VITE_GEMINI_API_KEY` - Google Gemini AI integration
- `VITE_SUPABASE_URL` - Database connection
- `VITE_SUPABASE_ANON_KEY` - Database public key

### Performance Features

The deployment includes:
- ✅ Bundle splitting and lazy loading
- ✅ Gzip/Brotli compression
- ✅ Progressive Web App (PWA) capabilities
- ✅ Optimized asset caching
- ✅ Security headers
- ✅ CDN delivery via Vercel Edge Network

### Post-Deployment

1. **Verify Deployment**:
   - Test all major features
   - Check browser console for errors
   - Verify environment variables are loaded

2. **Set Custom Domain** (Optional):
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS records as instructed

3. **Monitor Performance**:
   - Use Vercel Analytics
   - Monitor Core Web Vitals
   - Check error logs in Vercel Dashboard

### Troubleshooting

**Build Failures:**
- Check environment variables are set correctly
- Ensure all required API keys are provided
- Review build logs in Vercel Dashboard

**Runtime Errors:**
- Check browser console for client-side errors
- Verify API endpoints are accessible
- Confirm environment variables are prefixed with `VITE_`

**Performance Issues:**
- Review bundle analysis at `/stats.html` after build
- Check network tab for slow-loading resources
- Monitor Vercel analytics for insights

### Support

For deployment issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review build logs in Vercel Dashboard
3. Test locally with `npm run build && npm run preview`

---

**Ready to deploy?** The project is fully configured and optimized for Vercel deployment.