"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  const removeItem = useCartStore(
    (state) => state.removeItem
  );

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Cart
        </h1>

        <Link
          href="/"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-lg">
            Your cart is empty.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <p className="text-lg font-semibold">
              Total Items: {totalItems}
            </p>
          </div>

          <div className="grid gap-4">
            {items.map((item) => (
              <div
                key={item.inventoryId}
                className="rounded-lg bg-white p-6 shadow"
              >
                <h2 className="text-2xl font-semibold">
                  {item.productName}
                </h2>

                <p className="mt-2">
                  Warehouse:
                  {" "}
                  {item.warehouseName}
                </p>

                <p>
                  Quantity:
                  {" "}
                  {item.quantity}
                </p>

                <button
                  onClick={() =>
                    removeItem(item.inventoryId)
                  }
                  className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button className="rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700">
              Proceed To Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}