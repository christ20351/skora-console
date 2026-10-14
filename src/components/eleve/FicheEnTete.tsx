"use client";

import Link from "next/link";
import { ArrowRight, Printer, Target } from "lucide-react";
import { analyserRisque } from "@/features/risque";
import { useStore } from "@/store";
import { Avatar, BadgeRisque, Bouton, Card, ProgressBar } from "@/components/ui";
import { JaugeRisque, Tendance } from "@/components/charts";
import type { Eleve } from "@/types";

const AXES = [
  { cle: "bulletin", label: "Bulletin", poids: "40 %" },
  { cle: "lacunes", label: "Lacunes", poids: "40 %" },
  { cle: "contexte", label: "Contexte (appels)", poids: "20 %" },
] as const;

/** En-tête de la fiche élève : identité, score de risque, axes, prochaine action */
export function FicheEnTete({ eleve }: { eleve: Eleve }) {
  const { lacunes, appels, tests, bulletins } = useStore();
  const risque = analyserRisque(eleve, lacunes, appels, tests, bulletins);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start gap-5">
        <Avatar prenom={eleve.prenom} nom={eleve.nom} couleur={eleve.couleur} taille="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {eleve.prenom} {eleve.nom}
            </h2>
            <BadgeRisque label={risque.label} />
            <Tendance t={risque.tendance} />
          </div>
          <p className="mt-0.5 text-sm text-slate-500">
            {eleve.niveauScolaire}
            {eleve.ecole ? ` · ${eleve.ecole}` : ""}
            {eleve.age ? ` · ${eleve.age} ans` : ""}
          </p>

          {/* Axes du score */}
          <div className="mt-4 grid max-w-xl gap-2">
            {AXES.map((a) => (
              <div key={a.cle} className="flex items-center gap-3">
                <span className="w-36 text-xs font-medium text-slate-500">
                  {a.label} <span className="text-slate-300">({a.poids})</span>
                </span>
                <ProgressBar valeur={risque.axes[a.cle]} />
                <span className="w-8 text-right text-xs font-bold text-slate-600">
                  {risque.axes[a.cle]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <JaugeRisque score={risque.score} taille={84} />
          <span className="text-xs font-medium text-slate-400">Score de risque</span>
        </div>
      </div>

      {/* Matière prioritaire + actions */}
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-3.5">
        <div className="min-w-0 flex-1 text-sm">
          <span className="font-medium text-slate-500">On priorise : </span>
          {risque.matierePrioritaire ? (
            <>
              <span className="font-bold text-brand-600">
                {risque.matierePrioritaire.matiere} (
                {risque.matierePrioritaire.note}/{risque.matierePrioritaire.sur})
              </span>
              <span className="text-slate-500">
                {" "}
                — la note la plus basse du bulletin ({risque.matierePrioritaire.trimestre}).
              </span>
            </>
          ) : (
            <span className="text-slate-400">aucun bulletin saisi</span>
          )}
        </div>
        <Link href={`/diagnostics?eleve=${eleve.id}`}>
          <Bouton taille="sm" variant="secondaire">
            <Target size={14} /> Faire passer un test
          </Bouton>
        </Link>
        <Link href={`/impression/${eleve.id}`}>
          <Bouton taille="sm">
            <Printer size={14} /> Cahier de renfort (PDF)
          </Bouton>
        </Link>
      </div>

      {/* Prochaine action recommandée */}
      <Link
        href={
          risque.action.type === "test"
            ? "/test-adaptatif"
            : risque.action.type === "appel"
              ? `/eleves/${eleve.id}`
              : `/eleves/${eleve.id}`
        }
        className="mt-3 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-700 transition-colors hover:bg-brand-100"
      >
        <span className="font-semibold">Prochaine action recommandée :</span>
        {risque.action.libelle}
        <ArrowRight size={14} className="ml-auto" />
      </Link>
    </Card>
  );
}
