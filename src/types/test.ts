/** 1 = Renfort (bases) · 2 = Standard (niveau de la classe) · 3 = Avancé · 4 = Expert */
export type Niveau = 1 | 2 | 3 | 4;

export const NIVEAUX: Record<Niveau, { nom: string; court: string }> = {
  1: { nom: "Renfort", court: "N1" },
  2: { nom: "Standard", court: "N2" },
  3: { nom: "Avancé", court: "N3" },
  4: { nom: "Expert", court: "N4" },
};

export interface Notion {
  id: string;
  matiere: string;
  nom: string;
  /** Rappel de cours (l'essentiel) */
  pointsCles: string[];
  /** Exemple guidé résolu */
  exemple: { enonce: string; resolution: string[] };
  /** L'erreur classique commise sur cette notion */
  piege: string;
  /** true si la banque de questions permet un test adaptatif jouable */
  testDisponible: boolean;
}

export interface Question {
  id: string;
  notionId: string;
  niveau: Niveau;
  enonce: string;
  choix: string[];
  bonneReponse: number;
  explication: string;
}

export interface EtapeTest {
  questionId: string;
  notionId: string;
  niveauAvant: Niveau;
  niveauApres: Niveau;
  correct: boolean;
}

export interface TestAdaptatif {
  id: string;
  eleveId: string;
  matiere: string;
  date: string;
  dureeMin: number;
  niveauInitial: Niveau;
  niveauFinal: Niveau;
  etapes: EtapeTest[];
}

export function reussitePct(t: TestAdaptatif): number {
  if (t.etapes.length === 0) return 0;
  return Math.round((t.etapes.filter((e) => e.correct).length / t.etapes.length) * 100);
}

export function notionsRatees(t: TestAdaptatif): string[] {
  return [...new Set(t.etapes.filter((e) => !e.correct).map((e) => e.notionId))];
}
