export type Matiere =
  | "Mathématiques"
  | "Physique-Chimie"
  | "SVT"
  | "Français"
  | "Anglais"
  | "Histoire-Géo"
  | "ECM";

export interface BulletinLigne {
  matiere: Matiere;
  note: number;
  sur: number;
  /** moyenne de la classe sur la même matière (informative, optionnelle) */
  moyenneClasse?: number;
}

export interface Bulletin {
  trimestre: string;
  lignes: BulletinLigne[];
}

export interface Eleve {
  id: string;
  prenom: string;
  nom: string;
  /** "2nde", "1ère D", "Tle C"… — lycée uniquement */
  niveauScolaire: string;
  /** informatif uniquement — les élèves ne sont pas regroupés par école */
  ecole?: string;
  age?: number;
  inscritLe: string;
  couleur: string;
}

/** Palette d'avatars pour les nouveaux élèves (rotation) */
export const COULEURS_AVATAR = [
  "bg-rose-500",
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-fuchsia-500",
];

export const MATIERES: Matiere[] = [
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "Français",
  "Anglais",
  "Histoire-Géo",
  "ECM",
];
