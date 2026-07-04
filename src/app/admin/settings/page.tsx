"use client";

import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import type { RestaurantSettings } from "@/lib/types";
import { useMenu, DEFAULT_SETTINGS } from "@/context/menu-provider";
import {
  PageHeader,
  Card,
  Field,
  TextInput,
  Button,
} from "@/components/admin/ui";

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetAll } = useMenu();
  const [form, setForm] = useState<RestaurantSettings>(settings);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof RestaurantSettings>(
    key: K,
    value: RestaurantSettings[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Sozlamalar"
        subtitle="Restoran ma'lumotlari (sayt bo'ylab ko'rinadi)"
      />

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateSettings(form);
            setSaved(true);
          }}
          className="space-y-4"
        >
          <Field label="Restoran nomi">
            <TextInput
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Shior (tagline)">
            <TextInput
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
            />
          </Field>
          <Field label="Telefon">
            <TextInput
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label="Manzil">
            <TextInput
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </Field>
          <Field label="Ish vaqti">
            <TextInput
              value={form.hours}
              onChange={(e) => set("hours", e.target.value)}
            />
          </Field>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit">
              <Save className="h-4 w-4" /> Saqlash
            </Button>
            {saved && (
              <span className="text-sm text-emerald-500">Saqlandi ✓</span>
            )}
          </div>
        </form>
      </Card>

      <Card className="mt-6 border-red-500/30">
        <p className="font-semibold text-red-500">Xavfli hudud</p>
        <p className="mt-1 text-sm text-muted">
          Barcha o&apos;zgarishlarni (taomlar, kategoriyalar, promo kodlar,
          sozlamalar) dastlabki holatga qaytaradi.
        </p>
        <Button
          variant="danger"
          className="mt-4"
          onClick={() => {
            if (
              confirm(
                "Barcha ma'lumotlar dastlabki holatga qaytarilsinmi? Bu amalni ortga qaytarib bo'lmaydi.",
              )
            ) {
              resetAll();
              setForm(DEFAULT_SETTINGS);
            }
          }}
        >
          <RotateCcw className="h-4 w-4" /> Hammasini tiklash
        </Button>
      </Card>
    </div>
  );
}
