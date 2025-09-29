import React, { useEffect, useRef } from 'react';

// CSS loading configuration
interface CSSLoadConfig {
  href: string;
  rel?: string;
  as?: string;
  crossOrigin?: string;
  integrity?: string;
  onLoad?: () => void;
  onError?: () => void;
  preload?: boolean;
  priority?: 'high' | 'low';
}

// Asset loading configuration
interface AssetLoadConfig {
  src: string;
  as?: 'image' | 'script' | 'style' | 'font' | 'video' | 'audio';
  crossOrigin?: string;
  integrity?: string;
  onLoad?: () => void;
  onError?: () => void;
  preload?: boolean;
  priority?: 'high' | 'low';
}

// CSS loader utility
export const loadCSS = (config: CSSLoadConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    const {
      href,
      rel = 'stylesheet',
      as = 'style',
      crossOrigin,
      integrity,
      onLoad,
      onError,
      preload = false,
      priority = 'low',
    } = config;

    // Check if stylesheet already exists
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) {
      resolve();
      return;
    }

    if (preload) {
      // Create preload link
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = as;
      preloadLink.href = href;
      if (crossOrigin) preloadLink.crossOrigin = crossOrigin;
      if (integrity) preloadLink.integrity = integrity;
      
      if (priority === 'high') {
        document.head.appendChild(preloadLink);
      } else {
        // Add to end of head for low priority
        document.head.insertBefore(preloadLink, document.head.firstChild);
      }
    }

    // Create stylesheet link
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (crossOrigin) link.crossOrigin = crossOrigin;
    if (integrity) link.integrity = integrity;

    link.onload = () => {
      onLoad?.();
      resolve();
    };

    link.onerror = () => {
      onError?.();
      reject(new Error(`Failed to load CSS: ${href}`));
    };

    if (priority === 'high') {
      document.head.appendChild(link);
    } else {
      // Add to end of head for low priority
      document.head.insertBefore(link, document.head.firstChild);
    }
  });
};

// Asset preloader utility
export const preloadAsset = (config: AssetLoadConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    const {
      src,
      as = 'image',
      crossOrigin,
      integrity,
      onLoad,
      onError,
      priority = 'low',
    } = config;

    // Check if asset already exists
    const existingLink = document.querySelector(`link[href="${src}"]`);
    if (existingLink) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = src;
    if (crossOrigin) link.crossOrigin = crossOrigin;
    if (integrity) link.integrity = integrity;

    link.onload = () => {
      onLoad?.();
      resolve();
    };

    link.onerror = () => {
      onError?.();
      reject(new Error(`Failed to preload asset: ${src}`));
    };

    if (priority === 'high') {
      document.head.appendChild(link);
    } else {
      // Add to end of head for low priority
      document.head.insertBefore(link, document.head.firstChild);
    }
  });
};

// Critical CSS injector
export const injectCriticalCSS = (css: string): void => {
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  
  // Insert as first style element
  const firstStyle = document.querySelector('style');
  if (firstStyle) {
    document.head.insertBefore(style, firstStyle);
  } else {
    document.head.appendChild(style);
  }
};

