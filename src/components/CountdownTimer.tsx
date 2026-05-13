"use client";

import { useEffect, useState } from "react";

type Props = {
  expiresAt: string;
};

export default function CountdownTimer({
  expiresAt,
}: Props) {
  const [timeLeft, setTimeLeft] =
    useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const difference =
        new Date(expiresAt).getTime() -
        Date.now();

      if (difference <= 0) {
        setTimeLeft("Expired");

        clearInterval(interval);

        return;
      }

      const minutes = Math.floor(
        difference / 1000 / 60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      setTimeLeft(
        `${minutes}m ${seconds}s`
      );
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="rounded-lg bg-yellow-100 p-4">
      <p className="font-semibold">
        Reservation expires in:
        {" "}
        {timeLeft}
      </p>
    </div>
  );
}