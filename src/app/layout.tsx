import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import PageLoader from "@/components/ui/PageLoader";
import AdminLauncher from "@/components/admin/AdminLauncher";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = "https://watermelon.travel";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Watermelon Travel — Premium Journeys to 24+ Destinations",
    template: "%s · Watermelon Travel",
  },
  description:
    "Watermelon Travel crafts premium, handcrafted luxury journeys to 24+ breathtaking destinations worldwide. Discover destinations, view packages, and book your dream trip.",
  keywords: [
    "luxury travel",
    "travel agency",
    "holiday packages",
    "Dubai",
    "Maldives",
    "Japan",
    "Switzerland",
    "premium tours",
  ],
  authors: [{ name: "Watermelon Travel" }],
  openGraph: {
    type: "website",
    title: "Watermelon Travel — Premium Travel Agency",
    description:
      "Handcrafted luxury journeys to 24+ breathtaking destinations. Real places, real moments, unforgettable experiences.",
    siteName: "Watermelon Travel",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Watermelon Travel — Premium Travel Agency",
    description: "Handcrafted luxury journeys to 24+ breathtaking destinations.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fb2c5a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen antialiased">
        <LanguageProvider>
          <PageLoader />
          <ScrollProgress />
          <Header />
          <main>{children}</main>
          <Footer />
          <AdminLauncher />
        </LanguageProvider>
      </body>
    </html>
  );
}
