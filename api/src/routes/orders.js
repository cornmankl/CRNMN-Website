import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { Order } from '../models/Order.js';
import { logger } from '../utils/logger.js';
import { validateRequest } from '../middleware/validation.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
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
 *         description: Number of orders per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']).withMessage('Invalid status'),
  validateRequest,
  cacheMiddleware(60) // 1 minute cache
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status
    } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      }
    });

  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to fetch orders'
    });
  }
});

export default router;
