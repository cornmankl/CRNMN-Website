// Analytics and monitoring utilities
export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private events: any[] = [];
  private isEnabled = true;

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  // Track page views
  trackPageView(page: string, title?: string) {
    if (!this.isEnabled) return;

    const event = {
      type: 'page_view',
      page,
      title: title || document.title,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  // Track user interactions
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const event = {
      type: 'event',
      name: eventName,
      properties: properties || {},
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  // Track e-commerce events
  trackPurchase(orderId: string, value: number, items: any[]) {
    if (!this.isEnabled) return;

    const event = {
      type: 'purchase',
      orderId,
      value,
      items,
      timestamp: new Date().toISOString(),
      currency: 'MYR'
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  // Track cart events
  trackAddToCart(item: any) {
    this.trackEvent('add_to_cart', {
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: 1
    });
  }

  trackRemoveFromCart(item: any) {
    this.trackEvent('remove_from_cart', {
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price
    });
  }

  // Track search events
  trackSearch(query: string, results: number) {
    this.trackEvent('search', {
      search_term: query,
      results_count: results
    });
  }

  // Track user engagement
  trackEngagement(action: string, duration?: number) {
    this.trackEvent('engagement', {
      action,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  // Track errors
  trackError(error: Error, context?: string) {
    const event = {
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.trackEvent('performance', {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString()
    });
  }

  // Send to analytics service
  private sendToAnalytics(event: any) {
    // In a real implementation, you would send to Google Analytics, Mixpanel, etc.
    console.log('Analytics Event:', event);
    
    // Example: Send to Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event.name || event.type, event.properties || {});
    }

    // Example: Send to custom analytics endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event)
    }).catch(error => {
      console.error('Failed to send analytics event:', error);
    });
  }

  // Get analytics data
  getEvents() {
    return this.events;
  }

  // Clear events
  clearEvents() {
    this.events = [];
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

export const analytics = AnalyticsManager.getInstance();

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure page load time
  measurePageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        
        this.metrics.set('page_load_time', loadTime);
        analytics.trackPerformance('page_load_time', loadTime);
      });
    }
  }

  // Measure component render time
  measureRender(componentName: string, startTime: number) {
    const renderTime = performance.now() - startTime;
    this.metrics.set(`${componentName}_render_time`, renderTime);
    analytics.trackPerformance(`${componentName}_render_time`, renderTime);
  }

  // Measure API response time
  measureAPI(apiName: string, startTime: number) {
    const responseTime = performance.now() - startTime;
    this.metrics.set(`${apiName}_response_time`, responseTime);
    analytics.trackPerformance(`${apiName}_response_time`, responseTime);
  }

  // Get all metrics
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Error tracking
export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: Error[] = [];

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  // Initialize error tracking
  init() {
    // Track unhandled errors
    window.addEventListener('error', (event) => {
      this.trackError(new Error(event.message), 'unhandled_error');
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), 'unhandled_promise_rejection');
    });
  }

  // Track custom errors
  trackError(error: Error, context?: string) {
    this.errors.push(error);
    analytics.trackError(error, context);
  }

  // Get all errors
  getErrors() {
    return this.errors;
  }

  // Clear errors
  clearErrors() {
    this.errors = [];
  }
}

export const errorTracker = ErrorTracker.getInstance();

// Initialize tracking
if (typeof window !== 'undefined') {
  errorTracker.init();
  performanceMonitor.measurePageLoad();
}
