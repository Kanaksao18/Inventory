import { razorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const options = {
      amount: body.amount * 100,
      currency: "INR",
      receipt: body.reservationId,
    };

    const order =
      await razorpay.orders.create(options);

    return Response.json(order);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to create payment order",
      },
      {
        status: 500,
      }
    );
  }
}