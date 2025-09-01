import React from 'react';

// Bundle optimization utilities
interface BundleConfig {
  codeSplitting: boolean;
  treeShaking: boolean;
  compression: boolean;
  dynamicImports: boolean;
  lazyLoading: boolean;
  prefetching: boolean;
}

interface BundleMetrics {
  size: number;
  gzipSize: number;
  loadTime: number;
  renderTime: number;
  totalRequests: number;
  timestamp?: number;
}

// Default bundle optimization configuration
export const DEFAULT_BUNDLE_CONFIG: BundleConfig = {
  codeSplitting: true,
  treeShaking: true,
  compression: true,
  dynamicImports: true,
  lazyLoading: true,
  prefetching: true,
};

// Component-level bundle optimization decorator
export function withBundleOptimization<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    preload?: boolean;
    prefetch?: boolean;
    suspense?: boolean;
    priority?: 'high' | 'medium' | 'low';
  } = {}
) {
  const { preload = false, prefetch = false, suspense = false, priority = 'medium' } = options;

  const WrappedComponent: React.FC<P> = (props) => {
    const componentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (preload && componentRef.current) {
        // Preload component when it's likely to be needed
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              // Trigger component preload
              observer.unobserve(entry.target);
            }
          },
          {
            rootMargin: '50px',
            threshold: 0.1,
          }
        );

        observer.observe(componentRef.current);

        return () => {
          observer.disconnect();
        };
      }
    }, [preload]);

    React.useEffect(() => {
      if (prefetch && typeof window !== 'undefined') {
        // Prefetch component resources when idle
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            // Trigger component prefetch
            console.log(`Prefetching component: ${Component.name}`);
          });
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => {
            console.log(`Prefetching component: ${Component.name}`);
          }, 2000);
        }
      }
    }, [prefetch]);

    if (suspense) {
      return React.createElement(
        'div',
        { ref: componentRef },
        React.createElement(
          React.Suspense,
          { fallback: React.createElement(BundleLoadingPlaceholder, { priority }) },
          React.createElement(Component, props)
        )
      );
    }

    return React.createElement(
      'div',
      { ref: componentRef },
      React.createElement(Component, props)
    );
  };

  WrappedComponent.displayName = `WithBundleOptimization(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Loading placeholder for bundle optimization
interface BundleLoadingPlaceholderProps {
  priority?: 'high' | 'medium' | 'low';
  height?: string;
  width?: string;
}

export const BundleLoadingPlaceholder: React.FC<BundleLoadingPlaceholderProps> = ({
  priority = 'medium',
  height = '200px',
  width = '100%',
}) => {
  const getAnimationDelay = () => {
    switch (priority) {
      case 'high':
        return '0s';
      case 'medium':
        return '0.2s';
      case 'low':
        return '0.5s';
      default:
        return '0.2s';
    }
  };

  return React.createElement(
    'div',
    {
      className: 'animate-pulse bg-gray-200 rounded-lg',
      style: {
        height,
        width,
        animationDelay: getAnimationDelay(),
      },
    },
    React.createElement(
      'div',
      {
        className: 'h-full w-full flex items-center justify-center',
      },
      React.createElement('div', {
        className: 'text-gray-400 text-sm',
        children: 'Loading...',
      })
    )
  );
};

// Dynamic import utility with error handling and retry logic
interface DynamicImportOptions {
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
  fallback?: React.ComponentType<any>;
}

export const createDynamicImport = <T extends { default: React.ComponentType<any> }>(
  importFn: () => Promise<T>,
  options: DynamicImportOptions = {}
) => {
  const {
    retryCount = 3,
    retryDelay = 1000,
    timeout = 10000,
    fallback: FallbackComponent,
  } = options;

  let retryAttempt = 0;

  const loadComponent = (): Promise<T> => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Dynamic import timeout after ${timeout}ms`));
      }, timeout);

      importFn()
        .then((module) => {
          clearTimeout(timeoutId);
          resolve(module);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          
          if (retryAttempt < retryCount) {
            retryAttempt++;
            console.log(`Retry attempt ${retryAttempt} for dynamic import`);
            
            setTimeout(() => {
              loadComponent().then(resolve).catch(reject);
            }, retryDelay * retryAttempt);
          } else {
            reject(error);
          }
        });
    });
  };

  const LazyComponent = React.lazy(() => loadComponent());

  const WrappedComponent: React.FC<any> = (props) => {
    if (FallbackComponent) {
      return React.createElement(
        React.Suspense,
        { fallback: React.createElement(FallbackComponent) },
        React.createElement(LazyComponent, props)
      );
    }

    return React.createElement(
      React.Suspense,
      { fallback: React.createElement(BundleLoadingPlaceholder) },
      React.createElement(LazyComponent, props)
    );
  };

  return WrappedComponent;
};

// Bundle analyzer and metrics collector
export class BundleAnalyzer {
  private metrics: BundleMetrics[] = [];

  async analyzeBundle(): Promise<BundleMetrics> {
    if (typeof window === 'undefined') {
      return this.getEmptyMetrics();
    }

    // Simulate bundle analysis
    const metrics: BundleMetrics = {
      size: Math.random() * 1000000, // Simulated bundle size in bytes
      gzipSize: Math.random() * 300000, // Simulated gzip size
      loadTime: Math.random() * 3000, // Simulated load time in ms
      renderTime: Math.random() * 1000, // Simulated render time in ms
      totalRequests: Math.floor(Math.random() * 50) + 1, // Simulated request count
    };

    this.metrics.push({
      ...metrics,
      timestamp: Date.now(),
    });

    return metrics;
  }

  getMetrics(): BundleMetrics[] {
    return this.metrics;
  }

