import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: process.env.SWAGGER_TITLE || 'CORNMAN Public API',
            version: process.env.SWAGGER_VERSION || '1.0.0',
            description: process.env.SWAGGER_DESCRIPTION || 'Comprehensive API for CORNMAN third-party integrations',
            contact: {
                name: process.env.SWAGGER_CONTACT_NAME || 'CORNMAN API Team',
                email: process.env.SWAGGER_CONTACT_EMAIL || 'api@cornman.com',
                url: process.env.SWAGGER_CONTACT_URL || 'https://cornman.com/api'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: process.env.API_BASE_URL || 'http://localhost:3001/api/v1',
                description: 'Development server'
            },
            {
                url: 'https://api.cornman.com/v1',
                description: 'Production server'
            },
            {
                url: 'https://sandbox-api.cornman.com/v1',
                description: 'Sandbox server'
            }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-Key',
                    description: 'API key for authentication'
                },
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token for authentication'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error type'
                        },
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        code: {
                            type: 'string',
                            description: 'Error code'
                        },
                        details: {
                            type: 'object',
                            description: 'Additional error details'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Error timestamp'
                        }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        page: {
                            type: 'integer',
                            minimum: 1,
                            description: 'Current page number'
                        },
                        limit: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 100,
                            description: 'Number of items per page'
                        },
                        total: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Total number of items'
                        },
                        pages: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Total number of pages'
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Request success status'
                        },
                        data: {
                            type: 'object',
                            description: 'Response data'
                        },
                        message: {
                            type: 'string',
                            description: 'Success message'
                        },
                        pagination: {
                            $ref: '#/components/schemas/Pagination'
                        }
                    }
                },
                ApiKey: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'API key ID'
                        },
                        key: {
                            type: 'string',
                            description: 'API key (masked)'
                        },
                        name: {
                            type: 'string',
                            description: 'API key name'
                        },
                        description: {
                            type: 'string',
                            description: 'API key description'
                        },
                        permissions: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: [
                                    'products:read',
                                    'products:write',
                                    'orders:read',
                                    'orders:write',
                                    'customers:read',
                                    'customers:write',
                                    'payments:read',
                                    'payments:write',
                                    'delivery:read',
                                    'delivery:write',
                                    'reviews:read',
                                    'reviews:write',
                                    'promotions:read',
                                    'promotions:write',
                                    'analytics:read',
                                    'webhooks:write'
                                ]
                            }
                        },
                        rateLimit: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 10000,
                            description: 'Rate limit per hour'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'API key active status'
                        },
                        expiresAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'API key expiration date'
                        },
                        lastUsedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last usage timestamp'
                        },
                        usageCount: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Total usage count'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp'
                        }
                    }
                },
                Partner: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Partner ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Partner name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Partner email'
                        },
                        company: {
                            type: 'string',
                            description: 'Company name'
                        },
                        website: {
                            type: 'string',
                            format: 'uri',
                            description: 'Company website'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'active', 'suspended', 'inactive'],
                            description: 'Partner status'
                        },
                        tier: {
                            type: 'string',
                            enum: ['basic', 'premium', 'enterprise'],
                            description: 'Partner tier'
                        },
                        permissions: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Partner permissions'
                        },
                        rateLimit: {
                            type: 'integer',
                            description: 'Rate limit per hour'
                        },
                        webhookUrl: {
                            type: 'string',
                            format: 'uri',
                            description: 'Webhook URL'
                        },
                        sandboxMode: {
                            type: 'boolean',
                            description: 'Sandbox mode enabled'
                        },
                        contactInfo: {
                            type: 'object',
                            properties: {
                                phone: {
                                    type: 'string',
                                    description: 'Contact phone'
                                },
                                address: {
                                    type: 'object',
                                    properties: {
                                        street: { type: 'string' },
                                        city: { type: 'string' },
                                        state: { type: 'string' },
                                        zipCode: { type: 'string' },
                                        country: { type: 'string' }
                                    }
                                }
                            }
                        },
                        billingInfo: {
                            type: 'object',
                            properties: {
                                plan: {
                                    type: 'string',
                                    enum: ['free', 'basic', 'premium', 'enterprise']
                                },
                                monthlyLimit: {
                                    type: 'integer',
                                    description: 'Monthly request limit'
                                },
                                overageRate: {
                                    type: 'number',
                                    description: 'Overage rate per request'
                                },
                                nextBillingDate: {
                                    type: 'string',
                                    format: 'date-time'
                                },
                                totalSpent: {
                                    type: 'number',
                                    description: 'Total amount spent'
                                }
                            }
                        },
                        analytics: {
                            type: 'object',
                            properties: {
                                totalRequests: {
                                    type: 'integer',
                                    description: 'Total API requests'
                                },
                                successfulRequests: {
                                    type: 'integer',
                                    description: 'Successful requests'
                                },
                                failedRequests: {
                                    type: 'integer',
                                    description: 'Failed requests'
                                },
                                averageResponseTime: {
                                    type: 'number',
                                    description: 'Average response time in ms'
                                },
                                lastRequestAt: {
                                    type: 'string',
                                    format: 'date-time'
                                }
                            }
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Authentication information is missing or invalid',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                error: 'Unauthorized',
                                message: 'API key is required',
                                code: 'MISSING_API_KEY',
                                timestamp: '2023-01-01T00:00:00.000Z'
                            }
                        }
                    }
                },
                ForbiddenError: {
                    description: 'Access denied',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                error: 'Forbidden',
                                message: 'Insufficient permissions',
                                code: 'INSUFFICIENT_PERMISSIONS',
                                timestamp: '2023-01-01T00:00:00.000Z'
                            }
                        }
                    }
                },
                NotFoundError: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                error: 'Not Found',
                                message: 'Resource not found',
                                code: 'RESOURCE_NOT_FOUND',
                                timestamp: '2023-01-01T00:00:00.000Z'
                            }
                        }
                    }
                },
                ValidationError: {
                    description: 'Validation error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                error: 'Bad Request',
                                message: 'Validation failed',
                                code: 'VALIDATION_ERROR',
                                details: {
                                    field: 'email',
                                    message: 'Invalid email format'
                                },
                                timestamp: '2023-01-01T00:00:00.000Z'
                            }
                        }
                    }
                },
                RateLimitError: {
                    description: 'Rate limit exceeded',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                error: 'Too Many Requests',
                                message: 'Rate limit exceeded',
                                code: 'RATE_LIMIT_EXCEEDED',
                                retryAfter: 60,
                                timestamp: '2023-01-01T00:00:00.000Z'
                            }
                        }
                    }
                },
                InternalServerError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                error: 'Internal Server Error',
                                message: 'An unexpected error occurred',
                                code: 'INTERNAL_ERROR',
                                timestamp: '2023-01-01T00:00:00.000Z'
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'API authentication and authorization'
            },
            {
                name: 'Products',
                description: 'Product catalog management'
            },
            {
                name: 'Orders',
                description: 'Order management and tracking'
            },
            {
                name: 'Customers',
                description: 'Customer management'
            },
            {
                name: 'Payments',
                description: 'Payment processing'
            },
            {
                name: 'Delivery',
                description: 'Delivery management and tracking'
            },
            {
                name: 'Reviews',
                description: 'Review and rating management'
            },
            {
                name: 'Promotions',
                description: 'Promotion and discount management'
            },
            {
                name: 'Analytics',
                description: 'Analytics and reporting'
            },
            {
                name: 'Webhooks',
                description: 'Webhook management'
            },
            {
                name: 'Partners',
                description: 'Partner management'
            }
        ]
    },
    apis: ['./src/routes/*.js'] // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);
