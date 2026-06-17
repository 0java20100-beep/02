"use client";

import { CreditCard, QrCode, ShieldCheck, Lock, Wallet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Payment() {
  const { dict } = useLanguage();

  return (
    <section id="payment" className="section bg-ink-50/60">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={dict.payment.secure}
          title={dict.sections.paymentTitle}
          subtitle={dict.sections.paymentSubtitle}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-ink-900/5 bg-white p-7 shadow-card">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-watermelon-gradient text-white shadow-glow">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink-950">
                {dict.payment.cards}
              </h3>
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-ink-900 to-ink-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <Wallet className="h-7 w-7 text-white/80" />
                  <span className="text-xs uppercase tracking-widest text-white/50">Watermelon</span>
                </div>
                <p className="mt-6 font-display text-lg tracking-[0.2em] text-white/90">
                  4790 9122 5923 8246
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                  <span>Watermelon Travel</span>
                  <span>••/••</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-ink-800/60">{dict.payment.cardNumber}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-3xl border border-ink-900/5 bg-white p-7 shadow-card">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-500 text-white shadow-glow">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink-950">
                {dict.payment.instructionsTitle}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-800/70">
                {dict.payment.instructions}
              </p>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-leaf-50 px-4 py-3 text-sm font-medium text-leaf-700">
                <Lock className="h-4 w-4" />
                {dict.payment.secure}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-ink-900/5 bg-white p-7 text-center shadow-card">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950 text-white">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink-950">
                {dict.payment.scanQr}
              </h3>
              <div className="mt-5 flex aspect-square w-40 items-center justify-center rounded-2xl border-2 border-dashed border-ink-900/15 bg-ink-50">
                <QrCode className="h-16 w-16 text-ink-900/20" />
              </div>
              <p className="mt-4 text-sm text-ink-800/60">{dict.payment.qrPlaceholder}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