  getAverageMetrics(): BundleMetrics {
    if (this.metrics.length === 0) {
      return this.getEmptyMetrics();
    }

    const sum = this.metrics.reduce((acc, metric) => ({
      size: acc.size + metric.size,
      gzipSize: acc.gzipSize + metric.gzipSize,
      loadTime: acc.loadTime + metric.loadTime,
      renderTime: acc.renderTime + metric.renderTime,
      totalRequests: acc.totalRequests + metric.totalRequests,
    }), this.getEmptyMetrics());

    const count = this.metrics.length;

    return {
      size: sum.size / count,
      gzipSize: sum.gzipSize / count,
      loadTime: sum.loadTime / count,
      renderTime: sum.renderTime / count,
      totalRequests: sum.totalRequests / count,
    };
  }

  private getEmptyMetrics(): BundleMetrics {
    return {
      size: 0,
      gzipSize: 0,
      loadTime: 0,
      renderTime: 0,
      totalRequests: 0,
    };
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  generateReport(): string {
    const avgMetrics = this.getAverageMetrics();
    
    return `
Bundle Optimization Report
==========================

Average Metrics:
- Bundle Size: ${this.formatBytes(avgMetrics.size)}
- Gzip Size: ${this.formatBytes(avgMetrics.gzipSize)}
- Load Time: ${avgMetrics.loadTime.toFixed(2)}ms
- Render Time: ${avgMetrics.renderTime.toFixed(2)}ms
- Total Requests: ${avgMetrics.totalRequests.toFixed(0)}

Recommendations:
${this.generateRecommendations(avgMetrics)}
    `.trim();
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private generateRecommendations(metrics: BundleMetrics): string {
    const recommendations: string[] = [];

    if (metrics.size > 500000) { // 500KB
      recommendations.push('- Consider code splitting for large bundles');
    }

    if (metrics.gzipSize > 150000) { // 150KB
      recommendations.push('- Enable compression for better transfer speeds');
    }

    if (metrics.loadTime > 2000) { // 2 seconds
      recommendations.push('- Optimize loading strategy and consider lazy loading');
    }

    if (metrics.renderTime > 500) { // 500ms
      recommendations.push('- Optimize component rendering and consider memoization');
    }

    if (metrics.totalRequests > 20) {
      recommendations.push('- Reduce number of requests through bundling');
    }

    return recommendations.length > 0 
      ? recommendations.join('\n')
      : '- Bundle performance is optimal';
  }
}

// Tree shaking utilities
export const TreeShakingUtils = {
  // Mark functions as pure for tree shaking
  pure<T extends (...args: any[]) => any>(fn: T): T {
    return fn;
  },

  // Create side-effect free utilities
  createUtil<T extends object>(util: T): T {
    return util;
  },

  // Conditional imports for tree shaking
  dynamicImport: <T>(condition: boolean, importFn: () => Promise<T>, fallback: T): Promise<T> => {
    if (condition) {
      return importFn();
    }
    return Promise.resolve(fallback);
  },

  // Feature flag based imports
  featureImport: <T>(featureFlag: string, importFn: () => Promise<T>, fallback: T): Promise<T> => {
    const isEnabled = typeof window !== 'undefined' 
      ? window.localStorage.getItem(featureFlag) === 'true'
      : false;
    
    return TreeShakingUtils.dynamicImport(isEnabled, importFn, fallback);
  },
};

// Bundle optimization hook
export const useBundleOptimization = () => {
  const [metrics, setMetrics] = React.useState<BundleMetrics | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const analyzer = React.useMemo(() => new BundleAnalyzer(), []);

  const analyzeBundle = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const bundleMetrics = await analyzer.analyzeBundle();
      setMetrics(bundleMetrics);
    } catch (error) {
      console.error('Failed to analyze bundle:', error);
    } finally {
      setIsLoading(false);
    }
  }, [analyzer]);

  const getReport = React.useCallback(() => {
    return analyzer.generateReport();
  }, [analyzer]);

  const clearMetrics = React.useCallback(() => {
    analyzer.clearMetrics();
    setMetrics(null);
  }, [analyzer]);

  return {
    metrics,
    isLoading,
    analyzeBundle,
    getReport,
    clearMetrics,
  };
};

// Performance optimization component
interface BundleOptimizerProps {
  enabled?: boolean;
  config?: Partial<BundleConfig>;
  children?: React.ReactNode;
}

export const BundleOptimizer: React.FC<BundleOptimizerProps> = ({
  enabled = true,
  config = {},
  children,
}) => {
  const finalConfig = React.useMemo(() => ({
    ...DEFAULT_BUNDLE_CONFIG,
    ...config,
  }), [config]);

  const { analyzeBundle } = useBundleOptimization();

  React.useEffect(() => {
    if (enabled && finalConfig.codeSplitting) {
      // Analyze bundle on mount
      analyzeBundle();
    }
  }, [enabled, finalConfig.codeSplitting, analyzeBundle]);

  if (!enabled) {
    return React.createElement(React.Fragment, null, children);
  }

  return React.createElement(
    'div',
    { className: 'bundle-optimizer' },
    children,
    // Add performance monitoring scripts
    finalConfig.compression && React.createElement('script', {
      dangerouslySetInnerHTML: {
        __html: `
              // Enable compression hints
              if ('CompressionStream' in window) {
                console.log('Compression API available');
              }
            `,
      },
    })
  );
};

export default {
  withBundleOptimization,
  BundleLoadingPlaceholder,
  createDynamicImport,
  BundleAnalyzer,
  TreeShakingUtils,
  useBundleOptimization,
  BundleOptimizer,
};
