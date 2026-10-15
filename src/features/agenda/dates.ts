/** Helpers calendrier (semaines commençant le lundi, tout en ISO "YYYY-MM-DD") */

export const JOURS = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];

/** ISO "YYYY-MM-DD" à partir des composantes locales */
export function iso(annee: number, mois: number, jour: number): string {
  return `${annee}-${String(mois + 1).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
}

/** index du jour de la semaine, 0 = lundi */
export function jourSemaine(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return (new Date(y, m - 1, d).getDay() + 6) % 7;
}

export function ajouterJours(isoDate: string, nb: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d + nb);
  return iso(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Lundi de la semaine contenant `isoDate` */
export function lundiDe(isoDate: string): string {
  return ajouterJours(isoDate, -jourSemaine(isoDate));
}

/** Les 6 semaines (42 jours) couvrant le mois (annee, mois 0-11), lundi → dimanche */
export function grilleMois(annee: number, mois: number): string[][] {
  const premier = new Date(annee, mois, 1);
  const decalage = (premier.getDay() + 6) % 7;
  const lundi = new Date(annee, mois, 1 - decalage);
  return Array.from({ length: 6 }, (_, s) =>
    Array.from({ length: 7 }, (_, j) => {
      const d = new Date(lundi.getFullYear(), lundi.getMonth(), lundi.getDate() + s * 7 + j);
      return iso(d.getFullYear(), d.getMonth(), d.getDate());
    })
  );
}

/** minutes depuis minuit → "HH:mm" */
export function minutesVersHeure(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** "HH:mm" → minutes depuis minuit */
export function heureEnMinutes(heure: string): number {
  const [h, m] = heure.split(":").map(Number);
  return h * 60 + m;
}

export const MOIS_COMPLETS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
