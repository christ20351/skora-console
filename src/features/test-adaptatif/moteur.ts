import { questionsParMatiereImpl } from "./pool";
import { severiteDepuisNiveau } from "@/features/risque";
import type { EtapeTest, Niveau, Question } from "@/types";

export const NOMBRE_QUESTIONS = 8;
export const NIVEAU_DEPART: Niveau = 2; // niveau standard

/** Choisit une question au niveau demandé ; sinon au niveau le plus proche. */
export function choisirQuestion(
  matiere: string,
  niveau: Niveau,
  exclues: Set<string>
): Question | null {
  const pool = questionsParMatiereImpl(matiere).filter((q) => !exclues.has(q.id));
  if (pool.length === 0) return null;
  for (let delta = 0; delta <= 3; delta++) {
    for (const sens of [0, -1, 1]) {
      const n = Math.min(4, Math.max(1, niveau + delta * sens));
      const candidates = pool.filter((q) => q.niveau === n);
      if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
    }
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Réussi → on monte d'un niveau ; raté → on descend (min 1, max 4). */
export function niveauSuivant(niveau: Niveau, correct: boolean): Niveau {
  return correct ? (Math.min(4, niveau + 1) as Niveau) : (Math.max(1, niveau - 1) as Niveau);
}

export interface NotionRatee {
  notionId: string;
  /** niveau le plus bas auquel la notion a été ratée → détermine la sévérité */
  niveauEchec: Niveau;
  nbEchecs: number;
}

export interface Bilan {
  reussitePct: number;
  notionsRatees: NotionRatee[];
  niveauFinal: Niveau;
}

/** Bilan de session : tout ce qui a été raté, et à quel niveau. */
export function etablirBilan(
  etapes: EtapeTest[],
  niveauFinal: Niveau
): Bilan {
  const echecs = etapes.filter((e) => !e.correct);
  const parNotion = new Map<string, number[]>();
  for (const e of echecs) {
    parNotion.set(e.notionId, [...(parNotion.get(e.notionId) ?? []), e.niveauAvant]);
  }
  const notionsRatees: NotionRatee[] = [...parNotion.entries()].map(([notionId, niveaux]) => ({
    notionId,
    niveauEchec: Math.min(...niveaux) as Niveau,
    nbEchecs: niveaux.length,
  }));
  notionsRatees.sort((a, b) => a.niveauEchec - b.niveauEchec);

  return {
    reussitePct: etapes.length
      ? Math.round(((etapes.length - echecs.length) / etapes.length) * 100)
      : 0,
    notionsRatees,
    niveauFinal,
  };
}

export { severiteDepuisNiveau };
