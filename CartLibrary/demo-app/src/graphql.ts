import { gql } from "@apollo/client";

export const GET_DATA = gql`
  query GetData($userId: ID!) {
    products {
      id
      name
      price
      image
    }
    cart(userId: $userId) {
      items {
        id
        product {
          id
          name
          price
          image
        }
        quantity
        selected
      }
      totalPrice
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($userId: ID!, $productId: ID!) {
    addToCart(userId: $userId, productId: $productId) {
      items {
        id
        product {
          id
        }
        quantity
        selected
      }
    }
  }
`;

export const UPDATE_QUANTITY = gql`
  mutation UpdateQty($userId: ID!, $itemId: ID!, $quantity: Int!) {
    updateQuantity(userId: $userId, itemId: $itemId, quantity: $quantity) {
      items {
        id
        quantity
      }
    }
  }
`;

export const REMOVE_ITEM = gql`
  mutation RemoveItem($userId: ID!, $itemId: ID!) {
    removeFromCart(userId: $userId, itemId: $itemId) {
      items {
        id
      }
    }
  }
`;

export const TOGGLE_SELECT = gql`
  mutation ToggleSelect($userId: ID!, $itemId: ID!) {
    toggleSelect(userId: $userId, itemId: $itemId) {
      items {
        id
        selected
      }
    }
  }
`;

export const CHECKOUT = gql`
  mutation Checkout($userId: ID!) {
    checkout(userId: $userId) {
      success
      message
      orderId
    }
  }
`;
