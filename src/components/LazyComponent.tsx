import React, { Suspense, ComponentType, LazyExoticComponent } from 'react';
import { Skeleton } from './ui/skeleton';

interface LoadingProps {
  className?: string;
  height?: string;
  width?: string;
}



// Default loading component
const DefaultLoading: React.FC<LoadingProps> = ({ 
  className = "w-full", 
  height = "200px", 
  width = "100%" 
}) => {
  return (
    <div className={className}>
      <Skeleton 
        className={`${height} ${width} rounded-lg`} 
      />
      <div className="space-y-2 mt-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};

// Error boundary for lazy components
class LazyComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyComponent Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <h3 className="text-red-800 font-semibold">Component failed to load</h3>
          <p className="text-red-600 text-sm mt-1">
            {this.state.error?.message || 'An error occurred while loading this component.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P> | LazyExoticComponent<P>,
  options: {
    fallback?: React.ComponentType<LoadingProps>;
    errorFallback?: React.ComponentType;
    loadingProps?: LoadingProps;
    preload?: boolean;
  } = {}
) => {
  const LazyComponent = Component as LazyExoticComponent<P>;
  const { 
    fallback: CustomFallback, 
    errorFallback: ErrorFallback,
    loadingProps,
    preload = false 
  } = options;

  const FallbackComponent = CustomFallback || DefaultLoading;

  const LazyWrappedComponent: React.FC<P> = (props) => {
    return (
      <LazyComponentErrorBoundary fallback={ErrorFallback}>
        <Suspense fallback={<FallbackComponent {...loadingProps} />}>
          <LazyComponent {...props} />
        </Suspense>
      </LazyComponentErrorBoundary>
    );
  };

  // Add preload method if requested
  if (preload) {
    (LazyWrappedComponent as any).preload = LazyComponent;
  }

  return LazyWrappedComponent;
};

// Hook for preloading lazy components
export const usePreload = () => {
  const preloadComponent = (component: any) => {
    if (component && typeof component.preload === 'function') {
      component.preload();
    }
  };

  const preloadOnHover = (component: any, delay: number = 200) => {
    let timeoutId: NodeJS.Timeout;
    
    return {
      onMouseEnter: () => {
        timeoutId = setTimeout(() => {
          preloadComponent(component);
        }, delay);
      },
      onMouseLeave: () => {
        clearTimeout(timeoutId);
      }
    };
  };

  const preloadOnFocus = (component: any) => {
    return {
      onFocus: () => preloadComponent(component)
    };
  };

  return { preloadComponent, preloadOnHover, preloadOnFocus };
};

// Utility for creating lazy loaded routes
export const createLazyRoute = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: {
    fallback?: React.ComponentType<LoadingProps>;
    errorFallback?: React.ComponentType;
    loadingProps?: LoadingProps;
  } = {}
) => {
  const LazyComponent = React.lazy(importFn);
  return withLazyLoading(LazyComponent, options);
};

// Image lazy loading component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af'%3ELoading...%3C/text%3E%3C/svg%3E",
  threshold = 0.1,
  rootMargin = "50px",
  alt = "",
  className = "",
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder);
  const [imageRef, setImageRef] = React.useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!imageRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
            onLoad?.();
          };
          img.onerror = () => {
            onError?.();
          };
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(imageRef);

    return () => {
      if (imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, threshold, rootMargin, imageRef, onLoad, onError]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-70'} ${className}`}
      {...props}
    />
  );
};

// Video lazy loading component
interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  threshold?: number;
  rootMargin?: string;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  poster,
  threshold = 0.1,
  rootMargin = "50px",
  className = "",
  ...props
}) => {
  const [videoRef, setVideoRef] = React.useState<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!videoRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          videoRef.load();
          setIsLoaded(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(videoRef);

    return () => {
      if (videoRef) {
        observer.unobserve(videoRef);
      }
    };
  }, [src, threshold, rootMargin, videoRef, isLoaded]);

  return (
    <video
      ref={setVideoRef}
      src={src}
      poster={poster}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-70'} ${className}`}
      preload="none"
      {...props}
    />
  );
};
