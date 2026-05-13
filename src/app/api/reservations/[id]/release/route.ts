import { releaseReservation } from "@/lib/reservation";

type Params = Promise<{
  id: string;
}>;

export async function POST(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;

    const reservation =
      await releaseReservation(id);

    return Response.json(
      reservation
    );
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