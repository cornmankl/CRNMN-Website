import React, { lazy, Suspense } from 'react';
import { Skeleton } from '../components/ui/skeleton';

// Third-party library loading configurations
interface LibraryConfig {
  name: string;
  importFn: () => Promise<{ default: React.ComponentType<unknown> }>;
  placeholder?: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  preloadCondition?: () => boolean;
  errorFallback?: React.ReactNode;
}

// Loading placeholder for third-party libraries
interface LibraryLoadingPlaceholderProps {
  name: string;
  height?: string;
  width?: string;
}

export const LibraryLoadingPlaceholder: React.FC<LibraryLoadingPlaceholderProps> = ({
  name,
  height = '200px',
  width = '100%',
}) => {
  return React.createElement(
    'div',
    {
      className: 'flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50',
    },
    React.createElement(Skeleton, {
      className: `${height} ${width} mb-2`,
    }),
    React.createElement(
      'div',
      {
        className: 'text-sm text-gray-500',
      },
      `Loading ${name}...`
    )
  );
};

// Error fallback for failed library loads
interface LibraryErrorFallbackProps {
  name: string;
  error?: Error;
  retry?: () => void;
}

export const LibraryErrorFallback: React.FC<LibraryErrorFallbackProps> = ({
  name,
  error,
  retry,
}) => {
  return React.createElement(
    'div',
    {
      className: 'flex flex-col items-center justify-center p-4 border border-red-200 rounded-lg bg-red-50',
    },
    React.createElement(
      'div',
      {
        className: 'text-red-600 font-medium mb-2',
      },
      `Failed to load ${name}`
    ),
    error && React.createElement(
      'div',
      {
        className: 'text-red-500 text-sm mb-2',
      },
      error.message
    ),
    retry && React.createElement(
      'button',
      {
        onClick: retry,
        className: 'px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors',
      },
      'Retry'
    )
  );
};

// Lazy loading wrapper for third-party libraries
export const createLazyLibrary = (
  config: LibraryConfig
) => {
  const {
    name,
    importFn,
    placeholder,
    priority = 'medium',
    preloadCondition,
    errorFallback,
  } = config;

  // Create lazy component with error boundary
  const LazyLibrary = lazy(() => 
    importFn().catch((error) => {
      console.error(`Failed to load ${name}:`, error);
      // Return a fallback component
      return Promise.resolve({
        default: () => errorFallback || React.createElement(LibraryErrorFallback, { name, error })
      });
    })
  );

  // Wrapper component with suspense and error handling
  const LazyLibraryWrapper: React.FC<Record<string, unknown>> = (props) => {
    const [hasError, setHasError] = React.useState(false);
    const [retryCount, setRetryCount] = React.useState(0);
    const maxRetries = 3;

    const handleRetry = () => {
      setHasError(false);
      setRetryCount(prev => prev + 1);
      // Force re-render by changing key
      window.location.reload();
    };

    React.useEffect(() => {
      // Preload library when condition is met
      if (preloadCondition && preloadCondition()) {
        importFn().catch(console.error);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (hasError && retryCount >= maxRetries) {
      return errorFallback || React.createElement(LibraryErrorFallback, { name, retry: handleRetry });
    }

    const loadingPlaceholder = placeholder || React.createElement(LibraryLoadingPlaceholder, {
      name,
      height: priority === 'high' ? '100px' : '200px',
    });

    return React.createElement(
      ErrorBoundary,
      {
        onError: () => setHasError(true),
        fallback: errorFallback || React.createElement(LibraryErrorFallback, { name, retry: handleRetry }),
      },
      React.createElement(
        Suspense,
        { fallback: loadingPlaceholder },
        React.createElement(LazyLibrary, props)
      )
    );
  };

  LazyLibraryWrapper.displayName = `LazyLibrary(${name})`;

  return LazyLibraryWrapper;
};

// Error boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error) => void;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || React.createElement(
        'div',
        {
          className: 'p-4 border border-red-200 rounded-lg bg-red-50',
        },
        React.createElement(
          'div',
          {
            className: 'text-red-600 font-medium',
          },
          'Something went wrong'
        )
      );
    }

    return this.props.children;
  }
}

