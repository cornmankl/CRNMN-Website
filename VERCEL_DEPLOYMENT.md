# CRNMN Website - Vercel Production Deployment Guide

## Overview

This guide covers deploying the CRNMN website to Vercel for production use. The application is a modern React + Vite + TypeScript project with AI integration, authentication, payments, and PWA capabilities.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: You'll need API keys for various services

## Deployment Methods

### Method 1: Automated Deployment via GitHub Actions (Recommended)

1. **Set up Vercel secrets in GitHub**:
   - Go to your GitHub repository settings
   - Navigate to **Secrets and variables** → **Actions**
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel token (get from [Vercel Settings](https://vercel.com/account/tokens))
     - `VERCEL_ORG_ID`: Your Vercel organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel project ID

2. **Create a Vercel project**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Create a new project
   vercel --name crnmn-website
   ```

3. **Configure environment variables in Vercel**:
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add all variables from `.env.production` with actual values

4. **Deploy**:
   - Push to `main` branch for production deployment
   - Create a PR for preview deployment

### Method 2: Direct Vercel CLI Deployment

1. **Install and setup Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Build the project**:
   ```bash
   npm install --ignore-scripts
   npm run build
   ```

3. **Deploy**:
   ```bash
   # Deploy to production
   vercel --prod
   
   # Or deploy for preview
   vercel
   ```

### Method 3: Vercel Dashboard Integration

1. **Connect GitHub repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"New Project"**
   - Import your GitHub repository

2. **Configure build settings**:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --ignore-scripts`

3. **Set environment variables** in the project settings

## Required Environment Variables

### Core Services
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### AI Services (Optional but recommended)
```
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Firebase (for auth and analytics)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

See `.env.production` for the complete list.

## Build Configuration

The project uses an optimized Vite configuration with:

- **Code splitting**: Separate chunks for different library types
- **Compression**: Gzip and Brotli compression
- **Bundle analysis**: Generated stats.html for bundle inspection
- **Security headers**: CSP and security headers via vercel.json

## Performance Optimizations

1. **Caching Strategy**:
   - Static assets cached for 1 year (immutable)
   - HTML files have no cache (for dynamic updates)

2. **Compression**:
   - Gzip and Brotli compression enabled
   - Reduces bundle size by ~70%

3. **Code Splitting**:
   - React vendor chunk (~140KB)
   - UI libraries chunk (~120KB)
   - Database libraries chunk (~120KB)
   - Main application code (~677KB)

## Security Configuration

The `vercel.json` includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` for camera/microphone/location

## Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test AI features with actual API keys
- [ ] Test payment flow with Stripe
- [ ] Verify authentication works
- [ ] Check PWA functionality
- [ ] Test mobile responsiveness
- [ ] Verify analytics tracking
- [ ] Check all external integrations

## Troubleshooting

### Common Issues

1. **Build fails with "vite: not found"**:
   - Ensure dependencies are installed correctly
   - Check that vite is in devDependencies

2. **Environment variables not working**:
   - Ensure variables start with `VITE_`
   - Check they're set in Vercel dashboard
   - Verify no typos in variable names

3. **Cypress installation fails**:
   - Use `npm install --ignore-scripts` to skip Cypress
   - Cypress is only needed for local testing

4. **Large bundle size warnings**:
   - Review the generated `stats.html` in dist folder
   - Consider lazy loading heavy components

## Monitoring and Analytics

- **Bundle Analysis**: Check `dist/stats.html` after build
- **Web Vitals**: Built-in web vitals monitoring
- **Error Tracking**: Configure error reporting services
- **Performance**: Monitor Core Web Vitals in production

## Support

For deployment issues:
1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Check GitHub Actions logs for automated deployments
4. Ensure all required environment variables are properly set