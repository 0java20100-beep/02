"use client";

import { useMemo, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Star,
  ChefHat,
  Upload,
} from "lucide-react";
import type { Dish } from "@/lib/types";
import { useMenu } from "@/context/menu-provider";
import { formatSom } from "@/lib/utils";
import {
  PageHeader,
  Card,
  Field,
  TextInput,
  TextArea,
  Select,
  Button,
  Modal,
} from "@/components/admin/ui";

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "taom"
  );
}

const empty = (categoryId: string): Dish => ({
  id: "",
  categoryId,
  name: "",
  description: "",
  ingredients: [],
  calories: 0,
  cookTime: 0,
  price: 0,
  rating: 4.5,
  image: "",
  popular: false,
  chefPick: false,
  spicy: false,
});

export default function AdminMenuPage() {
  const { dishes, categories, addDish, updateDish, deleteDish } = useMenu();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<Dish | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = useMemo(() => {
    let list = dishes;
    if (filter !== "all") list = list.filter((d) => d.categoryId === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    return list;
  }, [dishes, filter, query]);

  const openNew = () => {
    setEditing(empty(categories[0]?.id ?? ""));
    setIsNew(true);
  };
  const openEdit = (dish: Dish) => {
    setEditing(dish);
    setIsNew(false);
  };

  const catName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  return (
    <div>
      <PageHeader
        title="Menu / Taomlar"
        subtitle={`${dishes.length} ta taom`}
        action={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Yangi taom
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Taom qidirish..."
            className="pl-11"
          />
        </div>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="sm:w-56"
        >
          <option value="all">Barcha kategoriyalar</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-3">
        {filtered.map((dish) => (
          <Card
            key={dish.id}
            className="flex items-center gap-4 !p-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dish.image}
              alt={dish.name}
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold">{dish.name}</p>
                {dish.popular && (
                  <Star className="h-4 w-4 shrink-0 fill-gold text-gold" />
                )}
                {dish.chefPick && (
                  <ChefHat className="h-4 w-4 shrink-0 text-gold-400" />
                )}
              </div>
              <p className="truncate text-sm text-muted">
                {catName(dish.categoryId)} · {formatSom(dish.price)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => openEdit(dish)}
                aria-label="Tahrirlash"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold-400"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`"${dish.name}" o'chirilsinmi?`))
                    deleteDish(dish.id);
                }}
                aria-label="O'chirish"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-16 text-center text-muted">Taom topilmadi</p>
        )}
      </div>

      <DishModal
        dish={editing}
        isNew={isNew}
        categories={categories}
        onClose={() => setEditing(null)}
        onSave={(dish) => {
          if (isNew) {
            const id = `${slugify(dish.name)}-${Date.now().toString(36)}`;
            addDish({ ...dish, id });
          } else {
            updateDish(dish);
          }
          setEditing(null);
        }}
      />
    </div>
  );
}

function DishModal({
  dish,
  isNew,
  categories,
  onClose,
  onSave,
}: {
  dish: Dish | null;
  isNew: boolean;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSave: (dish: Dish) => void;
}) {
  return (
    <Modal
      open={!!dish}
      onClose={onClose}
      title={isNew ? "Yangi taom" : "Taomni tahrirlash"}
    >
      {dish && (
        <DishForm
          key={dish.id || "new"}
          initial={dish}
          categories={categories}
          onCancel={onClose}
          onSave={onSave}
        />
      )}
    </Modal>
  );
}

function DishForm({
  initial,
  categories,
  onCancel,
  onSave,
}: {
  initial: Dish;
  categories: { id: string; name: string }[];
  onCancel: () => void;
  onSave: (dish: Dish) => void;
}) {
  const [form, setForm] = useState<Dish>(initial);
  const [ingredients, setIngredients] = useState(
    initial.ingredients.join(", "),
  );
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Dish>(key: K, value: Dish[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (json.url) set("image", json.url);
      else alert(json.error || "Rasm yuklanmadi");
    } catch {
      alert("Rasm yuklanmadi");
    } finally {
      setUploading(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      name: form.name.trim(),
      ingredients: ingredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Nomi">
        <TextInput
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>

      <Field label="Tavsif">
        <TextArea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Kategoriya">
          <Select
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Narxi (so'm)">
          <TextInput
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </Field>
      </div>

      <Field label="Rasm (yuklash yoki URL)">
        <div className="flex gap-2">
          <TextInput
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="https://... yoki rasm yuklang"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="shrink-0"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Yuklanmoqda…" : "Yuklash"}
          </Button>
        </div>
      </Field>
      {form.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={form.image}
          alt="Ko'rinishi"
          className="h-32 w-full rounded-xl object-cover"
        />
      )}

      <Field label="Tarkibi (vergul bilan ajrating)">
        <TextInput
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Guruch, Go'sht, Sabzi"
        />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Kaloriya">
          <TextInput
            type="number"
            min={0}
            value={form.calories}
            onChange={(e) => set("calories", Number(e.target.value))}
          />
        </Field>
        <Field label="Vaqt (min)">
          <TextInput
            type="number"
            min={0}
            value={form.cookTime}
            onChange={(e) => set("cookTime", Number(e.target.value))}
          />
        </Field>
        <Field label="Reyting">
          <TextInput
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={form.rating}
            onChange={(e) => set("rating", Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!form.popular}
            onChange={(e) => set("popular", e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          Mashhur
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!form.chefPick}
            onChange={(e) => set("chefPick", e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          Chef tavsiyasi
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!form.spicy}
            onChange={(e) => set("spicy", e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          Achchiq
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Bekor qilish
        </Button>
        <Button type="submit">Saqlash</Button>
      </div>
    </form>
  );
}
