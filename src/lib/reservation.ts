import { prisma } from "@/lib/prisma";

type CreateReservationInput = {
  inventoryId: string;
  quantity: number;
};

export async function createReservation({
  inventoryId,
  quantity,
}: CreateReservationInput) {
  return prisma.$transaction(async (tx) => {
    const inventoryRows = await tx.$queryRaw<
      {
        id: string;
        totalStock: number;
        reservedStock: number;
      }[]
    >`
      SELECT *
      FROM "Inventory"
      WHERE id = ${inventoryId}
      FOR UPDATE
    `;

    const inventory = inventoryRows[0];

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    const availableStock =
      inventory.totalStock -
      inventory.reservedStock;

    if (availableStock < quantity) {
      throw new Error("Not enough stock");
    }

    await tx.inventory.update({
      where: {
        id: inventoryId,
      },
      data: {
        reservedStock: {
          increment: quantity,
        },
      },
    });

    const reservation = await tx.reservation.create({
      data: {
        inventoryId,
        quantity,
        expiresAt: new Date(
          Date.now() + 10 * 60 * 1000
        ),
      },
    });

    return reservation;
  });
}

export async function confirmReservation(
  reservationId: string
) {
  return prisma.$transaction(async (tx) => {
    const reservation =
      await tx.reservation.findUnique({
        where: {
          id: reservationId,
        },
      });

    if (!reservation) {
      throw new Error(
        "Reservation not found"
      );
    }

    if (
      reservation.status !== "PENDING"
    ) {
      throw new Error(
        "Reservation already processed"
      );
    }

    if (
      new Date() >
      new Date(reservation.expiresAt)
    ) {
      throw new Error(
        "Reservation expired"
      );
    }

    await tx.inventory.update({
      where: {
        id: reservation.inventoryId,
      },
      data: {
        totalStock: {
          decrement:
            reservation.quantity,
        },

        reservedStock: {
          decrement:
            reservation.quantity,
        },
      },
    });

    const updatedReservation =
      await tx.reservation.update({
        where: {
          id: reservationId,
        },
        data: {
          status: "CONFIRMED",
        },
      });

    return updatedReservation;
  });
}
export async function releaseReservation(
  reservationId: string
) {
  return prisma.$transaction(async (tx) => {
    const reservation =
      await tx.reservation.findUnique({
        where: {
          id: reservationId,
        },
      });

    if (!reservation) {
      throw new Error(
        "Reservation not found"
      );
    }

    if (
      reservation.status !== "PENDING"
    ) {
      throw new Error(
        "Reservation already processed"
      );
    }

    await tx.inventory.update({
      where: {
        id: reservation.inventoryId,
      },
      data: {
        reservedStock: {
          decrement:
            reservation.quantity,
        },
      },
    });

    const updatedReservation =
      await tx.reservation.update({
        where: {
          id: reservationId,
        },
        data: {
          status: "RELEASED",
        },
      });

    return updatedReservation;
  });
}
export async function releaseExpiredReservations() {
  return prisma.$transaction(async (tx) => {
    const expiredReservations =
      await tx.reservation.findMany({
        where: {
          status: "PENDING",

          expiresAt: {
            lt: new Date(),
          },
        },
      });

    for (const reservation of expiredReservations) {
      await tx.inventory.update({
        where: {
          id: reservation.inventoryId,
        },

        data: {
          reservedStock: {
            decrement:
              reservation.quantity,
          },
        },
      });

      await tx.reservation.update({
        where: {
          id: reservation.id,
        },

        data: {
          status: "RELEASED",
        },
      });
    }

    return expiredReservations.length;
  });
}