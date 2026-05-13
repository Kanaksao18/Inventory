
import AddToCartButton from "@/components/AddToCartButton";

import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    include: {
      inventories: {
        include: {
          warehouse: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">
      <Navbar />

      {products.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-lg text-gray-700">
            No products found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-white p-6 shadow-md"
            >
              <h2 className="text-2xl font-bold text-black">
                {product.name}
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {product.inventories.map(
                  (inventory) => {
                    const availableStock =
                      inventory.totalStock -
                      inventory.reservedStock;

                    return (
                      <div
                        key={inventory.id}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                      >
                        <p className="text-gray-800">
                          <span className="font-semibold">
                            Warehouse:
                          </span>{" "}
                          {
                            inventory.warehouse
                              .name
                          }
                        </p>

                        <p className="mt-2 text-gray-800">
                          <span className="font-semibold">
                            Total Stock:
                          </span>{" "}
                          {
                            inventory.totalStock
                          }
                        </p>

                        <p className="mt-2 text-gray-800">
                          <span className="font-semibold">
                            Reserved Stock:
                          </span>{" "}
                          {
                            inventory.reservedStock
                          }
                        </p>

                        <p className="mt-3 text-lg font-bold text-green-600">
                          Available Stock:{" "}
                          {availableStock}
                        </p>

                        <AddToCartButton
                          inventoryId={
                            inventory.id
                          }
                          productName={
                            product.name
                          }
                          warehouseName={
                            inventory
                              .warehouse.name
                          }
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}