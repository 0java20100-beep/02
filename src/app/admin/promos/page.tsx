"use client";

import { useState } from "react";
import { Plus, Trash2, Ticket } from "lucide-react";
import { useMenu } from "@/context/menu-provider";
import {
  PageHeader,
  Card,
  Field,
  TextInput,
  Button,
  Modal,
} from "@/components/admin/ui";

export default function AdminPromosPage() {
  const { promos, addPromo, deletePromo } = useMenu();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Promo kodlar"
        subtitle={`${promos.length} ta faol kod`}
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Yangi kod
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {promos.map((p) => (
          <Card key={p.code} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold-400">
              <Ticket className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-bold tracking-wide">
                {p.code}
              </p>
              <p className="text-sm text-muted">{p.discountPercent}% chegirma</p>
            </div>
            <button
              onClick={() => {
                if (confirm(`"${p.code}" o'chirilsinmi?`)) deletePromo(p.code);
              }}
              aria-label="O'chirish"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Card>
        ))}
        {promos.length === 0 && (
          <p className="py-16 text-center text-muted">Promo kod yo&apos;q</p>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Yangi promo kod">
        <PromoForm
          onCancel={() => setOpen(false)}
          onSave={(code, percent) => {
            addPromo({ code, discountPercent: percent });
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

function PromoForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (code: string, percent: number) => void;
}) {
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(10);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const c = code.trim().toUpperCase();
        if (!c) return;
        onSave(c, Math.max(1, Math.min(100, percent)));
      }}
      className="space-y-4"
    >
      <Field label="Kod">
        <TextInput
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="SHARQONA10"
          className="uppercase tracking-wide"
        />
      </Field>
      <Field label="Chegirma foizi (%)">
        <TextInput
          type="number"
          min={1}
          max={100}
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
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
