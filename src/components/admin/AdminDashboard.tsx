"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  LayoutDashboard,
  Ticket,
  MapPinned,
  Tag,
  Images,
  Star,
  Users,
  LogOut,
  TrendingUp,
  Wallet,
  Globe,
  Trash2,
  Search,
  X,
  Menu,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { destinations, unsplash } from "@/data/destinations";
import { galleryItems } from "@/data/gallery";
import { testimonials } from "@/data/testimonials";
import {
  adminKpis,
  adminUsers,
  bookingsByRegion,
  monthlyRevenue,
} from "@/lib/adminData";
import {
  deleteBooking,
  updateBookingStatus,
  type Booking,
  type BookingStatus,
} from "@/lib/bookings";
import { cn } from "@/lib/utils";

type Tab =
  | "overview"
  | "bookings"
  | "destinations"
  | "packages"
  | "gallery"
  | "testimonials"
  | "users";

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-gold-400/15 text-gold-600",
  confirmed: "bg-leaf-50 text-leaf-700",
  completed: "bg-sky-100 text-sky-700",
  cancelled: "bg-watermelon-50 text-watermelon-600",
};

export default function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const { dict, formatPrice } = useLanguage();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(() => adminKpis().bookings);
  const [gallery, setGallery] = useState(galleryItems);
  const [prices, setPrices] = useState<Record<string, number>>(() =>
    Object.fromEntries(destinations.map((d) => [d.id, d.startingPrice])),
  );

  const kpis = useMemo(() => {
    const revenue = bookings.reduce((s, b) => s + b.total, 0);
    return {
      revenue,
      totalBookings: bookings.length,
      activeDestinations: destinations.length,
      conversion: 4.8,
    };
  }, [bookings]);

  const regionData = useMemo(() => bookingsByRegion(bookings), [bookings]);

  function setStatus(ref: string, status: BookingStatus) {
    setBookings(updateBookingStatus(ref, status));
  }
  function removeBooking(ref: string) {
    setBookings(deleteBooking(ref));
  }

  const nav: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: dict.admin.overview, icon: LayoutDashboard },
    { id: "bookings", label: dict.admin.bookings, icon: Ticket },
    { id: "destinations", label: dict.admin.destinations, icon: MapPinned },
    { id: "packages", label: dict.admin.packages, icon: Tag },
    { id: "gallery", label: dict.admin.gallery, icon: Images },
    { id: "testimonials", label: dict.admin.testimonials, icon: Star },
    { id: "users", label: dict.admin.users, icon: Users },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex bg-ink-50"
      dir="ltr"
    >
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-ink-950 text-white transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 px-6 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-watermelon-gradient text-lg">
            🍉
          </span>
          <div className="leading-tight">
            <p className="font-display font-bold">Watermelon</p>
            <p className="text-xs text-white/50">Admin Console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {active && (
                  <motion.span
                    layoutId="admin-active"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-watermelon-500"
                  />
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-3">
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            {dict.admin.signOut}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink-950/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-ink-900/5 bg-white px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-ink-900" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-ink-950">
                {nav.find((n) => n.id === tab)?.label}
              </h1>
              <p className="text-xs text-ink-800/50">{dict.admin.dashboard}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-800/40" />
              <input
                placeholder={dict.common.search}
                className="w-44 rounded-full border border-ink-900/10 bg-ink-50 py-2 pl-9 pr-3 text-sm focus:outline-none"
              />
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-watermelon-gradient text-sm font-bold text-white">
              A
            </span>
            <button
              onClick={onSignOut}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-800 hover:bg-ink-100"
              aria-label={dict.common.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {tab === "overview" && (
            <Overview
              kpis={kpis}
              bookings={bookings}
              regionData={regionData}
              formatPrice={formatPrice}
              dict={dict}
            />
          )}
          {tab === "bookings" && (
            <BookingsTable
              bookings={bookings}
              onStatus={setStatus}
              onDelete={removeBooking}
              formatPrice={formatPrice}
              dict={dict}
            />
          )}
          {tab === "destinations" && (
            <DestinationsTable prices={prices} setPrices={setPrices} formatPrice={formatPrice} />
          )}
          {tab === "packages" && <PackagesTable formatPrice={formatPrice} />}
          {tab === "gallery" && (
            <GalleryGrid
              items={gallery}
              onDelete={(id) => setGallery((g) => g.filter((i) => i.id !== id))}
            />
          )}
          {tab === "testimonials" && <TestimonialsTable />}
          {tab === "users" && <UsersTable />}
        </main>
      </div>
    </motion.div>
  );
}

type Dict = ReturnType<typeof useLanguage>["dict"];
type FormatPrice = (n: number) => string;

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-ink-900/5 bg-white p-5 shadow-soft", className)}>
      {children}
    </div>
  );
}

