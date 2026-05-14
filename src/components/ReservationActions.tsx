
"use client";

import { LoaderCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PayNowButton from "./PayNowButton";

type Props = {
  reservationId: string;
};

export default function ReservationActions({
  reservationId,
}: Props) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] =
    useState(false);

  async function handleCancel() {
    try {
      setIsCancelling(true);

      const response = await fetch(
        `/api/reservations/${reservationId}/release`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        alert(
          "Failed to cancel reservation"
        );

        return;
      }

      alert(
        "Reservation cancelled"
      );

      router.push("/");
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="space-y-3">
      <PayNowButton
        reservationId={reservationId}
      />

      <button
        type="button"
        onClick={handleCancel}
        disabled={isCancelling}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
      >
        {isCancelling ? (
          <LoaderCircle
            size={18}
            className="animate-spin"
          />
        ) : (
          <XCircle size={18} />
        )}

        {isCancelling
          ? "Cancelling"
          : "Cancel Reservation"}
      </button>
    </div>
  );
}
