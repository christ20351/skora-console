import type { BulletinLigne } from "./eleve";

export type LabelRisque = "Critique" | "Élevé" | "Modéré" | "Vigilance";
export type TypeAction = "test" | "contenu" | "appel" | "ok";
export type Tendance = "hausse" | "stable" | "baisse";

export interface ProchaineAction {
  type: TypeAction;
  libelle: string;
  /** id d'élément ciblé : notionId, matière… selon le type */
  cible?: string;
}

export interface AnalyseRisque {
  score: number;
  label: LabelRisque;
  axes: { bulletin: number; lacunes: number; contexte: number };
  tendance: Tendance;
  /** ligne du bulletin avec la note normalisée la plus basse */
  matierePrioritaire?: BulletinLigne & { trimestre: string };
  action: ProchaineAction;
}
