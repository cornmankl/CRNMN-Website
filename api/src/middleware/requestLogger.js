import { logger } from '../utils/logger.js';

export function requestLogger(req, res, next) {
  const start = Date.now();
  
  // Log request
  logger.info('API Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.id,
    timestamp: new Date().toISOString()
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    
    logger.info('API Response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      requestId: req.id,
      timestamp: new Date().toISOString()
    });

    originalEnd.call(this, chunk, encoding);
  };

  next();
}
