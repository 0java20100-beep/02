import type { Metadata } from "next";
import LocalizedPageHeader from "@/components/layout/LocalizedPageHeader";
import Contact from "@/components/sections/Contact";
import Payment from "@/components/sections/Payment";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Watermelon Travel concierge via Telegram, Instagram or our contact form.",
};

export default function ContactPage() {
  return (
    <>
      <LocalizedPageHeader page="contact" />
      <Contact />
      <Payment />
    </>
  );
}
