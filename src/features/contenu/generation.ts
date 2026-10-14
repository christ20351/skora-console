import { notionParId, questionsParNotion } from "@/data/notions";
import type { ContenuGenere, Niveau } from "@/types";
import { uid } from "@/lib/utils";

/** Libellé du calibrage affiché sur la fiche */
export function libelleCalibrage(niveau: Niveau): string {
  return {
    1: "Re-découverte de la base",
    2: "Consolidation — niveau de la classe",
    3: "Consolidation avancée",
    4: "Perfectionnement",
  }[niveau];
}

/**
 * Génère une fiche de renfort calibrée sur le niveau auquel l'élève a raté.
 * - essentiel : les points de cours au minimum
 * - exercices : 3 exercices progressifs autour du niveau d'échec
 * - autoCheck : 2 questions flash issues d'autres niveaux
 */
export function genererContenu(opts: {
  eleveId: string;
  notionId: string;
  lacuneId?: string;
  niveauEchec: Niveau;
  contexteUtilise?: string;
}): ContenuGenere {
  const { eleveId, notionId, lacuneId, niveauEchec, contexteUtilise } = opts;
  const notion = notionParId(notionId);
  const pool = questionsParNotion(notionId);

  // Progression : un cran sous l'échec → l'échec → un cran au-dessus
  const planNiveaux: Niveau[] = [
    Math.max(1, niveauEchec - 1) as Niveau,
    niveauEchec,
    Math.min(4, niveauEchec + 1) as Niveau,
  ];
  const utilisees = new Set<string>();
  const exercices: ContenuGenere["exercices"] = [];
  for (const n of planNiveaux) {
    const qu =
      pool.find((p) => p.niveau === n && !utilisees.has(p.id)) ??
      pool.find((p) => !utilisees.has(p.id));
    if (qu) {
      utilisees.add(qu.id);
      exercices.push({ enonce: qu.enonce, correction: qu.explication, niveau: qu.niveau });
    }
  }
  const autoCheck: ContenuGenere["autoCheck"] = pool
    .filter((p) => !utilisees.has(p.id))
    .slice(0, 2)
    .map((p) => ({ question: p.enonce, reponse: p.explication }));

  return {
    id: uid("c"),
    eleveId,
    notionId,
    lacuneId,
    date: new Date().toISOString().slice(0, 10),
    titre: `Renfort — ${notion.nom}`,
    calibreNiveau: niveauEchec,
    essentiel: notion.pointsCles,
    exemple: notion.exemple,
    exercices:
      exercices.length > 0
        ? exercices
        : [
            {
              enonce: notion.exemple.enonce,
              correction: notion.exemple.resolution.join(" "),
              niveau: niveauEchec,
            },
          ],
    autoCheck,
    contexteUtilise,
  };
}

/** Complète une fiche partiellement remplie (mock) depuis les métadonnées de la notion */
export function hydraterContenu(c: import("@/types").ContenuGenere): import("@/types").ContenuGenere {
  if (c.essentiel.length > 0 && c.exercices.length > 0 && c.autoCheck.length > 0) return c;
  const generee = genererContenu({
    eleveId: c.eleveId,
    notionId: c.notionId,
    lacuneId: c.lacuneId,
    niveauEchec: c.calibreNiveau,
    contexteUtilise: c.contexteUtilise,
  });
  return {
    ...generee,
    id: c.id,
    date: c.date,
    titre: c.titre,
    calibreNiveau: c.calibreNiveau,
  };
}

/**
 * Remplit sur place une fiche partiellement vide (données mock) — SANS
 * Date.now/Math.random, pour rester compatible avec le prérendu statique.
 */
export function remplirContenu(
  c: import("@/types").ContenuGenere,
  questions: ReturnType<typeof import("@/data/notions").questionsParNotion>
): import("@/types").ContenuGenere {
  if (c.essentiel.length > 0 && c.exercices.length > 0) return c;
  const notion = notionParId(c.notionId);
  const utilisees = new Set<string>();
  const exercices = questions
    .slice(0, 3)
    .map((qu) => {
      utilisees.add(qu.id);
      return { enonce: qu.enonce, correction: qu.explication, niveau: qu.niveau };
    });
  const autoCheck = questions
    .filter((qu) => !utilisees.has(qu.id))
    .slice(0, 2)
    .map((qu) => ({ question: qu.enonce, reponse: qu.explication }));
  return {
    ...c,
    essentiel: c.essentiel.length ? c.essentiel : notion.pointsCles,
    exemple:
      c.exemple.enonce ? c.exemple : notion.exemple,
    exercices: c.exercices.length ? c.exercices : exercices,
    autoCheck: c.autoCheck.length ? c.autoCheck : autoCheck,
  };
}
