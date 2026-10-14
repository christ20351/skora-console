import type { Question } from "@/types";

/**
 * Fabrique une question en mélangeant déterministe les choix de réponse
 * (la bonne réponse n'est pas toujours au même endroit).
 */
export function q(
  id: string,
  notionId: string,
  niveau: 1 | 2 | 3 | 4,
  enonce: string,
  bonne: string,
  autres: [string, string, string],
  explication: string
): Question {
  const choix = [bonne, ...autres];
  let seed = [...id].reduce((a, c) => a + c.charCodeAt(0) * 31, 7);
  const rnd = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const choixMelanges = indices.map((i) => choix[i]);
  return {
    id,
    notionId,
    niveau,
    enonce,
    choix: choixMelanges,
    bonneReponse: choixMelanges.indexOf(bonne),
    explication,
  };
}
