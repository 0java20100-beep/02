"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { MenuCategory } from "@/lib/types";
import { useMenu } from "@/context/menu-provider";
import {
  PageHeader,
  Card,
  Field,
  TextInput,
  Button,
  Modal,
} from "@/components/admin/ui";

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "kategoriya"
  );
}

export default function AdminCategoriesPage() {
  const {
    categories,
    dishes,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useMenu();
  const [editing, setEditing] = useState<MenuCategory | null>(null);
  const [isNew, setIsNew] = useState(false);

  const count = (id: string) =>
    dishes.filter((d) => d.categoryId === id).length;

  return (
    <div>
      <PageHeader
        title="Kategoriyalar"
        subtitle={`${categories.length} ta bo'lim`}
        action={
          <Button
            onClick={() => {
              setEditing({ id: "", name: "", emoji: "🍽️" });
              setIsNew(true);
            }}
          >
            <Plus className="h-4 w-4" /> Yangi kategoriya
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Card key={c.id} className="flex items-center gap-3">
            <span className="text-2xl">{c.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{c.name}</p>
              <p className="text-sm text-muted">{count(c.id)} ta taom</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => {
                  setEditing(c);
                  setIsNew(false);
                }}
                aria-label="Tahrirlash"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold-400"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const n = count(c.id);
                  if (
                    confirm(
                      n > 0
                        ? `"${c.name}" va undagi ${n} ta taom o'chirilsinmi?`
                        : `"${c.name}" o'chirilsinmi?`,
                    )
                  )
                    deleteCategory(c.id);
                }}
                aria-label="O'chirish"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? "Yangi kategoriya" : "Kategoriyani tahrirlash"}
      >
        {editing && (
          <CategoryForm
            key={editing.id || "new"}
            initial={editing}
            onCancel={() => setEditing(null)}
            onSave={(cat) => {
              if (isNew) {
                addCategory({
                  ...cat,
                  id: `${slugify(cat.name)}-${Date.now().toString(36)}`,
                });
              } else {
                updateCategory(cat);
              }
              setEditing(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function CategoryForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: MenuCategory;
  onCancel: () => void;
  onSave: (cat: MenuCategory) => void;
}) {
  const [name, setName] = useState(initial.name);
  const [emoji, setEmoji] = useState(initial.emoji);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...initial, name: name.trim(), emoji: emoji.trim() || "🍽️" });
      }}
      className="space-y-4"
    >
      <Field label="Nomi">
        <TextInput
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      <Field label="Emoji / belgi">
        <TextInput
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          className="w-24 text-center text-2xl"
        />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Bekor qilish
        </Button>
        <Button type="submit">Saqlash</Button>
      </div>
    </form>
  );
}
