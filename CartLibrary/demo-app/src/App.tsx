import React, { useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  GET_DATA,
  ADD_TO_CART,
  UPDATE_QUANTITY,
  REMOVE_ITEM,
  TOGGLE_SELECT,
  CHECKOUT,
} from "./graphql";
import { Button, CartContainer } from "tphong-cart-ui";

function App() {
  const [activeUserId, setActiveUserId] = useState("user_123");
  const [inputUserId, setInputUserId] = useState("user_123");

  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    variables: { userId: activeUserId },
    fetchPolicy: "network-only",
  });

  const [addToCart] = useMutation(ADD_TO_CART, {
    onCompleted: () => refetch(),
  });
  const [updateQty] = useMutation(UPDATE_QUANTITY, {
    onCompleted: () => refetch(),
  });
  const [removeItem] = useMutation(REMOVE_ITEM, {
    onCompleted: () => refetch(),
  });
  const [toggleSelect] = useMutation(TOGGLE_SELECT, {
    onCompleted: () => refetch(),
  });
  const [checkout] = useMutation(CHECKOUT, { onCompleted: () => refetch() });

  const uiCartItems = useMemo(() => {
    if (!data?.cart?.items) return [];
    return data.cart.items.map((item: any) => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity,
      isSelected: item.selected,
    }));
  }, [data]);

  const handleSwitchUser = () => {
    if (inputUserId.trim() === "") {
      alert("Vui lòng nhập User ID");
      return;
    }
    setActiveUserId(inputUserId);
  };

  const handleAddToCart = (product: any) => {
    addToCart({ variables: { userId: activeUserId, productId: product.id } });
  };

  const handleUpdateQty = (id: string, qty: number) => {
    updateQty({
      variables: { userId: activeUserId, itemId: id, quantity: qty },
    });
  };

  const handleRemove = (id: string) => {
    if (confirm("Bạn chắc chắn muốn xóa?")) {
      removeItem({ variables: { userId: activeUserId, itemId: id } });
    }
  };

  const handleToggle = (id: string) => {
    toggleSelect({ variables: { userId: activeUserId, itemId: id } });
  };

  const handleCheckout = async () => {
    try {
      const result = await checkout({ variables: { userId: activeUserId } });
      if (result.data?.checkout?.success) {
        alert(
          `${result.data.checkout.message}\nMã đơn: ${result.data.checkout.orderId}`
        );
      } else {
        alert(` ${result.data?.checkout?.message}`);
      }
    } catch (e) {
      alert("Lỗi thanh toán");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">
              Cửa Hàng Công Nghệ
            </h1>

            <div className="mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200 inline-block w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô phỏng Khách hàng (User ID):
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputUserId}
                  onChange={(e) => setInputUserId(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập ID ví dụ: user_123"
                />
                <Button onClick={handleSwitchUser}>Chuyển User</Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Đang xem giỏ hàng của:{" "}
                <span className="font-bold text-green-600">{activeUserId}</span>
              </p>
            </div>
          </header>

          {loading && (
            <div className="p-10 text-center text-blue-500 font-medium">
              Đang tải dữ liệu cho {activeUserId}...
            </div>
          )}

          {error && (
            <div className="p-10 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
              Lỗi kết nối Server: {error.message}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {data?.products.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="relative overflow-hidden rounded-xl mb-5 group">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {p.name}
                      </h3>
                      <p className="text-blue-600 font-semibold text-lg">
                        ${p.price}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(p)}
                      className="px-6 py-2 shadow-md"
                    >
                      + Thêm
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-400">
                  Đang đồng bộ giỏ hàng...
                </div>
              ) : (
                <CartContainer
                  items={uiCartItems}
                  onUpdateQuantity={handleUpdateQty}
                  onRemove={handleRemove}
                  onToggleSelect={handleToggle}
                  onCheckout={handleCheckout}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
