import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { logger } from '../utils/logger.js';
import { validateRequest } from '../middleware/validation.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/analytics:
 *   get:
 *     summary: Get analytics data
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', [
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO 8601 date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO 8601 date'),
  validateRequest,
  cacheMiddleware(300) // 5 minutes cache
], async (req, res) => {
  try {
    const {
      startDate,
      endDate
    } = req.query;

    // Mock analytics data for now
    const analytics = {
      totalOrders: 1250,
      totalRevenue: 45600.50,
      averageOrderValue: 36.48,
      topProducts: [
        { name: 'Sweet Corn Fritters', orders: 450, revenue: 13500 },
        { name: 'Grilled Corn', orders: 320, revenue: 9600 },
        { name: 'Corn Soup', orders: 280, revenue: 8400 }
      ],
      ordersByStatus: {
        pending: 25,
        confirmed: 45,
        preparing: 30,
        ready: 15,
        delivered: 1100,
        cancelled: 35
      },
      revenueByMonth: [
        { month: 'Jan', revenue: 12000 },
        { month: 'Feb', revenue: 15000 },
        { month: 'Mar', revenue: 18600.50 }
      ]
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to fetch analytics'
    });
  }
});

export default router;
