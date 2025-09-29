import express from 'express';
import crypto from 'crypto';
import { body, param, validationResult } from 'express-validator';
import { Webhook } from '../models/Webhook.js';
import { WebhookDelivery } from '../models/WebhookDelivery.js';
import { logger } from '../utils/logger.js';
import { validateRequest } from '../middleware/validation.js';
import { webhookQueue } from '../queues/webhookQueue.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Webhook:
 *       type: object
 *       required:
 *         - url
 *         - events
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier
 *         url:
 *           type: string
 *           format: uri
 *           description: Webhook URL
 *         events:
 *           type: array
 *           items:
 *             type: string
 *             enum: [product.created, product.updated, product.deleted, order.created, order.updated, order.cancelled, payment.completed, payment.failed, delivery.started, delivery.completed, review.created, review.updated]
 *         secret:
 *           type: string
 *           description: Webhook secret for signature verification
 *         isActive:
 *           type: boolean
 *           default: true
 *         retryAttempts:
 *           type: integer
 *           default: 3
 *         timeout:
 *           type: integer
 *           default: 5000
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     WebhookDelivery:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         webhookId:
 *           type: string
 *         event:
 *           type: string
 *         payload:
 *           type: object
 *         status:
 *           type: string
 *           enum: [pending, delivered, failed, retrying]
 *         attempts:
 *           type: integer
 *         lastAttemptAt:
 *           type: string
 *           format: date-time
 *         nextRetryAt:
 *           type: string
 *           format: date-time
 *         responseStatus:
 *           type: integer
 *         responseBody:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/webhooks:
 *   get:
 *     summary: Get all webhooks
 *     tags: [Webhooks]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of webhooks per page
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of webhooks
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('isActive').optional().isBoolean().withMessage('Is active must be a boolean'),
    validateRequest
], async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            isActive
        } = req.query;

        const filter = { partner: req.partner._id };
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [webhooks, total] = await Promise.all([
            Webhook.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Webhook.countDocuments(filter)
        ]);

        const pages = Math.ceil(total / parseInt(limit));

        res.json({
            success: true,
            data: webhooks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages
            }
        });

    } catch (error) {
        logger.error('Error fetching webhooks:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch webhooks'
        });
    }
});

