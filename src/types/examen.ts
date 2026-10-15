import type { Matiere } from "./eleve";

export type TypeExamen = "bac-blanc" | "devoir" | "composition" | "interrogation";

export const TYPE_EXAMEN_LABEL: Record<TypeExamen, string> = {
  "bac-blanc": "Bac blanc",
  devoir: "Devoir surveillé",
  composition: "Composition",
  interrogation: "Interrogation écrite",
};

/**
 * Épreuve suivie pour un élève : le fichier source est un Markdown
 * (sujet + barème, et corrigé lorsqu'il est disponible).
 */
export interface Examen {
  id: string;
  eleveId: string;
  matiere: Matiere;
  titre: string;
  type: TypeExamen;
  /** date de l'épreuve */
  date: string;
  trimestre?: string;
  /** note obtenue — undefined tant que la copie n'est pas corrigée */
  note?: number;
  sur?: number;
  /** nom du fichier markdown tel que déposé dans la console */
  fichier: string;
  /** contenu intégral du fichier markdown */
  contenu: string;
  /** membre de l'équipe ayant déposé le fichier */
  deposePar?: string;
}
