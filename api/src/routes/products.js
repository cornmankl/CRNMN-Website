import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { Product } from '../models/Product.js';
import { logger } from '../utils/logger.js';
import { cacheMiddleware } from '../middleware/cache.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         price:
 *           type: number
 *           format: float
 *           description: Product price
 *         category:
 *           type: string
 *           enum: [appetizer, main, dessert, beverage, combo]
 *           description: Product category
 *         availability:
 *           type: object
 *           properties:
 *             inStock:
 *               type: boolean
 *             quantity:
 *               type: number
 *             lastUpdated:
 *               type: string
 *               format: date-time
 *         nutrition:
 *           type: object
 *           properties:
 *             calories:
 *               type: number
 *             protein:
 *               type: number
 *             carbs:
 *               type: number
 *             fat:
 *               type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         isActive:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
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
 *         description: Number of products per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [appetizer, main, dessert, beverage, combo]
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum price filter
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter by stock availability
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, createdAt, updatedAt]
 *           default: name
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('category').optional().isIn(['appetizer', 'main', 'dessert', 'beverage', 'combo']).withMessage('Invalid category'),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
    query('inStock').optional().isBoolean().withMessage('In stock must be a boolean'),
    query('sortBy').optional().isIn(['name', 'price', 'createdAt', 'updatedAt']).withMessage('Invalid sort field'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
    validateRequest,
    cacheMiddleware(300) // 5 minutes cache
], async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            search,
            minPrice,
            maxPrice,
            inStock,
            sortBy = 'name',
            sortOrder = 'asc'
        } = req.query;

        // Build filter object
        const filter = { isActive: true };

        if (category) filter.category = category;
        if (inStock !== undefined) filter['availability.inStock'] = inStock === 'true';
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Product.countDocuments(filter)
        ]);

        const pages = Math.ceil(total / parseInt(limit));

        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages
            }
        });

    } catch (error) {
        logger.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch products'
        });
    }
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', [
    param('id').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    cacheMiddleware(600) // 10 minutes cache
], async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        logger.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to fetch product'
        });
    }
});

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create new product
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post('/', [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('description').optional().trim(),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').isIn(['appetizer', 'main', 'dessert', 'beverage', 'combo']).withMessage('Invalid category'),
    body('availability.inStock').optional().isBoolean().withMessage('In stock must be a boolean'),
    body('availability.quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('nutrition.calories').optional().isInt({ min: 0 }).withMessage('Calories must be a non-negative integer'),
    body('nutrition.protein').optional().isFloat({ min: 0 }).withMessage('Protein must be a positive number'),
    body('nutrition.carbs').optional().isFloat({ min: 0 }).withMessage('Carbs must be a positive number'),
    body('nutrition.fat').optional().isFloat({ min: 0 }).withMessage('Fat must be a positive number'),
    body('images').optional().isArray().withMessage('Images must be an array'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    validateRequest
], async (req, res) => {
    try {
        const productData = {
            ...req.body,
            createdBy: req.partner._id
        };

        const product = new Product(productData);
        await product.save();

        // Clear cache
        req.clearCache?.();

        logger.info('Product created', {
            productId: product._id,
            name: product.name,
            partner: req.partner.name
        });

        res.status(201).json({
            success: true,
            data: product,
            message: 'Product created successfully'
        });

    } catch (error) {
        logger.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to create product'
        });
    }
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('name').optional().notEmpty().trim().withMessage('Name cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').optional().isIn(['appetizer', 'main', 'dessert', 'beverage', 'combo']).withMessage('Invalid category'),
    validateRequest
], async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Product not found'
            });
        }

        // Update product
        Object.assign(product, req.body);
        product.updatedAt = new Date();
        await product.save();

        // Clear cache
        req.clearCache?.();

        logger.info('Product updated', {
            productId: product._id,
            name: product.name,
            partner: req.partner.name
        });

        res.json({
            success: true,
            data: product,
            message: 'Product updated successfully'
        });

    } catch (error) {
        logger.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to update product'
        });
    }
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', [
    param('id').isMongoId().withMessage('Invalid product ID'),
    validateRequest
], async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Product not found'
            });
        }

        // Soft delete
        product.isActive = false;
        await product.save();

        // Clear cache
        req.clearCache?.();

        logger.info('Product deleted', {
            productId: product._id,
            name: product.name,
            partner: req.partner.name
        });

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        logger.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to delete product'
        });
    }
});

export default router;
