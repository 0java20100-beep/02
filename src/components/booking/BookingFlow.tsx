"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Minus,
  Plus,
  Calendar,
  ShieldCheck,
  Plane,
  UserCheck,
  LoaderCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { destinations, getDestination, unsplash } from "@/data/destinations";
import { addBooking } from "@/lib/bookings";
import { cn } from "@/lib/utils";

const ADDON_PRICES = { insurance: 79, transfer: 49, guide: 129 };
const TAX_RATE = 0.08;

export default function BookingFlow() {
  const { dict, formatPrice } = useLanguage();
  const router = useRouter();
  const params = useSearchParams();

  const initialDest = params.get("destination") || destinations[0].id;
  const initialPkg = params.get("package") || "";
  const initialDate = params.get("date") || "";
  const initialGuests = Number(params.get("guests")) || 2;

  const [step, setStep] = useState(1);
  const [destId, setDestId] = useState(initialDest);
  const destination = getDestination(destId) ?? destinations[0];
  const [packageId, setPackageId] = useState(initialPkg || destination.packages[0].id);
  const [travelDate, setTravelDate] = useState(initialDate);
  const [adults, setAdults] = useState(Math.max(1, initialGuests));
  const [children, setChildren] = useState(0);
  const [addons, setAddons] = useState<string[]>([]);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedPackage =
    destination.packages.find((p) => p.id === packageId) ?? destination.packages[0];

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const pricing = useMemo(() => {
    const base = selectedPackage.price;
    const travelers = adults + children * 0.6;
    const addonTotal =
      addons.reduce((sum, a) => sum + (ADDON_PRICES[a as keyof typeof ADDON_PRICES] ?? 0), 0) *
      (adults + children);
    const subtotal = base * travelers + addonTotal;
    const taxes = subtotal * TAX_RATE;
    return { base, subtotal, taxes, total: subtotal + taxes };
  }, [selectedPackage, adults, children, addons]);

  function toggleAddon(key: string) {
    setAddons((prev) => (prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]));
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = dict.booking.requiredField;
    if (!form.email.trim()) e.email = dict.booking.requiredField;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = dict.booking.invalidEmail;
    if (!form.phone.trim()) e.phone = dict.booking.requiredField;
    if (!travelDate) e.travelDate = dict.booking.requiredField;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleConfirm() {
    if (!validateStep2()) {
      setStep(1);
      return;
    }
    setSubmitting(true);
    const booking = addBooking({
      destinationId: destination.id,
      destinationName: `${destination.city}, ${destination.country}`,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      travelDate,
      adults,
      children,
      addons,
      total: Math.round(pricing.total),
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      notes: form.notes,
    });
    setTimeout(() => {
      router.push(`/booking/confirmation?ref=${booking.ref}`);
    }, 1100);
  }

  const steps = [dict.booking.step1, dict.booking.step2, dict.booking.step3];
  const addonList = [
    { key: "insurance", label: dict.booking.addonInsurance, price: ADDON_PRICES.insurance, icon: ShieldCheck },
    { key: "transfer", label: dict.booking.addonTransfer, price: ADDON_PRICES.transfer, icon: Plane },
    { key: "guide", label: dict.booking.addonGuide, price: ADDON_PRICES.guide, icon: UserCheck },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div>
        {/* Stepper */}
        <div className="mb-8 flex items-center gap-2">
          {steps.map((label, i) => {
            const num = i + 1;
            const active = step === num;
            const done = step > num;
            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    done && "bg-leaf-500 text-white",
                    active && "bg-watermelon-gradient text-white shadow-glow",
                    !active && !done && "bg-ink-100 text-ink-800/50",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : num}
                </div>
                <span
                  className={cn(
                    "hidden text-sm font-medium sm:block",
                    active ? "text-ink-950" : "text-ink-800/50",
                  )}
                >
                  {label}
                </span>
                {i < steps.length - 1 && (
                  <span className="h-px flex-1 bg-ink-900/10" aria-hidden />
                )}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Field label={dict.search.destination}>
              <div className="relative">
                <select
                  value={destId}
                  onChange={(e) => {
                    const d = getDestination(e.target.value);
                    setDestId(e.target.value);
                    if (d) setPackageId(d.packages[0].id);
                  }}
                  className="wm-input appearance-none pr-10"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.city}, {d.country}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40" />
              </div>
            </Field>

            <div>
              <p className="mb-1.5 text-sm font-medium text-ink-800">{dict.booking.package}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {destination.packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setPackageId(pkg.id)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all",
                      packageId === pkg.id
                        ? "border-watermelon-400 bg-watermelon-50/60 ring-2 ring-watermelon-100"
                        : "border-ink-900/10 bg-white hover:border-watermelon-200",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink-950">{pkg.name}</span>
                      {packageId === pkg.id && (
                        <Check className="h-4 w-4 text-watermelon-600" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink-800/60">{pkg.summary}</p>
                    <p className="mt-2 font-display text-lg font-bold text-watermelon-600">
                      {formatPrice(pkg.price)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <Field label={dict.booking.travelDate} error={errors.travelDate}>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-watermelon-500" />
                <input
                  type="date"
                  min={minDate}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="wm-input pl-10"
                />
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Counter label={dict.booking.adults} value={adults} setValue={setAdults} min={1} />
              <Counter label={dict.booking.children} value={children} setValue={setChildren} min={0} />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-ink-800">{dict.booking.addons}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {addonList.map((a) => {
                  const Icon = a.icon;
                  const checked = addons.includes(a.key);
                  return (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => toggleAddon(a.key)}
                      className={cn(
                        "flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all",
                        checked
                          ? "border-watermelon-400 bg-watermelon-50/60"
                          : "border-ink-900/10 bg-white hover:border-watermelon-200",
                      )}
                    >
                      <span className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-watermelon-500" />
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-md border",
                            checked
                              ? "border-watermelon-500 bg-watermelon-500 text-white"
                              : "border-ink-900/20",
                          )}
                        >
                          {checked && <Check className="h-3 w-3" />}
                        </span>
                      </span>
                      <span className="text-sm font-medium text-ink-900">{a.label}</span>
                      <span className="text-xs text-ink-800/60">+{formatPrice(a.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn btn-primary w-full justify-center sm:w-auto"
            >
              {dict.common.next}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={dict.booking.fullName} error={errors.fullName}>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="wm-input"
                />
              </Field>
              <Field label={dict.booking.email} error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="wm-input"
                />
              </Field>
            </div>
            <Field label={dict.booking.phone} error={errors.phone}>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="wm-input"
              />
            </Field>
            <Field label={dict.booking.notes}>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="wm-input resize-none"
              />
            </Field>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                {dict.common.back}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                className="btn btn-primary"
              >
                {dict.common.next}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-soft">
              <h3 className="font-display text-lg font-semibold text-ink-950">
                {dict.booking.step3}
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <SummaryRow label={dict.search.destination} value={`${destination.city}, ${destination.country}`} />
                <SummaryRow label={dict.booking.package} value={selectedPackage.name} />
                <SummaryRow label={dict.booking.travelDate} value={travelDate || "—"} />
                <SummaryRow
                  label={dict.booking.travelers}
                  value={`${adults} ${dict.booking.adults}, ${children} ${dict.booking.children}`}
                />
                <SummaryRow label={dict.booking.fullName} value={form.fullName || "—"} />
                <SummaryRow label={dict.booking.email} value={form.email || "—"} />
                <SummaryRow label={dict.booking.phone} value={form.phone || "—"} />
              </dl>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setStep(2)} className="btn btn-outline">
                {dict.common.back}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" /> {dict.booking.processing}
                  </>
                ) : (
                  dict.booking.confirmBooking
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Price summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-3xl border border-ink-900/5 bg-white shadow-card">
          <div className="relative h-36">
            <Image
              src={unsplash(destination.image, 700, 72)}
              alt={destination.city}
              fill
              sizes="400px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white">
              <p className="text-xs text-white/80">{destination.country}</p>
              <p className="font-display text-xl font-semibold">{destination.city}</p>
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-display text-lg font-semibold text-ink-950">
              {dict.booking.summary}
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <SummaryRow
                label={`${dict.booking.basePrice} × ${adults + children}`}
                value={formatPrice(Math.round(pricing.base))}
              />
              {addons.length > 0 && (
                <SummaryRow label={dict.booking.addons} value={`${addons.length}`} />
              )}
              <SummaryRow label={dict.booking.subtotal} value={formatPrice(Math.round(pricing.subtotal))} />
              <SummaryRow label={dict.booking.taxes} value={formatPrice(Math.round(pricing.taxes))} />
            </dl>
            <div className="mt-4 flex items-end justify-between border-t border-ink-900/5 pt-4">
              <span className="text-sm font-medium text-ink-800/70">{dict.booking.total}</span>
              <span className="font-display text-2xl font-bold text-watermelon-600">
                {formatPrice(Math.round(pricing.total))}
              </span>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-800/50">
              <ShieldCheck className="h-3.5 w-3.5 text-leaf-500" /> {dict.payment.secure}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-watermelon-600">{error}</span>}
    </label>
  );
}

function Counter({
  label,
  value,
  setValue,
  min,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  min: number;
}) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink-800">{label}</p>
      <div className="flex items-center justify-between rounded-xl border border-ink-900/10 bg-white px-2 py-1.5">
        <button
          type="button"
          onClick={() => setValue(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-50 text-ink-800 hover:bg-watermelon-50 hover:text-watermelon-600"
          aria-label="Decrease"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="font-display text-lg font-semibold text-ink-950">{value}</span>
        <button
          type="button"
          onClick={() => setValue(Math.min(20, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-50 text-ink-800 hover:bg-watermelon-50 hover:text-watermelon-600"
          aria-label="Increase"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-800/60">{label}</dt>
      <dd className="text-right font-medium text-ink-900">{value}</dd>
    </div>
  );
}