// CSS optimization hook
export const useCSOptimization = () => {
  const [loadedCSS, setLoadedCSS] = React.useState<Set<string>>(new Set());
  const [loadingCSS, setLoadingCSS] = React.useState<Set<string>>(new Set());
  const [failedCSS, setFailedCSS] = React.useState<Set<string>>(new Set());

  const loadStylesheet = React.useCallback(async (href: string, options: Partial<CSSLoadConfig> = {}) => {
    if (loadedCSS.has(href) || loadingCSS.has(href)) {
      return;
    }

    setLoadingCSS(prev => new Set(prev).add(href));

    try {
      await loadCSS({ href, ...options });
      setLoadedCSS(prev => new Set(prev).add(href));
      setFailedCSS(prev => {
        const newSet = new Set(prev);
        newSet.delete(href);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to load stylesheet:', href, error);
      setFailedCSS(prev => new Set(prev).add(href));
    } finally {
      setLoadingCSS(prev => {
        const newSet = new Set(prev);
        newSet.delete(href);
        return newSet;
      });
    }
  }, [loadedCSS, loadingCSS]);

  const preloadStylesheet = React.useCallback(async (href: string, options: Partial<CSSLoadConfig> = {}) => {
    if (loadedCSS.has(href) || loadingCSS.has(href)) {
      return;
    }

    setLoadingCSS(prev => new Set(prev).add(href));

    try {
      await loadCSS({ href, preload: true, ...options });
      setLoadedCSS(prev => new Set(prev).add(href));
      setFailedCSS(prev => {
        const newSet = new Set(prev);
        newSet.delete(href);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to preload stylesheet:', href, error);
      setFailedCSS(prev => new Set(prev).add(href));
    } finally {
      setLoadingCSS(prev => {
        const newSet = new Set(prev);
        newSet.delete(href);
        return newSet;
      });
    }
  }, [loadedCSS, loadingCSS]);

  const isCSSLoaded = (href: string) => loadedCSS.has(href);
  const isCSSLoading = (href: string) => loadingCSS.has(href);
  const didCSSFail = (href: string) => failedCSS.has(href);

  return {
    loadedCSS,
    loadingCSS,
    failedCSS,
    loadStylesheet,
    preloadStylesheet,
    isCSSLoaded,
    isCSSLoading,
    didCSSFail,
  };
};

// Asset optimization hook
export const useAssetOptimization = () => {
  const [loadedAssets, setLoadedAssets] = React.useState<Set<string>>(new Set());
  const [loadingAssets, setLoadingAssets] = React.useState<Set<string>>(new Set());
  const [failedAssets, setFailedAssets] = React.useState<Set<string>>(new Set());

  const preloadAssetHook = React.useCallback(async (src: string, options: Partial<AssetLoadConfig> = {}) => {
    if (loadedAssets.has(src) || loadingAssets.has(src)) {
      return;
    }

    setLoadingAssets(prev => new Set(prev).add(src));

    try {
      await preloadAsset({ src, ...options });
      setLoadedAssets(prev => new Set(prev).add(src));
      setFailedAssets(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to preload asset:', src, error);
      setFailedAssets(prev => new Set(prev).add(src));
    } finally {
      setLoadingAssets(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });
    }
  }, [loadedAssets, loadingAssets]);

  const isAssetLoaded = (src: string) => loadedAssets.has(src);
  const isAssetLoading = (src: string) => loadingAssets.has(src);
  const didAssetFail = (src: string) => failedAssets.has(src);

  return {
    loadedAssets,
    loadingAssets,
    failedAssets,
    preloadAsset: preloadAssetHook,
    isAssetLoaded,
    isAssetLoading,
    didAssetFail,
  };
};

// Font loader utility
export const loadFont = (family: string, options: {
  weight?: string | number;
  style?: 'normal' | 'italic' | 'oblique';
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
} = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const {
      weight = '400',
      style = 'normal',
      display = 'swap',
      preload = true,
    } = options;

    // Check if font is already loaded using document.fonts.check()
    const isFontLoaded = document.fonts?.check(`${style} ${weight} 12px "${family}"`);
    if (isFontLoaded) {
      resolve();
      return;
    }

    if (preload) {
      // Create preload link
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'font';
      preloadLink.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&display=${display}`;
      preloadLink.crossOrigin = 'anonymous';
      document.head.appendChild(preloadLink);
    }

    // Create font link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&display=${display}`;
    link.crossOrigin = 'anonymous';

    link.onload = () => {
      // Wait for font to actually load
      const checkFont = setInterval(() => {
        if (document.fonts?.check(`${style} ${weight} 12px "${family}"`)) {
          clearInterval(checkFont);
          resolve();
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkFont);
        resolve(); // Resolve anyway to prevent blocking
      }, 5000);
    };

    link.onerror = () => {
      reject(new Error(`Failed to load font: ${family}`));
    };

    document.head.appendChild(link);
  });
};

// Critical CSS component
interface CriticalCSSProps {
  css: string;
  children?: React.ReactNode;
}

export const CriticalCSS: React.FC<CriticalCSSProps> = ({ css, children }) => {
  useEffect(() => {
    injectCriticalCSS(css);
  }, [css]);

  return React.createElement(React.Fragment, null, children);
};

// CSS preloader component
interface CSSPreloaderProps {
  stylesheets: string[];
  preload?: boolean;
  priority?: 'high' | 'low';
  onLoad?: (href: string) => void;
  onError?: (href: string) => void;
}

export const CSSPreloader: React.FC<CSSPreloaderProps> = ({
  stylesheets,
  preload = true,
  priority = 'low',
  onLoad,
  onError,
}) => {
  const { loadStylesheet, preloadStylesheet } = useCSOptimization();

  useEffect(() => {
    const loadStyles = async () => {
      for (const href of stylesheets) {
        try {
          if (preload) {
            await preloadStylesheet(href, { priority });
          } else {
            await loadStylesheet(href, { priority });
          }
          onLoad?.(href);
        } catch (error) {
          onError?.(href);
        }
      }
    };

    loadStyles();
  }, [stylesheets, preload, priority, loadStylesheet, preloadStylesheet, onLoad, onError]);

  return null;
};

// Asset preloader component
interface AssetPreloaderProps {
  assets: string[];
  as?: 'image' | 'script' | 'style' | 'font' | 'video' | 'audio';
  priority?: 'high' | 'low';
  onLoad?: (src: string) => void;
  onError?: (src: string) => void;
}

export const AssetPreloader: React.FC<AssetPreloaderProps> = ({
  assets,
  as = 'image',
  priority = 'low',
  onLoad,
  onError,
}) => {
  const { preloadAsset: preloadAssetHook } = useAssetOptimization();

  useEffect(() => {
    const preloadAssets = async () => {
      for (const src of assets) {
        try {
          await preloadAssetHook(src, { as, priority });
          onLoad?.(src);
        } catch (error) {
          onError?.(src);
        }
      }
    };

    preloadAssets();
  }, [assets, as, priority, preloadAssetHook, onLoad, onError]);

  return null;
};

// Font loader component
interface FontLoaderProps {
  fonts: Array<{
    family: string;
    weight?: string | number;
    style?: 'normal' | 'italic' | 'oblique';
  }>;
  onLoad?: (family: string) => void;
  onError?: (family: string) => void;
}

export const FontLoader: React.FC<FontLoaderProps> = ({
  fonts,
  onLoad,
  onError,
}) => {
  useEffect(() => {
    const loadFonts = async () => {
      for (const font of fonts) {
        try {
          await loadFont(font.family, font);
          onLoad?.(font.family);
        } catch (error) {
          onError?.(font.family);
        }
      }
    };

    loadFonts();
  }, [fonts, onLoad, onError]);

  return null;
};

// Performance monitoring for CSS and assets
export const AssetPerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    // Monitor CSS and asset load times
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (
          entry.name.includes('.css') ||
          entry.name.includes('.js') ||
          entry.name.includes('.png') ||
          entry.name.includes('.jpg') ||
          entry.name.includes('.jpeg') ||
          entry.name.includes('.webp') ||
          entry.name.includes('.woff') ||
          entry.name.includes('.woff2') ||
          entry.name.includes('.ttf')
        ) {
          setMetrics(prev => ({
            ...prev,
            [entry.name]: entry.duration,
          }));
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Log slow-loading assets
  React.useEffect(() => {
    Object.entries(metrics).forEach(([asset, duration]) => {
      if (duration > 3000) { // 3 seconds
        console.warn(`Slow asset load: ${asset} took ${duration}ms`);
      }
    });
  }, [metrics]);

  return null;
};

// Resource hints utility
export const addResourceHints = (hints: Array<{
  href: string;
  rel: 'preconnect' | 'dns-prefetch' | 'prefetch' | 'prerender';
  crossOrigin?: string;
}>) => {
  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
    document.head.appendChild(link);
  });
};

// Service worker registration for asset caching
export const registerServiceWorker = async (swPath: string = '/sw.js'): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(swPath);
      console.log('Service Worker registered successfully:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Offline asset manager
export const useOfflineAssets = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheAssets = React.useCallback(async (assets: string[]) => {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const cache = await caches.open('offline-assets');
        await cache.addAll(assets);
        console.log('Assets cached for offline use');
      } catch (error) {
        console.error('Failed to cache assets:', error);
      }
    }
  }, []);

  return {
    isOnline,
    cacheAssets,
  };
};

export default {
  loadCSS,
  preloadAsset,
  injectCriticalCSS,
  useCSOptimization,
  useAssetOptimization,
  loadFont,
  CriticalCSS,
  CSSPreloader,
  AssetPreloader,
  FontLoader,
  AssetPerformanceMonitor,
  addResourceHints,
  registerServiceWorker,
  useOfflineAssets,
};
