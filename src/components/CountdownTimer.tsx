"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  expiresAt: string;
};

function getTimeLeft(expiresAt: string) {
  const difference =
    new Date(expiresAt).getTime() - Date.now();

  if (difference <= 0) {
    return "Expired";
  }

  const minutes = Math.floor(
    difference / 1000 / 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export default function CountdownTimer({
  expiresAt,
}: Props) {
  const [timeLeft, setTimeLeft] =
    useState(() => getTimeLeft(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const nextTimeLeft =
        getTimeLeft(expiresAt);

      setTimeLeft(nextTimeLeft);

      if (nextTimeLeft === "Expired") {
        clearInterval(interval);
      }
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
          <Clock3 size={20} />
        </span>

        <div>
          <p className="text-sm font-semibold">
            Reservation hold
          </p>

          <p className="text-xs text-amber-700">
            Complete payment before the timer ends.
          </p>
        </div>
      </div>

      <span className="shrink-0 rounded-lg bg-white px-3 py-2 text-sm font-bold shadow-sm">
        {timeLeft}
      </span>
    </div>
  );
}
