"use client";

import Link from "next/link";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  LoaderCircle,
  PackageCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import Navbar from "@/components/Navbar";

import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const [error, setError] =
    useState<string | null>(null);

  const [isCheckingOut, setIsCheckingOut] =
    useState(false);

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
      setError(null);

      if (items.length === 0) {
        return;
      }

      setIsCheckingOut(true);

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
        setError(
          data.error ||
            "Unable to reserve this item. Please try again."
        );

        return;
      }

      router.push(
        `/reservation/${data.id}`
      );
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong while starting checkout."
      );
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Navbar />

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShoppingBag size={26} />
              </span>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your Cart
              </h1>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              Review your reserved stock before
              moving to payment.
            </p>
          </div>

          {items.length > 0 && (
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-950"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <ShoppingBag size={32} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-slate-600">
              Add products to continue
              shopping.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-white transition hover:bg-slate-800"
            >
              <ArrowLeft size={18} />

              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0"
                  />

                  <p className="text-sm font-medium">
                    {error}
                  </p>
                </div>
              )}

              {items.map((item) => (
                <div
                  key={item.inventoryId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 sm:flex">
                        <PackageCheck size={26} />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold sm:text-2xl">
                          {item.productName}
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                          Warehouse:
                          {" "}
                          {
                            item.warehouseName
                          }
                        </p>

                        <div className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                          Qty {item.quantity}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          item.inventoryId
                        )
                      }
                      aria-label={`Remove ${item.productName}`}
                      className="rounded-lg border border-red-100 bg-red-50 p-3 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">
                  Order Summary
                </h2>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  Ready
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Total Items
                  </span>

                  <span className="font-semibold">
                    {totalItems}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Shipping
                  </span>

                  <span className="font-semibold text-emerald-700">
                    Free
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      Total
                    </span>

                    <span className="text-2xl font-bold">
                      &#8377;500
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {isCheckingOut && (
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />
                )}

                {isCheckingOut
                  ? "Starting Checkout"
                  : "Proceed to Checkout"}
              </button>

              <p className="mt-4 text-center text-xs text-slate-500">
                Your stock is held for 10 minutes
                after checkout starts.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
