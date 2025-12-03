import { gql } from "@apollo/client";

// 1. Query lấy dữ liệu ban đầu
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

// 2. Mutation thêm vào giỏ
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

// 3. Mutation cập nhật số lượng
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

// 4. Mutation xóa sản phẩm
export const REMOVE_ITEM = gql`
  mutation RemoveItem($userId: ID!, $itemId: ID!) {
    removeFromCart(userId: $userId, itemId: $itemId) {
      items {
        id
      }
    }
  }
`;

// 5. Mutation chọn/bỏ chọn
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

// 6. Mutation thanh toán
export const CHECKOUT = gql`
  mutation Checkout($userId: ID!) {
    checkout(userId: $userId) {
      success
      message
      orderId
    }
  }
`;
