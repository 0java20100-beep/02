import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "the-admin-navix",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
