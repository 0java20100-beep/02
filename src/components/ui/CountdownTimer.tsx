"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function CountdownTimer({ endsInHours }: { endsInHours: number }) {
  const { dict } = useLanguage();
  const [target] = useState(() => Date.now() + endsInHours * 3600 * 1000);
  const [remaining, setRemaining] = useState(endsInHours * 3600 * 1000);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [target]);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (remaining <= 0) {
    return <span className="text-sm font-medium text-watermelon-600">{dict.offers.expired}</span>;
  }

  const units = [
    { value: days, label: dict.offers.days },
    { value: hours, label: dict.offers.hours },
    { value: mins, label: dict.offers.mins },
    { value: secs, label: dict.offers.secs },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-1.5">
          <div className="flex min-w-[3rem] flex-col items-center rounded-xl bg-ink-950 px-2 py-1.5">
            <span className="font-display text-lg font-bold leading-none text-white tabular-nums">
              {pad(u.value)}
            </span>
            <span className="mt-0.5 text-[10px] uppercase tracking-wide text-white/50">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && <span className="text-ink-800/40">:</span>}
        </div>
      ))}
    </div>
  );
}
