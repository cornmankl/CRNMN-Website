export const orderTypeDefs = `
  type Order implements Node {
    id: ID!
    orderNumber: String!
    customer: Customer!
    items: [OrderItem!]!
    subtotal: Float!
    tax: Float!
    deliveryFee: Float!
    discount: Float!
    total: Float!
    status: OrderStatus!
    paymentStatus: PaymentStatus!
    deliveryAddress: Address
    deliveryTime: DeliveryTime
    trackingNumber: String
    notes: String
    createdAt: Date!
    updatedAt: Date!
  }

  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
    total: Float!
  }

  type Address {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
    coordinates: Coordinates
  }

  type Coordinates {
    lat: Float!
    lng: Float!
  }

  type DeliveryTime {
    estimated: Date
    actual: Date
  }

  enum OrderStatus {
    PENDING
    CONFIRMED
    PREPARING
    READY
    DELIVERED
    CANCELLED
  }

  enum PaymentStatus {
    PENDING
    PAID
    FAILED
    REFUNDED
  }

  extend type Query {
    orders(
      filter: OrderFilter
      sort: OrderSort
      pagination: PaginationInput
    ): OrderConnection!
    
    order(id: ID!): Order
  }

  extend type Mutation {
    createOrder(input: OrderInput!): OrderMutationResult!
    updateOrder(id: ID!, input: OrderInput!): OrderMutationResult!
    cancelOrder(id: ID!, reason: String!): OrderMutationResult!
  }

  type OrderMutationResult implements MutationResult {
    success: Boolean!
    errors: [Error!]
    order: Order
  }
`;
