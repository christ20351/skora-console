import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function initiales(prenom: string, nom: string): string {
  return `${prenom[0]}${nom[0]}`.toUpperCase();
}

const MOIS = [
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
