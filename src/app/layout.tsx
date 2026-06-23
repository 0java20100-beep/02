import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { AnalyticsTracker } from "@/components/site/AnalyticsTracker";
import { getAllSettings } from "@/lib/settings";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://navix.uz";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, site } = await getAllSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: seo.title, template: `%s | ${site.brand}` },
    description: seo.description,
    keywords: seo.keywords,
    applicationName: site.brand,
    authors: [{ name: site.brand }],
    openGraph: {
      type: "website",
      title: seo.title,
      description: seo.description,
      url: SITE_URL,
      siteName: site.brand,
      images: [{ url: seo.ogImage }],
      locale: "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: SITE_URL },
  };
}

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { site } = await getAllSettings();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand,
    url: SITE_URL,
    slogan: site.tagline,
    sameAs: [
      "https://t.me/navixstudio",
      "https://instagram.com/navi.xstudio",
    ],
  };

  const themeCss = `:root{--primary:${site.primaryColor};--secondary:${site.secondaryColor};--accent:${site.accentColor};}`;

  return (
    <html lang="ru" className="dark">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <div className="bg-aurora" aria-hidden />
        {children}
        <AnalyticsTracker />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
