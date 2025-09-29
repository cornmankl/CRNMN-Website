import React, { useEffect } from 'react';

// Web Vitals types
interface Metric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
  navigationType: string;
  url?: string;
  timestamp?: number;
}

interface WebVitalsProps {
  onMetric?: (metric: Metric) => void;
  reportToAnalytics?: boolean;
  sampleRate?: number;
}

// Web Vitals thresholds
const VITAL_THRESHOLDS = {
  FCP: [1800, 3000], // First Contentful Paint (in ms)
  LCP: [2500, 4000], // Largest Contentful Paint (in ms)
  FID: [100, 300],   // First Input Delay (in ms)
  CLS: [0.1, 0.25],  // Cumulative Layout Shift
  TTFB: [500, 1500], // Time to First Byte (in ms)
  INP: [200, 500],   // Interaction to Next Paint (in ms)
} as const;

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, event: string, params: any) => void;
  }
}

// Load web-vitals library dynamically
const loadWebVitals = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const webVitals = await import('web-vitals');
    return webVitals;
  } catch (error) {
    console.error('Failed to load web-vitals:', error);
    return null;
  }
};

// Get performance rating
const getRating = (name: keyof typeof VITAL_THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const [good, poor] = VITAL_THRESHOLDS[name];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
};

// Format metric value
const formatMetricValue = (name: string, value: number): string => {
  switch (name) {
    case 'CLS':
      return value.toFixed(3);
    case 'FID':
    case 'INP':
      return `${value.toFixed(0)}ms`;
    case 'FCP':
    case 'LCP':
    case 'TTFB':
      return `${value.toFixed(0)}ms`;
    default:
      return value.toString();
  }
};

// Report metric to console
const reportMetric = (metric: Metric) => {
  const { name, value, rating, delta } = metric;
  const formattedValue = formatMetricValue(name, value);
  const formattedDelta = formatMetricValue(name, delta);
  
  console.group(`📊 ${name}`);
  console.log(`Value: ${formattedValue}`);
  console.log(`Rating: ${rating}`);
  console.log(`Delta: ${formattedDelta}`);
  console.groupEnd();
  
  // Add visual indicator for poor performance
  if (rating === 'poor') {
    console.warn(`⚠️ Poor ${name} performance: ${formattedValue}`);
  }
};

// Send metric to analytics
const sendToAnalytics = (metric: Metric) => {
  // This would typically send to Google Analytics, Mixpanel, etc.
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
      custom_metric_1: metric.delta,
      custom_metric_2: metric.rating === 'good' ? 1 : metric.rating === 'needs-improvement' ? 2 : 3,
    });
  }
  
  // Send to custom analytics endpoint
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const data = new Blob([JSON.stringify(metric)], { type: 'application/json' });
    navigator.sendBeacon('/api/analytics/web-vitals', data);
  }
};

// Performance monitoring component
export const WebVitals: React.FC<WebVitalsProps> = ({
  onMetric,
  reportToAnalytics = true,
  sampleRate = 1.0,
}) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Only sample a percentage of users
    if (Math.random() > sampleRate) return;
    
    let isMounted = true;
    
    const initWebVitals = async () => {
      const webVitals = await loadWebVitals();
      if (!webVitals || !isMounted) return;
      
      // Get navigation type
      const getNavigationType = () => {
        if (typeof window === 'undefined' || !window.performance) return 'unknown';
        
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (!navigation) return 'unknown';
        
        switch (navigation.type) {
          case 'navigate':
            return 'navigate';
          case 'reload':
            return 'reload';
          case 'back_forward':
            return 'back_forward';
          case 'prerender':
            return 'prerender';
          default:
            return 'unknown';
        }
      };
      
      const navigationType = getNavigationType();
      
      // Create metric handler
      const handleMetric = (metric: any) => {
        const vitalMetric: Metric = {
          id: metric.id,
          name: metric.name,
          value: metric.value,
          rating: getRating(metric.name as keyof typeof VITAL_THRESHOLDS, metric.value),
          delta: metric.delta,
          entries: metric.entries || [],
          navigationType,
        };
        
        // Report to console
        reportMetric(vitalMetric);
        
        // Send to analytics
        if (reportToAnalytics) {
          sendToAnalytics(vitalMetric);
        }
        
        // Call custom handler
        if (onMetric) {
          onMetric(vitalMetric);
        }
        
        // Store in session storage for debugging
        try {
          const storedMetrics = JSON.parse(sessionStorage.getItem('web-vitals') || '[]');
          storedMetrics.push({
            ...vitalMetric,
            timestamp: Date.now(),
            url: window.location.href,
          });
          
          // Keep only last 100 metrics
          if (storedMetrics.length > 100) {
            storedMetrics.splice(0, storedMetrics.length - 100);
          }
          
          sessionStorage.setItem('web-vitals', JSON.stringify(storedMetrics));
        } catch (error) {
          console.warn('Failed to store web vitals in session storage:', error);
        }
      };
      
      // Setup metric reporters
      webVitals.onFCP(handleMetric);
      webVitals.onLCP(handleMetric);
      webVitals.onFID(handleMetric);
      webVitals.onCLS(handleMetric);
      webVitals.onTTFB(handleMetric);
      webVitals.onINP(handleMetric);
      
      // Cleanup function
      return () => {
        isMounted = false;
      };
    };
    
    initWebVitals();
    
    return () => {
      isMounted = false;
    };
  }, [onMetric, reportToAnalytics, sampleRate]);
  
  return null;
};

