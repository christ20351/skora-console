import type { Niveau } from "./test";

export interface ContenuGenere {
  id: string;
  eleveId: string;
  notionId: string;
  lacuneId?: string;
  date: string;
  titre: string;
  /** niveau auquel l'élève a raté → calibre la fiche */
  calibreNiveau: Niveau;
  essentiel: string[];
  exemple: { enonce: string; resolution: string[] };
  exercices: { enonce: string; correction: string; niveau: Niveau }[];
  autoCheck: { question: string; reponse: string }[];
  /** contexte humain réutilisé (issu des appels) */
  contexteUtilise?: string;
}
