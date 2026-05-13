"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import Navbar from "@/components/Navbar";

import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore(
    (state) => state.items
  );

  const removeItem = useCartStore(
    (state) => state.removeItem
  );

  const router = useRouter();

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  async function handleCheckout() {
    try {
      if (items.length === 0) {
        return;
      }

      const firstItem = items[0];

      const response = await fetch(
        "/api/reservations",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            inventoryId:
              firstItem.inventoryId,

            quantity:
              firstItem.quantity,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(data.error);

        return;
      }

      router.push(
        `/reservation/${data.id}`
      );
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">
      <Navbar />

      <div className="mb-8 flex items-center gap-3">
        <ShoppingBag
          size={32}
          className="text-black"
        />

        <h1 className="text-4xl font-bold">
          Your Cart
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <h2 className="text-2xl font-semibold">
            Your cart is empty
          </h2>

          <p className="mt-2 text-gray-600">
            Add products to continue
            shopping.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800"
          >
            <ArrowLeft size={18} />

            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.inventoryId}
                className="rounded-2xl bg-white p-6 shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {item.productName}
                    </h2>

                    <p className="mt-2 text-gray-600">
                      Warehouse:
                      {" "}
                      {
                        item.warehouseName
                      }
                    </p>

                    <p className="mt-1 text-lg font-medium">
                      Quantity:
                      {" "}
                      {item.quantity}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeItem(
                        item.inventoryId
                      )
                    }
                    className="rounded-lg bg-red-100 p-3 text-red-500 transition hover:bg-red-200"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Total Items
                </span>

                <span className="font-semibold">
                  {totalItems}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Shipping
                </span>

                <span className="font-semibold text-green-600">
                  Free
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    Total
                  </span>

                  <span className="text-2xl font-bold">
                    ₹500
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-8 w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-green-700"
            >
              Proceed To Checkout
            </button>

            <Link
              href="/"
              className="mt-4 block text-center text-sm text-gray-600 hover:text-black"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}