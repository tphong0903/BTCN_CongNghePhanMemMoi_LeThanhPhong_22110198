import React from "react";
import { CartItemType } from "../../types";
import { Button } from "../Button";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onToggleSelect: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onToggleSelect,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 mb-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={!!item.isSelected}
        onChange={() => onToggleSelect(item.id)}
        className="w-5 h-5 cursor-pointer accent-blue-600"
      />

      {/* Ảnh */}
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-md border"
      />

      {/* Thông tin */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-blue-600 font-bold">
          ${item.price.toLocaleString()}
        </p>
      </div>

      {/* Tăng giảm số lượng */}
      <div className="flex items-center border rounded-md overflow-hidden">
        <button
          className="px-3 py-1 hover:bg-gray-100 border-r"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          -
        </button>
        <span className="w-10 text-center font-medium">{item.quantity}</span>
        <button
          className="px-3 py-1 hover:bg-gray-100 border-l"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          +
        </button>
      </div>

      {/* Nút xóa */}
      <Button variant="danger" onClick={() => onRemove(item.id)}>
        Xóa
      </Button>
    </div>
  );
};
