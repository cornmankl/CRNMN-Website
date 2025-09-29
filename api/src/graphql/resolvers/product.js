import { Product } from '../../models/Product.js';
import { logger } from '../../utils/logger.js';

export const productResolvers = {
    Query: {
        products: async (_, { filter = {}, sort = {}, pagination = {} }, context) => {
            try {
                const { first = 20, after } = pagination;
                const { field = 'name', direction = 'ASC' } = sort;

                // Build filter object
                const mongoFilter = { isActive: true };

                if (filter.category) mongoFilter.category = filter.category.toLowerCase();
                if (filter.subcategory) mongoFilter.subcategory = filter.subcategory;
                if (filter.inStock !== undefined) mongoFilter['availability.inStock'] = filter.inStock;
                if (filter.isFeatured !== undefined) mongoFilter.isFeatured = filter.isFeatured;
                if (filter.isOnSale !== undefined) {
                    if (filter.isOnSale) {
                        mongoFilter.$or = [
                            { 'pricing.discountPrice': { $exists: true, $ne: null } },
                            { 'pricing.discountValidUntil': { $gt: new Date() } }
                        ];
                    }
                }
                if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
                    mongoFilter.price = {};
                    if (filter.minPrice !== undefined) mongoFilter.price.$gte = filter.minPrice;
                    if (filter.maxPrice !== undefined) mongoFilter.price.$lte = filter.maxPrice;
                }
                if (filter.tags && filter.tags.length > 0) {
                    mongoFilter.tags = { $in: filter.tags };
                }
                if (filter.allergens && filter.allergens.length > 0) {
                    mongoFilter.allergens = { $in: filter.allergens };
                }
                if (filter.dietary && filter.dietary.length > 0) {
                    mongoFilter.dietary = { $in: filter.dietary };
                }
                if (filter.search) {
                    mongoFilter.$or = [
                        { name: { $regex: filter.search, $options: 'i' } },
                        { description: { $regex: filter.search, $options: 'i' } },
                        { tags: { $in: [new RegExp(filter.search, 'i')] } }
                    ];
                }

                // Build sort object
                const mongoSort = {};
                const sortField = field.toLowerCase();
                mongoSort[sortField] = direction === 'DESC' ? -1 : 1;

                // Handle cursor-based pagination
                let skip = 0;
                if (after) {
                    const decodedCursor = Buffer.from(after, 'base64').toString('utf-8');
                    const { createdAt, _id } = JSON.parse(decodedCursor);
                    mongoFilter.$or = [
                        { createdAt: { $lt: new Date(createdAt) } },
                        { createdAt: new Date(createdAt), _id: { $lt: _id } }
                    ];
                }

                // Execute query
                const products = await Product.find(mongoFilter)
                    .sort(mongoSort)
                    .limit(first + 1) // Fetch one extra to determine hasNextPage
                    .lean();

                const hasNextPage = products.length > first;
                const edges = products.slice(0, first).map(product => ({
                    node: product,
                    cursor: Buffer.from(JSON.stringify({
                        createdAt: product.createdAt,
                        _id: product._id
                    })).toString('base64')
                }));

                const totalCount = await Product.countDocuments(mongoFilter);

                return {
                    edges,
                    pageInfo: {
                        hasNextPage,
                        hasPreviousPage: !!after,
                        startCursor: edges[0]?.cursor,
                        endCursor: edges[edges.length - 1]?.cursor
                    },
                    totalCount
                };

            } catch (error) {
                logger.error('Error fetching products:', error);
                throw new Error('Failed to fetch products');
            }
        },

        product: async (_, { id }, context) => {
            try {
                const product = await Product.findById(id).lean();
                if (!product) {
                    throw new Error('Product not found');
                }
                return product;
            } catch (error) {
                logger.error('Error fetching product:', error);
                throw new Error('Failed to fetch product');
            }
        },

        productsByCategory: async (_, { category, pagination = {} }, context) => {
            try {
                const { first = 20, after } = pagination;

                const mongoFilter = {
                    category: category.toLowerCase(),
                    isActive: true
                };

                let skip = 0;
                if (after) {
                    const decodedCursor = Buffer.from(after, 'base64').toString('utf-8');
                    const { createdAt, _id } = JSON.parse(decodedCursor);
                    mongoFilter.$or = [
                        { createdAt: { $lt: new Date(createdAt) } },
                        { createdAt: new Date(createdAt), _id: { $lt: _id } }
                    ];
                }

                const products = await Product.find(mongoFilter)
                    .sort({ createdAt: -1 })
                    .limit(first + 1)
                    .lean();

                const hasNextPage = products.length > first;
                const edges = products.slice(0, first).map(product => ({
                    node: product,
                    cursor: Buffer.from(JSON.stringify({
                        createdAt: product.createdAt,
                        _id: product._id
                    })).toString('base64')
                }));

                const totalCount = await Product.countDocuments(mongoFilter);

                return {
                    edges,
                    pageInfo: {
                        hasNextPage,
                        hasPreviousPage: !!after,
                        startCursor: edges[0]?.cursor,
                        endCursor: edges[edges.length - 1]?.cursor
                    },
                    totalCount
                };

            } catch (error) {
                logger.error('Error fetching products by category:', error);
                throw new Error('Failed to fetch products by category');
            }
        },

        featuredProducts: async (_, { pagination = {} }, context) => {
            try {
                const { first = 20, after } = pagination;

                const mongoFilter = {
                    isFeatured: true,
                    isActive: true
                };

                let skip = 0;
                if (after) {
                    const decodedCursor = Buffer.from(after, 'base64').toString('utf-8');
                    const { sortOrder, _id } = JSON.parse(decodedCursor);
                    mongoFilter.$or = [
                        { sortOrder: { $lt: sortOrder } },
                        { sortOrder, _id: { $lt: _id } }
                    ];
                }

                const products = await Product.find(mongoFilter)
                    .sort({ sortOrder: 1, createdAt: -1 })
                    .limit(first + 1)
                    .lean();

                const hasNextPage = products.length > first;
                const edges = products.slice(0, first).map(product => ({
                    node: product,
                    cursor: Buffer.from(JSON.stringify({
                        sortOrder: product.sortOrder,
                        _id: product._id
                    })).toString('base64')
                }));

                const totalCount = await Product.countDocuments(mongoFilter);

                return {
                    edges,
                    pageInfo: {
                        hasNextPage,
                        hasPreviousPage: !!after,
                        startCursor: edges[0]?.cursor,
                        endCursor: edges[edges.length - 1]?.cursor
                    },
                    totalCount
                };

            } catch (error) {
                logger.error('Error fetching featured products:', error);
                throw new Error('Failed to fetch featured products');
            }
        },

        productsOnSale: async (_, { pagination = {} }, context) => {
            try {
                const { first = 20, after } = pagination;
                const now = new Date();

                const mongoFilter = {
                    $or: [
                        { 'pricing.discountPrice': { $exists: true, $ne: null } },
                        { 'pricing.discountValidUntil': { $gt: now } }
                    ],
                    isActive: true
                };

                let skip = 0;
                if (after) {
                    const decodedCursor = Buffer.from(after, 'base64').toString('utf-8');
                    const { discountPercentage, _id } = JSON.parse(decodedCursor);
                    mongoFilter.$or = [
                        { 'pricing.discountPercentage': { $gt: discountPercentage } },
                        { 'pricing.discountPercentage': discountPercentage, _id: { $lt: _id } }
                    ];
                }

                const products = await Product.find(mongoFilter)
                    .sort({ 'pricing.discountPercentage': -1, createdAt: -1 })
                    .limit(first + 1)
                    .lean();

                const hasNextPage = products.length > first;
                const edges = products.slice(0, first).map(product => ({
                    node: product,
                    cursor: Buffer.from(JSON.stringify({
                        discountPercentage: product.pricing.discountPercentage || 0,
                        _id: product._id
                    })).toString('base64')
                }));

                const totalCount = await Product.countDocuments(mongoFilter);

                return {
                    edges,
                    pageInfo: {
                        hasNextPage,
                        hasPreviousPage: !!after,
                        startCursor: edges[0]?.cursor,
                        endCursor: edges[edges.length - 1]?.cursor
                    },
                    totalCount
                };

            } catch (error) {
                logger.error('Error fetching products on sale:', error);
                throw new Error('Failed to fetch products on sale');
            }
        },

        searchProducts: async (_, { query, filter = {}, pagination = {} }, context) => {
            try {
                const { first = 20, after } = pagination;

                const mongoFilter = {
                    $text: { $search: query },
                    isActive: true
                };

                // Apply additional filters
                if (filter.category) mongoFilter.category = filter.category.toLowerCase();
                if (filter.inStock !== undefined) mongoFilter['availability.inStock'] = filter.inStock;
                if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
                    mongoFilter.price = {};
                    if (filter.minPrice !== undefined) mongoFilter.price.$gte = filter.minPrice;
                    if (filter.maxPrice !== undefined) mongoFilter.price.$lte = filter.maxPrice;
                }

                let skip = 0;
                if (after) {
                    const decodedCursor = Buffer.from(after, 'base64').toString('utf-8');
                    const { score, _id } = JSON.parse(decodedCursor);
                    mongoFilter.$or = [
                        { score: { $meta: 'textScore' } },
                        { score: { $lt: score } },
                        { score, _id: { $lt: _id } }
                    ];
                }

                const products = await Product.find(mongoFilter, { score: { $meta: 'textScore' } })
                    .sort({ score: { $meta: 'textScore' } })
                    .limit(first + 1)
                    .lean();

                const hasNextPage = products.length > first;
                const edges = products.slice(0, first).map(product => ({
                    node: product,
                    cursor: Buffer.from(JSON.stringify({
                        score: product.score,
                        _id: product._id
                    })).toString('base64')
                }));

                const totalCount = await Product.countDocuments(mongoFilter);

                return {
                    edges,
                    pageInfo: {
                        hasNextPage,
                        hasPreviousPage: !!after,
                        startCursor: edges[0]?.cursor,
                        endCursor: edges[edges.length - 1]?.cursor
                    },
                    totalCount
                };

            } catch (error) {
                logger.error('Error searching products:', error);
                throw new Error('Failed to search products');
            }
        }
    },

    Mutation: {
        createProduct: async (_, { input }, context) => {
            try {
                if (!context.partner) {
                    throw new Error('Authentication required');
                }

                const productData = {
                    ...input,
                    createdBy: context.partner._id
                };

                const product = new Product(productData);
                await product.save();

                logger.info('Product created via GraphQL', {
                    productId: product._id,
                    name: product.name,
                    partner: context.partner.name
                });

                return {
                    success: true,
                    product
                };

            } catch (error) {
                logger.error('Error creating product via GraphQL:', error);
                return {
                    success: false,
                    errors: [{
                        code: 'CREATE_PRODUCT_ERROR',
                        message: error.message
                    }]
                };
            }
        },

        updateProduct: async (_, { id, input }, context) => {
            try {
                if (!context.partner) {
                    throw new Error('Authentication required');
                }

                const product = await Product.findById(id);
                if (!product) {
                    return {
                        success: false,
                        errors: [{
                            code: 'PRODUCT_NOT_FOUND',
                            message: 'Product not found'
                        }]
                    };
                }

                Object.assign(product, input);
                product.updatedAt = new Date();
                await product.save();

                logger.info('Product updated via GraphQL', {
                    productId: product._id,
                    name: product.name,
                    partner: context.partner.name
                });

                return {
                    success: true,
                    product
                };

            } catch (error) {
                logger.error('Error updating product via GraphQL:', error);
                return {
                    success: false,
                    errors: [{
                        code: 'UPDATE_PRODUCT_ERROR',
                        message: error.message
                    }]
                };
            }
        },

        deleteProduct: async (_, { id }, context) => {
            try {
                if (!context.partner) {
                    throw new Error('Authentication required');
                }

                const product = await Product.findById(id);
                if (!product) {
                    return {
                        success: false,
                        errors: [{
                            code: 'PRODUCT_NOT_FOUND',
                            message: 'Product not found'
                        }]
                    };
                }

                product.isActive = false;
                await product.save();

                logger.info('Product deleted via GraphQL', {
                    productId: product._id,
                    name: product.name,
                    partner: context.partner.name
                });

                return {
                    success: true,
                    product
                };

            } catch (error) {
                logger.error('Error deleting product via GraphQL:', error);
                return {
                    success: false,
                    errors: [{
                        code: 'DELETE_PRODUCT_ERROR',
                        message: error.message
                    }]
                };
            }
        },

        updateProductStock: async (_, { id, quantity }, context) => {
            try {
                if (!context.partner) {
                    throw new Error('Authentication required');
                }

                const product = await Product.findById(id);
                if (!product) {
                    return {
                        success: false,
                        errors: [{
                            code: 'PRODUCT_NOT_FOUND',
                            message: 'Product not found'
                        }]
                    };
                }

                await product.updateStock(quantity);

                logger.info('Product stock updated via GraphQL', {
                    productId: product._id,
                    name: product.name,
                    quantity,
                    partner: context.partner.name
                });

                return {
                    success: true,
                    product
                };

            } catch (error) {
                logger.error('Error updating product stock via GraphQL:', error);
                return {
                    success: false,
                    errors: [{
                        code: 'UPDATE_STOCK_ERROR',
                        message: error.message
                    }]
                };
            }
        },

        addProductStock: async (_, { id, quantity }, context) => {
            try {
                if (!context.partner) {
                    throw new Error('Authentication required');
                }

                const product = await Product.findById(id);
                if (!product) {
                    return {
                        success: false,
                        errors: [{
                            code: 'PRODUCT_NOT_FOUND',
                            message: 'Product not found'
                        }]
                    };
                }

                await product.addStock(quantity);

                logger.info('Product stock added via GraphQL', {
                    productId: product._id,
                    name: product.name,
                    quantity,
                    partner: context.partner.name
                });

                return {
                    success: true,
                    product
                };

            } catch (error) {
                logger.error('Error adding product stock via GraphQL:', error);
                return {
                    success: false,
                    errors: [{
                        code: 'ADD_STOCK_ERROR',
                        message: error.message
                    }]
                };
            }
        },

        removeProductStock: async (_, { id, quantity }, context) => {
            try {
                if (!context.partner) {
                    throw new Error('Authentication required');
                }

                const product = await Product.findById(id);
                if (!product) {
                    return {
                        success: false,
                        errors: [{
                            code: 'PRODUCT_NOT_FOUND',
                            message: 'Product not found'
                        }]
                    };
                }

                await product.removeStock(quantity);

                logger.info('Product stock removed via GraphQL', {
                    productId: product._id,
                    name: product.name,
                    quantity,
                    partner: context.partner.name
                });

                return {
                    success: true,
                    product
                };

            } catch (error) {
                logger.error('Error removing product stock via GraphQL:', error);
                return {
                    success: false,
                    errors: [{
                        code: 'REMOVE_STOCK_ERROR',
                        message: error.message
                    }]
                };
            }
        },

        updateProductRating: async (_, { id, rating }, context) => {
            try {
                if (!context.partner) {
                    throw new Error('Authentication required');
                }

                if (rating < 0 || rating > 5) {
                    return {
                        success: false,
                        errors: [{
                            code: 'INVALID_RATING',
                            message: 'Rating must be between 0 and 5'
                        }]
                    };
                }

                const product = await Product.findById(id);
                if (!product) {
                    return {
                        success: false,
                        errors: [{
                            code: 'PRODUCT_NOT_FOUND',
                            message: 'Product not found'
                        }]
                    };
                }

                await product.updateRating(rating);

                logger.info('Product rating updated via GraphQL', {
                    productId: product._id,
                    name: product.name,
                    rating,
                    partner: context.partner.name
                });

                return {
                    success: true,
                    product
                };

            } catch (error) {
                logger.error('Error updating product rating via GraphQL:', error);
                return {
                    success: false,
                    errors: [{
                        code: 'UPDATE_RATING_ERROR',
                        message: error.message
                    }]
                };
            }
        }
    },

    Product: {
        id: (product) => product._id.toString(),
        currentPrice: (product) => {
            if (product.pricing.discountPrice &&
                (!product.pricing.discountValidUntil || product.pricing.discountValidUntil > new Date())) {
                return product.pricing.discountPrice;
            }
            return product.pricing.basePrice;
        },
        discountAmount: (product) => {
            if (product.pricing.discountPrice &&
                (!product.pricing.discountValidUntil || product.pricing.discountValidUntil > new Date())) {
                return product.pricing.basePrice - product.pricing.discountPrice;
            }
            return 0;
        },
        isOnSale: (product) => {
            return product.pricing.discountPrice &&
                (!product.pricing.discountValidUntil || product.pricing.discountValidUntil > new Date());
        },
        primaryImage: (product) => {
            const primary = product.images?.find(img => img.isPrimary);
            return primary || product.images?.[0] || null;
        }
    }
};
