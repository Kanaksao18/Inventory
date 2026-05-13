import { createReservation } from "@/lib/reservation";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const reservation =
      await createReservation({
        inventoryId: body.inventoryId,
        quantity: body.quantity,
      });

    return Response.json(reservation);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      {
        status: 400,
      }
    );
  }
}