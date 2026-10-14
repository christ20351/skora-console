import {
  APPELS as APPELS_INIT,
  BULLETINS as BULLETINS_INIT,
  LACUNES as LACUNES_INIT,
  TESTS as TESTS_INIT,
} from "@/data/mock";
import type {
  AnalyseRisque,
  Appel,
  Bulletin,
  Eleve,
  LabelRisque,
  Lacune,
  Severite,
  TestAdaptatif,
} from "@/types";
import { axeBulletin, axeContexte, axeLacunes, matierePrioritaire, tendance } from "./scores";
import { prochaineAction } from "./action";

/** Date de référence de la démo */
export { AUJOURDHUI } from "@/lib/constantes";

const POIDS_AXES = { bulletin: 0.4, lacunes: 0.4, contexte: 0.2 };
const SEUILS: [number, LabelRisque][] = [
  [65, "Critique"],
  [45, "Élevé"],
  [25, "Modéré"],
  [0, "Vigilance"],
];

/** Sévérité déduite du niveau le plus bas auquel l'élève a raté */
export function severiteDepuisNiveau(niveauEchec: number): Severite {
  return { 1: "critique", 2: "elevee", 3: "moderee", 4: "legere" }[niveauEchec] as Severite;
}

/**
 * Score de risque 0–100 :
 * bulletin (40 %) + lacunes diagnostiquées (40 %) + contexte humain (20 %).
 */
export function analyserRisque(
  eleve: Eleve,
  lacunes?: Lacune[],
  appels?: Appel[],
  tests?: TestAdaptatif[],
  bulletins: Record<string, Bulletin[]> = BULLETINS_INIT
): AnalyseRisque {
  const lac = lacunes ?? LACUNES_INIT.filter((l) => l.eleveId === eleve.id);
  const ap = appels ?? APPELS_INIT.filter((a) => a.eleveId === eleve.id);
  const ts = tests ?? TESTS_INIT.filter((t) => t.eleveId === eleve.id);

  const bulletin = Math.round(axeBulletin(eleve, bulletins));
  const axeLac = Math.round(axeLacunes(lac));
  const contexte = Math.round(axeContexte(ap, lac));
  const score = Math.min(
    100,
    Math.round(
      POIDS_AXES.bulletin * bulletin +
        POIDS_AXES.lacunes * axeLac +
        POIDS_AXES.contexte * contexte
    )
  );
  const label = SEUILS.find(([seuil]) => score >= seuil)![1];

  return {
    score,
    label,
    axes: { bulletin, lacunes: axeLac, contexte },
    tendance: tendance(lac),
    matierePrioritaire: matierePrioritaire(eleve),
    action: prochaineAction(eleve, lac, ap, ts, bulletins),
  };
}

export { matierePrioritaire, pctNote, normalise, axeBulletin } from "./scores";
export { prochaineAction } from "./action";
export { lacunesParMatiere, maitriseParNotion, dernierTestMatiere } from "./stats";
export { notionsRatees, reussitePct } from "@/types";
