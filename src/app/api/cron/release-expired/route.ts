import { releaseExpiredReservations } from "@/lib/reservation";

export async function GET() {
  try {
    const releasedCount =
      await releaseExpiredReservations();

    return Response.json({
      success: true,
      releasedCount,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to release reservations",
      },
      {
        status: 500,
      }
    );
  }
}