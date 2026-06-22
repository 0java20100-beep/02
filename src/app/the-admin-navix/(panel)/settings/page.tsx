"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Check } from "lucide-react";
import { apiGet, apiSend } from "@/lib/admin-client";
import {
  PageHeader,
  Field,
  Button,
  inputCls,
} from "@/components/admin/ui";
import { MediaInput } from "@/components/admin/MediaInput";

interface SiteCfg {
  brand: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
}
interface HeroCfg {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;
}
interface SeoCfg {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export default function SettingsAdminPage() {
  const [site, setSite] = useState<SiteCfg | null>(null);
  const [hero, setHero] = useState<HeroCfg | null>(null);
  const [seo, setSeo] = useState<SeoCfg | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Record<string, unknown>>("/api/settings").then((r) => {
      if (r.success && r.data) {
        setSite(r.data.site as SiteCfg);
        setHero(r.data.hero as HeroCfg);
        setSeo(r.data.seo as SeoCfg);
      }
      setLoading(false);
    });
  }, []);

  async function save(key: string, value: unknown) {
    setSavingKey(key);
    const res = await apiSend("/api/settings", "PUT", { key, value });
    setSavingKey(null);
    if (res.success) {
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 1800);
    }
  }

  if (loading || !site || !hero || !seo) {
    return (
      <div className="grid place-items-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const SaveBtn = ({ k, value }: { k: string; value: unknown }) => (
    <Button onClick={() => save(k, value)} disabled={savingKey === k}>
      {savingKey === k ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : savedKey === k ? (
        <>
          <Check className="h-4 w-4" /> Сохранено
        </>
      ) : (
        <>
          <Save className="h-4 w-4" /> Сохранить
        </>
      )}
    </Button>
  );

  return (
    <div>
      <PageHeader
        title="Настройки сайта"
        description="Конструктор контента: меняйте тексты, цвета, логотип и SEO без программиста."
      />

      <div className="space-y-6">
        {/* Brand */}
        <section className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Бренд и оформление</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Название бренда">
              <input className={inputCls} value={site.brand} onChange={(e) => setSite({ ...site, brand: e.target.value })} />
            </Field>
            <Field label="Слоган">
              <input className={inputCls} value={site.tagline} onChange={(e) => setSite({ ...site, tagline: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Логотип" hint="Загрузите логотип или оставьте пустым для текстового лого">
              <MediaInput value={site.logoUrl || null} onChange={(url) => setSite({ ...site, logoUrl: url || "" })} />
            </Field>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <ColorField label="Основной цвет" value={site.primaryColor} onChange={(v) => setSite({ ...site, primaryColor: v })} />
            <ColorField label="Вторичный цвет" value={site.secondaryColor} onChange={(v) => setSite({ ...site, secondaryColor: v })} />
            <ColorField label="Акцент" value={site.accentColor} onChange={(v) => setSite({ ...site, accentColor: v })} />
          </div>
          <div className="mt-5 flex justify-end">
            <SaveBtn k="site" value={site} />
          </div>
        </section>

        {/* Hero */}
        <section className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Главный экран (Hero)</h3>
          <div className="space-y-4">
            <Field label="Заголовок">
              <input className={inputCls} value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
            </Field>
            <Field label="Подзаголовок">
              <textarea rows={2} className={inputCls} value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Кнопка 1">
                <input className={inputCls} value={hero.ctaPrimary} onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })} />
              </Field>
              <Field label="Кнопка 2">
                <input className={inputCls} value={hero.ctaSecondary} onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })} />
              </Field>
              <Field label="Кнопка 3">
                <input className={inputCls} value={hero.ctaTertiary} onChange={(e) => setHero({ ...hero, ctaTertiary: e.target.value })} />
              </Field>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <SaveBtn k="hero" value={hero} />
          </div>
        </section>

        {/* SEO */}
        <section className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-4">SEO</h3>
          <div className="space-y-4">
            <Field label="Title">
              <input className={inputCls} value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea rows={2} className={inputCls} value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })} />
            </Field>
            <Field label="Keywords">
              <input className={inputCls} value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} />
            </Field>
            <Field label="OG Image">
              <MediaInput value={seo.ogImage || null} onChange={(url) => setSeo({ ...seo, ogImage: url || "" })} />
            </Field>
          </div>
          <div className="mt-5 flex justify-end">
            <SaveBtn k="seo" value={seo} />
          </div>
        </section>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 rounded-lg bg-transparent border border-white/10 cursor-pointer"
        />
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}
