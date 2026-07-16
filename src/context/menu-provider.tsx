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
  MenuData,
  PromoCode,
  RestaurantSettings,
} from "@/lib/types";
import {
  DEFAULT_PROMOS,
  DEFAULT_SETTINGS,
  defaultMenuData,
} from "@/data/menu";

export { DEFAULT_PROMOS, DEFAULT_SETTINGS };

const POLL_MS = 8000;

interface StoredData {
  dishes: Dish[];
  categories: MenuCategory[];
  promos: PromoCode[];
  settings: RestaurantSettings;
}

interface MenuContextValue extends StoredData {
  hydrated: boolean;
  saving: boolean;
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
  refresh: () => Promise<void>;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

function strip(d: MenuData): StoredData {
  return {
    dishes: d.dishes,
    categories: d.categories,
    promos: d.promos,
    settings: d.settings,
  };
}

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoredData>(() => strip(defaultMenuData()));
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  // Timestamp of the newest data we hold; a poll only overwrites local state
  // when the backend has something strictly newer (avoids clobbering a fresh
  // local admin edit while its POST is still in flight).
  const localTs = useRef(0);
  const dataRef = useRef(data);
  dataRef.current = data;

  const applyRemote = useCallback((menu: MenuData) => {
    if (menu.updatedAt < localTs.current) return;
    localTs.current = menu.updatedAt;
    setData(strip(menu));
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/menu", { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as { menu: MenuData };
      if (json.menu) applyRemote(json.menu);
    } catch {
      /* keep current data on network error */
    }
  }, [applyRemote]);

  useEffect(() => {
    let alive = true;
    (async () => {
      await refresh();
      if (alive) setHydrated(true);
    })();
    const t = setInterval(refresh, POLL_MS);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [refresh]);

  // Optimistically update local state, then persist the full document.
  const persist = useCallback((next: StoredData) => {
    const ts = Date.now();
    localTs.current = ts;
    setData(next);
    setSaving(true);
    const payload: MenuData = { ...next, updatedAt: ts };
    (async () => {
      try {
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          cache: "no-store",
        });
        if (res.ok) {
          const json = (await res.json()) as { menu: MenuData };
          if (json.menu) localTs.current = json.menu.updatedAt;
        }
      } catch {
        /* keep optimistic state; next poll reconciles */
      } finally {
        setSaving(false);
      }
    })();
  }, []);

  const mutate = useCallback(
    (fn: (prev: StoredData) => StoredData) => {
      persist(fn(dataRef.current));
    },
    [persist],
  );

  const addDish = useCallback(
    (dish: Dish) => mutate((p) => ({ ...p, dishes: [dish, ...p.dishes] })),
    [mutate],
  );

  const updateDish = useCallback(
    (dish: Dish) =>
      mutate((p) => ({
        ...p,
        dishes: p.dishes.map((d) => (d.id === dish.id ? dish : d)),
      })),
    [mutate],
  );

  const deleteDish = useCallback(
    (dishId: string) =>
      mutate((p) => ({ ...p, dishes: p.dishes.filter((d) => d.id !== dishId) })),
    [mutate],
  );

  const addCategory = useCallback(
    (category: MenuCategory) =>
      mutate((p) => ({ ...p, categories: [...p.categories, category] })),
    [mutate],
  );

  const updateCategory = useCallback(
    (category: MenuCategory) =>
      mutate((p) => ({
        ...p,
        categories: p.categories.map((c) =>
          c.id === category.id ? category : c,
        ),
      })),
    [mutate],
  );

  const deleteCategory = useCallback(
    (categoryId: string) =>
      mutate((p) => ({
        ...p,
        categories: p.categories.filter((c) => c.id !== categoryId),
        dishes: p.dishes.filter((d) => d.categoryId !== categoryId),
      })),
    [mutate],
  );

  const addPromo = useCallback(
    (promo: PromoCode) =>
      mutate((p) => {
        const code = promo.code.trim().toUpperCase();
        const rest = p.promos.filter((x) => x.code !== code);
        return { ...p, promos: [...rest, { ...promo, code }] };
      }),
    [mutate],
  );

  const deletePromo = useCallback(
    (code: string) =>
      mutate((p) => ({ ...p, promos: p.promos.filter((x) => x.code !== code) })),
    [mutate],
  );

  const updateSettings = useCallback(
    (settings: RestaurantSettings) => mutate((p) => ({ ...p, settings })),
    [mutate],
  );

  const resetAll = useCallback(
    () => mutate(() => strip(defaultMenuData())),
    [mutate],
  );

  const popularDishes = useMemo(
    () => data.dishes.filter((d) => d.popular),
    [data.dishes],
  );
  const chefPicks = useMemo(
    () => data.dishes.filter((d) => d.chefPick),
    [data.dishes],
  );
  const getDishesByCategory = useCallback(
    (categoryId: string) =>
      data.dishes.filter((d) => d.categoryId === categoryId),
    [data.dishes],
  );

  const value: MenuContextValue = {
    ...data,
    hydrated,
    saving,
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
    refresh,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within MenuProvider");
  return ctx;
}
