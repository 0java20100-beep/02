import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FloatingActions } from "@/components/layout/floating-actions";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = "https://sharqona.uz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sharqona — Premium O'zbek Restorani",
    template: "%s | Sharqona",
  },
  description:
    "Sharqona — Toshkentdagi premium O'zbek restorani. Milliy taomlar, QR orqali buyurtma, hashamatli atmosfera. Palov, shashlik, manti va boshqalar.",
  keywords: [
    "o'zbek restorani",
    "palov",
    "shashlik",
    "QR buyurtma",
    "Toshkent restoran",
    "milliy taomlar",
    "Sharqona",
  ],
  authors: [{ name: "Sharqona" }],
  openGraph: {
    title: "Sharqona — Premium O'zbek Restorani",
    description:
      "Milliy taomlar san'ati va zamonaviy hashamat. QR orqali buyurtma bering.",
    url: siteUrl,
    siteName: "Sharqona",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sharqona — Premium O'zbek Restorani",
    description: "Milliy taomlar san'ati va zamonaviy hashamat.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B3D2E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingActions />
        </Providers>
      </body>
    </html>
  );
}
