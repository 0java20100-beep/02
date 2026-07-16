import type {
  Dish,
  MenuCategory,
  MenuData,
  PromoCode,
  RestaurantSettings,
} from "@/lib/types";

export const categories: MenuCategory[] = [
  { id: "palov", name: "Palov", emoji: "🍚" },
  { id: "shashlik", name: "Shashlik", emoji: "🍢" },
  { id: "somsa", name: "Somsa", emoji: "🥟" },
  { id: "manti", name: "Manti", emoji: "🥠" },
  { id: "lagmon", name: "Lag'mon", emoji: "🍜" },
  { id: "norin", name: "Norin", emoji: "🍝" },
  { id: "mastava", name: "Mastava", emoji: "🥣" },
  { id: "dimlama", name: "Dimlama", emoji: "🍲" },
  { id: "shorva", name: "Sho'rva", emoji: "🍵" },
  { id: "qozon-kabob", name: "Qozon Kabob", emoji: "🥘" },
  { id: "chuchvara", name: "Chuchvara", emoji: "🫕" },
  { id: "beshbarmoq", name: "Beshbarmoq", emoji: "🍖" },
  { id: "tandir", name: "Tandir Go'sht", emoji: "🔥" },
  { id: "grill", name: "Grill", emoji: "🥩" },
  { id: "salatlar", name: "Salatlar", emoji: "🥗" },
  { id: "nonlar", name: "Milliy Nonlar", emoji: "🫓" },
  { id: "shirinliklar", name: "Shirinliklar", emoji: "🍰" },
  { id: "ichimliklar", name: "Ichimliklar", emoji: "🥤" },
  { id: "choylar", name: "Choylar", emoji: "🍵" },
  { id: "sharbatlar", name: "Sharbatlar", emoji: "🧃" },
];

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const dishes: Dish[] = [
  // Palov
  {
    id: "palov-toy",
    categoryId: "palov",
    name: "To'y Oshi",
    description:
      "An'anaviy to'y palovi — sarg'ish guruch, mayin qo'y go'shti va zar-zar sabzi bilan.",
    ingredients: ["Guruch", "Qo'y go'shti", "Sabzi", "Piyoz", "Zira", "Yog'"],
    calories: 780,
    cookTime: 90,
    price: 150000,
    rating: 4.9,
    image: img("photo-1633945274405-b6c8069047b0"),
    popular: true,
    chefPick: true,
  },
  {
    id: "palov-osh",
    categoryId: "palov",
    name: "Toshkent Palov",
    description:
      "Poytaxt uslubidagi palov, qazi va tuxum bilan bezatilgan klassik taom.",
    ingredients: ["Guruch", "Mol go'shti", "Sabzi", "Qazi", "Tuxum"],
    calories: 720,
    cookTime: 75,
    price: 120000,
    rating: 4.8,
    image: img("photo-1596797038530-2c107229654b"),
    popular: true,
  },
  {
    id: "palov-devzira",
    categoryId: "palov",
    name: "Devzira Palov",
    description:
      "Qadimiy devzira guruchidan tayyorlangan, boy ta'mli maxsus palov.",
    ingredients: ["Devzira guruch", "Qo'y go'shti", "Sabzi", "No'xat", "Mayiz"],
    calories: 810,
    cookTime: 100,
    price: 135000,
    rating: 4.9,
    image: img("photo-1512058564366-18510be2db19"),
  },

  // Shashlik
  {
    id: "shashlik-qoy",
    categoryId: "shashlik",
    name: "Qo'y Shashlik",
    description:
      "Cho'g'da pishirilgan mayin qo'y go'shti, piyoz va sumax bilan.",
    ingredients: ["Qo'y go'shti", "Piyoz", "Sumax", "Ziravorlar"],
    calories: 430,
    cookTime: 25,
    price: 45000,
    rating: 4.8,
    image: img("photo-1555939594-58d7cb561ad1"),
    popular: true,
  },
  {
    id: "shashlik-mol",
    categoryId: "shashlik",
    name: "Mol Shashlik",
    description: "Marinadlangan mol go'shti, aromatik cho'g' ustida qovurilgan.",
    ingredients: ["Mol go'shti", "Piyoz", "Marinad", "Ziravorlar"],
    calories: 410,
    cookTime: 25,
    price: 48000,
    rating: 4.7,
    image: img("photo-1544025162-d76694265947"),
  },
  {
    id: "shashlik-jigar",
    categoryId: "shashlik",
    name: "Jigar Shashlik",
    description: "Dumba yog'iga o'ralgan mayin jigar shashligi.",
    ingredients: ["Jigar", "Dumba yog'i", "Piyoz", "Tuz"],
    calories: 380,
    cookTime: 20,
    price: 42000,
    rating: 4.6,
    image: img("photo-1529193591184-b1d58069ecdd"),
  },

  // Somsa
  {
    id: "somsa-goshtli",
    categoryId: "somsa",
    name: "Go'shtli Somsa",
    description: "Tandirda pishirilgan, sershira go'shtli klassik somsa.",
    ingredients: ["Xamir", "Mol go'shti", "Piyoz", "Ziravorlar"],
    calories: 320,
    cookTime: 30,
    price: 18000,
    rating: 4.8,
    image: img("photo-1601050690597-df0568f70950"),
    popular: true,
  },
  {
    id: "somsa-tandir",
    categoryId: "somsa",
    name: "Tandir Somsa",
    description: "An'anaviy tandirda, qatlama xamirdan tayyorlangan somsa.",
    ingredients: ["Qatlama xamir", "Qo'y go'shti", "Dumba", "Piyoz"],
    calories: 360,
    cookTime: 35,
    price: 22000,
    rating: 4.7,
    image: img("photo-1625944230945-1b7dd3b949ab"),
  },

  // Manti
  {
    id: "manti-goshtli",
    categoryId: "manti",
    name: "Go'shtli Manti",
    description: "Bug'da pishirilgan, sershira go'sht va piyoz bilan to'ldirilgan.",
    ingredients: ["Xamir", "Mol go'shti", "Piyoz", "Qora murch"],
    calories: 340,
    cookTime: 45,
    price: 75000,
    rating: 4.8,
    image: img("photo-1534422298391-e4f8c172dddb"),
    popular: true,
  },
  {
    id: "manti-qovoqli",
    categoryId: "manti",
    name: "Qovoqli Manti",
    description: "Shirin oshqovoq va go'shtdan tayyorlangan mavsumiy manti.",
    ingredients: ["Xamir", "Oshqovoq", "Go'sht", "Piyoz"],
    calories: 300,
    cookTime: 45,
    price: 68000,
    rating: 4.6,
    image: img("photo-1563245372-f21724e3856d"),
  },

  // Lag'mon
  {
    id: "lagmon-choziq",
    categoryId: "lagmon",
    name: "Cho'ziq Lag'mon",
    description: "Qo'lda cho'zilgan xamir, boy sabzavotli qovurma bilan.",
    ingredients: ["Cho'ziq ugra", "Mol go'shti", "Sabzavotlar", "Ziravorlar"],
    calories: 520,
    cookTime: 40,
    price: 70000,
    rating: 4.8,
    image: img("photo-1569718212165-3a8278d5f624"),
    popular: true,
  },
  {
    id: "lagmon-quyruq",
    categoryId: "lagmon",
    name: "Qovurma Lag'mon",
    description: "Qovurilgan ugra va achchiq-shirin sous bilan tayyorlangan.",
    ingredients: ["Ugra", "Go'sht", "Bulg'or qalampiri", "Soya sousi"],
    calories: 560,
    cookTime: 35,
    price: 78000,
    rating: 4.7,
    image: img("photo-1585032226651-759b368d7246"),
  },

  // Norin
  {
    id: "norin-otliq",
    categoryId: "norin",
    name: "Norin",
    description: "Qo'lda kesilgan xamir va qazi bilan tayyorlangan sovuq taom.",
    ingredients: ["Xamir", "Qazi", "Qo'y go'shti", "Piyoz", "Qora murch"],
    calories: 480,
    cookTime: 60,
    price: 95000,
    rating: 4.7,
    image: img("photo-1547592166-23ac45744acd"),
  },

  // Mastava
  {
    id: "mastava-klassik",
    categoryId: "mastava",
    name: "Mastava",
    description: "Guruchli quyuq sho'rva, go'sht va sabzavotlar bilan.",
    ingredients: ["Guruch", "Go'sht", "Sabzi", "Pomidor", "Kartoshka"],
    calories: 350,
    cookTime: 50,
    price: 38000,
    rating: 4.6,
    image: img("photo-1547592180-85f173990554"),
  },

  // Dimlama
  {
    id: "dimlama-klassik",
    categoryId: "dimlama",
    name: "Dimlama",
    description:
      "Bug'da dimlangan go'sht va sabzavotlar — tabiiy shira bilan to'yingan.",
    ingredients: ["Go'sht", "Kartoshka", "Sabzi", "Karam", "Piyoz", "Pomidor"],
    calories: 590,
    cookTime: 90,
    price: 110000,
    rating: 4.8,
    image: img("photo-1512058564366-18510be2db19"),
    chefPick: true,
  },

  // Sho'rva
  {
    id: "shorva-qoy",
    categoryId: "shorva",
    name: "Qo'y Sho'rva",
    description: "Suyakli qo'y go'shtidan tayyorlangan to'yimli tiniq sho'rva.",
    ingredients: ["Qo'y go'shti", "Kartoshka", "Sabzi", "No'xat", "Ko'kat"],
    calories: 420,
    cookTime: 80,
    price: 55000,
    rating: 4.7,
    image: img("photo-1547592166-23ac45744acd"),
  },

  // Qozon Kabob
  {
    id: "qozon-kabob",
    categoryId: "qozon-kabob",
    name: "Qozon Kabob",
    description:
      "Qozonda dumba yog'ida qovurilgan go'sht va kartoshka — tilni yorar ta'm.",
    ingredients: ["Mol go'shti", "Kartoshka", "Piyoz", "Ziravorlar"],
    calories: 680,
    cookTime: 70,
    price: 145000,
    rating: 4.9,
    image: img("photo-1600891964092-4316c288032e"),
    popular: true,
    chefPick: true,
  },

  // Chuchvara
  {
    id: "chuchvara-klassik",
    categoryId: "chuchvara",
    name: "Chuchvara",
    description: "Mayda chuchvara — tiniq sho'rvada yoki qaymoq bilan.",
    ingredients: ["Xamir", "Go'sht", "Piyoz", "Ko'kat"],
    calories: 360,
    cookTime: 40,
    price: 65000,
    rating: 4.7,
    image: img("photo-1534422298391-e4f8c172dddb"),
  },

  // Beshbarmoq
  {
    id: "beshbarmoq-klassik",
    categoryId: "beshbarmoq",
    name: "Beshbarmoq",
    description: "Keng xamir varaqlari ustida qo'y go'shti va piyoz sousi.",
    ingredients: ["Xamir", "Qo'y go'shti", "Piyoz", "Bulon"],
    calories: 640,
    cookTime: 80,
    price: 130000,
    rating: 4.8,
    image: img("photo-1547592166-23ac45744acd"),
  },

  // Tandir Go'sht
  {
    id: "tandir-goshti",
    categoryId: "tandir",
    name: "Tandir Go'sht",
    description: "Tandirda sekin pishirilgan, mayin va aromatik qo'y go'shti.",
    ingredients: ["Qo'y go'shti", "Tuz", "Ziravorlar"],
    calories: 700,
    cookTime: 180,
    price: 160000,
    rating: 4.9,
    image: img("photo-1432139555190-58524dae6a55"),
    chefPick: true,
  },

  // Grill
  {
    id: "grill-tovuq",
    categoryId: "grill",
    name: "Grill Tovuq",
    description: "Ziravorlarga marinadlangan tovuq, ochiq olovda pishirilgan.",
    ingredients: ["Tovuq", "Marinad", "Limon", "Rozmarin"],
    calories: 460,
    cookTime: 35,
    price: 85000,
    rating: 4.7,
    image: img("photo-1598103442097-8b74394b95c6"),
  },
  {
    id: "grill-qovurga",
    categoryId: "grill",
    name: "Qovurg'a Grill",
    description: "Asal-ziravorli sousda pishirilgan mol qovurg'asi.",
    ingredients: ["Mol qovurg'asi", "Asal", "Sarimsoq", "Ziravorlar"],
    calories: 720,
    cookTime: 50,
    price: 140000,
    rating: 4.8,
    image: img("photo-1544025162-d76694265947"),
  },

  // Salatlar
  {
    id: "salat-achichuk",
    categoryId: "salatlar",
    name: "Achichuk",
    description: "Yangi pomidor, piyoz va bodring — palovga eng mos salat.",
    ingredients: ["Pomidor", "Piyoz", "Bodring", "Ko'kat"],
    calories: 90,
    cookTime: 10,
    price: 25000,
    rating: 4.6,
    image: img("photo-1540420773420-3366772f4999"),
  },
  {
    id: "salat-tashkent",
    categoryId: "salatlar",
    name: "Toshkent Salati",
    description: "Qaynatilgan go'sht, turp va tuxumdan mashhur salat.",
    ingredients: ["Mol tili", "Yashil turp", "Tuxum", "Mayonez"],
    calories: 280,
    cookTime: 20,
    price: 55000,
    rating: 4.7,
    image: img("photo-1546069901-ba9599a7e63c"),
  },

  // Milliy Nonlar
  {
    id: "non-obi",
    categoryId: "nonlar",
    name: "Obi Non",
    description: "Tandirda pishirilgan an'anaviy o'zbek noni.",
    ingredients: ["Un", "Suv", "Xamirturush", "Kunjut"],
    calories: 260,
    cookTime: 40,
    price: 8000,
    rating: 4.8,
    image: img("photo-1509440159596-0249088772ff"),
  },
  {
    id: "non-patir",
    categoryId: "nonlar",
    name: "Patir Non",
    description: "Qatlama, dumba yog'i qo'shilgan boy ta'mli patir.",
    ingredients: ["Un", "Dumba yog'i", "Sut", "Kunjut"],
    calories: 320,
    cookTime: 45,
    price: 12000,
    rating: 4.7,
    image: img("photo-1586444248902-2f64eddc13df"),
  },

  // Shirinliklar
  {
    id: "shirinlik-chak",
    categoryId: "shirinliklar",
    name: "Chak-chak",
    description: "Asalga botirilgan xamir bo'lakchalari — an'anaviy shirinlik.",
    ingredients: ["Un", "Tuxum", "Asal", "Yong'oq"],
    calories: 410,
    cookTime: 40,
    price: 35000,
    rating: 4.7,
    image: img("photo-1519676867240-f03562e64548"),
  },
  {
    id: "shirinlik-halva",
    categoryId: "shirinliklar",
    name: "Holva",
    description: "Kunjut va yong'oqli mayin, eriydigan holva.",
    ingredients: ["Kunjut", "Shakar", "Yong'oq"],
    calories: 470,
    cookTime: 30,
    price: 40000,
    rating: 4.6,
    image: img("photo-1551024601-bec78aea704b"),
  },

  // Ichimliklar
  {
    id: "ich-cola",
    categoryId: "ichimliklar",
    name: "Coca-Cola 0.5L",
    description: "Sovutilgan gazlangan ichimlik.",
    ingredients: ["Gazlangan ichimlik"],
    calories: 210,
    cookTime: 1,
    price: 12000,
    rating: 4.5,
    image: img("photo-1554866585-cd94860890b7"),
  },
  {
    id: "ich-suv",
    categoryId: "ichimliklar",
    name: "Mineral Suv 0.5L",
    description: "Tabiiy mineral suv.",
    ingredients: ["Mineral suv"],
    calories: 0,
    cookTime: 1,
    price: 6000,
    rating: 4.6,
    image: img("photo-1616118132534-381148898bb4"),
  },

  // Choylar
  {
    id: "choy-kok",
    categoryId: "choylar",
    name: "Ko'k Choy",
    description: "An'anaviy piyolada damlangan xushbo'y ko'k choy.",
    ingredients: ["Ko'k choy bargi"],
    calories: 5,
    cookTime: 5,
    price: 10000,
    rating: 4.8,
    image: img("photo-1556679343-c7306c1976bc"),
    popular: true,
  },
  {
    id: "choy-qora",
    categoryId: "choylar",
    name: "Qora Choy",
    description: "To'q, aromatik qora choy — choynak bilan.",
    ingredients: ["Qora choy bargi"],
    calories: 5,
    cookTime: 5,
    price: 10000,
    rating: 4.7,
    image: img("photo-1544787219-7f47ccb76574"),
  },

  // Sharbatlar
  {
    id: "sharbat-anor",
    categoryId: "sharbatlar",
    name: "Anor Sharbati",
    description: "Yangi siqilgan tabiiy anor sharbati.",
    ingredients: ["Anor"],
    calories: 130,
    cookTime: 5,
    price: 28000,
    rating: 4.8,
    image: img("photo-1600271886742-f049cd451bba"),
    popular: true,
  },
  {
    id: "sharbat-uzum",
    categoryId: "sharbatlar",
    name: "Uzum Sharbati",
    description: "Shirin uzumdan tayyorlangan tabiiy sharbat.",
    ingredients: ["Uzum"],
    calories: 150,
    cookTime: 5,
    price: 25000,
    rating: 4.6,
    image: img("photo-1621263764928-df1444c5e859"),
  },
];

export function getDishesByCategory(categoryId: string): Dish[] {
  return dishes.filter((d) => d.categoryId === categoryId);
}

export function getPopularDishes(): Dish[] {
  return dishes.filter((d) => d.popular);
}

export function getChefPicks(): Dish[] {
  return dishes.filter((d) => d.chefPick);
}

export const DEFAULT_PROMOS: PromoCode[] = [
  { code: "SHARQONA10", discountPercent: 10 },
  { code: "PALOV20", discountPercent: 20 },
  { code: "VIP15", discountPercent: 15 },
];

export const DEFAULT_SETTINGS: RestaurantSettings = {
  name: "Sharqona",
  tagline: "Milliy ta'm, zamonaviy hashamat",
  phone: "+998 71 200 00 00",
  address: "Toshkent sh., Amir Temur ko'chasi 12",
  hours: "Har kuni 10:00 — 23:00",
};

export function defaultMenuData(): MenuData {
  return {
    dishes,
    categories,
    promos: DEFAULT_PROMOS,
    settings: DEFAULT_SETTINGS,
    updatedAt: 0,
  };
}
