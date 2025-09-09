# CRNMN Website

This is a code bundle for CRNMN Website Improvement Suggestions. The original project is available at https://www.figma.com/design/wt62OQWqx6cNpLnf9mh0WQ/CRNMN-Website-Improvement-Suggestions.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## 🚀 Deployment to Vercel

### Quick Deploy
```bash
# Option 1: Use our deployment script (Recommended)
./deploy-vercel.sh

# Option 2: Manual deployment
npm run build
npx vercel --prod
```

### Detailed Instructions
See `DEPLOY_TO_VERCEL.md` for complete deployment guide including:
- Environment variables setup
- Custom domain configuration
- Troubleshooting tips

### Current Status
✅ Build configuration fixed and working  
✅ Vercel configuration ready (`vercel.json`)  
✅ Environment variables template provided  
✅ Optimized production build with code splitting  

This project is configured for deployment on Vercel with the following settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite + React
