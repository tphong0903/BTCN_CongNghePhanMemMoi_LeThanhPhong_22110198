import { v4 as uuidv4 } from "uuid";

export type Product = {
  id: string;
  sku?: string;
  name: string;
  price: number;
  image?: string;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  selected: boolean;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
};

export const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    name: "MacBook Air",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1611186871348-d1dcbae9b5b9?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    name: "AirPods Max",
    price: 549,
    image:
      "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "4",
    name: "iPad Mini",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
  },
];

export const carts: Record<string, Cart> = {};

export function getOrCreateCart(userId: string): Cart {
  if (!carts[userId]) {
    carts[userId] = { id: uuidv4(), userId, items: [] };
  }
  return carts[userId];
}
