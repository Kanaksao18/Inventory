"use client";

import Link from "next/link";

import { ShoppingCart } from "lucide-react";

import { useCartStore } from "@/store/cart-store";

export default function Navbar() {
  const items = useCartStore(
    (state) => state.items
  );

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <header className="mb-8 flex items-center justify-between rounded-2xl bg-white p-5 shadow">
      <Link href="/">
        <h1 className="text-3xl font-bold text-black">
          Inventory System
        </h1>
      </Link>

      <Link
        href="/cart"
        className="relative"
      >
        <div className="rounded-full bg-blue-600 p-3 text-white transition hover:bg-blue-700">
          <ShoppingCart size={24} />
        </div>

        {totalItems > 0 && (
          <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
            {totalItems}
          </div>
        )}
      </Link>
    </header>
  );
}