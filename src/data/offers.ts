import { getDestination } from "./destinations";

export interface Offer {
  id: string;
  destinationId: string;
  title: string;
  discountPercent: number;
  originalPrice: number;
  newPrice: number;
  /** Hours from page load until the countdown expires (keeps timers always live). */
  endsInHours: number;
  image: string;
  badge: string;
}

function build(
  destinationId: string,
  title: string,
  discountPercent: number,
  endsInHours: number,
  badge: string,
): Offer {
  const dest = getDestination(destinationId);
  const original = dest?.startingPrice ?? 1200;
  const newPrice = Math.round((original * (100 - discountPercent)) / 100 / 10) * 10;
  return {
    id: `offer-${destinationId}`,
    destinationId,
    title,
    discountPercent,
    originalPrice: original,
    newPrice,
    endsInHours,
    image: dest?.image ?? "",
    badge,
  };
}

export const offers: Offer[] = [
  build("maldives", "Maldives Overwater Flash Sale", 30, 47, "Best seller"),
  build("dubai", "Dubai Winter Getaway", 25, 71, "Limited"),
  build("japan", "Japan Cherry Blossom Special", 20, 119, "Seasonal"),
  build("turkey", "Cappadocia Balloon Escape", 35, 23, "Last minute"),
  build("bali", "Bali Wellness Retreat", 28, 95, "Couples"),
  build("italy", "Amalfi Coast Early Bird", 22, 167, "Early bird"),
];
