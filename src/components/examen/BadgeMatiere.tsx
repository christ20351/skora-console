import { MATIERES } from "@/types";
import type { Matiere } from "@/types";
import { cn } from "@/lib/utils";

/** Couleurs par matière — réutilisées dans les tableaux et badges */
export const STYLE_MATIERE: Record<Matiere, string> = {
  "Mathématiques": "bg-sky-400/15 text-sky-600 ring-1 ring-sky-300/40",
  "Physique-Chimie": "bg-violet-400/15 text-violet-600 ring-1 ring-violet-300/40",
  "SVT": "bg-emerald-400/15 text-emerald-600 ring-1 ring-emerald-300/40",
  "Français": "bg-amber-400/15 text-amber-600 ring-1 ring-amber-300/40",
  "Anglais": "bg-fuchsia-400/15 text-fuchsia-600 ring-1 ring-fuchsia-300/40",
  "Histoire-Géo": "bg-orange-400/15 text-orange-600 ring-1 ring-orange-300/40",
  "ECM": "bg-teal-400/15 text-teal-600 ring-1 ring-teal-300/40",
};

export function classeMatiere(matiere: string): string {
  return STYLE_MATIERE[matiere as Matiere] ?? "bg-white/60 text-slate-500 ring-1 ring-slate-200/60";
}

export function BadgeMatiere({ matiere }: { matiere: Matiere }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
        classeMatiere(matiere)
      )}
    >
      {matiere}
    </span>
  );
}

/** Ordre canonique des matières (celles de la maquette en premier) */
export function triMatiere(a: string, b: string): number {
  const ia = MATIERES.indexOf(a as Matiere);
  const ib = MATIERES.indexOf(b as Matiere);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
}
