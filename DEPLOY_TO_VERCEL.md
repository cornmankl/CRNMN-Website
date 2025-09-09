# 🚀 Deploy CRNMN Website ke Vercel - Panduan Lengkap

## 🎯 Persiapan Pre-Deployment

### ✅ Status Projek:
- [x] Build configuration sudah diperbaiki
- [x] Vercel configuration (`vercel.json`) sudah siap
- [x] Environment variables template (`.env.production`) sudah ada
- [x] TypeScript dan React import sudah diperbaiki  
- [x] Project build berhasil tanpa error

## 🌐 Cara 1: Deploy Melalui Vercel Dashboard (Direkomendasikan)

### Langkah 1: Persiapan Repository
1. **Pastikan semua perubahan sudah di-commit dan di-push ke GitHub**
2. **Verify build berjalan dengan baik:**
   ```bash
   npm run build
   ```

### Langkah 2: Deploy ke Vercel
1. **Buka [vercel.com](https://vercel.com)**
2. **Sign in dengan GitHub account anda**
3. **Klik "New Project"**
4. **Import repository `cornmankl/CRNMN-Website`**
5. **Vercel akan auto-detect settings:**
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Klik "Deploy"** ✨

### Langkah 3: Configure Environment Variables
Di Vercel Dashboard → Project Settings → Environment Variables, tambahkan:

**Required untuk basic functionality:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**AI Services (opsional):**
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

**AI Configuration (opsional):**
```env
VITE_AI_DEFAULT_MODEL=gemini-pro
VITE_AI_MAX_TOKENS=2000
VITE_AI_TEMPERATURE=0.7
VITE_AI_ENABLE_IMAGE_GENERATION=true
```

### Langkah 4: Redeploy
Setelah menambah environment variables, klik **"Redeploy"** dalam Vercel dashboard.

## 🖥️ Cara 2: Deploy Melalui CLI

### Langkah 1: Install & Setup Vercel CLI
```bash
# Install Vercel CLI (sudah diinstall)
npm install -g vercel

# Login ke Vercel
vercel login
```

### Langkah 2: Deploy
```bash
# Deploy ke production
vercel --prod
```

### Langkah 3: Configure Environment Variables
```bash
# Tambah environment variables melalui CLI
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_GEMINI_API_KEY production
```

## ⚙️ Konfigurasi yang Sudah Ada

### 📄 vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci --omit=dev",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 🔧 Optimisasi Build
- ✅ Code splitting untuk loading lebih cepat
- ✅ Gzip & Brotli compression
- ✅ Bundle analyzer untuk monitoring size
- ✅ Tree shaking untuk bundle lebih kecil
- ✅ CSS code splitting
- ✅ Asset optimization

## 🔐 Environment Variables yang Diperlukan

### **Wajib:**
- `VITE_SUPABASE_URL` - URL project Supabase anda
- `VITE_SUPABASE_ANON_KEY` - Anon key dari Supabase

### **Opsional untuk AI Features:**
- `VITE_GEMINI_API_KEY` - Google Gemini API key
- `VITE_OPENAI_API_KEY` - OpenAI API key  
- `VITE_ANTHROPIC_API_KEY` - Anthropic Claude API key
- `VITE_GLM_API_KEY` - GLM API key

### **Konfigurasi AI (opsional):**
- `VITE_AI_DEFAULT_MODEL` - Model AI default
- `VITE_AI_MAX_TOKENS` - Max tokens per request
- `VITE_AI_TEMPERATURE` - AI response creativity (0-1)

## 🔗 Custom Domain (Opsional)

### Langkah 1: Tambah Domain di Vercel
1. **Vercel Dashboard → Project → Settings → Domains**
2. **Tambah domain anda (e.g., `crnmn.my` atau `cornman.xyz`)**

### Langkah 2: Update DNS Records
```dns
# Untuk root domain (example.com)
A Record: @ → 76.76.19.19

# Untuk subdomain (www.example.com)  
CNAME Record: www → cname.vercel-dns.com

# Untuk custom subdomain (crnmn.example.com)
CNAME Record: crnmn → cname.vercel-dns.com
```

## 📊 Post-Deployment Testing

### ✅ Testing Checklist:
- [ ] **Homepage loads dengan betul**
- [ ] **Menu section menampilkan semua items**
- [ ] **Cart functionality berfungsi**
- [ ] **Authentication flow berjalan**
- [ ] **Mobile responsiveness**
- [ ] **Performance check (PageSpeed Insights)**
- [ ] **PWA features berfungsi**

### 🔍 Debugging Common Issues

**Build Failures:**
```bash
# Clear cache dan rebuild
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variable Issues:**
- Pastikan variables dimulai dengan `VITE_` untuk client-side access
- Check Vercel dashboard untuk memastikan variables sudah ditambah dengan betul

## 🎉 Selesai!

Setelah deployment berhasil:
1. **✅ Website anda akan live di URL Vercel**
2. **✅ Auto-deploy akan aktif untuk setiap git push**
3. **✅ SSL certificate auto-generated**
4. **✅ Global CDN active**

**Website anda sekarang sudah live dan siap digunakan! 🌽**

---

### 📝 Notes:
- Deployment pertama mungkin ambil 2-5 minit
- Setiap git push akan trigger auto-deployment
- Monitor performance melalui Vercel Analytics
- Update environment variables bila perlu melalui Vercel dashboard