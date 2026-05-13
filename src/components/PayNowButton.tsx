"use client";

import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  reservationId: string;
};

export default function PayNowButton({
  reservationId,
}: Props) {
  const router = useRouter();

  async function handlePayment() {
    try {
      const orderResponse = await fetch(
        "/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            amount: 500,
            reservationId,
          }),
        }
      );

      const order =
        await orderResponse.json();

      const options = {
        key: process.env
          .NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Inventory System",

        description:
          "Reservation Payment",

        order_id: order.id,

        handler: async function (
          response: any
        ) {
          const confirmResponse =
            await fetch(
              `/api/reservations/${reservationId}/confirm`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify(
                  response
                ),
              }
            );

          if (confirmResponse.ok) {
            router.refresh();

            alert(
              "Payment successful"
            );
          } else {
            alert(
              "Failed to confirm reservation"
            );
          }
        },

        theme: {
          color: "#000000",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(error);

      alert("Payment failed");
    }
  }

  return (
    <button
      onClick={handlePayment}
      className="rounded-lg bg-green-600 px-6 py-3 text-white"
    >
      Pay Now
    </button>
  );
}