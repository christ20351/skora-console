import type { Severite } from "./lacune";

/** État d'une notion pour un appren donné, déduit de l'analyse de son profil */
export type StatutNotion = "acquise" | "en-cours" | "fragile" | "critique" | "non-evaluee";

export const ORDRE_GRAVITE_STATUT: Record<StatutNotion, number> = {
  critique: 5,
  fragile: 4,
  "en-cours": 3,
  "non-evaluee": 2,
  acquise: 1,
};

export const STATUT_NOTION_LABEL: Record<StatutNotion, string> = {
  acquise: "Acquise",
  "en-cours": "En renfort",
  fragile: "Fragile",
  critique: "Critique",
  "non-evaluee": "Non évaluée",
};

/** Une notion (de la banque ou de base) placée dans un chapitre du diagnostic */
export interface NotionDiagnostic {
  /** id dans la banque de notions, si le chapitre en contient */
  id?: string;
  nom: string;
  statut: StatutNotion;
  /** 0–100, null si non évaluée */
  maitrisePct: number | null;
  /** maîtrise estimée depuis le bulletin (et non mesurée par un test) */
  estimee?: boolean;
  severite?: Severite;
  confirmeOral?: boolean;
  /** rappels de cours (notions de la banque uniquement) */
  pointsCles?: string[];
  piege?: string;
}

/** Nœud de l'arbre : un chapitre avec ses notions et les chapitres qui le précèdent */
export interface ChapitreDiagnostic {
  id: string;
  nom: string;
  /** ids des chapitres à maîtriser avant celui-ci */
  prerequis: string[];
  notions: NotionDiagnostic[];
  statut: StatutNotion;
  /** moyenne des maîtrises de ses notions (null si aucune évaluée) */
  maitrisePct: number | null;
}

/** Un arbre par matière — les arbres sont indépendants dans le canvas */
export interface ArbreDiagnostic {
  matiere: string;
  chapitres: ChapitreDiagnostic[];
}
