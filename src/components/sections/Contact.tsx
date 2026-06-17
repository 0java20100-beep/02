"use client";

import { useState } from "react";
import { MapPin, Phone, Send, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InstagramIcon, TelegramIcon } from "@/components/ui/BrandIcons";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Contact() {
  const { dict } = useLanguage();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <section id="contact" className="section bg-background">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={dict.nav.contact}
          title={dict.sections.contactTitle}
          subtitle={dict.sections.contactSubtitle}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="flex h-full flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href="https://t.me/watermelontravel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                    <TelegramIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-800/50">
                      {dict.contact.telegram}
                    </p>
                    <p className="font-semibold text-ink-900">@watermelontravel</p>
                  </div>
                </a>
                <a
                  href="https://instagram.com/watermelontravel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-watermelon-100 text-watermelon-600">
                    <InstagramIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-800/50">
                      {dict.contact.instagram}
                    </p>
                    <p className="font-semibold text-ink-900">@watermelontravel</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-100 text-leaf-600">
                    <Phone className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-800/50">
                      {dict.contact.phone}
                    </p>
                    <p className="font-semibold text-ink-900">{dict.contact.phonePlaceholder}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/15 text-gold-600">
                    <MapPin className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-800/50">
                      {dict.contact.address}
                    </p>
                    <p className="font-semibold text-ink-900">{dict.contact.addressPlaceholder}</p>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-ink-900/5 bg-ink-50 p-10 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(251,44,90,0.08),transparent_60%)]" />
                <div className="relative">
                  <MapPin className="mx-auto h-8 w-8 text-watermelon-500" />
                  <p className="mt-2 text-sm font-medium text-ink-800/70">
                    {dict.contact.mapPlaceholder}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={dict.contact.name}>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="wm-input"
                  />
                </Field>
                <Field label={dict.contact.email}>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="wm-input"
                  />
                </Field>
              </div>
              <Field label={dict.contact.subject} className="mt-4">
                <input
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  className="wm-input"
                />
              </Field>
              <Field label={dict.contact.message} className="mt-4">
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="wm-input resize-none"
                />
              </Field>
              <button
                type="submit"
                disabled={sent}
                className="btn btn-primary mt-6 w-full justify-center"
              >
                {sent ? (
                  <>
                    <MessageCircle className="h-4 w-4" /> {dict.contact.sent}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> {dict.contact.send}
                  </>
                )}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-800/50">
                <Mail className="h-3.5 w-3.5" /> hello@watermelon.travel
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
      {children}
    </label>
  );
}
