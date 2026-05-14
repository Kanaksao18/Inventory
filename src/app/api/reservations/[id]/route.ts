import { prisma } from "@/lib/prisma";

type ReservationRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: ReservationRouteProps
) {
  try {
    const { id } = await params;

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id,
        },
        include: {
          inventory: {
            include: {
              product: true,
              warehouse: true,
            },
          },
        },
      });

    if (!reservation) {
      return Response.json(
        {
          error: "Reservation not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(reservation);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to load reservation",
      },
      {
        status: 500,
      }
    );
  }
}
