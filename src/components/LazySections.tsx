import React, { lazy, Suspense } from 'react';
import { Skeleton } from './ui/skeleton';

// Loading component for sections
const SectionLoading: React.FC = () => (
  <div className="w-full p-8">
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Lazy load all sections with React.lazy
export const LazyHeroSection = lazy(() => import('./HeroSection').then(mod => ({ default: mod.HeroSection })));
export const LazyMenuSection = lazy(() => import('./MenuSection').then(mod => ({ default: mod.MenuSection })));
export const LazyOrderTrackingSection = lazy(() => import('./OrderTrackingSection').then(mod => ({ default: mod.OrderTrackingSection })));
export const LazyLocationsSection = lazy(() => import('./LocationsSection').then(mod => ({ default: mod.LocationsSection })));
export const LazyProfileSection = lazy(() => import('./ProfileSection').then(mod => ({ default: mod.ProfileSection })));
export const LazyAuthModal = lazy(() => import('./AuthModal').then(mod => ({ default: mod.AuthModal })));
export const LazyCartSheet = lazy(() => import('./CartSheet').then(mod => ({ default: mod.CartSheet })));
export const LazyFooter = lazy(() => import('./Footer').then(mod => ({ default: mod.Footer })));

// Lazy load UI components
export const LazyButton = lazy(() => import('./ui/button').then(mod => ({ default: mod.Button })));
export const LazyCard = lazy(() => import('./ui/card').then(mod => ({ default: mod.Card })));
export const LazyDialog = lazy(() => import('./ui/dialog').then(mod => ({ default: mod.Dialog })));
export const LazySheet = lazy(() => import('./ui/sheet').then(mod => ({ default: mod.Sheet })));

// Lazy load third-party libraries
export const LazyFramerMotion = lazy(() => import('framer-motion').then(mod => ({ default: mod.motion })));
export const LazyRecharts = lazy(() => import('recharts').then(mod => ({ default: mod.LineChart })));
export const LazyThreeJS = lazy(() => import('three').then(mod => ({ default: mod.Scene })));

// Lazy load advanced features (placeholders for now)
export const LazyAIChatbot = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="h-96 w-full max-w-md bg-gray-800 rounded-lg p-4">AI Chatbot Coming Soon</div> 
  })
);

export const LazyARViewer = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="h-screen w-full bg-gray-800 flex items-center justify-center">AR Viewer Coming Soon</div> 
  })
);

export const LazyBlockchainWallet = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="h-96 w-full max-w-2xl bg-gray-800 rounded-lg p-4">Blockchain Wallet Coming Soon</div> 
  })
);

// Lazy load form components
export const LazyForm = lazy(() => import('./ui/form').then(mod => ({ default: mod.Form })));
export const LazyInput = lazy(() => import('./ui/input').then(mod => ({ default: mod.Input })));
export const LazySelect = lazy(() => import('./ui/select').then(mod => ({ default: mod.Select })));

// Lazy load chart components (placeholder for now)
export const LazyChart = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="h-64 w-full bg-gray-800 rounded-lg p-4 flex items-center justify-center">Chart Component Coming Soon</div> 
  })
);

export const LazyTable = lazy(() => import('./ui/table').then(mod => ({ default: mod.Table })));
export const LazyCarousel = lazy(() => import('./ui/carousel').then(mod => ({ default: mod.Carousel })));
export const LazyCalendar = lazy(() => import('./ui/calendar').then(mod => ({ default: mod.Calendar })));

// Wrapper component for lazy loading with fallback
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  height?: string;
  width?: string;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <SectionLoading />,
  height,
  width 
}) => {
  const loadingComponent = height || width ? (
    <Skeleton className={`${height || 'h-64'} ${width || 'w-full'} rounded-lg`} />
  ) : fallback;

  return (
    <Suspense fallback={loadingComponent}>
      {children}
    </Suspense>
  );
};

// Hook for preloading sections based on user behavior
export const useSectionPreloader = () => {
  const preloadSection = (section: string) => {
    switch (section) {
      case 'menu':
        import('./MenuSection');
        break;
      case 'tracking':
        import('./OrderTrackingSection');
        break;
      case 'locations':
        import('./LocationsSection');
        break;
      case 'profile':
        import('./ProfileSection');
        break;
      default:
        break;
    }
  };

  const preloadOnNavigation = (targetSection: string) => {
    // Preload the target section
    preloadSection(targetSection);
    
    // Preload adjacent sections for better UX
    const sections = ['home', 'menu', 'tracking', 'locations', 'profile'];
    const currentIndex = sections.indexOf(targetSection);
    
    if (currentIndex > 0) {
      preloadSection(sections[currentIndex - 1]);
    }
    if (currentIndex < sections.length - 1) {
      preloadSection(sections[currentIndex + 1]);
    }
  };

  return { preloadSection, preloadOnNavigation };
};

// Component that preloads sections when they might be needed
export const SectionPreloader: React.FC<{ currentSection: string }> = ({ currentSection }) => {
  const { preloadOnNavigation } = useSectionPreloader();

  React.useEffect(() => {
    // Preload sections based on current section
    preloadOnNavigation(currentSection);
  }, [currentSection, preloadOnNavigation]);

  return null;
};

// Performance monitoring component
export const PerformanceMonitor: React.FC = () => {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor page load performance
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Page load performance:', {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              firstPaint: navEntry.responseStart - navEntry.requestStart,
              totalLoadTime: navEntry.loadEventEnd - navEntry.startTime
            });
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return null;
};

// Virtual list component for large datasets
interface VirtualListItem {
  id: string | number;
  height: number;
  content: React.ReactNode;
}

interface VirtualListProps {
  items: VirtualListItem[];
  height: number;
  itemHeight?: number;
  overscan?: number;
  renderItem?: (item: VirtualListItem) => React.ReactNode;
}

export const VirtualList: React.FC<VirtualListProps> = ({
  items,
  height,
  itemHeight = 50,
  overscan = 3,
  renderItem
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = React.useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + height) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;
  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
      className="relative"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            width: '100%'
          }}
        >
          {visibleItems.map((item) =>
            renderItem ? (
              renderItem(item)
            ) : (
              <div
                key={item.id}
                style={{ height: item.height || itemHeight }}
                className="border-b border-gray-200"
              >
                {item.content}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// Memoized component wrapper
export const MemoizedComponent = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  },
  (prevProps, nextProps) => {
    return prevProps.children === nextProps.children;
  }
);

// Image optimization component
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  placeholder,
  blurDataURL,
  priority = false,
  alt = "",
  className = "",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = React.useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = React.useCallback(() => {
    setHasError(true);
  }, []);

  const imageSrc = hasError ? placeholder || '/placeholder.png' : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && blurDataURL && (
        <div
          className="absolute inset-0 blur-sm"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } w-full h-full object-cover`}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
    </div>
  );
};
