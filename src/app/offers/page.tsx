import type { Metadata } from "next";
import LocalizedPageHeader from "@/components/layout/LocalizedPageHeader";
import SpecialOffers from "@/components/sections/SpecialOffers";

export const metadata: Metadata = {
  title: "Special Offers",
  description: "Limited-time deals and discounts on premium Watermelon Travel packages.",
};

export default function OffersPage() {
  return (
    <>
      <LocalizedPageHeader page="offers" />
      <SpecialOffers />
    </>
  );
}
