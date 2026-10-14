import { notionParId } from "@/data/notions";
import { normalise } from "@/features/risque";
import { MAITRISE_INITIALE } from "@/types";
import type { Appel, Lacune, TestAdaptatif } from "@/types";

/**
 * Intègre un test dans l'état : liste de tests + lacunes mises à jour ou créées.
 * Une notion ratée à un niveau bas produit une lacune sévère ; une notion
 * repassée sans faute voit sa maîtrise remonter (détectée → amélioration → résolue).
 */
export function integrerTest(
  tests: TestAdaptatif[],
  lacunes: Lacune[],
  appels: Appel[],
  t: TestAdaptatif
): { tests: TestAdaptatif[]; lacunes: Lacune[] } {
  const nouveauxTests = [t, ...tests];
  const nouvellesLacunes = lacunes.map((l) => ({ ...l }));

  const parNotion = new Map<string, typeof t.etapes>();
  for (const e of t.etapes) {
    parNotion.set(e.notionId, [...(parNotion.get(e.notionId) ?? []), e]);
  }
  const declarations = new Set(
    appels.filter((a) => a.statut === "effectue").flatMap((a) => a.declarations.map(normalise))
  );

  for (const [notionId, etapes] of parNotion) {
    const echecs = etapes.filter((e) => !e.correct);
    const reussite = Math.round(((etapes.length - echecs.length) / etapes.length) * 100);
    const niveauEchec = echecs.length ? Math.min(...echecs.map((e) => e.niveauAvant)) : 4;
    const severite =
      ({ 1: "critique", 2: "elevee", 3: "moderee", 4: "legere" } as Record<number, Lacune["severite"]>)[
        niveauEchec
      ] ?? "moderee";
    const confirme = declarations.has(normalise(notionParId(notionId).nom));
    const existante = nouvellesLacunes.find(
      (l) => l.eleveId === t.eleveId && l.notionId === notionId
    );

    if (existante) {
      existante.origineTestIds = [...new Set([...existante.origineTestIds, t.id])];
      existante.historique = [
        ...existante.historique,
        { date: t.date, maitrisePct: Math.max(existante.maitrisePct, reussite) },
      ];
      if (echecs.length === 0) {
        existante.maitrisePct = Math.max(existante.maitrisePct, Math.max(70, reussite));
        existante.severite = "legere";
        existante.statut = existante.maitrisePct >= 80 ? "resolue" : "amelioration";
      } else {
        existante.severite = severite;
        existante.maitrisePct = Math.max(MAITRISE_INITIALE[severite], Math.round(reussite * 0.7));
      }
      if (confirme) existante.confirmeOral = true;
    } else {
      nouvellesLacunes.push({
        id: `l-${t.id}-${notionId}`,
        eleveId: t.eleveId,
        notionId,
        severite,
        maitrisePct: MAITRISE_INITIALE[severite],
        historique: [{ date: t.date, maitrisePct: MAITRISE_INITIALE[severite] }],
        origineTestIds: [t.id],
        confirmeOral: confirme,
        statut: "detectee",
      });
    }
  }
  return { tests: nouveauxTests, lacunes: nouvellesLacunes };
}
