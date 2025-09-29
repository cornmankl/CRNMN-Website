import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'graphql';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Import type definitions
import { productTypeDefs } from './types/product.js';
import { orderTypeDefs } from './types/order.js';
import { customerTypeDefs } from './types/customer.js';
import { paymentTypeDefs } from './types/payment.js';
import { deliveryTypeDefs } from './types/delivery.js';
import { reviewTypeDefs } from './types/review.js';
import { promotionTypeDefs } from './types/promotion.js';
import { analyticsTypeDefs } from './types/analytics.js';

// Import resolvers
import { productResolvers } from './resolvers/product.js';
import { orderResolvers } from './resolvers/order.js';
import { customerResolvers } from './resolvers/customer.js';
import { paymentResolvers } from './resolvers/payment.js';
import { deliveryResolvers } from './resolvers/delivery.js';
import { reviewResolvers } from './resolvers/review.js';
import { promotionResolvers } from './resolvers/promotion.js';
import { analyticsResolvers } from './resolvers/analytics.js';

// Base schema
const baseTypeDefs = `
  scalar Date
  scalar JSON

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }

  interface Node {
    id: ID!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type Connection {
    pageInfo: PageInfo!
    totalCount: Int!
  }

  input PaginationInput {
    first: Int
    after: String
    last: Int
    before: String
  }

  input SortInput {
    field: String!
    direction: SortDirection!
  }

  enum SortDirection {
    ASC
    DESC
  }

  type Error {
    code: String!
    message: String!
    field: String
  }

  type MutationResult {
    success: Boolean!
    errors: [Error!]
  }
`;

// Merge all type definitions
const typeDefs = mergeTypeDefs([
    baseTypeDefs,
    productTypeDefs,
    orderTypeDefs,
    customerTypeDefs,
    paymentTypeDefs,
    deliveryTypeDefs,
    reviewTypeDefs,
    promotionTypeDefs,
    analyticsTypeDefs
]);

// Merge all resolvers
const resolvers = mergeResolvers([
    productResolvers,
    orderResolvers,
    customerResolvers,
    paymentResolvers,
    deliveryResolvers,
    reviewResolvers,
    promotionResolvers,
    analyticsResolvers
]);

// Create executable schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

// Context function
const context = ({ req }) => {
    return {
        user: req.user,
        partner: req.partner,
        apiKey: req.apiKey
    };
};

// Format error function
const formatError = (error) => {
    console.error('GraphQL Error:', error);

    return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_ERROR',
        path: error.path,
        locations: error.locations
    };
};

// Create Apollo Server
const server = new ApolloServer({
    schema,
    context,
    formatError,
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
    plugins: [
        {
            requestDidStart() {
                return {
                    willSendResponse(requestContext) {
                        // Log GraphQL queries
                        if (requestContext.request.operationName) {
                            console.log(`GraphQL Query: ${requestContext.request.operationName}`);
                        }
                    }
                };
            }
        }
    ]
});

export function setupGraphQL(app) {
    server.applyMiddleware({
        app,
        path: '/graphql',
        cors: false // CORS is handled by Express middleware
    });

    console.log('🚀 GraphQL server ready at /graphql');
}
