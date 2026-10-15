"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type Periode = "jour" | "semaine" | "mois";

const OPTIONS: { cle: Periode; label: string }[] = [
  { cle: "jour", label: "Jour" },
  { cle: "semaine", label: "Semaine" },
  { cle: "mois", label: "Mois" },
];

/** Sélecteur segmenté de période : jour · semaine · mois */
export function FiltrePeriode({
  valeur,
  onChange,
}: {
  valeur: Periode;
  onChange: (p: Periode) => void;
}) {
  const id = useId();
  return (
    <div className="glass-soft flex shrink-0 items-center gap-0.5 rounded-xl p-1">
      {OPTIONS.map((o) => {
        const on = valeur === o.cle;
        return (
          <button
            key={o.cle}
            type="button"
            onClick={() => onChange(o.cle)}
            className={cn(
              "relative rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
              on ? "text-white" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {on ? (
              <motion.span
                layoutId={`filtre-periode-${id}`}
                className="absolute inset-0 rounded-lg bg-slate-600 shadow-[0_5px_12px_-6px_rgba(71,85,105,0.5)]"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
