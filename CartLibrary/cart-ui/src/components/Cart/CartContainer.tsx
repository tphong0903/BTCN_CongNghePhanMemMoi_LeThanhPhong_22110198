import React, { useMemo } from "react";
import { CartItemType } from "../../types";
import { CartItem } from "./CartItem";
import { Button } from "../Button";

interface CartContainerProps {
  items: CartItemType[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onCheckout: (selectedItems: CartItemType[]) => void;
}

export const CartContainer: React.FC<CartContainerProps> = ({
  items,
  onUpdateQuantity,
  onRemove,
  onToggleSelect,
  onCheckout,
}) => {
  // Tính tổng tiền các món được chọn
  const { total, selectedCount } = useMemo(() => {
    const selected = items.filter((i) => i.isSelected);
    return {
      selectedCount: selected.length,
      total: selected.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    };
  }, [items]);

  return (
    <div className="max-w-3xl mx-auto bg-black-50 p-6 rounded-xl border min-w-96">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Giỏ Hàng Của Bạn ({items.length})
      </h2>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Chưa có sản phẩm nào.
          </p>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
              onToggleSelect={onToggleSelect}
            />
          ))
        )}
      </div>

      {/* Footer thanh toán */}
      {items.length > 0 && (
        <div className="mt-8 pt-6 border-t flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div>
            <p className="text-gray-500">
              Tổng thanh toán ({selectedCount} sản phẩm):
            </p>
            <p className="text-3xl font-bold text-red-600">
              ${total.toLocaleString()}
            </p>
          </div>
          <Button
            variant="primary"
            className="px-8 py-3 text-lg"
            disabled={selectedCount === 0}
            onClick={() => onCheckout(items.filter((i) => i.isSelected))}
          >
            Mua Hàng Ngay
          </Button>
        </div>
      )}
    </div>
  );
};
