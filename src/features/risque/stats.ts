import { notionParId } from "@/data/notions";
import type { Lacune, Matiere, TestAdaptatif } from "@/types";

/** Répartition des lacunes actives par matière (dashboard) */
export function lacunesParMatiere(lacunes: Lacune[]): { matiere: string; nb: number }[] {
  const res: Record<string, number> = {};
  for (const l of lacunes) {
    if (l.statut === "resolue") continue;
    const m = notionParId(l.notionId).matiere;
    res[m] = (res[m] ?? 0) + 1;
  }
  return Object.entries(res)
    .map(([matiere, nb]) => ({ matiere, nb }))
    .sort((a, b) => b.nb - a.nb);
}

/** Maîtrise par notion pour le radar : lacune → sa maîtrise ; testé sans échec → 90 */
export function maitriseParNotion(
  tests: TestAdaptatif[],
  lacunes: Lacune[]
): { notionId: string; maitrise: number }[] {
  const res = new Map<string, number>();
  for (const l of lacunes) res.set(l.notionId, l.maitrisePct);
  for (const t of tests) {
    for (const n of new Set(t.etapes.map((e) => e.notionId))) {
      if (!res.has(n)) res.set(n, 90);
    }
  }
  return [...res.entries()].map(([notionId, maitrise]) => ({ notionId, maitrise }));
}

export function dernierTestMatiere(
  tests: TestAdaptatif[],
  matiere: Matiere | string
): TestAdaptatif | undefined {
  return tests
    .filter((t) => t.matiere === matiere)
    .sort((a, b) => b.date.localeCompare(a.date))
    .at(0);
}