// Predefined lazy libraries
export const LazyLibraries = {
  // Chart libraries
  ChartJS: createLazyLibrary({
    name: 'Chart.js',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'Chart.js placeholder') }),
    priority: 'medium',
    placeholder: React.createElement(
      'div',
      {
        className: 'h-64 w-full flex items-center justify-center',
      },
      React.createElement(
        'div',
        {
          className: 'text-gray-500',
        },
        'Loading charts...'
      )
    ),
  }),

  Recharts: createLazyLibrary({
    name: 'Recharts',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'Recharts placeholder') }),
    priority: 'medium',
    placeholder: React.createElement(
      'div',
      {
        className: 'h-64 w-full flex items-center justify-center',
      },
      React.createElement(
        'div',
        {
          className: 'text-gray-500',
        },
        'Loading charts...'
      )
    ),
  }),

  // Animation libraries
  FramerMotion: createLazyLibrary({
    name: 'Framer Motion',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'Framer Motion placeholder') }),
    priority: 'high',
    preloadCondition: () => typeof window !== 'undefined' && 'IntersectionObserver' in window,
  }),

  GSAP: createLazyLibrary({
    name: 'GSAP',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'GSAP placeholder') }),
    priority: 'low',
    placeholder: React.createElement(
      'div',
      {
        className: 'h-32 w-full flex items-center justify-center',
      },
      React.createElement(
        'div',
        {
          className: 'text-gray-500',
        },
        'Loading animations...'
      )
    ),
  }),

  // 3D libraries
  ThreeJS: createLazyLibrary({
    name: 'Three.js',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'Three.js placeholder') }),
    priority: 'low',
    placeholder: React.createElement(
      'div',
      {
        className: 'h-96 w-full flex items-center justify-center',
      },
      React.createElement(
        'div',
        {
          className: 'text-gray-500',
        },
        'Loading 3D...'
      )
    ),
  }),

  // Form libraries
  ReactHookForm: createLazyLibrary({
    name: 'React Hook Form',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'React Hook Form placeholder') }),
    priority: 'high',
  }),

  // Date libraries
  DayJS: createLazyLibrary({
    name: 'Day.js',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'Day.js placeholder') }),
    priority: 'high',
  }),

  DateFNS: createLazyLibrary({
    name: 'Date-fns',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'Date-fns placeholder') }),
    priority: 'medium',
  }),

  // Utility libraries
  Lodash: createLazyLibrary({
    name: 'Lodash',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'Lodash placeholder') }),
    priority: 'medium',
  }),

  Axios: createLazyLibrary({
    name: 'Axios',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'Axios placeholder') }),
    priority: 'high',
  }),

  // Icon libraries
  ReactIcons: createLazyLibrary({
    name: 'React Icons',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'React Icons placeholder') }),
    priority: 'medium',
  }),

  // Map libraries
  Leaflet: createLazyLibrary({
    name: 'Leaflet',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'Leaflet placeholder') }),
    priority: 'low',
    placeholder: React.createElement(
      'div',
      {
        className: 'h-96 w-full flex items-center justify-center',
      },
      React.createElement(
        'div',
        {
          className: 'text-gray-500',
        },
        'Loading map...'
      )
    ),
  }),

  // PDF libraries
  ReactPDF: createLazyLibrary({
    name: 'React PDF',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'React PDF placeholder') }),
    priority: 'low',
    placeholder: React.createElement(
      'div',
      {
        className: 'h-96 w-full flex items-center justify-center',
      },
      React.createElement(
        'div',
        {
          className: 'text-gray-500',
        },
        'Loading PDF...'
      )
    ),
  }),

  // Table libraries
  ReactTable: createLazyLibrary({
    name: 'React Table',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'React Table placeholder') }),
    priority: 'medium',
  }),

  // Rich text editors
  ReactQuill: createLazyLibrary({
    name: 'React Quill',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'React Quill placeholder') }),
    priority: 'low',
    placeholder: React.createElement(
      'div',
      {
        className: 'h-64 w-full flex items-center justify-center',
      },
      React.createElement(
        'div',
        {
          className: 'text-gray-500',
        },
        'Loading editor...'
      )
    ),
  }),

  // Image processing
  Sharp: createLazyLibrary({
    name: 'Sharp',
    importFn: () => Promise.resolve({ default: () => React.createElement('div', null, 'Sharp placeholder') }),
    priority: 'low',
  }),
};

