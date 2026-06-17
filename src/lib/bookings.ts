import { generateRef } from "./utils";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  ref: string;
  destinationId: string;
  destinationName: string;
  packageId: string;
  packageName: string;
  travelDate: string;
  adults: number;
  children: number;
  addons: string[];
  total: number;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
}

const KEY = "wm_bookings";

const seedBookings: Booking[] = [
  {
    ref: "WM-7KQ2MA",
    destinationId: "maldives",
    destinationName: "Maldives",
    packageId: "maldives-luxury",
    packageName: "Private Island Luxury",
    travelDate: "2026-07-12",
    adults: 2,
    children: 0,
    addons: ["Travel insurance", "Private guide"],
    total: 11680,
    fullName: "Sophia Bennett",
    email: "sophia.b@example.com",
    phone: "+44 7700 900123",
    notes: "Honeymoon — please arrange flowers.",
    status: "confirmed",
    createdAt: "2026-05-28T10:24:00.000Z",
  },
  {
    ref: "WM-3HD9PL",
    destinationId: "japan",
    destinationName: "Tokyo & Kyoto",
    packageId: "japan-essential",
    packageName: "Classic Japan",
    travelDate: "2026-10-03",
    adults: 2,
    children: 1,
    addons: ["Airport transfer"],
    total: 5390,
    fullName: "Daniel Okafor",
    email: "d.okafor@example.com",
    phone: "+1 416 555 0198",
    notes: "",
    status: "pending",
    createdAt: "2026-06-02T14:10:00.000Z",
  },
  {
    ref: "WM-9XF4RB",
    destinationId: "turkey",
    destinationName: "Istanbul",
    packageId: "turkey-essential",
    packageName: "Istanbul & Cappadocia",
    travelDate: "2026-06-30",
    adults: 1,
    children: 0,
    addons: [],
    total: 1190,
    fullName: "Aisha Rahman",
    email: "aisha.r@example.com",
    phone: "+971 50 123 4567",
    notes: "Vegetarian meals.",
    status: "completed",
    createdAt: "2026-04-19T08:00:00.000Z",
  },
];

export function loadBookings(): Booking[] {
  if (typeof window === "undefined") return seedBookings;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(seedBookings));
      return seedBookings;
    }
    return JSON.parse(raw) as Booking[];
  } catch {
    return seedBookings;
  }
}

export function saveBookings(bookings: Booking[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(bookings));
}

export type NewBooking = Omit<Booking, "ref" | "status" | "createdAt">;

export function addBooking(input: NewBooking): Booking {
  const booking: Booking = {
    ...input,
    ref: generateRef("WM"),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const all = loadBookings();
  all.unshift(booking);
  saveBookings(all);
  return booking;
}

export function getBooking(ref: string): Booking | undefined {
  return loadBookings().find((b) => b.ref === ref);
}

export function updateBookingStatus(ref: string, status: BookingStatus): Booking[] {
  const all = loadBookings().map((b) => (b.ref === ref ? { ...b, status } : b));
  saveBookings(all);
  return all;
}

export function deleteBooking(ref: string): Booking[] {
  const all = loadBookings().filter((b) => b.ref !== ref);
  saveBookings(all);
  return all;
}