// Hook for accessing web vitals data
export const useWebVitals = () => {
  const [metrics, setMetrics] = React.useState<Metric[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadStoredMetrics = () => {
      try {
        const stored = sessionStorage.getItem('web-vitals');
        if (stored) {
          const parsed = JSON.parse(stored);
          setMetrics(parsed);
        }
      } catch (error) {
        console.warn('Failed to load stored web vitals:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStoredMetrics();
    
    // Listen for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'web-vitals') {
        loadStoredMetrics();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const getLatestMetric = (name: string): Metric | undefined => {
    return metrics
      .filter(metric => metric.name === name)
      .sort((a, b) => b.id.localeCompare(a.id))[0];
  };
  
  const getMetricsByUrl = (url: string): Metric[] => {
    return metrics.filter(metric => metric.url === url);
  };
  
  const clearMetrics = () => {
    sessionStorage.removeItem('web-vitals');
    setMetrics([]);
  };
  
  return {
    metrics,
    isLoading,
    getLatestMetric,
    getMetricsByUrl,
    clearMetrics,
  };
};

// Performance score component
interface PerformanceScoreProps {
  metrics: Metric[];
  className?: string;
}

export const PerformanceScore: React.FC<PerformanceScoreProps> = ({
  metrics,
  className = '',
}) => {
  const calculateScore = (): number => {
    if (metrics.length === 0) return 0;
    
    const latestMetrics = Array.from(
      new Set(metrics.map(m => m.name))
    ).map(name => metrics.filter(m => m.name === name).pop()).filter(Boolean) as Metric[];
    
    if (latestMetrics.length === 0) return 0;
    
    let totalScore = 0;
    let count = 0;
    
    latestMetrics.forEach(metric => {
      const weight = getMetricWeight(metric.name);
      const score = getMetricScore(metric);
      totalScore += score * weight;
      count += weight;
    });
    
    return Math.round((totalScore / count) * 100);
  };
  
  const getMetricWeight = (name: string): number => {
    switch (name) {
      case 'LCP':
        return 3;
      case 'FID':
      case 'INP':
        return 2;
      case 'CLS':
        return 2;
      case 'FCP':
        return 1;
      case 'TTFB':
        return 1;
      default:
        return 1;
    }
  };
  
  const getMetricScore = (metric: Metric): number => {
    switch (metric.rating) {
      case 'good':
        return 1;
      case 'needs-improvement':
        return 0.5;
      case 'poor':
        return 0;
      default:
        return 0;
    }
  };
  
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getScoreLabel = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };
  
  const score = calculateScore();
  const colorClass = getScoreColor(score);
  const label = getScoreLabel(score);
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="text-sm font-medium">Performance Score:</div>
      <div className={`text-lg font-bold ${colorClass}`}>{score}</div>
      <div className={`text-sm ${colorClass}`}>{label}</div>
    </div>
  );
};

// Debug panel for web vitals
interface WebVitalsDebugProps {
  className?: string;
}

export const WebVitalsDebug: React.FC<WebVitalsDebugProps> = ({
  className = '',
}) => {
  const { metrics, clearMetrics } = useWebVitals();
  const [isVisible, setIsVisible] = React.useState(false);
  
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm z-50 ${className}`}
      >
        📊 Debug
      </button>
    );
  }
  
  const latestMetrics = Array.from(
    new Set(metrics.map(m => m.name))
  ).map(name => metrics.filter(m => m.name === name).pop()).filter(Boolean) as Metric[];
  
  return (
    <div className={`fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-auto z-50 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Web Vitals Debug</h3>
        <div className="flex space-x-2">
          <button
            onClick={clearMetrics}
            className="text-sm bg-red-500 text-white px-2 py-1 rounded"
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-sm bg-gray-500 text-white px-2 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>
      
      <PerformanceScore metrics={metrics} className="mb-4" />
      
      <div className="space-y-2">
        {latestMetrics.map(metric => (
          <div key={metric.id} className="border-b border-gray-100 pb-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{metric.name}</span>
              <span className={`text-sm px-2 py-1 rounded ${
                metric.rating === 'good' ? 'bg-green-100 text-green-800' :
                metric.rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {metric.rating}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Value: {formatMetricValue(metric.name, metric.value)}
            </div>
            <div className="text-xs text-gray-500">
              Delta: {formatMetricValue(metric.name, metric.delta)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebVitals;
