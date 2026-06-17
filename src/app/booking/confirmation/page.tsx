import type { Metadata } from "next";
import { Suspense } from "react";
import Confirmation from "@/components/booking/Confirmation";

export const metadata: Metadata = {
  title: "Booking Confirmation",
  robots: { index: false },
};

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <span className="wm-loader" />
        </div>
      }
    >
      <Confirmation />
    </Suspense>
  );
}
