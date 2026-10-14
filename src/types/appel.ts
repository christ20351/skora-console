export type TypeAppel = "diagnostic" | "suivi-renfort" | "parent";
export type Sentiment = "positif" | "neutre" | "preoccupant";

export interface Appel {
  id: string;
  eleveId: string;
  /** ISO date ; statut planifié si dans le futur */
  date: string;
  dureeMin: number;
  animateur: string;
  type: TypeAppel;
  sentiment: Sentiment;
  resume: string;
  /** thèmes abordés */
  points: string[];
  /** ce que l'élève déclare ne pas comprendre (noms de notions) */
  declarations: string[];
  prochaineEtape: string;
  statut: "effectue" | "planifie";
  motif?: string;
}

export const TYPE_APPEL_LABEL: Record<TypeAppel, string> = {
  diagnostic: "Diagnostic",
  "suivi-renfort": "Suivi du renfort",
  parent: "Parent",
};

export const SENTIMENT_LABEL: Record<Sentiment, string> = {
  positif: "Positif",
  neutre: "Neutre",
  preoccupant: "Préoccupant",
};
