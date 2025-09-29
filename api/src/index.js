import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import mongoSanitize from 'express-mongo-sanitize';
import requestId from 'express-request-id';
import 'express-async-errors';

import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { setupSwagger } from './config/swagger.js';
import { setupPrometheus } from './config/prometheus.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiKeyAuth } from './middleware/auth.js';
import { validateApiVersion } from './middleware/versioning.js';

// Import routes
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import customersRoutes from './routes/customers.js';
import paymentsRoutes from './routes/payments.js';
import deliveryRoutes from './routes/delivery.js';
import reviewsRoutes from './routes/reviews.js';
import promotionsRoutes from './routes/promotions.js';
import analyticsRoutes from './routes/analytics.js';
import webhooksRoutes from './routes/webhooks.js';
import partnersRoutes from './routes/partners.js';
import cornmanRoutes from './routes/cornman.js';

// Import GraphQL
import { setupGraphQL } from './graphql/index.js';

const app = express();
const PORT = process.env.PORT || 3001;
const API_VERSION = process.env.API_VERSION || 'v1';

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Request-ID']
}));

// Compression
app.use(compression());

// Request ID
app.use(requestId());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === 'true'
});

// Speed limiter
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // allow 50 requests per 15 minutes, then...
    delayMs: 500 // begin adding 500ms of delay per request above 50
});

app.use('/api/', limiter);
app.use('/api/', speedLimiter);

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// API versioning middleware
app.use('/api', validateApiVersion);

// Public routes (no authentication required)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/webhooks', webhooksRoutes);
app.use('/api/v1/cornman', cornmanRoutes);

// Protected routes (authentication required)
app.use('/api/v1/products', apiKeyAuth, productsRoutes);
app.use('/api/v1/orders', apiKeyAuth, ordersRoutes);
app.use('/api/v1/customers', apiKeyAuth, customersRoutes);
app.use('/api/v1/payments', apiKeyAuth, paymentsRoutes);
app.use('/api/v1/delivery', apiKeyAuth, deliveryRoutes);
app.use('/api/v1/reviews', apiKeyAuth, reviewsRoutes);
app.use('/api/v1/promotions', apiKeyAuth, promotionsRoutes);
app.use('/api/v1/analytics', apiKeyAuth, analyticsRoutes);
app.use('/api/v1/partners', apiKeyAuth, partnersRoutes);

// GraphQL endpoint
if (process.env.ENABLE_GRAPHQL === 'true') {
    setupGraphQL(app);
}

// API Documentation
setupSwagger(app);

// Prometheus metrics
if (process.env.ENABLE_METRICS === 'true') {
    setupPrometheus(app);
}

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Start server
async function startServer() {
    try {
        // Connect to databases
        await connectDatabase();
        await connectRedis();

        app.listen(PORT, () => {
            logger.info(`🚀 CORNMAN API Server running on port ${PORT}`);
            logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
            logger.info(`🔍 GraphQL Playground: http://localhost:${PORT}/graphql`);
            logger.info(`📊 Metrics: http://localhost:${PORT}/metrics`);
            logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

export default app;
