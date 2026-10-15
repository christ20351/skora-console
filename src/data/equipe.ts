import type { Utilisateur } from "@/types";

/** Équipe de la console (utilisateurs et rôles) — pilotée depuis l'onglet Équipe */
export const UTILISATEURS: Utilisateur[] = [
  { id: "u1", nom: "Ferot", role: "admin", fonction: "Coordinateur de l'accompagnement", couleur: "bg-rose-500" },
  { id: "u2", nom: "Adja", role: "animateur", fonction: "Animatrice d'appels", couleur: "bg-violet-500" },
  { id: "u3", nom: "Moussa", role: "animateur", fonction: "Animateur mathématiques", couleur: "bg-emerald-500" },
];
