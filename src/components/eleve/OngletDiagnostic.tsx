"use client";

import { useMemo } from "react";
import { Network } from "lucide-react";
import { chapitresParMatiere, MATIERES_GRILLE } from "@/data/notions/graphe";
import type { ChapitreGrille } from "@/data/notions/graphe";
import { notionParId } from "@/data/notions";
import { Card, CardHeader } from "@/components/ui";
import { CanvasDiagnostic } from "@/components/diagnostic/CanvasDiagnostic";
import { pctNote } from "@/features/risque/scores";
import { useStore } from "@/store";
import { ORDRE_GRAVITE_STATUT } from "@/types";
import type {
  ArbreDiagnostic,
  Bulletin,
  ChapitreDiagnostic,
  Eleve,
  Lacune,
  NotionDiagnostic,
  StatutNotion,
  TestAdaptatif,
} from "@/types";

/** Dernière ligne de bulletin connue pour une matière (sinon undefined) */
function bulletinPour(
  bulletins: Record<string, Bulletin[]>,
  eleveId: string,
  matiere: string
) {
  const bs = bulletins[eleveId];
  if (!bs?.length) return undefined;
  for (let i = bs.length - 1; i >= 0; i--) {
    const l = bs[i].lignes.find((x) => x.matiere === matiere);
    if (l) return l;
  }
  return undefined;
}

/** Statut déduit de la note de bulletin (analyse du profil, sans test) */
function statutDepuisPct(pct: number): StatutNotion {
  if (pct >= 55) return "acquise";
  if (pct >= 40) return "fragile";
  return "critique";
}

/** Une notion de la banque : statut mesuré (test/lacune) sinon estimé (bulletin) */
function notionDeBanque(
  notionId: string,
  eleve: Eleve,
  lacunes: Lacune[],
  tests: TestAdaptatif[],
  pctBulletin: number | null
): NotionDiagnostic {
  const notion = notionParId(notionId);
  const lacune = lacunes.find((l) => l.eleveId === eleve.id && l.notionId === notionId);

  if (lacune) {
    let statut: StatutNotion;
    if (lacune.statut === "resolue") statut = "acquise";
    else if (lacune.statut === "renfort" || lacune.statut === "amelioration")
      statut = "en-cours";
    else
      statut =
        lacune.severite === "critique" || lacune.severite === "elevee"
          ? "critique"
          : "fragile";
    return {
      id: notionId,
      nom: notion.nom,
      statut,
      maitrisePct: lacune.maitrisePct,
      severite: lacune.severite,
      confirmeOral: lacune.confirmeOral,
      pointsCles: notion.pointsCles,
      piege: notion.piege,
    };
  }

  /* Pas de lacune : le test a-t-il déjà évalué cette notion ? */
  const etapesNotion = tests
    .filter((t) => t.eleveId === eleve.id)
    .flatMap((t) => t.etapes)
    .filter((e) => e.notionId === notionId);
  if (etapesNotion.length > 0) {
    const pct = Math.round(
      (etapesNotion.filter((e) => e.correct).length / etapesNotion.length) * 100
    );
    return { id: notionId, nom: notion.nom, statut: statutDepuisPct(pct), maitrisePct: pct };
  }

  /* Rien de mesuré : estimation d'après le bulletin */
  return {
    id: notionId,
    nom: notion.nom,
    statut: pctBulletin != null ? statutDepuisPct(pctBulletin) : "non-evaluee",
    maitrisePct: pctBulletin,
    estimee: pctBulletin != null,
    pointsCles: notion.pointsCles,
    piege: notion.piege,
  };
}

