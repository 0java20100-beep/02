export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  trip: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sophia Bennett",
    location: "London, UK",
    avatar: "https://i.pravatar.cc/160?img=47",
    rating: 5,
    text: "Absolutely flawless from start to finish. Our Maldives villa was a dream and every transfer ran like clockwork. Watermelon thought of everything.",
    trip: "Maldives — Private Island Luxury",
  },
  {
    id: "t2",
    name: "Daniel Okafor",
    location: "Toronto, Canada",
    avatar: "https://i.pravatar.cc/160?img=12",
    rating: 5,
    text: "The Japan itinerary balanced city buzz and quiet temples perfectly. The bullet train passes and ryokan stay were unforgettable.",
    trip: "Japan — Grand Luxury",
  },
  {
    id: "t3",
    name: "Aisha Rahman",
    location: "Dubai, UAE",
    avatar: "https://i.pravatar.cc/160?img=32",
    rating: 5,
    text: "Booked a last-minute Cappadocia trip and they made it magical. Sunrise over the balloons brought tears to my eyes. Highly recommend!",
    trip: "Turkey — Istanbul & Cappadocia",
  },
  {
    id: "t4",
    name: "Marco Rossi",
    location: "Milan, Italy",
    avatar: "https://i.pravatar.cc/160?img=15",
    rating: 5,
    text: "The most seamless travel experience I've had. The concierge was reachable any hour and upgraded our suite in Switzerland. Pure class.",
    trip: "Switzerland — Grand Alpine",
  },
  {
    id: "t5",
    name: "Elena Petrova",
    location: "Moscow, Russia",
    avatar: "https://i.pravatar.cc/160?img=45",
    rating: 5,
    text: "Bali wellness retreat exceeded every expectation. Private villa, daily yoga, and a yacht trip to Nusa Penida. We're already planning the next one.",
    trip: "Bali — Private Villa",
  },
  {
    id: "t6",
    name: "James Carter",
    location: "Sydney, Australia",
    avatar: "https://i.pravatar.cc/160?img=51",
    rating: 5,
    text: "From the Pyramids to the Nile cruise, the Egypt trip was historic and luxurious in equal measure. Knowledgeable guides made it shine.",
    trip: "Egypt — Nile Royal Luxury",
  },
  {
    id: "t7",
    name: "Yuki Tanaka",
    location: "Osaka, Japan",
    avatar: "https://i.pravatar.cc/160?img=44",
    rating: 5,
    text: "Incredible attention to detail on our Dubai trip. The yacht cruise and desert safari were highlights. Will book with Watermelon again.",
    trip: "Dubai — Royal Luxury",
  },
  {
    id: "t8",
    name: "Liam Walsh",
    location: "Dublin, Ireland",
    avatar: "https://i.pravatar.cc/160?img=53",
    rating: 5,
    text: "The Silk Road tour through Uzbekistan was a revelation. Samarkand's blue domes are even more stunning in person. Beautifully organized.",
    trip: "Uzbekistan — Silk Road Luxury",
  },
];
