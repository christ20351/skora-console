"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mini courbe d'évolution de la maîtrise */
export function Sparkline({
  valeurs,
  largeur = 72,
  hauteur = 24,
}: {
  valeurs: number[];
  largeur?: number;
  hauteur?: number;
}) {
  if (valeurs.length < 2) {
    return <div className="h-6 w-[72px] rounded bg-slate-50" />;
  }
  const px = (i: number) => (i / (valeurs.length - 1)) * (largeur - 4) + 2;
  const py = (v: number) => hauteur - 3 - (v / 100) * (hauteur - 6);
  const trace = valeurs.map((v, i) => `${px(i)},${py(v)}`).join(" ");
  const monte = valeurs.at(-1)! >= valeurs[0];
  const c = monte ? "#10b981" : "#dc3545";
  return (
    <svg width={largeur} height={hauteur}>
      <polyline
        points={trace}
        fill="none"
        stroke={c}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={px(valeurs.length - 1)} cy={py(valeurs.at(-1)!)} r={2.5} fill={c} />
    </svg>
  );
}

/** Badge d'évolution globale de l'élève */
export function Tendance({ t }: { t: "hausse" | "stable" | "baisse" }) {
  const conf = {
    hausse: { Icon: TrendingUp, texte: "En progrès", classe: "text-emerald-600 bg-emerald-50" },
    stable: { Icon: null, texte: "Stable", classe: "text-slate-500 bg-slate-100" },
    baisse: { Icon: TrendingDown, texte: "En recul", classe: "text-brand-600 bg-brand-50" },
  }[t];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        conf.classe
      )}
    >
      {conf.Icon ? <conf.Icon size={12} /> : null}
      {conf.texte}
    </span>
  );
}
