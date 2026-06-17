import type { Metadata } from "next";
import { Suspense } from "react";
import LocalizedPageHeader from "@/components/layout/LocalizedPageHeader";
import BookingFlow from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book Your Journey",
  description:
    "Choose your destination, package and travel dates, then submit your booking request with Watermelon Travel.",
};

export default function BookingPage() {
  return (
    <>
      <LocalizedPageHeader page="booking" />
      <section className="section bg-background">
        <div className="container-px mx-auto max-w-6xl">
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center">
                <span className="wm-loader" />
              </div>
            }
          >
            <BookingFlow />
          </Suspense>
        </div>
      </section>
    </>
  );
}
