/** Utilisateurs de la console et leurs rôles */
export type Role = "admin" | "animateur";

export interface Utilisateur {
  id: string;
  /** nom utilisé comme clé d'assignation des visios (RendezVous.assigneA) */
  nom: string;
  role: Role;
  fonction: string;
  couleur: string;
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  animateur: "Animateur",
};

/** Description des droits, affichée dans l'agenda */
export const ROLE_AIDE: Record<Role, string> = {
  admin: "Voit tous les rendez-vous, les assigne et les replanifie.",
  animateur: "Ne voit que les rendez-vous qui lui sont assignés.",
};

/** Matrice des droits concrète, affichée dans l'onglet Équipe */
export const PERMISSIONS: { label: string; roles: Role[] }[] = [
  { label: "Consulter l'annuaire de l'équipe", roles: ["admin", "animateur"] },
  { label: "Mener ses visios et lire les notes Meet", roles: ["admin", "animateur"] },
  { label: "Voir tous les rendez-vous de l'agenda", roles: ["admin"] },
  { label: "Assigner et replanifier les visios", roles: ["admin"] },
  { label: "Gérer l'équipe — inviter, changer les rôles, retirer", roles: ["admin"] },
];

export const permissionsDe = (role: Role) =>
  PERMISSIONS.filter((p) => p.roles.includes(role)).map((p) => p.label);