function Overview({
  kpis,
  bookings,
  regionData,
  formatPrice,
  dict,
}: {
  kpis: { revenue: number; totalBookings: number; activeDestinations: number; conversion: number };
  bookings: Booking[];
  regionData: { name: string; value: number; color: string }[];
  formatPrice: FormatPrice;
  dict: Dict;
}) {
  const cards = [
    { label: dict.admin.revenue, value: formatPrice(kpis.revenue), icon: Wallet, trend: "+12.4%" },
    { label: dict.admin.totalBookings, value: String(kpis.totalBookings), icon: Ticket, trend: "+8.1%" },
    { label: dict.admin.activeDestinations, value: String(kpis.activeDestinations), icon: Globe, trend: "+2" },
    { label: dict.admin.conversion, value: `${kpis.conversion}%`, icon: TrendingUp, trend: "+0.6%" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label}>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-watermelon-50 text-watermelon-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-leaf-600">
                  <TrendingUp className="h-3.5 w-3.5" /> {c.trend}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl font-bold text-ink-950">{c.value}</p>
              <p className="text-sm text-ink-800/55">{c.label}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-ink-950">{dict.admin.monthlyRevenue}</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb2c5a" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#fb2c5a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#98a2b3" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#98a2b3" tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(v) => [formatPrice(Number(v)), dict.admin.revenue]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #eef0f4" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#fb2c5a" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-ink-950">{dict.admin.bookingsByRegion}</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {regionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef0f4" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {regionData.map((r) => (
              <div key={r.name} className="flex items-center gap-2 text-xs text-ink-800/70">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                {r.name}
                <span className="ml-auto font-semibold text-ink-900">{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-ink-950">{dict.admin.recentBookings}</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/5 text-xs uppercase tracking-wide text-ink-800/50">
                <th className="pb-3 font-medium">{dict.admin.bookings}</th>
                <th className="pb-3 font-medium">{dict.search.destination}</th>
                <th className="pb-3 font-medium">{dict.booking.travelDate}</th>
                <th className="pb-3 font-medium">{dict.booking.total}</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 6).map((b) => (
                <tr key={b.ref} className="border-b border-ink-900/5 last:border-0">
                  <td className="py-3 font-medium text-ink-900">{b.ref}</td>
                  <td className="py-3 text-ink-800/70">{b.destinationName}</td>
                  <td className="py-3 text-ink-800/70">{b.travelDate}</td>
                  <td className="py-3 font-medium text-ink-900">{formatPrice(b.total)}</td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize", statusStyles[b.status])}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function BookingsTable({
  bookings,
  onStatus,
  onDelete,
  formatPrice,
  dict,
}: {
  bookings: Booking[];
  onStatus: (ref: string, s: BookingStatus) => void;
  onDelete: (ref: string) => void;
  formatPrice: FormatPrice;
  dict: Dict;
}) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/5 text-xs uppercase tracking-wide text-ink-800/50">
              <th className="pb-3 font-medium">Ref</th>
              <th className="pb-3 font-medium">{dict.booking.fullName}</th>
              <th className="pb-3 font-medium">{dict.search.destination}</th>
              <th className="pb-3 font-medium">{dict.booking.travelDate}</th>
              <th className="pb-3 font-medium">{dict.booking.total}</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.ref} className="border-b border-ink-900/5 last:border-0">
                <td className="py-3 font-medium text-ink-900">{b.ref}</td>
                <td className="py-3 text-ink-800/70">
                  {b.fullName}
                  <span className="block text-xs text-ink-800/40">{b.email}</span>
                </td>
                <td className="py-3 text-ink-800/70">{b.destinationName}</td>
                <td className="py-3 text-ink-800/70">{b.travelDate}</td>
                <td className="py-3 font-medium text-ink-900">{formatPrice(b.total)}</td>
                <td className="py-3">
                  <select
                    value={b.status}
                    onChange={(e) => onStatus(b.ref, e.target.value as BookingStatus)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium capitalize focus:outline-none",
                      statusStyles[b.status],
                    )}
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onDelete(b.ref)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-800/40 hover:bg-watermelon-50 hover:text-watermelon-600"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-ink-800/50">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function DestinationsTable({
  prices,
  setPrices,
  formatPrice,
}: {
  prices: Record<string, number>;
  setPrices: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  formatPrice: FormatPrice;
}) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/5 text-xs uppercase tracking-wide text-ink-800/50">
              <th className="pb-3 font-medium">Destination</th>
              <th className="pb-3 font-medium">Region</th>
              <th className="pb-3 font-medium">Rating</th>
              <th className="pb-3 font-medium">Starting price (editable)</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((d) => (
              <tr key={d.id} className="border-b border-ink-900/5 last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-10 w-10 overflow-hidden rounded-lg">
                      <Image src={unsplash(d.image, 80, 60)} alt={d.city} fill className="object-cover" sizes="40px" />
                    </span>
                    <div>
                      <p className="font-medium text-ink-900">{d.city}</p>
                      <p className="text-xs text-ink-800/50">{d.country}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-ink-800/70">{d.region}</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 text-ink-900">
                    <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> {d.rating}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-ink-800/40">$</span>
                    <input
                      type="number"
                      value={prices[d.id]}
                      onChange={(e) => setPrices((p) => ({ ...p, [d.id]: Number(e.target.value) }))}
                      className="w-28 rounded-lg border border-ink-900/10 px-2 py-1 text-sm focus:border-watermelon-400 focus:outline-none"
                    />
                    <span className="text-xs text-ink-800/40">{formatPrice(prices[d.id])}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PackagesTable({ formatPrice }: { formatPrice: FormatPrice }) {
  const rows = destinations.flatMap((d) =>
    d.packages.map((p) => ({ dest: `${d.city}, ${d.country}`, ...p })),
  );
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/5 text-xs uppercase tracking-wide text-ink-800/50">
              <th className="pb-3 font-medium">Package</th>
              <th className="pb-3 font-medium">Destination</th>
              <th className="pb-3 font-medium">Nights</th>
              <th className="pb-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-ink-900/5 last:border-0">
                <td className="py-3">
                  <p className="font-medium text-ink-900">{r.name}</p>
                  <p className="text-xs text-ink-800/50">{r.summary}</p>
                </td>
                <td className="py-3 text-ink-800/70">{r.dest}</td>
                <td className="py-3 text-ink-800/70">{r.nights}</td>
                <td className="py-3 font-medium text-ink-900">{formatPrice(r.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function GalleryGrid({
  items,
  onDelete,
}: {
  items: typeof galleryItems;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.id} className="group relative overflow-hidden rounded-2xl">
          <div className="relative aspect-square">
            <Image src={unsplash(item.photo, 400, 70)} alt={item.caption} fill className="object-cover" sizes="200px" />
          </div>
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="text-xs font-medium text-white">{item.location}</p>
            <button
              onClick={() => onDelete(item.id)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-watermelon-600 hover:bg-white"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TestimonialsTable() {
  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.map((t) => (
          <div key={t.id} className="flex gap-4 rounded-2xl border border-ink-900/5 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink-900">{t.name}</p>
                <span className="inline-flex items-center gap-1 text-xs text-ink-800/60">
                  <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> {t.rating}
                </span>
              </div>
              <p className="text-xs text-ink-800/50">{t.location}</p>
              <p className="mt-2 line-clamp-2 text-sm text-ink-800/70">{t.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function UsersTable() {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/5 text-xs uppercase tracking-wide text-ink-800/50">
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Bookings</th>
              <th className="pb-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((u) => (
              <tr key={u.id} className="border-b border-ink-900/5 last:border-0">
                <td className="py-3">
                  <p className="font-medium text-ink-900">{u.name}</p>
                  <p className="text-xs text-ink-800/50">{u.email}</p>
                </td>
                <td className="py-3">
                  <span className="rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-800">
                    {u.role}
                  </span>
                </td>
                <td className="py-3 text-ink-800/70">{u.bookings}</td>
                <td className="py-3 text-ink-800/70">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
