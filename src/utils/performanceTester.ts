import React, { useEffect, useRef, useState } from 'react';

// Performance metrics interface
interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  loadTime: number; // Page load time
  bundleSize: number; // Bundle size in KB
  memoryUsage: number; // Memory usage in MB
  renderTime: number; // Render time in ms
}

// Performance test configuration
interface PerformanceTestConfig {
  name: string;
  description?: string;
  threshold?: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
    loadTime?: number;
    bundleSize?: number;
    memoryUsage?: number;
    renderTime?: number;
  };
  runOnMount?: boolean;
  interval?: number;
}

// Performance test result
interface PerformanceTestResult {
  name: string;
  passed: boolean;
  metrics: PerformanceMetrics;
  threshold: PerformanceMetrics;
  timestamp: number;
  duration: number;
}

// Performance monitor component
export const PerformanceMonitor: React.FC<{
  tests: PerformanceTestConfig[];
  onResults?: (results: PerformanceTestResult[]) => void;
  autoRun?: boolean;
}> = ({ tests, onResults, autoRun = true }) => {
  const [results, setResults] = useState<PerformanceTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const testTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get performance metrics
  const getMetrics = async (): Promise<PerformanceMetrics> => {
    // Get Web Vitals
    const getWebVitals = () => {
      return new Promise<{ lcp: number; fid: number; cls: number; fcp: number }>((resolve) => {
        // Mock Web Vitals for demo
        setTimeout(() => {
          resolve({
            lcp: Math.random() * 4000 + 1000, // 1-5 seconds
            fid: Math.random() * 200 + 50, // 50-250ms
            cls: Math.random() * 0.3 + 0.1, // 0.1-0.4
            fcp: Math.random() * 2000 + 800, // 0.8-2.8 seconds
          });
        }, 100);
      });
    };

    // Get navigation timing
    const getNavigationTiming = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        ttfb: navigation.responseStart - navigation.requestStart,
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      };
    };

    // Get memory usage
    const getMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return {
          used: memory.usedJSHeapSize / (1024 * 1024), // Convert to MB
          total: memory.totalJSHeapSize / (1024 * 1024),
          limit: memory.jsHeapSizeLimit / (1024 * 1024),
        };
      }
      return { used: 0, total: 0, limit: 0 };
    };

    // Get bundle size (mock)
    const getBundleSize = () => {
      return Math.random() * 500 + 100; // 100-600KB
    };

    // Get render time
    const getRenderTime = () => {
      const paint = performance.getEntriesByType('paint');
      const firstPaint = paint.find(entry => entry.name === 'first-paint');
      return firstPaint ? firstPaint.startTime : 0;
    };

    const [webVitals, navigationTiming, memoryUsage, bundleSize, renderTime] = await Promise.all([
      getWebVitals(),
      getNavigationTiming(),
      Promise.resolve(getMemoryUsage()),
      Promise.resolve(getBundleSize()),
      Promise.resolve(getRenderTime()),
    ]);

    return {
      lcp: webVitals.lcp,
      fid: webVitals.fid,
      cls: webVitals.cls,
      fcp: webVitals.fcp,
      ttfb: navigationTiming.ttfb,
      loadTime: navigationTiming.loadTime,
      bundleSize,
      memoryUsage: memoryUsage.used,
      renderTime,
    };
  };

  // Run a single test
  const runTest = async (test: PerformanceTestConfig): Promise<PerformanceTestResult> => {
    setCurrentTest(test.name);
    const startTime = performance.now();
    
    const metrics = await getMetrics();
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Default thresholds
    const defaultThreshold: PerformanceMetrics = {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      fcp: 1800,
      ttfb: 600,
      loadTime: 3000,
      bundleSize: 300,
      memoryUsage: 50,
      renderTime: 1000,
    };

    const threshold = { ...defaultThreshold, ...test.threshold };
    
    // Check if test passed
    const passed = 
      metrics.lcp <= threshold.lcp &&
      metrics.fid <= threshold.fid &&
      metrics.cls <= threshold.cls &&
      metrics.fcp <= threshold.fcp &&
      metrics.ttfb <= threshold.ttfb &&
      metrics.loadTime <= threshold.loadTime &&
      metrics.bundleSize <= threshold.bundleSize &&
      metrics.memoryUsage <= threshold.memoryUsage &&
      metrics.renderTime <= threshold.renderTime;

    return {
      name: test.name,
      passed,
      metrics,
      threshold,
      timestamp: Date.now(),
      duration,
    };
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    const testResults: PerformanceTestResult[] = [];

    for (const test of tests) {
      try {
        const result = await runTest(test);
        testResults.push(result);
      } catch (error) {
        console.error(`Test "${test.name}" failed:`, error);
      }
    }

    setResults(testResults);
    setIsRunning(false);
    setCurrentTest(null);
    onResults?.(testResults);
  };

  // Auto-run tests on mount
  useEffect(() => {
    if (autoRun) {
      runAllTests();
    }
  }, [autoRun]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (testTimeoutRef.current) {
        clearTimeout(testTimeoutRef.current);
      }
    };
  }, []);

  // Render performance results
  const renderResults = () => {
    if (results.length === 0) {
      return React.createElement('div', { className: 'text-gray-500' }, 'No test results yet');
    }

    return React.createElement(
      'div',
      { className: 'space-y-4' },
      ...results.map((result, index) =>
        React.createElement(
          'div',
          {
            key: index,
            className: `p-4 border rounded-lg ${
              result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`,
          },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between mb-2' },
            React.createElement(
              'h3',
              { className: 'font-medium' },
              result.name
            ),
            React.createElement(
              'span',
              {
                className: `px-2 py-1 rounded text-sm ${
                  result.passed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`,
              },
              result.passed ? 'PASSED' : 'FAILED'
            )
          ),
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 md:grid-cols-3 gap-4 text-sm' },
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'text-gray-600' }, 'LCP'),
              React.createElement(
                'div',
                {
                  className: result.metrics.lcp <= result.threshold.lcp
                    ? 'text-green-600'
                    : 'text-red-600',
                },
                `${result.metrics.lcp.toFixed(0)}ms (${result.threshold.lcp}ms)`
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'text-gray-600' }, 'FID'),
              React.createElement(
                'div',
                {
                  className: result.metrics.fid <= result.threshold.fid
                    ? 'text-green-600'
                    : 'text-red-600',
                },
                `${result.metrics.fid.toFixed(0)}ms (${result.threshold.fid}ms)`
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'text-gray-600' }, 'CLS'),
              React.createElement(
                'div',
                {
                  className: result.metrics.cls <= result.threshold.cls
                    ? 'text-green-600'
                    : 'text-red-600',
                },
                `${result.metrics.cls.toFixed(3)} (${result.threshold.cls})`
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'text-gray-600' }, 'FCP'),
              React.createElement(
                'div',
                {
                  className: result.metrics.fcp <= result.threshold.fcp
                    ? 'text-green-600'
                    : 'text-red-600',
                },
                `${result.metrics.fcp.toFixed(0)}ms (${result.threshold.fcp}ms)`
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'text-gray-600' }, 'TTFB'),
              React.createElement(
                'div',
                {
                  className: result.metrics.ttfb <= result.threshold.ttfb
                    ? 'text-green-600'
                    : 'text-red-600',
                },
                `${result.metrics.ttfb.toFixed(0)}ms (${result.threshold.ttfb}ms)`
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'text-gray-600' }, 'Load Time'),
              React.createElement(
                'div',
                {
                  className: result.metrics.loadTime <= result.threshold.loadTime
                    ? 'text-green-600'
                    : 'text-red-600',
                },
                `${result.metrics.loadTime.toFixed(0)}ms (${result.threshold.loadTime}ms)`
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'text-gray-600' }, 'Bundle Size'),
              React.createElement(
                'div',
                {
                  className: result.metrics.bundleSize <= result.threshold.bundleSize
                    ? 'text-green-600'
                    : 'text-red-600',
                },
                `${result.metrics.bundleSize.toFixed(0)}KB (${result.threshold.bundleSize}KB)`
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'text-gray-600' }, 'Memory'),
              React.createElement(
                'div',
                {
                  className: result.metrics.memoryUsage <= result.threshold.memoryUsage
                    ? 'text-green-600'
                    : 'text-red-600',
                },
                `${result.metrics.memoryUsage.toFixed(1)}MB (${result.threshold.memoryUsage}MB)`
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'text-gray-600' }, 'Render Time'),
              React.createElement(
                'div',
                {
                  className: result.metrics.renderTime <= result.threshold.renderTime
                    ? 'text-green-600'
                    : 'text-red-600',
                },
                `${result.metrics.renderTime.toFixed(0)}ms (${result.threshold.renderTime}ms)`
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'text-xs text-gray-500 mt-2' },
            `Test duration: ${result.duration.toFixed(0)}ms`
          )
        )
      )
    );
  };

  return React.createElement(
    'div',
    { className: 'space-y-4' },
    React.createElement(
      'div',
      { className: 'flex items-center justify-between' },
      React.createElement('h2', { className: 'text-lg font-semibold' }, 'Performance Tests'),
      React.createElement(
        'button',
        {
          onClick: runAllTests,
          disabled: isRunning,
          className: `px-4 py-2 rounded text-sm font-medium ${
            isRunning
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`,
        },
        isRunning ? 'Running...' : 'Run Tests'
      )
    ),
    currentTest && React.createElement(
      'div',
      { className: 'text-sm text-blue-600' },
      `Running test: ${currentTest}...`
    ),
    renderResults()
  );
};

