import type { Examen } from "@/types";

/** Couleur de la note : échec → rouge Skora, moyen → ambre, solide → vert */
export function styleNote(note: number, sur: number): string {
  const ratio = note / (sur || 20);
  if (ratio < 0.5) return "font-bold text-brand-600";
  if (ratio < 0.7) return "font-semibold text-amber-600";
  return "font-semibold text-emerald-600";
}

export const tailleKo = (contenu: string) =>
  `${(new TextEncoder().encode(contenu).length / 1024).toFixed(1)} Ko`;

export function telecharger(ex: Examen) {
  const blob = new Blob([ex.contenu], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = ex.fichier;
  a.click();
  URL.revokeObjectURL(url);
}
