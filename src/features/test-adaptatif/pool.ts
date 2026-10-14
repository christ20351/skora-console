import { QUESTIONS } from "@/data/notions";
import { notionParId } from "@/data/notions";
import type { Question } from "@/types";

/** Questions disponibles pour un test adaptatif sur une matière donnée. */
export function questionsParMatiereImpl(matiere: string): Question[] {
  return QUESTIONS.filter((qu) => notionParId(qu.notionId).matiere === matiere);
}
