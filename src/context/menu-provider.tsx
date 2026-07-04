"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  Dish,
  MenuCategory,
  PromoCode,
  RestaurantSettings,
} from "@/lib/types";
import {
  categories as defaultCategories,
  dishes as defaultDishes,
} from "@/data/menu";

const STORAGE_KEY = "sharqona-data-v1";

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

interface StoredData {
  dishes: Dish[];
  categories: MenuCategory[];
  promos: PromoCode[];
  settings: RestaurantSettings;
}

interface MenuContextValue extends StoredData {
  hydrated: boolean;
  popularDishes: Dish[];
  chefPicks: Dish[];
  getDishesByCategory: (categoryId: string) => Dish[];
  addDish: (dish: Dish) => void;
  updateDish: (dish: Dish) => void;
  deleteDish: (dishId: string) => void;
  addCategory: (category: MenuCategory) => void;
  updateCategory: (category: MenuCategory) => void;
  deleteCategory: (categoryId: string) => void;
  addPromo: (promo: PromoCode) => void;
  deletePromo: (code: string) => void;
  updateSettings: (settings: RestaurantSettings) => void;
  resetAll: () => void;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

function defaults(): StoredData {
  return {
    dishes: defaultDishes,
    categories: defaultCategories,
    promos: DEFAULT_PROMOS,
    settings: DEFAULT_SETTINGS,
  };
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoredData>(defaults);
  const [hydrated, setHydrated] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<StoredData>;
        setData({
          dishes: parsed.dishes ?? defaultDishes,
          categories: parsed.categories ?? defaultCategories,
          promos: parsed.promos ?? DEFAULT_PROMOS,
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
        });
      } catch {
        /* ignore corrupt data */
      }
    }
    loaded.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addDish = useCallback((dish: Dish) => {
    setData((prev) => ({ ...prev, dishes: [dish, ...prev.dishes] }));
  }, []);

  const updateDish = useCallback((dish: Dish) => {
    setData((prev) => ({
      ...prev,
      dishes: prev.dishes.map((d) => (d.id === dish.id ? dish : d)),
    }));
  }, []);

  const deleteDish = useCallback((dishId: string) => {
    setData((prev) => ({
      ...prev,
      dishes: prev.dishes.filter((d) => d.id !== dishId),
    }));
  }, []);

  const addCategory = useCallback((category: MenuCategory) => {
    setData((prev) => ({ ...prev, categories: [...prev.categories, category] }));
  }, []);

  const updateCategory = useCallback((category: MenuCategory) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === category.id ? category : c,
      ),
    }));
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== categoryId),
      dishes: prev.dishes.filter((d) => d.categoryId !== categoryId),
    }));
  }, []);

  const addPromo = useCallback((promo: PromoCode) => {
    setData((prev) => {
      const code = promo.code.trim().toUpperCase();
      const rest = prev.promos.filter((p) => p.code !== code);
      return { ...prev, promos: [...rest, { ...promo, code }] };
    });
  }, []);

  const deletePromo = useCallback((code: string) => {
    setData((prev) => ({
      ...prev,
      promos: prev.promos.filter((p) => p.code !== code),
    }));
  }, []);

  const updateSettings = useCallback((settings: RestaurantSettings) => {
    setData((prev) => ({ ...prev, settings }));
  }, []);

  const resetAll = useCallback(() => setData(defaults()), []);

  const popularDishes = useMemo(
    () => data.dishes.filter((d) => d.popular),
    [data.dishes],
  );
  const chefPicks = useMemo(
    () => data.dishes.filter((d) => d.chefPick),
    [data.dishes],
  );
  const getDishesByCategory = useCallback(
    (categoryId: string) => data.dishes.filter((d) => d.categoryId === categoryId),
    [data.dishes],
  );

  const value: MenuContextValue = {
    ...data,
    hydrated,
    popularDishes,
    chefPicks,
    getDishesByCategory,
    addDish,
    updateDish,
    deleteDish,
    addCategory,
    updateCategory,
    deleteCategory,
    addPromo,
    deletePromo,
    updateSettings,
    resetAll,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within MenuProvider");
  return ctx;
}
