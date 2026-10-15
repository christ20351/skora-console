"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DonneeBuckets {
  label: string;
  valeur: number;
}

/**
 * Diagramme à bandes animées (valeur affichée au-dessus de chaque bande).
 * `barre` : classes du fond, ex. "bg-brand-400".
 */
export function Barres({
  donnees,
  barre,
}: {
  donnees: DonneeBuckets[];
  barre: string;
}) {
  const max = Math.max(...donnees.map((d) => d.valeur), 1);
  const HAUTEUR_MAX = 118;

  return (
    <div className="flex h-44 items-end gap-2 sm:gap-3">
      {donnees.map((d, i) => {
        const hauteur = d.valeur === 0 ? 3 : Math.max(10, (d.valeur / max) * HAUTEUR_MAX);
        return (
          <div
            key={d.label + i}
            className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
            title={`${d.label} : ${d.valeur}`}
          >
            <span
              className={cn(
                "text-xs font-bold tabular-nums",
                d.valeur === 0 ? "text-slate-400" : "text-slate-600"
              )}
            >
              {d.valeur}
            </span>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: hauteur, opacity: 1 }}
              transition={{ delay: 0.07 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "w-full max-w-9",
                d.valeur === 0
                  ? "rounded-t-md bg-slate-300/60"
                  : cn("rounded-t-lg transition-opacity group-hover:opacity-80", barre)
              )}
            />
            <span className="truncate text-xs font-semibold text-slate-400 uppercase">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
