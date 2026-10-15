import type { Sentiment, TypeAppel } from "./appel";

/** Rendez-vous Meet (visio / session en face de l'apprenant) */
export type StatutRdv = "a-venir" | "termine" | "annule";

export const STATUT_RDV_LABEL: Record<StatutRdv, string> = {
  "a-venir": "À venir",
  termine: "Terminé",
  annule: "Annulé",
};

/** Notes de visio générées par Google Meet (« Prendre des notes pour moi ») */
export interface ResumeMeet {
  /** résumé global de l'échange */
  texte: string;
  /** thèmes abordés */
  pointsCles: string[];
  /** ce que l'élève déclare ne pas comprendre */
  declarations: string[];
  prochaineEtape: string;
  sentiment: Sentiment;
  dureeReelleMin: number;
}

export interface RendezVous {
  id: string;
  eleveId: string;
  /** objet de la session */
  sujet: string;
  type: TypeAppel;
  /** ISO date "YYYY-MM-DD" */
  date: string;
  /** "HH:mm" */
  heure: string;
  dureeMin: number;
  /** personne assignée à la visio — chaîne vide si personne */
  assigneA: string;
  /** admin ayant créé ou assigné la visio */
  assignePar?: string;
  statut: StatutRdv;
  /** id de l'événement dans Google Calendar (source de vérité des dates) */
  googleEventId?: string;
  /** lien de la salle Google Meet */
  meetLink?: string;
  /** conférence Meet — sert de clé pour transcription et notes */
  conferenceId?: string;
  /** notes Meet disponibles une fois la visio passée */
  resumeMeet?: ResumeMeet;
}
