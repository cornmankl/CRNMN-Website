# CORNMAN Public API

Comprehensive REST and GraphQL API for CORNMAN third-party integrations.

## Features

- ✅ RESTful API with full CRUD operations
- ✅ GraphQL API for flexible queries
- ✅ OAuth 2.0 & API key authentication
- ✅ Rate limiting and throttling
- ✅ Comprehensive API documentation (Swagger)
- ✅ SDK generation for JavaScript, Python, PHP
- ✅ Webhook system for real-time updates
- ✅ API analytics and monitoring
- ✅ Partner integration framework
- ✅ Security features (IP whitelisting, request signing)

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB
- Redis

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp config.env.example .env
   # Edit .env with your configuration
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### API Endpoints

- **REST API**: `http://localhost:3001/api/v1`
- **GraphQL**: `http://localhost:3001/graphql`
- **Documentation**: `http://localhost:3001/api-docs`
- **Health Check**: `http://localhost:3001/health`
- **Metrics**: `http://localhost:3001/metrics`

## API Documentation

Visit `/api-docs` for interactive API documentation.

## SDKs

Generated SDKs are available in the `sdk/` directory:
- JavaScript/Node.js
- Python
- PHP

## License

MIT