// Performance benchmark component
export const PerformanceBenchmark: React.FC<{
  component: React.ComponentType<any>;
  props?: any;
  iterations?: number;
  onComplete?: (results: { avgTime: number; minTime: number; maxTime: number }) => void;
}> = ({ component: Component, props = {}, iterations = 100, onComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    avgTime: number;
    minTime: number;
    maxTime: number;
  } | null>(null);

  const runBenchmark = async () => {
    setIsRunning(true);
    const times: number[] = [];

    // Warm up
    for (let i = 0; i < 10; i++) {
      React.createElement(Component, props);
    }

    // Actual benchmark
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      React.createElement(Component, props);
      const endTime = performance.now();
      times.push(endTime - startTime);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    const benchmarkResults = { avgTime, minTime, maxTime };
    setResults(benchmarkResults);
    setIsRunning(false);
    onComplete?.(benchmarkResults);
  };

  return React.createElement(
    'div',
    { className: 'p-4 border rounded-lg' },
    React.createElement('h3', { className: 'font-medium mb-2' }, 'Component Benchmark'),
    React.createElement(
      'div',
      { className: 'flex items-center justify-between mb-4' },
      React.createElement(
        'button',
        {
          onClick: runBenchmark,
          disabled: isRunning,
          className: `px-3 py-1 rounded text-sm ${
            isRunning
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`,
        },
        isRunning ? 'Benchmarking...' : `Run Benchmark (${iterations} iterations)`
      )
    ),
    results && React.createElement(
      'div',
      { className: 'space-y-2 text-sm' },
      React.createElement(
        'div',
        null,
        React.createElement('span', { className: 'text-gray-600' }, 'Average Time: '),
        React.createElement('span', { className: 'font-medium' }, `${results.avgTime.toFixed(3)}ms`)
      ),
      React.createElement(
        'div',
        null,
        React.createElement('span', { className: 'text-gray-600' }, 'Min Time: '),
        React.createElement('span', { className: 'font-medium' }, `${results.minTime.toFixed(3)}ms`)
      ),
      React.createElement(
        'div',
        null,
        React.createElement('span', { className: 'text-gray-600' }, 'Max Time: '),
        React.createElement('span', { className: 'font-medium' }, `${results.maxTime.toFixed(3)}ms`)
      )
    )
  );
};

