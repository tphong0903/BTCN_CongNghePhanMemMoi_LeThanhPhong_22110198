import { gql } from "apollo-server";

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    image: String
  }

  type CartItem {
    id: ID!
    product: Product!
    quantity: Int!
    selected: Boolean!
  }

  type Cart {
    id: ID!
    userId: ID!
    items: [CartItem!]!
    totalPrice: Float!
  }

  type CheckoutResult {
    success: Boolean!
    message: String!
    orderId: ID
  }

  type Query {
    products: [Product]
    cart(userId: ID!): Cart
  }

  type Mutation {
    addToCart(userId: ID!, productId: ID!): Cart
    updateQuantity(userId: ID!, itemId: ID!, quantity: Int!): Cart
    removeFromCart(userId: ID!, itemId: ID!): Cart
    toggleSelect(userId: ID!, itemId: ID!): Cart
    clearCart(userId: ID!): Cart
    checkout(userId: ID!): CheckoutResult
  }
`;
