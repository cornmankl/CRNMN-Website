import React, { useState, useEffect, useRef } from 'react';

// Progressive image loading configuration
interface ProgressiveImageConfig {
  src: string;
  placeholder?: string;
  fallback?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  blurAmount?: number;
  transitionDuration?: number;
  lazy?: boolean;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
  retryCount?: number;
  retryDelay?: number;
}

// Image loading states
type ImageLoadingState = 'idle' | 'loading' | 'loaded' | 'error';

// Progressive image component
export const ProgressiveImage: React.FC<ProgressiveImageConfig> = ({
  src,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
  fallback,
  alt = '',
  width,
  height,
  className = '',
  blurAmount = 10,
  transitionDuration = 300,
  lazy = true,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  retryCount = 3,
  retryDelay = 1000,
}) => {
  const [loadingState, setLoadingState] = useState<ImageLoadingState>('idle');
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load image with retry logic
  const loadImage = React.useCallback(async (imageSrc: string) => {
    setLoadingState('loading');
    
    try {
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSrc;
      });

      setCurrentSrc(imageSrc);
      setLoadingState('loaded');
      onLoad?.();
    } catch (error) {
      console.error('Failed to load image:', error);
      
      if (retryAttempt < retryCount) {
        setRetryAttempt(prev => prev + 1);
        setTimeout(() => {
          loadImage(imageSrc);
        }, retryDelay * (retryAttempt + 1));
      } else {
        setLoadingState('error');
        if (fallback) {
          setCurrentSrc(fallback);
        }
        onError?.();
      }
    }
  }, [retryAttempt, retryCount, onLoad, onError, fallback]);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && loadingState === 'idle') {
          loadImage(src);
          observerRef.current?.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, src, loadingState, threshold, rootMargin, loadImage]);

  // Load immediately if not lazy
  useEffect(() => {
    if (!lazy && loadingState === 'idle') {
      loadImage(src);
    }
  }, [lazy, src, loadingState, loadImage]);

  // Calculate blur style
  const getBlurStyle = () => {
    if (loadingState === 'loaded') {
      return {
        filter: 'blur(0px)',
        transition: `filter ${transitionDuration}ms ease-in-out`,
      };
    }
    return {
      filter: `blur(${blurAmount}px)`,
      transition: `filter ${transitionDuration}ms ease-in-out`,
    };
  };

  // Get image dimensions
  const getImageDimensions = () => {
    const dimensions: React.CSSProperties = {};
    if (width) dimensions.width = width;
    if (height) dimensions.height = height;
    return dimensions;
  };

  return React.createElement('div', {
    className: `relative overflow-hidden ${className}`,
    style: getImageDimensions(),
  },
    React.createElement('img', {
      ref: imgRef,
      src: currentSrc,
      alt: alt,
      className: 'w-full h-full object-cover',
      style: getBlurStyle(),
      loading: lazy ? 'lazy' : 'eager',
    }),
    // Loading overlay
    loadingState === 'loading' && React.createElement('div', {
      className: 'absolute inset-0 bg-gray-200 flex items-center justify-center',
      style: {
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      },
    }),
    // Error overlay
    loadingState === 'error' && !fallback && React.createElement('div', {
      className: 'absolute inset-0 bg-red-100 flex items-center justify-center',
    },
      React.createElement('div', {
        className: 'text-red-600 text-sm text-center p-2',
      }, 'Failed to load image')
    ),
    // Shimmer animation keyframes
    React.createElement('style', {
      dangerouslySetInnerHTML: {
        __html: `
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `,
      },
    })
  );
};

// Background image progressive loader
interface ProgressiveBackgroundConfig {
  src: string;
  placeholder?: string;
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
  blurAmount?: number;
  transitionDuration?: number;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  retryCount?: number;
  retryDelay?: number;
}