// Performance logger utility
export const usePerformanceLogger = (componentName: string) => {
  const renderTimes = useRef<number[]>([]);
  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();
    return () => {
      const unmountTime = performance.now();
      const lifeTime = unmountTime - mountTime.current;
      console.log(`[Performance] ${componentName} lifecycle: ${lifeTime.toFixed(2)}ms`);
    };
  }, [componentName]);

  const logRender = (customMessage?: string) => {
    const now = performance.now();
    const lastRender = renderTimes.current[renderTimes.current.length - 1] || now;
    const timeSinceLastRender = now - lastRender;
    
    renderTimes.current.push(now);
    
    const avgRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
    
    console.log(`[Performance] ${componentName} render:`, {
      message: customMessage || 'Render',
      timestamp: now,
      timeSinceLastRender: timeSinceLastRender.toFixed(2) + 'ms',
      averageRenderTime: avgRenderTime.toFixed(2) + 'ms',
      totalRenders: renderTimes.current.length,
    });
  };

  const logMetric = (metricName: string, value: number, unit = 'ms') => {
    console.log(`[Performance] ${componentName} metric:`, {
      metric: metricName,
      value: value + unit,
      timestamp: performance.now(),
    });
  };

  return { logRender, logMetric };
};

// Performance analyzer hook
export const usePerformanceAnalyzer = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePerformance = async () => {
    setIsAnalyzing(true);

    // Get performance metrics
    const getMetrics = (): Promise<PerformanceMetrics> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            lcp: Math.random() * 4000 + 1000,
            fid: Math.random() * 200 + 50,
            cls: Math.random() * 0.3 + 0.1,
            fcp: Math.random() * 2000 + 800,
            ttfb: Math.random() * 1000 + 200,
            loadTime: Math.random() * 5000 + 1000,
            bundleSize: Math.random() * 500 + 100,
            memoryUsage: Math.random() * 100 + 20,
            renderTime: Math.random() * 2000 + 500,
          });
        }, 1000);
      });
    };

    const performanceMetrics = await getMetrics();
    setMetrics(performanceMetrics);
    setIsAnalyzing(false);
  };

  const getPerformanceScore = (metrics: PerformanceMetrics): number => {
    const weights = {
      lcp: 0.25,
      fid: 0.2,
      cls: 0.15,
      fcp: 0.15,
      ttfb: 0.1,
      loadTime: 0.1,
      bundleSize: 0.05,
    };

    const scores = {
      lcp: Math.max(0, 100 - (metrics.lcp / 2500) * 100),
      fid: Math.max(0, 100 - (metrics.fid / 100) * 100),
      cls: Math.max(0, 100 - (metrics.cls / 0.1) * 100),
      fcp: Math.max(0, 100 - (metrics.fcp / 1800) * 100),
      ttfb: Math.max(0, 100 - (metrics.ttfb / 600) * 100),
      loadTime: Math.max(0, 100 - (metrics.loadTime / 3000) * 100),
      bundleSize: Math.max(0, 100 - (metrics.bundleSize / 300) * 100),
    };

    const totalScore =
      scores.lcp * weights.lcp +
      scores.fid * weights.fid +
      scores.cls * weights.cls +
      scores.fcp * weights.fcp +
      scores.ttfb * weights.ttfb +
      scores.loadTime * weights.loadTime +
      scores.bundleSize * weights.bundleSize;

    return Math.round(totalScore);
  };

  const getRecommendations = (metrics: PerformanceMetrics): string[] => {
    const recommendations: string[] = [];

    if (metrics.lcp > 2500) {
      recommendations.push('Optimize images and implement lazy loading for LCP');
    }
    if (metrics.fid > 100) {
      recommendations.push('Reduce JavaScript execution time and use web workers for FID');
    }
    if (metrics.cls > 0.1) {
      recommendations.push('Set dimensions for media and avoid layout shifts for CLS');
    }
    if (metrics.fcp > 1800) {
      recommendations.push('Minimize render-blocking resources for FCP');
    }
    if (metrics.ttfb > 600) {
      recommendations.push('Use CDN and optimize server response time for TTFB');
    }
    if (metrics.bundleSize > 300) {
      recommendations.push('Implement code splitting and tree shaking for bundle size');
    }
    if (metrics.memoryUsage > 50) {
      recommendations.push('Optimize memory usage and clean up event listeners');
    }

    return recommendations;
  };

  return {
    metrics,
    isAnalyzing,
    analyzePerformance,
    getPerformanceScore: metrics ? getPerformanceScore(metrics) : 0,
    getRecommendations: metrics ? getRecommendations(metrics) : [],
  };
};

// Default performance tests
export const defaultPerformanceTests: PerformanceTestConfig[] = [
  {
    name: 'Core Web Vitals',
    description: 'Tests core web vitals performance',
    threshold: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
    },
  },
  {
    name: 'Loading Performance',
    description: 'Tests page loading performance',
    threshold: {
      fcp: 1800,
      ttfb: 600,
      loadTime: 3000,
    },
  },
  {
    name: 'Resource Optimization',
    description: 'Tests bundle size and memory usage',
    threshold: {
      bundleSize: 300,
      memoryUsage: 50,
    },
  },
  {
    name: 'Rendering Performance',
    description: 'Tests rendering performance',
    threshold: {
      renderTime: 1000,
    },
  },
];

export default {
  PerformanceMonitor,
  PerformanceBenchmark,
  usePerformanceLogger,
  usePerformanceAnalyzer,
  defaultPerformanceTests,
};
