export type Severite = "critique" | "elevee" | "moderee" | "legere";
export type StatutLacune = "detectee" | "renfort" | "amelioration" | "resolue";

export interface Lacune {
  id: string;
  eleveId: string;
  notionId: string;
  severite: Severite;
  /** 0–100 */
  maitrisePct: number;
  historique: { date: string; maitrisePct: number }[];
  origineTestIds: string[];
  /** confirmée par l'élève lui-même lors d'un appel */
  confirmeOral?: boolean;
  statut: StatutLacune;
}

export const POIDS_SEVERITE: Record<Severite, number> = {
  critique: 15,
  elevee: 10,
  moderee: 5,
  legere: 2,
};

export const SEVERITE_LABEL: Record<Severite, string> = {
  critique: "Critique",
  elevee: "Élevée",
  moderee: "Modérée",
  legere: "Légère",
};

export const STATUT_LACUNE_LABEL: Record<StatutLacune, string> = {
  detectee: "Détectée",
  renfort: "En renfort",
  amelioration: "En amélioration",
  resolue: "Résolue",
};

/** Sévérité déduite du niveau le plus bas auquel l'élève a raté */
export const SEVERITE_PAR_NIVEAU: Record<number, Severite> = {
  1: "critique",
  2: "elevee",
  3: "moderee",
  4: "legere",
};

/** Maitrise estimée d'après la sévérité fraîchement diagnostiquée */
export const MAITRISE_INITIALE: Record<Severite, number> = {
  critique: 20,
  elevee: 35,
  moderee: 50,
  legere: 65,
};

/** Niveau d'échec associé à une sévérité (pour calibrer la génération) */
export const NIVEAU_PAR_SEVERITE: Record<Severite, number> = {
  critique: 1,
  elevee: 2,
  moderee: 3,
  legere: 4,
};
