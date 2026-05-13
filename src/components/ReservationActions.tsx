
"use client";

import { useRouter } from "next/navigation";
import PayNowButton from "./PayNowButton";

type Props = {
  reservationId: string;
};

export default function ReservationActions({
  reservationId,
}: Props) {
  const router = useRouter();

  async function handleCancel() {
    try {
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
    }
  }

  return (
    <div className="flex gap-4 pt-6">
      <PayNowButton
        reservationId={reservationId}
      />

      <button
        onClick={handleCancel}
        className="rounded-lg bg-red-500 px-6 py-3 text-white"
      >
        Cancel Reservation
      </button>
    </div>
  );
}