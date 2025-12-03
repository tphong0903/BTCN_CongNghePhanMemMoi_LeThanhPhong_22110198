import { CartItem, carts, getOrCreateCart, products } from "./data";
import { v4 as uuidv4 } from "uuid";

export const resolvers = {
  Cart: {
    totalPrice: (parent: any) => {
      return parent.items
        .filter((item: CartItem) => item.selected)
        .reduce(
          (sum: number, item: CartItem) =>
            sum + item.product.price * item.quantity,
          0
        );
    },
  },

  Query: {
    products: () => products,
    cart: (_: any, { userId }: { userId: string }) => getOrCreateCart(userId),
  },

  Mutation: {
    addToCart: (
      _: any,
      { userId, productId }: { userId: string; productId: string }
    ) => {
      const cart = getOrCreateCart(userId);
      const product = products.find((p) => p.id === productId);

      if (!product) throw new Error("Product not found");

      const existingItem = cart.items.find(
        (item) => item.product.id === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          id: `item_${Date.now()}`,
          product: product,
          quantity: 1,
          selected: true,
        });
      }
      return cart;
    },

    updateQuantity: (
      _: any,
      {
        userId,
        itemId,
        quantity,
      }: { userId: string; itemId: string; quantity: number }
    ) => {
      const cart = getOrCreateCart(userId);
      if (quantity <= 0) {
        cart.items = cart.items.filter((item) => item.id !== itemId);
      } else {
        const item = cart.items.find((item) => item.id === itemId);
        if (item) item.quantity = quantity;
      }
      return cart;
    },

    removeFromCart: (
      _: any,
      { userId, itemId }: { userId: string; itemId: string }
    ) => {
      const cart = getOrCreateCart(userId);
      cart.items = cart.items.filter((item) => item.id !== itemId);
      return cart;
    },

    toggleSelect: (
      _: any,
      { userId, itemId }: { userId: string; itemId: string }
    ) => {
      const cart = getOrCreateCart(userId);
      const item = cart.items.find((item) => item.id === itemId);
      if (item) item.selected = !item.selected;
      return cart;
    },

    clearCart: (_: any, { userId }: { userId: string }) => {
      const cart = getOrCreateCart(userId);
      cart.items = [];
      return cart;
    },

    checkout: (_: any, { userId }: { userId: string }) => {
      const cart = getOrCreateCart(userId);
      const selectedItems = cart.items.filter((item) => item.selected);

      if (selectedItems.length === 0) {
        return {
          success: false,
          message: "Vui lòng chọn sản phẩm để thanh toán",
          orderId: null,
        };
      }

      const orderId = `ORDER_${Date.now()}`;
      cart.items = cart.items.filter((item) => !item.selected);

      return {
        success: true,
        message: "Thanh toán thành công!",
        orderId,
      };
    },
  },
};
