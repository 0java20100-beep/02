"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CircleCheck, Calendar, Users, MapPin, Mail, ArrowRight, House } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getBooking, type Booking } from "@/lib/bookings";

export default function Confirmation() {
  const { dict, formatPrice } = useLanguage();
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (ref) setBooking(getBooking(ref) ?? null);
  }, [ref]);

  return (
    <section className="section relative overflow-hidden bg-background pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-watermelon-50/70 to-transparent" />
      <div className="container-px relative mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf-500 text-white shadow-glow"
        >
          <CircleCheck className="h-10 w-10" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="heading-display mt-6 text-3xl text-ink-950 sm:text-4xl"
        >
          {dict.booking.successTitle}
        </motion.h1>
        <p className="mt-3 text-ink-800/70">{dict.booking.successSubtitle}</p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 rounded-3xl border border-ink-900/5 bg-white p-6 text-left shadow-card sm:p-8"
        >
          <div className="flex items-center justify-between rounded-2xl bg-watermelon-50 px-5 py-4">
            <span className="text-sm font-medium text-ink-800/70">{dict.booking.bookingRef}</span>
            <span className="font-display text-xl font-bold text-watermelon-600">
              {ref || "—"}
            </span>
          </div>

          {booking ? (
            <dl className="mt-5 space-y-3 text-sm">
              <Row icon={MapPin} label={dict.search.destination} value={booking.destinationName} />
              <Row icon={Calendar} label={dict.booking.travelDate} value={booking.travelDate || "—"} />
              <Row
                icon={Users}
                label={dict.booking.travelers}
                value={`${booking.adults} ${dict.booking.adults}, ${booking.children} ${dict.booking.children}`}
              />
              <Row icon={Mail} label={dict.booking.email} value={booking.email} />
              <div className="flex items-center justify-between border-t border-ink-900/5 pt-4">
                <span className="font-medium text-ink-800/70">{dict.booking.total}</span>
                <span className="font-display text-2xl font-bold text-watermelon-600">
                  {formatPrice(booking.total)}
                </span>
              </div>
            </dl>
          ) : (
            <p className="mt-5 text-sm text-ink-800/60">{dict.booking.confirmEmail}</p>
          )}

          <p className="mt-5 flex items-center justify-center gap-1.5 rounded-xl bg-leaf-50 px-4 py-3 text-sm text-leaf-700">
            <Mail className="h-4 w-4" /> {dict.booking.confirmEmail}
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-outline">
            <House className="h-4 w-4" /> {dict.booking.backHome}
          </Link>
          <Link href="/destinations" className="btn btn-primary">
            {dict.booking.viewBookings} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-ink-800/60">
        <Icon className="h-4 w-4 text-watermelon-500" />
        {label}
      </span>
      <span className="text-right font-medium text-ink-900">{value}</span>
    </div>
  );
}
