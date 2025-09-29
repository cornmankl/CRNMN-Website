import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  // Log error
  logger.error('API Error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Default error
  let error = {
    success: false,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = {
      success: false,
      error: 'Validation Error',
      message: 'Invalid input data',
      code: 'VALIDATION_ERROR',
      details: Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      })),
      timestamp: new Date().toISOString()
    };
    return res.status(400).json(error);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error = {
      success: false,
      error: 'Duplicate Error',
      message: 'Resource already exists',
      code: 'DUPLICATE_ERROR',
      details: {
        field: Object.keys(err.keyValue)[0],
        value: Object.values(err.keyValue)[0]
      },
      timestamp: new Date().toISOString()
    };
    return res.status(409).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      success: false,
      error: 'Unauthorized',
      message: 'Invalid token',
      code: 'INVALID_TOKEN',
      timestamp: new Date().toISOString()
    };
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      success: false,
      error: 'Unauthorized',
      message: 'Token expired',
      code: 'TOKEN_EXPIRED',
      timestamp: new Date().toISOString()
    };
    return res.status(401).json(error);
  }

  // Rate limit error
  if (err.status === 429) {
    error = {
      success: false,
      error: 'Too Many Requests',
      message: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: err.retryAfter,
      timestamp: new Date().toISOString()
    };
    return res.status(429).json(error);
  }

  // Custom API errors
  if (err.status && err.message) {
    error = {
      success: false,
      error: err.name || 'API Error',
      message: err.message,
      code: err.code || 'API_ERROR',
      timestamp: new Date().toISOString()
    };
    return res.status(err.status).json(error);
  }

  // Default to 500 server error
  res.status(500).json(error);
}
