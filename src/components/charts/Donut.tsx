"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface DonneeDonut {
  label: string;
  valeur: number;
  couleur: string;
}

/** Palette par défaut des segments : gamme monochrome rouge Skora (du clair au foncé) */
export const PALETTE_DONUT = [
  "#f7a1aa",
  "#eb6673",
  "#dc3545",
  "#c92f3e",
  "#ad2936",
  "#8f222d",
  "#741c25",
  "#ffcdd3",
];

/**
 * Diagramme circulaire (donut) SVG : segments animés via stroke-dasharray,
 * contenu libre au centre (total, libellé…). Les valeurs nulles sont ignorées.
 */
export function Donut({
  donnees,
  taille = 190,
  epaisseur = 26,
  children,
}: {
  donnees: DonneeDonut[];
  taille?: number;
  epaisseur?: number;
  children?: ReactNode;
}) {
  const total = donnees.reduce((s, d) => s + d.valeur, 0);
  const r = (taille - epaisseur) / 2;
  const circonference = 2 * Math.PI * r;
  const centre = taille / 2;

  let parcouru = 0;
  const segments =
    total > 0
      ? donnees
          .filter((d) => d.valeur > 0)
          .map((d) => {
            const longueur = (d.valeur / total) * circonference;
            const segment = { ...d, longueur, depart: parcouru };
            parcouru += longueur;
            return segment;
          })
      : [];

  return (
    <div className="relative shrink-0" style={{ width: taille, height: taille }}>
      <svg width={taille} height={taille}>
        <g transform={`rotate(-90 ${centre} ${centre})`}>
          <circle
            cx={centre}
            cy={centre}
            r={r}
            fill="none"
            strokeWidth={epaisseur}
            className="stroke-slate-200/60"
          />
          {segments.map((s, i) => {
            const trace = Math.max(0, s.longueur - 2);
            return (
              <motion.circle
                key={s.label}
                cx={centre}
                cy={centre}
                r={r}
                fill="none"
                stroke={s.couleur}
                strokeWidth={epaisseur}
                initial={{ strokeDasharray: `0 ${circonference}`, opacity: 0 }}
                animate={{
                  strokeDasharray: `${trace} ${circonference - trace}`,
                  strokeDashoffset: -s.depart,
                  opacity: 1,
                }}
                transition={{ delay: 0.09 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <title>{`${s.label} : ${s.valeur}`}</title>
              </motion.circle>
            );
          })}
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