/**
 * @swagger
 * /api/v1/webhooks:
 *   post:
 *     summary: Create new webhook
 *     tags: [Webhooks]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Webhook'
 *     responses:
 *       201:
 *         description: Webhook created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', [
    body('url').isURL().withMessage('Valid URL is required'),
    body('events').isArray({ min: 1 }).withMessage('At least one event is required'),
    body('events.*').isIn([
        'product.created', 'product.updated', 'product.deleted',
        'order.created', 'order.updated', 'order.cancelled',
        'payment.completed', 'payment.failed',
        'delivery.started', 'delivery.completed',
        'review.created', 'review.updated'
    ]).withMessage('Invalid event type'),
    body('retryAttempts').optional().isInt({ min: 1, max: 10 }).withMessage('Retry attempts must be between 1 and 10'),
    body('timeout').optional().isInt({ min: 1000, max: 30000 }).withMessage('Timeout must be between 1000 and 30000'),
    validateRequest
], async (req, res) => {
    try {
        const webhookData = {
            ...req.body,
            partner: req.partner._id,
            secret: crypto.randomBytes(32).toString('hex')
        };

        const webhook = new Webhook(webhookData);
        await webhook.save();

        logger.info('Webhook created', {
            webhookId: webhook._id,
            url: webhook.url,
            events: webhook.events,
            partner: req.partner.name
        });

        res.status(201).json({
            success: true,
            data: webhook,
            message: 'Webhook created successfully'
        });

    } catch (error) {
        logger.error('Error creating webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to create webhook'
        });
    }
});

/**
 * @swagger
 * /api/v1/webhooks/{id}:
 *   get:
 *     summary: Get webhook by ID
 *     tags: [Webhooks]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Webhook ID
 *     responses:
 *       200:
 *         description: Webhook details
 *       404:
 *         description: Webhook not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', [
    param('id').isMongoId().withMessage('Invalid webhook ID'),
    validateRequest
], async (req, res) => {
    try {
        const webhook = await Webhook.findOne({
            _id: req.params.id,
            partner: req.partner._id
        }).lean();

        if (!webhook) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Webhook not found'
            });
        }

        res.json({
            success: true,
            data: webhook
        });

    } catch (error) {
        logger.error('Error fetching webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch webhook'
        });
    }
});

/**
 * @swagger
 * /api/v1/webhooks/{id}:
 *   put:
 *     summary: Update webhook
 *     tags: [Webhooks]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Webhook ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Webhook'
 *     responses:
 *       200:
 *         description: Webhook updated successfully
 *       404:
 *         description: Webhook not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', [
    param('id').isMongoId().withMessage('Invalid webhook ID'),
    body('url').optional().isURL().withMessage('Valid URL is required'),
    body('events').optional().isArray({ min: 1 }).withMessage('At least one event is required'),
    validateRequest
], async (req, res) => {
    try {
        const webhook = await Webhook.findOne({
            _id: req.params.id,
            partner: req.partner._id
        });

        if (!webhook) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Webhook not found'
            });
        }

        Object.assign(webhook, req.body);
        webhook.updatedAt = new Date();
        await webhook.save();

        logger.info('Webhook updated', {
            webhookId: webhook._id,
            url: webhook.url,
            events: webhook.events,
            partner: req.partner.name
        });

        res.json({
            success: true,
            data: webhook,
            message: 'Webhook updated successfully'
        });

    } catch (error) {
        logger.error('Error updating webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to update webhook'
        });
    }
});

/**
 * @swagger
 * /api/v1/webhooks/{id}:
 *   delete:
 *     summary: Delete webhook
 *     tags: [Webhooks]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Webhook ID
 *     responses:
 *       200:
 *         description: Webhook deleted successfully
 *       404:
 *         description: Webhook not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', [
    param('id').isMongoId().withMessage('Invalid webhook ID'),
    validateRequest
], async (req, res) => {
    try {
        const webhook = await Webhook.findOne({
            _id: req.params.id,
            partner: req.partner._id
        });

        if (!webhook) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Webhook not found'
            });
        }

        webhook.isActive = false;
        await webhook.save();

        logger.info('Webhook deleted', {
            webhookId: webhook._id,
            url: webhook.url,
            partner: req.partner.name
        });

        res.json({
            success: true,
            message: 'Webhook deleted successfully'
        });

    } catch (error) {
        logger.error('Error deleting webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to delete webhook'
        });
    }
});

/**
 * @swagger
 * /api/v1/webhooks/{id}/deliveries:
 *   get:
 *     summary: Get webhook delivery history
 *     tags: [Webhooks]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Webhook ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of deliveries per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, delivered, failed, retrying]
 *         description: Filter by delivery status
 *     responses:
 *       200:
 *         description: List of webhook deliveries
 *       404:
 *         description: Webhook not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id/deliveries', [
    param('id').isMongoId().withMessage('Invalid webhook ID'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'delivered', 'failed', 'retrying']).withMessage('Invalid status'),
    validateRequest
], async (req, res) => {
    try {
        const webhook = await Webhook.findOne({
            _id: req.params.id,
            partner: req.partner._id
        });

        if (!webhook) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Webhook not found'
            });
        }

        const {
            page = 1,
            limit = 20,
            status
        } = req.query;

        const filter = { webhookId: webhook._id };
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [deliveries, total] = await Promise.all([
            WebhookDelivery.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            WebhookDelivery.countDocuments(filter)
        ]);

        const pages = Math.ceil(total / parseInt(limit));

        res.json({
            success: true,
            data: deliveries,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages
            }
        });

    } catch (error) {
        logger.error('Error fetching webhook deliveries:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch webhook deliveries'
        });
    }
});

/**
 * @swagger
 * /api/v1/webhooks/{id}/test:
 *   post:
 *     summary: Test webhook
 *     tags: [Webhooks]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Webhook ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: Test event type
 *               payload:
 *                 type: object
 *                 description: Test payload
 *     responses:
 *       200:
 *         description: Webhook test initiated
 *       404:
 *         description: Webhook not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/test', [
    param('id').isMongoId().withMessage('Invalid webhook ID'),
    body('event').optional().isString().withMessage('Event must be a string'),
    body('payload').optional().isObject().withMessage('Payload must be an object'),
    validateRequest
], async (req, res) => {
    try {
        const webhook = await Webhook.findOne({
            _id: req.params.id,
            partner: req.partner._id
        });

        if (!webhook) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Webhook not found'
            });
        }

        const testEvent = req.body.event || 'webhook.test';
        const testPayload = req.body.payload || {
            message: 'This is a test webhook delivery',
            timestamp: new Date().toISOString(),
            webhookId: webhook._id
        };

        // Queue webhook delivery
        await webhookQueue.add('deliver-webhook', {
            webhookId: webhook._id,
            event: testEvent,
            payload: testPayload,
            isTest: true
        });

        logger.info('Webhook test initiated', {
            webhookId: webhook._id,
            url: webhook.url,
            event: testEvent,
            partner: req.partner.name
        });

        res.json({
            success: true,
            message: 'Webhook test initiated successfully'
        });

    } catch (error) {
        logger.error('Error testing webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to test webhook'
        });
    }
});

export default router;
