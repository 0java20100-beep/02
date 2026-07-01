"use client";

import Link from "next/link";
import { QrCode, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { RippleButton } from "@/components/ui/ripple-button";

export function CTA() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/30 bg-gradient-to-br from-emerald-700 to-emerald-800 p-10 text-center text-emerald-50 shadow-card md:p-16">
            <div className="absolute inset-0 bg-ornament [background-size:24px_24px] opacity-30" />
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl btn-gold shadow-glow">
                <QrCode className="h-8 w-8" />
              </div>
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold sm:text-4xl md:text-5xl">
                Stolingizdagi QR kodni skaner qiling
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-emerald-100/85">
                Navbat kutmang. Telefoningiz orqali menyuni ko&apos;ring,
                buyurtma bering va holatini real vaqtda kuzating.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/order">
                  <RippleButton className="px-7 py-3.5 text-base">
                    Buyurtmani boshlash <ArrowRight className="h-5 w-5" />
                  </RippleButton>
                </Link>
                <Link href="/menu">
                  <RippleButton
                    variant="outline"
                    className="px-7 py-3.5 text-base text-gold-200"
                  >
                    Menyuni ko&apos;rish
                  </RippleButton>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
