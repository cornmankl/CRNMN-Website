# CRNMN Website - Perubahan untuk Fix Deploy ke Vercel

## Isu yang Dikenal Pasti:
1. Ralat "React is not defined" semasa deploy ke Vercel
2. Konfigurasi Vite yang tidak optimal untuk deploy ke Vercel
3. Komponen-komponen yang tidak mengimport React dengan betul

## Perubahan yang Telah Dibuat:

### 1. Konfigurasi Vite
- Mengeluarkan konfigurasi HMR khusus untuk Cloud Workstations
- Menyimpan konfigurasi yang lebih universal untuk deploy ke Vercel

### 2. Komponen-komponen yang Telah Dibetulkan:
- HeroSection.tsx - Menambah import React
- Footer.tsx - Menambah import React
- Header.tsx - Menambah import React
- CartSheet.tsx - Menambah import React
- AuthModal.tsx - Menambah import React
- PWARegistration.tsx - Menambah import React

### 3. Konfigurasi untuk Vercel:
- Menambah vercel.json dengan konfigurasi yang sesuai
- Menambah .env.production untuk environment variables

### 4. Konfigurasi TypeScript:
- Memastikan "jsx": "react-jsx" dalam tsconfig.json untuk membolehkan penggunaan JSX tanpa mengimport React secara explisit

## Arahan Deploy ke Vercel:

1. Pastikan semua environment variables telah ditetapkan dalam Vercel dashboard:
   - VITE_GEMINI_API_KEY
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - dll.

2. Jalankan build menggunakan arahan:
   ```
   npm run build
   ```

3. Output akan dihasilkan dalam direktori "dist"

## Masalah yang Telah Diselesaikan:
- Ralat "React is not defined" telah diselesaikan dengan menambah import React dalam komponen-komponen yang memerlukannya
- Konfigurasi Vite telah dioptimalkan untuk deploy ke Vercel
- Fail konfigurasi untuk Vercel telah ditambah

## Cadangan untuk Masa Depan:
1. Pertimbangkan untuk menggunakan React 17+ "new JSX transform" sepenuhnya dengan memastikan semua komponen menggunakan konfigurasi yang betul
2. Tambah pengujian untuk memastikan komponen berfungsi dengan betul dalam persekitaran production
3. Periksa semula konfigurasi environment variables untuk memastikan keselamatan API keys