"use client";

import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
};

type RazorpayOptions = {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (
    response: RazorpayPaymentResponse
  ) => Promise<void>;
  theme: {
    color: string;
  };
};

declare global {
  interface Window {
    Razorpay: new (
      options: RazorpayOptions
    ) => {
      open: () => void;
    };
  }
}

type Props = {
  reservationId: string;
};

export default function PayNowButton({
  reservationId,
}: Props) {
  const router = useRouter();
  const [isPaying, setIsPaying] =
    useState(false);

  async function handlePayment() {
    try {
      setIsPaying(true);

      if (!window.Razorpay) {
        throw new Error(
          "Payment gateway is still loading"
        );
      }

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
        (await orderResponse.json()) as RazorpayOrder;

      if (!orderResponse.ok) {
        throw new Error(
          "Failed to create payment order"
        );
      }

      const options: RazorpayOptions = {
        key: process.env
          .NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Inventory System",

        description:
          "Reservation Payment",

        order_id: order.id,

        handler: async function (
          response: RazorpayPaymentResponse
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
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={isPaying}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
    >
      {isPaying ? (
        <LoaderCircle
          size={20}
          className="animate-spin"
        />
      ) : (
        <ShieldCheck size={20} />
      )}

      {isPaying
        ? "Opening Payment"
        : "Pay Now"}
    </button>
  );
}
