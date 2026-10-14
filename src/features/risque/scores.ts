import { BULLETINS } from "@/data/mock";
import { notionParId } from "@/data/notions";
import type {
  AnalyseRisque,
  Bulletin,
  Appel,
  BulletinLigne,
  Eleve,
  Lacune,
  Tendance,
} from "@/types";
import { AUJOURDHUI } from "@/lib/constantes";
import { joursEntre } from "@/lib/utils";

/** minuscule + sans accents, pour croiser déclarations orales et notions */
export function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** note/sur → % */
export function pctNote(l: BulletinLigne): number {
  return (l.note / l.sur) * 100;
}

/** Ligne du bulletin avec la note normalisée la plus basse (dernier trimestre) */
export function matierePrioritaire(
  eleve: Eleve,
  bulletins: Record<string, Bulletin[]> = BULLETINS
): (BulletinLigne & { trimestre: string }) | undefined {
  const b = bulletins[eleve.id];
  if (!b?.length) return undefined;
  const dernier = b[b.length - 1];
  return [...dernier.lignes]
    .sort((a, b) => pctNote(a) - pctNote(b))
    .map((l) => ({ ...l, trimestre: dernier.trimestre }))
    .at(0);
}

/** Axe bulletin (0–100) : pire note + moyenne basse + chute inter-trimestres */
export function axeBulletin(eleve: Eleve, bulletins: Record<string, Bulletin[]> = BULLETINS): number {
  const b = bulletins[eleve.id];
  if (!b?.length) return 40;
  const dernier = b[b.length - 1];
  const pire = Math.min(...dernier.lignes.map(pctNote));
  let gravite = 100 - pire;

  const moyenne = dernier.lignes.reduce((s, l) => s + pctNote(l), 0) / dernier.lignes.length;
  if (moyenne < 50) gravite += 8;

  if (b.length >= 2) {
    const precedent = b[b.length - 2];
    const moyPrec =
      precedent.lignes.reduce((s, l) => s + pctNote(l), 0) / precedent.lignes.length;
    if (moyPrec - moyenne > 3) gravite += 10;
  }
  return Math.min(100, gravite);
}

/** Axe lacunes (0–100) : somme pondérée des sévérités (+3 si confirmée à l'oral) */
export function axeLacunes(lacunes: Lacune[]): number {
  const actives = lacunes.filter((l) => l.statut !== "resolue");
  const score = actives.reduce(
    (s, l) => s + { critique: 15, elevee: 10, moderee: 5, legere: 2 }[l.severite] + (l.confirmeOral ? 3 : 0),
    0
  );
  return Math.min(100, score);
}

/** Axe contexte humain (0–100) : sentiment du dernier appel + angles morts */
export function axeContexte(appels: Appel[], lacunes: Lacune[]): number {
  if (appels.length === 0) return 40; // contexte inconnu = vigilance modérée
  const derniers = [...appels]
    .filter((a) => a.statut === "effectue")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2);
  if (derniers.length === 0) return 40;
  const base = { preoccupant: 70, neutre: 35, positif: 10 }[derniers[0].sentiment];
  const couvertes = new Set(lacunes.map((l) => normalise(notionParId(l.notionId).nom)));
  const angleMort = derniers.some((a) =>
    a.declarations.some((d) => !couvertes.has(normalise(d)))
  );
  return Math.min(100, base + (angleMort ? 10 : 0));
}

/** Évolution de la maîtrise : hausse si ≥ +5 pts entre 1er et dernier relevé */
export function tendance(lacunes: Lacune[]): Tendance {
  const avecHisto = lacunes.filter((l) => l.historique.length >= 2);
  if (avecHisto.length === 0) return "stable";
  const deltas = avecHisto.map(
    (l) => l.historique.at(-1)!.maitrisePct - l.historique[0].maitrisePct
  );
  const moyenne = deltas.reduce((s, d) => s + d, 0) / deltas.length;
  if (moyenne >= 5) return "hausse";
  if (moyenne <= -5) return "baisse";
  return "stable";
}

/** Jours écoulés depuis le dernier appel réalisé */
export function joursDepuisDernierAppel(appels: Appel[]): number {
  const dernier = [...appels]
    .filter((a) => a.statut === "effectue")
    .sort((a, b) => b.date.localeCompare(a.date))
    .at(0);
  return dernier ? joursEntre(dernier.date, AUJOURDHUI) : Infinity;
}

export type { AnalyseRisque };
