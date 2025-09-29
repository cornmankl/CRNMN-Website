import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Partner } from '../models/Partner.js';
import { ApiKey } from '../models/ApiKey.js';
import { logger } from '../utils/logger.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register new partner
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - company
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               company:
 *                 type: string
 *               website:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Partner registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Email already exists
 */
router.post('/register', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('company').notEmpty().trim().withMessage('Company is required'),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  validateRequest
], async (req, res) => {
  try {
    const { name, email, company, website } = req.body;

    // Check if partner already exists
    const existingPartner = await Partner.findOne({ email });
    if (existingPartner) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
    }

    // Create new partner
    const partner = new Partner({
      name,
      email,
      company,
      website
    });

    await partner.save();

    // Create API key for partner
    const apiKey = new ApiKey({
      partner: partner._id,
      name: `${company} - Main API Key`,
      description: 'Primary API key for partner integration'
    });

    await apiKey.save();

    logger.info('Partner registered', {
      partnerId: partner._id,
      name: partner.name,
      email: partner.email
    });

    res.status(201).json({
      success: true,
      data: {
        partner: {
          id: partner._id,
          name: partner.name,
          email: partner.email,
          company: partner.company,
          status: partner.status
        },
        apiKey: {
          id: apiKey._id,
          key: apiKey.key,
          name: apiKey.name
        }
      },
      message: 'Partner registered successfully'
    });

  } catch (error) {
    logger.error('Error registering partner:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to register partner'
    });
  }
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login partner
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: Partner not found
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  validateRequest
], async (req, res) => {
  try {
    const { email } = req.body;

    const partner = await Partner.findOne({ email });
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Partner not found',
        code: 'PARTNER_NOT_FOUND'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        partnerId: partner._id,
        email: partner.email,
        name: partner.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info('Partner logged in', {
      partnerId: partner._id,
      email: partner.email
    });

    res.json({
      success: true,
      data: {
        token,
        partner: {
          id: partner._id,
          name: partner.name,
          email: partner.email,
          company: partner.company,
          status: partner.status
        }
      },
      message: 'Login successful'
    });

  } catch (error) {
    logger.error('Error logging in partner:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to login'
    });
  }
});

export default router;
