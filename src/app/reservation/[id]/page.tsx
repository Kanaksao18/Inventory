import CountdownTimer from "@/components/CountdownTimer";
import ReservationActions from "@/components/ReservationActions";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  CheckCircle2,
  PackageCheck,
  ReceiptText,
  TimerOff,
  Warehouse,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

type ReservationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getReservation(id: string) {
  try {
    return await prisma.reservation.findUnique({
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

  const statusStyles = {
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700",
    CONFIRMED:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    RELEASED:
      "border-red-200 bg-red-50 text-red-600",
  }[reservation.status];

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Link
                href="/cart"
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
              >
                <ArrowLeft size={16} />
                Back to Cart
              </Link>

              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <ReceiptText size={26} />
                </span>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Checkout
                  </h1>

                  <p className="mt-2 text-sm text-slate-600">
                    Your stock is reserved while you complete payment.
                  </p>
                </div>
              </div>
            </div>

            <span
              className={`w-fit rounded-full border px-4 py-2 text-sm font-bold ${statusStyles}`}
            >
              {reservation.status}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <PackageCheck size={26} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-500">
                      Product
                    </p>

                    <h2 className="mt-1 break-words text-2xl font-bold">
                      {
                        reservation.inventory
                          .product.name
                      }
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Warehouse
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                      <Warehouse
                        size={16}
                        className="text-slate-500"
                      />
                      {
                        reservation.inventory
                          .warehouse.name
                      }
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Quantity
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {reservation.quantity}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Reservation ID
                    </p>

                    <p className="mt-2 truncate font-mono text-xs font-semibold text-slate-700">
                      {id}
                    </p>
                  </div>
                </div>
              </div>

              {!isCompleted &&
                !isExpired && (
                  <CountdownTimer
                    expiresAt={
                      reservation.expiresAt.toISOString()
                    }
                  />
                )}

              {isExpired &&
                reservation.status ===
                  "PENDING" && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <TimerOff
                      size={20}
                      className="mt-0.5 shrink-0"
                    />

                    <div>
                      <p className="font-semibold">
                        Reservation expired
                      </p>

                      <p className="mt-1 text-sm text-red-600">
                        This hold is no longer available. Please return to the cart and reserve again.
                      </p>
                    </div>
                  </div>
                )}

              {reservation.status ===
                "CONFIRMED" && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="font-semibold">
                      Payment successful
                    </p>

                    <p className="mt-1 text-sm text-emerald-600">
                      Your reservation is confirmed and the stock has been updated.
                    </p>
                  </div>
                </div>
              )}

              {reservation.status ===
                "RELEASED" && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                  <XCircle
                    size={20}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="font-semibold">
                      Reservation cancelled
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                      The held stock has been released back to inventory.
                    </p>
                  </div>
                </div>
              )}
            </section>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">
                  Payment
                </h2>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  Razorpay
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Reserved items
                  </span>

                  <span className="font-semibold">
                    {reservation.quantity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Payment method
                  </span>

                  <span className="font-semibold">
                    Online
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      Amount
                    </span>

                    <span className="text-2xl font-bold">
                      &#8377;500
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {!isCompleted &&
                !isExpired ? (
                  <ReservationActions
                    reservationId={id}
                  />
                ) : (
                  <Link
                    href="/"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    <ArrowLeft size={18} />
                    Continue Shopping
                  </Link>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