export const ProgressiveBackground: React.FC<ProgressiveBackgroundConfig> = ({
  src,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
  fallback,
  className = '',
  children,
  blurAmount = 20,
  transitionDuration = 500,
  lazy = true,
  onLoad,
  onError,
  retryCount = 3,
  retryDelay = 1000,
}) => {
  const [loadingState, setLoadingState] = useState<ImageLoadingState>('idle');
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load background image with retry logic
  const loadImage = React.useCallback(async (imageSrc: string) => {
    setLoadingState('loading');
    
    try {
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSrc;
      });

      setCurrentSrc(imageSrc);
      setLoadingState('loaded');
      onLoad?.();
    } catch (error) {
      console.error('Failed to load background image:', error);
      
      if (retryAttempt < retryCount) {
        setRetryAttempt(prev => prev + 1);
        setTimeout(() => {
          loadImage(imageSrc);
        }, retryDelay * (retryAttempt + 1));
      } else {
        setLoadingState('error');
        if (fallback) {
          setCurrentSrc(fallback);
        }
        onError?.();
      }
    }
  }, [retryAttempt, retryCount, onLoad, onError, fallback]);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!lazy || !containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && loadingState === 'idle') {
          loadImage(src);
          observerRef.current?.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, src, loadingState, loadImage]);

  // Load immediately if not lazy
  useEffect(() => {
    if (!lazy && loadingState === 'idle') {
      loadImage(src);
    }
  }, [lazy, src, loadingState, loadImage]);

  // Calculate background style
  const getBackgroundStyle = () => {
    const baseStyle: React.CSSProperties = {
      backgroundImage: `url(${currentSrc})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      transition: `filter ${transitionDuration}ms ease-in-out`,
    };

    if (loadingState === 'loaded') {
      baseStyle.filter = 'blur(0px)';
    } else {
      baseStyle.filter = `blur(${blurAmount}px)`;
    }

    return baseStyle;
  };

  return React.createElement('div', {
    ref: containerRef,
    className: `relative ${className}`,
    style: getBackgroundStyle(),
  },
    children,
    // Loading overlay
    loadingState === 'loading' && React.createElement('div', {
      className: 'absolute inset-0 bg-gray-200',
      style: {
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      },
    }),
    // Error overlay
    loadingState === 'error' && !fallback && React.createElement('div', {
      className: 'absolute inset-0 bg-red-100',
    }),
    // Shimmer animation keyframes
    React.createElement('style', {
      dangerouslySetInnerHTML: {
        __html: `
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `,
      },
    })
  );
};

// Image gallery with progressive loading
interface ProgressiveGalleryConfig {
  images: string[];
  placeholder?: string;
  fallback?: string;
  className?: string;
  columns?: number;
  gap?: string;
  aspectRatio?: string;
  lazy?: boolean;
  onLoad?: (index: number) => void;
  onError?: (index: number) => void;
}

export const ProgressiveGallery: React.FC<ProgressiveGalleryConfig> = ({
  images,
  placeholder,
  fallback,
  className = '',
  columns = 3,
  gap = '1rem',
  aspectRatio = '1/1',
  lazy = true,
  onLoad,
  onError,
}) => {
  return React.createElement(
    'div',
    {
      className: `grid gap-${gap} ${className}`,
      style: {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      },
    },
    ...images.map((src, index) =>
      React.createElement('div', {
        key: index,
        className: 'relative overflow-hidden',
        style: { paddingBottom: `calc(${aspectRatio} * 100%)` },
      },
        React.createElement(ProgressiveImage, {
          src,
          placeholder,
          fallback,
          alt: `Gallery image ${index + 1}`,
          className: 'absolute inset-0',
          lazy,
          onLoad: () => onLoad?.(index),
          onError: () => onError?.(index),
        })
      )
    )
  );
};

// Image preloader utility
export const useImagePreloader = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const preloadImage = React.useCallback(async (src: string) => {
    if (loadedImages.has(src) || loadingImages.has(src)) {
      return;
    }

    setLoadingImages(prev => new Set(prev).add(src));

    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });

      setLoadedImages(prev => new Set(prev).add(src));
      setFailedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to preload image:', src, error);
      setFailedImages(prev => new Set(prev).add(src));
    } finally {
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });
    }
  }, [loadedImages, loadingImages]);

  const preloadImages = React.useCallback((srcs: string[]) => {
    srcs.forEach(src => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          preloadImage(src);
        });
      } else {
        setTimeout(() => {
          preloadImage(src);
        }, 100);
      }
    });
  }, [preloadImage]);

  const isImageLoaded = (src: string) => loadedImages.has(src);
  const isImageLoading = (src: string) => loadingImages.has(src);
  const didImageFail = (src: string) => failedImages.has(src);

  return {
    loadedImages,
    loadingImages,
    failedImages,
    preloadImage,
    preloadImages,
    isImageLoaded,
    isImageLoading,
    didImageFail,
  };
};

// Image optimization hook
export const useImageOptimization = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check for modern image format support
    const checkSupport = async () => {
      const formats = ['webp', 'avif'];
      const supported: string[] = [];

      for (const format of formats) {
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = `data:image/${format};base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAs1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0OCByMjY0MyA1YzY1NzA0IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAZAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACGHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAgAAAAIAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAGQAAAAAAAEAAAAAAZBtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAACgAAAAEAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAE7bWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAA+3N0YmwAAACXc3RzZAAAAAAAAAABAAAAh2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAgACAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwFkAAr/4QAYZ2QACqzZX4iIhAAAAwAEAAADAFA8SJZYAQAGaOvjyyLAAAAAGHN0dHMAAAAAAAAAAQAAAAEAAAQAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAABRzdHN6AAAAAAAAAsUAAAABAAAAFHN0Y28AAAAAAAAAAQAAADAAAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal0b28AAAAdZGF0YQAAAAEAAAAATGF2ZjU2LjQwLjEwMQ==`;
          await new Promise((resolve) => setTimeout(resolve, 100));
          if (img.width > 0 && img.height > 0) {
            supported.push(format);
          }
        } catch (error) {
          // Format not supported
        }
      }

      setIsSupported(supported.length > 0);
    };

    checkSupport();
  }, []);

  const getOptimizedImageUrl = React.useCallback((src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}) => {
    const { width, height, quality = 80, format = 'webp' } = options;
    
    // If modern formats are supported and requested, use them
    if (isSupported && (format === 'webp' || format === 'avif')) {
      const url = new URL(src, window.location.origin);
      url.searchParams.set('format', format);
      url.searchParams.set('quality', quality.toString());
      if (width) url.searchParams.set('width', width.toString());
      if (height) url.searchParams.set('height', height.toString());
      return url.toString();
    }

    // Fallback to original image
    return src;
  }, [isSupported]);

  return {
    isSupported,
    getOptimizedImageUrl,
  };
};

// Image performance monitoring
export const ImagePerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    // Monitor image load times
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('image') || entry.name.includes('.jpg') || entry.name.includes('.png') || entry.name.includes('.webp')) {
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

  // Log slow-loading images
  React.useEffect(() => {
    Object.entries(metrics).forEach(([image, duration]) => {
      if (duration > 2000) { // 2 seconds
        console.warn(`Slow image load: ${image} took ${duration}ms`);
      }
    });
  }, [metrics]);

  return null;
};

export default {
  ProgressiveImage,
  ProgressiveBackground,
  ProgressiveGallery,
  useImagePreloader,
  useImageOptimization,
  ImagePerformanceMonitor,
};
};
