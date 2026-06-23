import type { Metadata } from "next";
import { ContactsSection } from "@/components/site/ContactsSection";
import { OrderForm } from "@/components/site/OrderForm";
import { getVisibleContacts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Свяжитесь с NAVIX: Telegram @navixstudio, бот @Navix_studio_bot, Instagram @navi.xstudio, email.",
};

export default async function ContactsPage() {
  const contacts = await getVisibleContacts();
  return (
    <div className="pt-20">
      <ContactsSection contacts={contacts} />
      <OrderForm />
    </div>
  );
}
