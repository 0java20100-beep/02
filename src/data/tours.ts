export interface Tour {
  id: string;
  title: string;
  destinationIds: string[];
  image: string;
  days: number;
  countries: number;
  priceFrom: number;
  style: "Cultural" | "Beach & Relax" | "Adventure" | "City & Luxury" | "Honeymoon";
  blurb: string;
}

export const tours: Tour[] = [
  {
    id: "grand-europe",
    title: "Grand European Discovery",
    destinationIds: ["france", "switzerland", "italy"],
    image: "photo-1502602898657-3e91760cbb34",
    days: 12,
    countries: 3,
    priceFrom: 3890,
    style: "City & Luxury",
    blurb: "Paris, the Swiss Alps and the romance of Italy in one seamless luxury journey.",
  },
  {
    id: "arabian-nights",
    title: "Arabian Nights & Desert Luxe",
    destinationIds: ["dubai", "qatar", "saudi-arabia"],
    image: "photo-1512453979798-5ea266f8880c",
    days: 9,
    countries: 3,
    priceFrom: 2990,
    style: "City & Luxury",
    blurb: "Skyline glamour, golden deserts and five-star Gulf hospitality.",
  },
  {
    id: "island-escape",
    title: "Indian Ocean Island Escape",
    destinationIds: ["maldives", "thailand"],
    image: "photo-1514282401047-d79a71a590e8",
    days: 8,
    countries: 2,
    priceFrom: 3450,
    style: "Beach & Relax",
    blurb: "Overwater villas in the Maldives followed by the beaches of Thailand.",
  },
  {
    id: "far-east",
    title: "Wonders of the Far East",
    destinationIds: ["japan", "south-korea", "china"],
    image: "photo-1493976040374-85c8e12f0c0e",
    days: 13,
    countries: 3,
    priceFrom: 4120,
    style: "Cultural",
    blurb: "Ancient temples, neon cities and cherry blossoms across East Asia.",
  },
  {
    id: "silk-road",
    title: "Silk Road & Caucasus",
    destinationIds: ["uzbekistan", "azerbaijan", "georgia"],
    image: "photo-1614531341773-3bff8b7cb3fc",
    days: 11,
    countries: 3,
    priceFrom: 2390,
    style: "Cultural",
    blurb: "Samarkand's blue domes, Baku's flame towers and Georgian wine country.",
  },
  {
    id: "southeast-asia",
    title: "Southeast Asia Explorer",
    destinationIds: ["singapore", "malaysia", "bali"],
    image: "photo-1525625293386-3f8f99389edd",
    days: 10,
    countries: 3,
    priceFrom: 2780,
    style: "Adventure",
    blurb: "Futuristic Singapore, vibrant Malaysia and the soul of Bali.",
  },
  {
    id: "european-capitals",
    title: "Classic European Capitals",
    destinationIds: ["united-kingdom", "germany", "austria", "netherlands"],
    image: "photo-1513635269975-59663e0ac1ad",
    days: 12,
    countries: 4,
    priceFrom: 3550,
    style: "City & Luxury",
    blurb: "London, Berlin, Vienna and Amsterdam — Europe's most iconic cities.",
  },
  {
    id: "mediterranean",
    title: "Mediterranean Sun & Culture",
    destinationIds: ["spain", "italy", "turkey"],
    image: "photo-1543783207-ec64e4d95325",
    days: 11,
    countries: 3,
    priceFrom: 3180,
    style: "Beach & Relax",
    blurb: "Sun-drenched coasts, ancient ruins and unforgettable cuisine.",
  },
  {
    id: "nile-wonders",
    title: "Nile & Ancient Wonders",
    destinationIds: ["egypt", "turkey"],
    image: "photo-1539768942893-daf53e448371",
    days: 9,
    countries: 2,
    priceFrom: 2650,
    style: "Cultural",
    blurb: "Pyramids, pharaohs and the timeless treasures of two ancient lands.",
  },
];
