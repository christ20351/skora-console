import type { Notion, Question } from "@/types";
import { NOTIONS_MATHS, QUESTIONS_MATHS } from "./maths";
import { NOTIONS_LANGUES, QUESTIONS_LANGUES } from "./langues";
import { NOTIONS_SCIENCES, QUESTIONS_SCIENCES } from "./sciences";
import { NOTIONS_SOCIETES, QUESTIONS_SOCIETES } from "./societes";

export const NOTIONS: Notion[] = [
  ...NOTIONS_MATHS,
  ...NOTIONS_LANGUES,
  ...NOTIONS_SCIENCES,
  ...NOTIONS_SOCIETES,
];

export const QUESTIONS: Question[] = [
  ...QUESTIONS_MATHS,
  ...QUESTIONS_LANGUES,
  ...QUESTIONS_SCIENCES,
  ...QUESTIONS_SOCIETES,
];

export const notionParId = (id: string): Notion => {
  const n = NOTIONS.find((x) => x.id === id);
  if (!n) throw new Error(`Notion inconnue : ${id}`);
  return n;
};

export const notionsParMatiere = (matiere: string): Notion[] =>
  NOTIONS.filter((n) => n.matiere === matiere);

export const questionParId = (id: string): Question | undefined =>
  QUESTIONS.find((qu) => qu.id === id);

export const questionsParNotion = (notionId: string): Question[] =>
  QUESTIONS.filter((qu) => qu.notionId === notionId);

/** Matières couvertes par le test adaptatif jouable */
export const MATIERES_TESTABLES = [
  ...new Set(NOTIONS.filter((n) => n.testDisponible).map((n) => n.matiere)),
];