// Hook for managing third-party library loading
export const useThirdPartyLibraries = () => {
  const [loadedLibraries, setLoadedLibraries] = React.useState<Set<string>>(new Set());
  const [loadingLibraries, setLoadingLibraries] = React.useState<Set<string>>(new Set());
  const [failedLibraries, setFailedLibraries] = React.useState<Set<string>>(new Set());

  const preloadLibrary = React.useCallback(async (libraryName: keyof typeof LazyLibraries) => {
    if (loadedLibraries.has(libraryName) || loadingLibraries.has(libraryName)) {
      return;
    }

    setLoadingLibraries(prev => new Set(prev).add(libraryName));

    try {
      // Trigger import by accessing the component
      const LazyComponent = LazyLibraries[libraryName];
      if (LazyComponent) {
        setLoadedLibraries(prev => new Set(prev).add(libraryName));
        setFailedLibraries(prev => {
          const newSet = new Set(prev);
          newSet.delete(libraryName);
          return newSet;
        });
      }
    } catch (error) {
      console.error(`Failed to preload ${libraryName}:`, error);
      setFailedLibraries(prev => new Set(prev).add(libraryName));
    } finally {
      setLoadingLibraries(prev => {
        const newSet = new Set(prev);
        newSet.delete(libraryName);
        return newSet;
      });
    }
  }, [loadedLibraries, loadingLibraries]);

  const preloadLibrariesOnDemand = React.useCallback((libraries: (keyof typeof LazyLibraries)[]) => {
    libraries.forEach(library => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          preloadLibrary(library);
        });
      } else {
        setTimeout(() => {
          preloadLibrary(library);
        }, 100);
      }
    });
  }, [preloadLibrary]);

  const isLibraryLoaded = (libraryName: string) => loadedLibraries.has(libraryName);
  const isLibraryLoading = (libraryName: string) => loadingLibraries.has(libraryName);
  const didLibraryFail = (libraryName: string) => failedLibraries.has(libraryName);

  return {
    loadedLibraries,
    loadingLibraries,
    failedLibraries,
    preloadLibrary,
    preloadLibrariesOnDemand,
    isLibraryLoaded,
    isLibraryLoading,
    didLibraryFail,
  };
};

// Component for preloading libraries based on user behavior
export const LibraryPreloader: React.FC<{
  libraries?: (keyof typeof LazyLibraries)[];
  preloadOnHover?: boolean;
  preloadOnIdle?: boolean;
}> = ({
  libraries = Object.keys(LazyLibraries) as (keyof typeof LazyLibraries)[],
  preloadOnHover = true,
  preloadOnIdle = true,
}) => {
  const { preloadLibrariesOnDemand } = useThirdPartyLibraries();

  React.useEffect(() => {
    if (preloadOnIdle && 'requestIdleCallback' in window) {
      // Preload high priority libraries when idle
      const highPriorityLibraries = libraries.filter(lib => {
        const config = LazyLibraries[lib];
        return config.toString().includes('priority: \'high\'');
      });

      window.requestIdleCallback(() => {
        preloadLibrariesOnDemand(highPriorityLibraries);
      });
    }
  }, [libraries, preloadOnIdle, preloadLibrariesOnDemand]);

  // Setup hover-based preloading
  React.useEffect(() => {
    if (!preloadOnHover) return;

    const handleMouseMovement = () => {
      // Preload medium priority libraries on first mouse movement
      const mediumPriorityLibraries = libraries.filter(lib => {
        const config = LazyLibraries[lib];
        return config.toString().includes('priority: \'medium\'');
      });

      preloadLibrariesOnDemand(mediumPriorityLibraries);
      
      // Remove event listener after first trigger
      document.removeEventListener('mousemove', handleMouseMovement);
    };

    document.addEventListener('mousemove', handleMouseMovement);

    return () => {
      document.removeEventListener('mousemove', handleMouseMovement);
    };
  }, [libraries, preloadOnHover, preloadLibrariesOnDemand]);

  return null;
};

// Performance monitoring for third-party libraries
export const LibraryPerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    // Monitor library load times
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('chunk') || entry.name.includes('library')) {
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

  // Log slow-loading libraries
  React.useEffect(() => {
    Object.entries(metrics).forEach(([library, duration]) => {
      if (duration > 1000) { // 1 second
        console.warn(`Slow library load: ${library} took ${duration}ms`);
      }
    });
  }, [metrics]);

  return null;
};

export default {
  createLazyLibrary,
  LazyLibraries,
  LibraryLoadingPlaceholder,
  LibraryErrorFallback,
  useThirdPartyLibraries,
  LibraryPreloader,
  LibraryPerformanceMonitor,
};
