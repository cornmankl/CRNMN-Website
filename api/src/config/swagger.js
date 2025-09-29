import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CORNMAN API Documentation'
  }));
  
  console.log('📚 API Documentation available at /api-docs');
}
