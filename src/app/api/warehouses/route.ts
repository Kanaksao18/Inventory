import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        inventories: {
          include: {
            product: true,
          },
        },
      },
    });

    return Response.json(warehouses);
  } catch (error) {
    console.error("Failed to fetch warehouses", error);

    return Response.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
