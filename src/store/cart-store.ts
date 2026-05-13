"use client";

import { create } from "zustand";

type CartItem = {
  inventoryId: string;
  productName: string;
  warehouseName: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];

  addItem: (item: CartItem) => void;

  removeItem: (inventoryId: string) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.inventoryId === item.inventoryId
      );

      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.inventoryId === item.inventoryId
              ? {
                  ...i,
                  quantity: i.quantity + 1,
                }
              : i
          ),
        };
      }

      return {
        items: [...state.items, item],
      };
    }),

  removeItem: (inventoryId) =>
    set((state) => ({
      items: state.items.filter(
        (item) => item.inventoryId !== inventoryId
      ),
    })),
}));