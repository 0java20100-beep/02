import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getVisibleContacts } from "@/lib/data";
import { getSetting } from "@/lib/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [contacts, site] = await Promise.all([
    getVisibleContacts(),
    getSetting("site"),
  ]);

  return (
    <>
      <Header
        contacts={contacts.map((c) => ({
          id: c.id,
          type: c.type,
          value: c.value,
          icon: c.icon,
        }))}
        site={{ brand: site.brand, logoUrl: site.logoUrl }}
      />
      <main className="min-h-screen">{children}</main>
      <Footer contacts={contacts} site={site} />
    </>
  );
}
