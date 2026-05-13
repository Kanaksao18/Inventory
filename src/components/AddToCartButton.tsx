"use client";

import { useCartStore } from "@/store/cart-store";

type Props = {
  inventoryId: string;
  productName: string;
  warehouseName: string;
};

export default function AddToCartButton({
  inventoryId,
  productName,
  warehouseName,
}: Props) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      onClick={() =>
        addItem({
          inventoryId,
          productName,
          warehouseName,
          quantity: 1,
        })
      }
      className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
    >
      Add To Cart
    </button>
  );
}