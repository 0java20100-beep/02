import type { Testimonial } from "@/lib/types";

const avatar = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=200&q=80`;

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Dilnoza Karimova",
    role: "Doimiy mijoz",
    avatar: avatar("photo-1494790108377-be9c29b29330"),
    rating: 5,
    text: "Sharqona — bu shunchaki restoran emas, bu haqiqiy san'at. To'y oshi ta'mi bolalikni eslatadi, xizmat esa Yevropa darajasida.",
  },
  {
    id: "t2",
    name: "Jahongir Toshmatov",
    role: "Biznesmen",
    avatar: avatar("photo-1500648767791-00dcc994a43e"),
    rating: 5,
    text: "Muhim uchrashuvlarni faqat shu yerda o'tkazaman. Interyer hashamatli, qozon kabob esa shaharning eng zo'ri.",
  },
  {
    id: "t3",
    name: "Malika Yusupova",
    role: "Blogger",
    avatar: avatar("photo-1438761681033-6461ffad8d80"),
    rating: 5,
    text: "Har bir taom rasmga tushirishga arziydi. Premium atmosfera va milliy ta'mlarning mukammal uyg'unligi.",
  },
  {
    id: "t4",
    name: "Sardor Alimov",
    role: "Sayohatchi",
    avatar: avatar("photo-1507003211169-0a1dd7228f2d"),
    rating: 5,
    text: "O'zbekistonga kelgan har bir mehmonga tavsiya qilaman. Chin ma'noda milliy mehmondo'stlik.",
  },
];
