# 🚀 Quick Start Implementation Guide

## Step 1: Install Required Dependencies

```bash
npm install react-router-dom@6
npm install -D @tailwindcss/forms @tailwindcss/typography @tailwindcss/container-queries tailwindcss-animate
```

## Step 2: Update Configuration Files

### 2.1 Update `vite.config.ts`

The compression plugin import has already been fixed. No changes needed.

### 2.2 Create `postcss.config.js`

```bash
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
```

### 2.3 Update `package.json` scripts

Add these scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "analyze": "vite build --mode analyze"
  }
}
```

## Step 3: Apply New Theme

### 3.1 Update `src/index.css`

Replace the existing CSS imports with:

```css
@import './styles/theme.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3.2 Test the theme

```bash
npm run dev
```

Visit http://localhost:3000 and check the console for errors.

## Step 4: Implement React Router (Phase 1)

### 4.1 Create router structure

```bash
mkdir -p src/app/router
mkdir -p src/pages
```

### 4.2 Create `src/app/router/router.tsx`

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '../layouts/RootLayout';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const MenuPage = lazy(() => import('@/pages/MenuPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'menu',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MenuPage />
          </Suspense>
        ),
      },
      {
        path: 'cart',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CartPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
```

### 4.3 Create `src/app/layouts/RootLayout.tsx`

```typescript
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
```

### 4.4 Create initial pages

Create `src/pages/HomePage.tsx`:
```typescript
export default function HomePage() {
  return (
    <div>
      <h1 className="text-4xl font-display font-bold text-gradient">
        Welcome to CRNMN
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Premium corn restaurant experience
      </p>
    </div>
  );
}
```

Create similar files for `MenuPage.tsx`, `CartPage.tsx`, `ProfilePage.tsx`.

### 4.5 Update `main.tsx` to use router

```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { AppRouter } from './app/router/router';
import './index.css';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from 'next-themes';
import './react-global';
import { EnhancedErrorBoundary } from './src/components/ui/EnhancedErrorBoundary';

const AppWrapper = () => {
  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Application Error:', error, errorInfo);
      }}
      resetOnPropsChange={true}
    >
      <HelmetProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <AppRouter />
          </QueryProvider>
        </ThemeProvider>
      </HelmetProvider>
    </EnhancedErrorBoundary>
  );
};

createRoot(document.getElementById('root')!).render(<AppWrapper />);
```

## Step 5: Split CSS (Immediate Win)

### 5.1 Create modular CSS files

```bash
mkdir -p src/styles/base
mkdir -p src/styles/components
mkdir -p src/styles/utilities
```

### 5.2 Create `src/styles/base/reset.css`

```css
/* Modern CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

#root {
  isolation: isolate;
}
```

### 5.3 Update `src/index.css`

```css
@import './styles/base/reset.css';
@import './styles/theme.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 6: Add Component Memoization (Quick Win)

Update your frequently rendered components:

```typescript
import { memo } from 'react';

export const MenuCard = memo(({ item, onAddToCart }: MenuCardProps) => {
  // ... component logic
}, (prevProps, nextProps) => {
  // Only re-render if these props change
  return prevProps.item.id === nextProps.item.id &&
         prevProps.item.price === nextProps.item.price;
});

MenuCard.displayName = 'MenuCard';
```

## Step 7: Test Everything

```bash
# Type check
npm run type-check

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Step 8: Gradual Migration Strategy

### Week 1: Foundation
- ✅ Install dependencies
- ✅ Apply new theme
- ✅ Setup React Router
- ✅ Split CSS files
- [ ] Add component memoization

### Week 2: Structure
- [ ] Create feature folders
- [ ] Move components to features
- [ ] Setup proper TypeScript types
- [ ] Add error boundaries per route

### Week 3: Optimization
- [ ] Implement lazy loading
- [ ] Add code splitting
- [ ] Optimize bundle size
- [ ] Performance audit

### Week 4: Polish
- [ ] Add animations
- [ ] Improve mobile UX
- [ ] SEO improvements
- [ ] Accessibility audit

## Common Issues & Solutions

### Issue 1: Module not found errors
**Solution:** Update import paths to use `@/` alias. Check `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue 2: Tailwind classes not applying
**Solution:** Make sure `tailwind.config.ts` content paths include all files:
```typescript
content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}',
]
```

### Issue 3: Router not working
**Solution:** Ensure BrowserRouter basename matches your deployment path.

## Verification Checklist

- [ ] All console errors resolved
- [ ] Theme colors displaying correctly
- [ ] Dark mode toggle working
- [ ] Navigation between pages works
- [ ] Build completes without errors
- [ ] Production build loads correctly
- [ ] Mobile responsive
- [ ] Accessibility (keyboard navigation)

## Next Steps

1. Review the full `COMPREHENSIVE_IMPROVEMENTS.md` file
2. Implement the new folder structure gradually
3. Migrate components feature by feature
4. Run performance audits regularly
5. Monitor bundle size

## Need Help?

- Check the console for errors
- Review component import paths
- Verify CSS is loading correctly
- Test in both light and dark modes
- Use React DevTools to debug

---

**Remember:** Implement changes incrementally. Test after each major change. Don't try to migrate everything at once!
