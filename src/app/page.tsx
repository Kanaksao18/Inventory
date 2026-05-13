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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-4xl font-bold">
        Inventory System
      </h1>

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
                  const available =
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
                          Total:
                        </span>{" "}
                        {inventory.totalStock}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Reserved:
                        </span>{" "}
                        {inventory.reservedStock}
                      </p>

                      <p className="font-bold text-green-600">
                        Available: {available}
                      </p>

                      <button className="mt-4 rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800">
                        Reserve
                      </button>
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