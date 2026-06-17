import type { Metadata } from "next";
import LocalizedPageHeader from "@/components/layout/LocalizedPageHeader";
import Tours from "@/components/sections/Tours";

export const metadata: Metadata = {
  title: "Tours",
  description:
    "Curated multi-country luxury tours — from the Grand European Discovery to the Silk Road & Caucasus.",
};

export default function ToursPage() {
  return (
    <>
      <LocalizedPageHeader page="tours" />
      <Tours full />
    </>
  );
}
