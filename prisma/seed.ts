import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();

  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Delhi Warehouse",
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Mumbai Warehouse",
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: "iPhone 16",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Samsung S25",
    },
  });

  await prisma.inventory.createMany({
    data: [
      {
        productId: product1.id,
        warehouseId: warehouse1.id,
        totalStock: 10,
      },
      {
        productId: product1.id,
        warehouseId: warehouse2.id,
        totalStock: 5,
      },
      {
        productId: product2.id,
        warehouseId: warehouse1.id,
        totalStock: 7,
      },
    ],
  });

  console.log("Database seeded");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });