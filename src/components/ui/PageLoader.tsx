"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function PageLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-5"
          >
            <div className="relative h-16 w-16">
              <span className="absolute inset-0 animate-spin-slow rounded-full border-2 border-watermelon-500/30 border-t-watermelon-500" />
              <span className="absolute inset-2 rounded-full bg-watermelon-gradient" />
              <span className="absolute inset-[26px] rounded-full bg-ink-950" />
            </div>
            <p className="font-display text-xl tracking-wide text-white">
              Watermelon<span className="text-watermelon-500">.</span>Travel
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
