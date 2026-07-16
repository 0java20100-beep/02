"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, Check } from "lucide-react";
import { useCart } from "@/context/cart-provider";
import { useOrder } from "@/context/order-provider";
import { formatSom } from "@/lib/utils";
import { DishImage } from "@/components/ui/dish-image";
import { RippleButton } from "@/components/ui/ripple-button";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    addItem,
    decrement,
    removeItem,
    clearCart,
    applyPromo,
    removePromo,
    promo,
    promoError,
    subtotal,
    discount,
    total,
    totalItems,
  } = useCart();
  const { placeOrder, tableNumber } = useOrder();
  const [promoInput, setPromoInput] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0 || submitting) return;
    setSubmitting(true);
    const order = await placeOrder(items, total);
    setSubmitting(false);
    if (!order) {
      alert("Buyurtma yuborilmadi. Internet aloqasini tekshiring va qayta urining.");
      return;
    }
    clearCart();
    closeCart();
    router.push("/order");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="glass-strong fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col shadow-card"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="font-display text-xl font-bold">Savatcha</h2>
                <p className="text-xs text-muted">
                  Stol #{tableNumber} · {totalItems} ta taom
                </p>
              </div>
              <button
                onClick={closeCart}
                aria-label="Yopish"
                className="flex h-10 w-10 items-center justify-center rounded-full glass transition-transform hover:rotate-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
                  <ShoppingBag className="h-9 w-9 text-gold-400" />
                </div>
                <p className="text-muted">Savatchangiz hozircha bo&apos;sh</p>
                <RippleButton
                  variant="outline"
                  onClick={() => {
                    closeCart();
                    router.push("/menu");
                  }}
                >
                  Menyuni ochish
                </RippleButton>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-5 no-scrollbar">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.dish.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-3 rounded-2xl glass p-3"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                          <DishImage
                            src={item.dish.image}
                            alt={item.dish.name}
                            sizes="80px"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold leading-tight">
                              {item.dish.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item.dish.id)}
                              aria-label="O'chirish"
                              className="text-muted transition-colors hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-gold-400">
                            {formatSom(item.dish.price)}
                          </span>
                          <div className="mt-auto flex items-center gap-2">
                            <button
                              onClick={() => decrement(item.dish.id)}
                              aria-label="Kamaytirish"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:border-gold hover:text-gold-400"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-6 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addItem(item.dish)}
                              aria-label="Ko'paytirish"
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:border-gold hover:text-gold-400"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="space-y-4 border-t border-border p-5">
                  {promo ? (
                    <div className="flex items-center justify-between rounded-2xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm">
                      <span className="flex items-center gap-2 font-semibold text-gold-400">
                        <Check className="h-4 w-4" /> {promo.code} (-
                        {promo.discountPercent}%)
                      </span>
                      <button
                        onClick={removePromo}
                        className="text-muted hover:text-red-500"
                        aria-label="Promo kodni o'chirish"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                          <input
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            placeholder="Promo kod (SHARQONA10)"
                            className="w-full rounded-full border border-border bg-transparent py-2.5 pl-9 pr-3 text-sm focus:border-gold focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => applyPromo(promoInput)}
                          className="rounded-full border border-gold/50 px-4 text-sm font-semibold text-gold-400 transition-colors hover:bg-gold/10"
                        >
                          Qo&apos;llash
                        </button>
                      </div>
                      {promoError && (
                        <p className="mt-1.5 px-2 text-xs text-red-500">
                          {promoError}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted">
                      <span>Oraliq summa</span>
                      <span>{formatSom(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-gold-400">
                        <span>Chegirma</span>
                        <span>−{formatSom(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                      <span>Jami</span>
                      <span className="text-gold-400">{formatSom(total)}</span>
                    </div>
                  </div>

                  <RippleButton
                    onClick={handleCheckout}
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? "Yuborilmoqda…" : "Buyurtmani yuborish"}
                  </RippleButton>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
