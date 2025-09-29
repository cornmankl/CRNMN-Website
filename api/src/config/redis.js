import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient;

export async function connectRedis() {
    try {
        redisClient = new Redis(REDIS_URL, {
            retryDelayOnFailover: 100,
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
            lazyConnect: true,
            keepAlive: 30000,
            connectTimeout: 10000,
            commandTimeout: 5000,
        });

        redisClient.on('connect', () => {
            logger.info('✅ Redis client connected');
        });

        redisClient.on('ready', () => {
            logger.info('✅ Redis client ready');
        });

        redisClient.on('error', (err) => {
            logger.error('❌ Redis client error:', err);
        });

        redisClient.on('close', () => {
            logger.warn('Redis client connection closed');
        });

        redisClient.on('reconnecting', () => {
            logger.info('Redis client reconnecting...');
        });

        // Test connection
        await redisClient.ping();
        logger.info('✅ Redis connection test successful');

    } catch (error) {
        logger.error('❌ Redis connection failed:', error);
        throw error;
    }
}

export function getRedisClient() {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
}

export async function closeRedis() {
    if (redisClient) {
        await redisClient.quit();
        logger.info('Redis client disconnected');
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await closeRedis();
    process.exit(0);
});

export default redisClient;
