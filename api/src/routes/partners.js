import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { Partner } from '../models/Partner.js';
import { logger } from '../utils/logger.js';
import { validateRequest } from '../middleware/validation.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/partners:
 *   get:
 *     summary: Get all partners
 *     tags: [Partners]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of partners
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validateRequest,
  cacheMiddleware(300) // 5 minutes cache
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [partners, total] = await Promise.all([
      Partner.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Partner.countDocuments()
    ]);

    const pages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: partners,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      }
    });

  } catch (error) {
    logger.error('Error fetching partners:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to fetch partners'
    });
  }
});

export default router;
