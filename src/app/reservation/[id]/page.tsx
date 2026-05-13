import CountdownTimer from "@/components/CountdownTimer";
import ReservationActions from "@/components/ReservationActions";
import Script from "next/script";

type ReservationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getReservation(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/reservations/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(error);

    return null;
  }
}

export default async function ReservationPage({
  params,
}: ReservationPageProps) {
  const { id } = await params;

  const reservation =
    await getReservation(id);

  if (!reservation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold">
            Reservation not found
          </h1>
        </div>
      </main>
    );
  }

  const isExpired =
    new Date() >
    new Date(reservation.expiresAt);

  const isCompleted =
    reservation.status !== "PENDING";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
          <h1 className="mb-6 text-3xl font-bold">
            Checkout
          </h1>

          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <p>
                <span className="font-semibold">
                  Product:
                </span>{" "}
                {
                  reservation.inventory
                    .product.name
                }
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Warehouse:
                </span>{" "}
                {
                  reservation.inventory
                    .warehouse.name
                }
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Quantity:
                </span>{" "}
                {reservation.quantity}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Status:
                </span>{" "}
                <span
                  className={
                    reservation.status ===
                    "CONFIRMED"
                      ? "text-green-600"
                      : reservation.status ===
                          "RELEASED"
                        ? "text-red-500"
                        : "text-yellow-600"
                  }
                >
                  {reservation.status}
                </span>
              </p>
            </div>

            {!isCompleted &&
              !isExpired && (
                <CountdownTimer
                  expiresAt={
                    reservation.expiresAt
                  }
                />
              )}

            {isExpired &&
              reservation.status ===
                "PENDING" && (
                <div className="rounded-lg bg-red-100 p-4">
                  <p className="font-semibold text-red-600">
                    Reservation expired
                  </p>
                </div>
              )}

            {reservation.status ===
              "CONFIRMED" && (
              <div className="rounded-lg bg-green-100 p-4">
                <p className="font-semibold text-green-700">
                  Payment successful
                </p>
              </div>
            )}

            {reservation.status ===
              "RELEASED" && (
              <div className="rounded-lg bg-red-100 p-4">
                <p className="font-semibold text-red-700">
                  Reservation cancelled
                </p>
              </div>
            )}

            {!isCompleted &&
              !isExpired && (
                <ReservationActions
                  reservationId={id}
                />
              )}
          </div>
        </div>
      </main>
    </>
  );
}