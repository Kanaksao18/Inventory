import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        inventories: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    return Response.json(products);
  } catch (error) {
    console.error("Failed to fetch products", error);

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