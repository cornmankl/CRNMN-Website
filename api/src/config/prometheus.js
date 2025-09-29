import client from 'prom-client';

// Create a Registry
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const apiKeyUsage = new client.Counter({
  name: 'api_key_usage_total',
  help: 'Total API key usage',
  labelNames: ['api_key', 'endpoint', 'status']
});

const webhookDeliveries = new client.Counter({
  name: 'webhook_deliveries_total',
  help: 'Total webhook deliveries',
  labelNames: ['webhook_id', 'event', 'status']
});

// Register metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(apiKeyUsage);
register.registerMetric(webhookDeliveries);

export function setupPrometheus(app) {
  // Metrics endpoint
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  // Middleware to collect metrics
  app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const route = req.route ? req.route.path : req.path;
      
      httpRequestDuration
        .labels(req.method, route, res.statusCode)
        .observe(duration);
      
      httpRequestTotal
        .labels(req.method, route, res.statusCode)
        .inc();
    });
    
    next();
  });

  console.log('📊 Prometheus metrics available at /metrics');
}

export { register, httpRequestDuration, httpRequestTotal, activeConnections, apiKeyUsage, webhookDeliveries };
