import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

type Warehouse = {
  id: string;
  name: string;
};

type Inventory = {
  id: string;
  totalStock: number;
  reservedStock: number;
  warehouse: Warehouse;
};

type Product = {
  id: string;
  name: string;
  inventories: Inventory[];
};

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch products", error);

    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Inventory System
        </h1>

        <Link
          href="/cart"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Go To Cart
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg bg-white p-6 shadow">
          <p>No products found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <h2 className="text-2xl font-semibold">
                {product.name}
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {product.inventories.map((inventory) => {
                  const availableStock =
                    inventory.totalStock -
                    inventory.reservedStock;

                  return (
                    <div
                      key={inventory.id}
                      className="rounded-lg border p-4"
                    >
                      <p>
                        <span className="font-semibold">
                          Warehouse:
                        </span>{" "}
                        {inventory.warehouse.name}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Total Stock:
                        </span>{" "}
                        {inventory.totalStock}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Reserved Stock:
                        </span>{" "}
                        {inventory.reservedStock}
                      </p>

                      <p className="font-bold text-green-600">
                        Available Stock: {availableStock}
                      </p>

                      <AddToCartButton
                        inventoryId={inventory.id}
                        productName={product.name}
                        warehouseName={
                          inventory.warehouse.name
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}