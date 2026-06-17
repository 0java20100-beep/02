import { destinations, type Region } from "@/data/destinations";
import { loadBookings, type Booking } from "@/lib/bookings";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Support";
  bookings: number;
  joined: string;
}

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Aziz Karimov", email: "aziz@watermelon.travel", role: "Admin", bookings: 0, joined: "2014-03-01" },
  { id: "u2", name: "Sophia Bennett", email: "sophia.b@example.com", role: "Support", bookings: 4, joined: "2023-07-19" },
  { id: "u3", name: "Daniel Okafor", email: "d.okafor@example.com", role: "Editor", bookings: 2, joined: "2024-01-08" },
  { id: "u4", name: "Mei Lin", email: "mei.lin@example.com", role: "Support", bookings: 7, joined: "2024-05-22" },
  { id: "u5", name: "Lucas Moretti", email: "lucas.m@example.com", role: "Editor", bookings: 1, joined: "2025-02-14" },
];

export const monthlyRevenue = [
  { month: "Jan", revenue: 142000, bookings: 78 },
  { month: "Feb", revenue: 158000, bookings: 86 },
  { month: "Mar", revenue: 196000, bookings: 104 },
  { month: "Apr", revenue: 211000, bookings: 119 },
  { month: "May", revenue: 248000, bookings: 138 },
  { month: "Jun", revenue: 287000, bookings: 161 },
  { month: "Jul", revenue: 312000, bookings: 173 },
  { month: "Aug", revenue: 298000, bookings: 167 },
  { month: "Sep", revenue: 264000, bookings: 149 },
  { month: "Oct", revenue: 231000, bookings: 128 },
  { month: "Nov", revenue: 205000, bookings: 112 },
  { month: "Dec", revenue: 276000, bookings: 154 },
];

const regionColors: Record<Region, string> = {
  "Middle East": "#fb2c5a",
  Europe: "#10b366",
  Asia: "#f59e0b",
  Africa: "#6366f1",
  "Caucasus & Central Asia": "#06b6d4",
};

export function bookingsByRegion(bookings: Booking[]) {
  const counts = new Map<Region, number>();
  for (const b of bookings) {
    const dest = destinations.find((d) => d.id === b.destinationId);
    const region: Region = dest?.region ?? "Asia";
    counts.set(region, (counts.get(region) ?? 0) + 1);
  }
  if (counts.size === 0) {
    destinations.slice(0, 5).forEach((d, i) => counts.set(d.region, (counts.get(d.region) ?? 0) + (5 - i)));
  }
  return Array.from(counts.entries()).map(([name, value]) => ({
    name,
    value,
    color: regionColors[name],
  }));
}

export function adminKpis() {
  const bookings = loadBookings();
  const revenue = bookings.reduce((sum, b) => sum + b.total, 0);
  return {
    bookings,
    totalBookings: bookings.length,
    revenue,
    activeDestinations: destinations.length,
    conversion: 4.8,
  };
}
