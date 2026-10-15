import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function initiales(prenom: string, nom: string): string {
  return `${prenom[0]}${nom[0]}`.toUpperCase();
}

export const MOIS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

/** "2026-10-09" → "9 oct. 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MOIS[m - 1]} ${y}`;
}

/** "2026-10-09" → "9 oct." */
export function formatDateCourte(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MOIS[m - 1]}`;
}

/** "2026-10" → "oct." */
export function libelleMois(ym: string): string {
  return MOIS[Number(ym.slice(5, 7)) - 1];
}

/** Les `nb` derniers mois jusqu'à la référence incluse : "2026-05" … "2026-10" */
export function fenetreMois(reference: string, nb = 6): string[] {
  const y = Number(reference.slice(0, 4));
  const m = Number(reference.slice(5, 7));
  return Array.from({ length: nb }, (_, i) =>
    new Date(Date.UTC(y, m - 1 - (nb - 1 - i), 1)).toISOString().slice(0, 7)
  );
}

const JOURS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

/** "2026-10-14" → "mer. 14" */
export function libelleJour(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return `${JOURS[d.getDay()]} ${d.getDate()}`;
}

/** Les `nb` derniers jours jusqu'à la référence incluse (ISO) */
export function fenetreJours(reference: string, nb = 7): string[] {
  const ref = new Date(reference + "T12:00:00").getTime();
  return Array.from(
    { length: nb },
    (_, i) => new Date(ref - (nb - 1 - i) * 86400000).toISOString().slice(0, 10)
  );
}

export interface SemaineFenetre {
  /** lundi de la semaine (ISO) */
  debut: string;
  /** dimanche de la semaine (ISO) */
  fin: string;
  /** numéro de semaine ISO, ex. "S42" */
  label: string;
}

function numeroSemaineIso(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7) + 3); // jeudi de la semaine
  const premierJanvier = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return 1 + Math.round((d.getTime() - premierJanvier.getTime()) / (7 * 86400000));
}

/** Les `nb` dernières semaines (lundi → dimanche) jusqu'à celle de la référence */
export function fenetreSemaines(reference: string, nb = 6): SemaineFenetre[] {
  const ref = new Date(reference + "T12:00:00");
  const lundiRef = new Date(ref.getTime() - ((ref.getDay() + 6) % 7) * 86400000);
  return Array.from({ length: nb }, (_, i) => {
    const debut = new Date(lundiRef.getTime() - (nb - 1 - i) * 7 * 86400000);
    const fin = new Date(debut.getTime() + 6 * 86400000);
    return {
      debut: debut.toISOString().slice(0, 10),
      fin: fin.toISOString().slice(0, 10),
      label: `S${numeroSemaineIso(debut)}`,
    };
  });
}

/** Nombre de jours entre deux dates ISO */
export function joursEntre(a: string, b: string): number {
  const da = new Date(a + "T12:00:00").getTime();
  const db = new Date(b + "T12:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

/** Date du jour (côté client) au format ISO */
export function aujourdhuiIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function pct(v: number): string {
  return `${Math.round(v)} %`;
}