/** Les chapitres d'une matière transformés en nœuds diagnostiqués */
function construireArbre(
  matiere: string,
  eleve: Eleve,
  lacunes: Lacune[],
  tests: TestAdaptatif[],
  bulletins: Record<string, Bulletin[]>
): ArbreDiagnostic {
  const ligne = bulletinPour(bulletins, eleve.id, matiere);
  const pctBulletin = ligne ? Math.round(pctNote(ligne)) : null;

  const chapitres: ChapitreDiagnostic[] = chapitresParMatiere(matiere).map(
    (c: ChapitreGrille) => {
      const notions: NotionDiagnostic[] = [
        ...c.notionIds.map((id) =>
          notionDeBanque(id, eleve, lacunes, tests, pctBulletin)
        ),
        ...c.notionsBase.map(
          (nom): NotionDiagnostic => ({
            nom,
            statut: pctBulletin != null ? statutDepuisPct(pctBulletin) : "non-evaluee",
            maitrisePct: pctBulletin,
            estimee: pctBulletin != null,
          })
        ),
      ];
      const evalues = notions.filter((n) => n.maitrisePct != null);
      const statut = notions.reduce(
        (pire, n) =>
          ORDRE_GRAVITE_STATUT[n.statut] > ORDRE_GRAVITE_STATUT[pire] ? n.statut : pire,
        notions[0].statut
      );
      return {
        id: c.id,
        nom: c.nom,
        prerequis: c.prerequis,
        notions,
        statut,
        maitrisePct: evalues.length
          ? Math.round(evalues.reduce((s, n) => s + (n.maitrisePct ?? 0), 0) / evalues.length)
          : null,
      };
    }
  );

  return { matiere, chapitres };
}

/** Onglet Diagnostic : arbre des savoirs de l'apprenant, reconstruit
 *  lors de l'analyse de son profil (bulletins · tests adaptatifs · appels) */
export function OngletDiagnostic({ eleve }: { eleve: Eleve }) {
  const { lacunes, tests, bulletins } = useStore();

  const arbres = useMemo(
    () => MATIERES_GRILLE.map((m) => construireArbre(m, eleve, lacunes, tests, bulletins)),
    [eleve, lacunes, tests, bulletins]
  );

  const stats = useMemo(() => {
    const toutes = arbres.flatMap((a) => a.chapitres.flatMap((c) => c.notions));
    const par = (s: StatutNotion) => toutes.filter((n) => n.statut === s).length;
    return {
      total: toutes.length,
      acquises: par("acquise"),
      enCours: par("en-cours"),
      fragiles: par("fragile"),
      critiques: par("critique"),
      nonEvaluees: par("non-evaluee"),
    };
  }, [arbres]);

  return (
    <Card>
      <CardHeader
        title="Arbre des savoirs"
        subtitle={`Chaque matière a son propre arbre, rangé des bases vers les notions avancées selon les dépendances entre chapitres. Statuts issus de l'analyse du profil de ${eleve.prenom} : bulletins, tests adaptatifs et appels.`}
        icon={<Network size={17} />}
        action={
          <div className="hidden flex-wrap items-center justify-end gap-1.5 text-xs font-semibold sm:flex">
            <Puce couleur="bg-emerald-500" label={`${stats.acquises} acquises`} />
            {stats.enCours > 0 ? (
              <Puce couleur="bg-violet-500" label={`${stats.enCours} en renfort`} />
            ) : null}
            {stats.fragiles > 0 ? (
              <Puce couleur="bg-amber-500" label={`${stats.fragiles} fragiles`} />
            ) : null}
            {stats.critiques > 0 ? (
              <Puce couleur="bg-rose-500" label={`${stats.critiques} critiques`} />
            ) : null}
            {stats.nonEvaluees > 0 ? (
              <Puce couleur="bg-slate-300" label={`${stats.nonEvaluees} non évaluées`} />
            ) : null}
          </div>
        }
      />
      <div className="p-3">
        <CanvasDiagnostic arbres={arbres} />
        <p className="mt-2 px-1 text-xs text-slate-400">
          Une arête relie chaque chapitre à ses prérequis : une arête ambrée ou
          rouge signale une base fragilisée qui bloque la suite du parcours.
        </p>
      </div>
    </Card>
  );
}

function Puce({ couleur, label }: { couleur: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-200/70">
      <span className={`h-2 w-2 rounded-full ${couleur}`} />
      <span className="text-slate-500">{label}</span>
    </span>
  );
}
