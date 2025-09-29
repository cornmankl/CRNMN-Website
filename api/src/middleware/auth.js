import jwt from 'jsonwebtoken';
import { getRedisClient } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { ApiKey } from '../models/ApiKey.js';
import { Partner } from '../models/Partner.js';

const JWT_SECRET = process.env.JWT_SECRET;
const API_KEY_SECRET = process.env.API_KEY_SECRET;

/**
 * API Key Authentication Middleware
 */
export async function apiKeyAuth(req, res, next) {
    try {
        const apiKey = req.headers['x-api-key'] || req.query.api_key;

        if (!apiKey) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'API key is required',
                code: 'MISSING_API_KEY'
            });
        }

        // Check if API key is in Redis cache first
        const cachedKey = await getRedisClient().get(`api_key:${apiKey}`);
        let keyData;

        if (cachedKey) {
            keyData = JSON.parse(cachedKey);
        } else {
            // Fetch from database
            keyData = await ApiKey.findOne({ key: apiKey, isActive: true })
                .populate('partner', 'name email status permissions')
                .lean();

            if (!keyData) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Invalid API key',
                    code: 'INVALID_API_KEY'
                });
            }

            // Cache for 1 hour
            await getRedisClient().setex(`api_key:${apiKey}`, 3600, JSON.stringify(keyData));
        }

        // Check if partner is active
        if (keyData.partner && keyData.partner.status !== 'active') {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Partner account is not active',
                code: 'PARTNER_INACTIVE'
            });
        }

        // Check rate limits
        const rateLimitKey = `rate_limit:${apiKey}:${Math.floor(Date.now() / 60000)}`;
        const currentRequests = await getRedisClient().incr(rateLimitKey);

        if (currentRequests === 1) {
            await getRedisClient().expire(rateLimitKey, 60); // 1 minute window
        }

        if (currentRequests > keyData.rateLimit) {
            return res.status(429).json({
                error: 'Too Many Requests',
                message: 'Rate limit exceeded',
                code: 'RATE_LIMIT_EXCEEDED',
                retryAfter: 60
            });
        }

        // Attach key data to request
        req.apiKey = keyData;
        req.partner = keyData.partner;

        // Log API usage
        logger.info('API request', {
            apiKey: apiKey.substring(0, 8) + '...',
            partner: keyData.partner?.name || 'Unknown',
            endpoint: req.path,
            method: req.method,
            ip: req.ip
        });

        next();
    } catch (error) {
        logger.error('API key authentication error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Authentication failed',
            code: 'AUTH_ERROR'
        });
    }
}

/**
 * JWT Token Authentication
 */
export function jwtAuth(req, res, next) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'JWT token is required',
                code: 'MISSING_JWT_TOKEN'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'JWT token has expired',
                code: 'JWT_EXPIRED'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid JWT token',
                code: 'INVALID_JWT_TOKEN'
            });
        }

        logger.error('JWT authentication error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Authentication failed',
            code: 'JWT_AUTH_ERROR'
        });
    }
}

/**
 * Role-based Authorization
 */
export function requireRole(roles) {
    return (req, res, next) => {
        if (!req.partner) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required',
                code: 'AUTH_REQUIRED'
            });
        }

        const userRoles = req.partner.permissions || [];
        const hasRole = roles.some(role => userRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Insufficient permissions',
                code: 'INSUFFICIENT_PERMISSIONS',
                required: roles,
                current: userRoles
            });
        }

        next();
    };
}

/**
 * Permission-based Authorization
 */
export function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.partner) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required',
                code: 'AUTH_REQUIRED'
            });
        }

        const permissions = req.partner.permissions || [];

        if (!permissions.includes(permission)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Permission denied',
                code: 'PERMISSION_DENIED',
                required: permission,
                current: permissions
            });
        }

        next();
    };
}

/**
 * IP Whitelist Check
 */
export async function checkIPWhitelist(req, res, next) {
    try {
        if (!req.apiKey || !req.apiKey.ipWhitelist || req.apiKey.ipWhitelist.length === 0) {
            return next();
        }

        const clientIP = req.ip;
        const isWhitelisted = req.apiKey.ipWhitelist.some(ip => {
            if (ip.includes('/')) {
                // CIDR notation
                return isIPInCIDR(clientIP, ip);
            }
            return clientIP === ip;
        });

        if (!isWhitelisted) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'IP address not whitelisted',
                code: 'IP_NOT_WHITELISTED',
                clientIP
            });
        }

        next();
    } catch (error) {
        logger.error('IP whitelist check error:', error);
        next(); // Allow request to continue if IP check fails
    }
}

/**
 * Request Signature Validation
 */
export function validateSignature(req, res, next) {
    try {
        const signature = req.headers['x-signature'];
        const timestamp = req.headers['x-timestamp'];

        if (!signature || !timestamp) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Request signature is required',
                code: 'MISSING_SIGNATURE'
            });
        }

        // Check timestamp (prevent replay attacks)
        const now = Math.floor(Date.now() / 1000);
        const requestTime = parseInt(timestamp);

        if (Math.abs(now - requestTime) > 300) { // 5 minutes tolerance
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Request timestamp is too old',
                code: 'TIMESTAMP_TOO_OLD'
            });
        }

        // Validate signature
        const expectedSignature = generateSignature(req, timestamp);

        if (signature !== expectedSignature) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid request signature',
                code: 'INVALID_SIGNATURE'
            });
        }

        next();
    } catch (error) {
        logger.error('Signature validation error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Signature validation failed',
            code: 'SIGNATURE_VALIDATION_ERROR'
        });
    }
}

/**
 * Generate request signature
 */
function generateSignature(req, timestamp) {
    const crypto = require('crypto');
    const secret = req.apiKey?.secret || API_KEY_SECRET;

    const method = req.method;
    const path = req.path;
    const body = JSON.stringify(req.body) || '';
    const query = new URLSearchParams(req.query).toString();

    const stringToSign = `${method}\n${path}\n${query}\n${body}\n${timestamp}`;

    return crypto
        .createHmac('sha256', secret)
        .update(stringToSign)
        .digest('hex');
}

/**
 * Check if IP is in CIDR range
 */
function isIPInCIDR(ip, cidr) {
    // Simple CIDR check implementation
    // In production, use a proper CIDR library
    const [network, prefixLength] = cidr.split('/');
    const ipNum = ipToNumber(ip);
    const networkNum = ipToNumber(network);
    const mask = (0xffffffff << (32 - parseInt(prefixLength))) >>> 0;

    return (ipNum & mask) === (networkNum & mask);
}

function ipToNumber(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}
