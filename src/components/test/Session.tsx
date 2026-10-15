"use client";

import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { notionParId } from "@/data/notions";
import { niveauSuivant } from "@/features/test-adaptatif/moteur";
import { NIVEAUX } from "@/types";
import type { EtapeTest, Niveau, Question } from "@/types";
import { Bouton, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

/** Étape 2 : la session — difficulté qui s'adapte en direct */
export function Session({
  matiere,
  question,
  numero,
  total,
  niveau,
  choix,
  onRepondre,
  onSuivant,
}: {
  matiere: string;
  question: Question;
  numero: number;
  total: number;
  niveau: Niveau;
  /** index choisi pour la question courante, ou null si pas encore répondu */
  choix: number | null;
  onRepondre: (index: number) => void;
  onSuivant: (etape: EtapeTest) => void;
}) {
  const repondu = choix !== null;
  const correct = choix === question.bonneReponse;

  const valider = () => {
    onSuivant({
      questionId: question.id,
      notionId: question.notionId,
      niveauAvant: question.niveau,
      niveauApres: niveauSuivant(question.niveau, correct),
      correct,
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{matiere}</span> · question {numero}/
          {total}
        </div>
        <IndicateurNiveau niveau={niveau} />
      </div>

      <Card className="p-6">
        <p className="mb-1 text-xs font-semibold tracking-wide text-brand-500 uppercase">
          {notionParId(question.notionId).nom} · {NIVEAUX[question.niveau].nom}
        </p>
        <h2 className="text-lg leading-snug font-semibold text-slate-900">{question.enonce}</h2>

        <div className="mt-5 grid gap-2">
          {question.choix.map((c, i) => {
            const estBonne = i === question.bonneReponse;
            const choisie = choix === i;
            return (
              <button
                key={i}
                disabled={repondu}
                onClick={() => onRepondre(i)}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                  !repondu && "border-slate-200 hover:border-brand-300 hover:bg-brand-50/50",
                  repondu && estBonne && "border-emerald-300 bg-emerald-50 text-emerald-800",
                  repondu && choisie && !estBonne && "border-brand-300 bg-brand-50 text-brand-800",
                  repondu && !estBonne && !choisie && "border-slate-100 text-slate-400"
                )}
              >
                {c}
                {repondu && estBonne ? (
                  <CheckCircle2 size={17} className="shrink-0 text-emerald-500" />
                ) : null}
                {repondu && choisie && !estBonne ? (
                  <XCircle size={17} className="shrink-0 text-brand-500" />
                ) : null}
              </button>
            );
          })}
        </div>

        {repondu ? (
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              <span className="font-semibold">
                {correct
                  ? "✓ Bonne réponse — on monte d'un niveau. "
                  : "✗ Raté — on descend d'un niveau. "}
              </span>
              {question.explication}
            </p>
            <div className="mt-3 flex justify-end">
              <Bouton taille="sm" onClick={valider}>
                {numero === total ? "Voir le bilan" : "Question suivante"} <ArrowRight size={14} />
              </Bouton>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

function IndicateurNiveau({ niveau }: { niveau: Niveau }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 text-xs font-medium text-slate-400">Difficulté :</span>
      {([1, 2, 3, 4] as Niveau[]).map((n) => (
        <div
          key={n}
          title={NIVEAUX[n].nom}
          className={cn(
            "flex h-6 w-9 items-center justify-center rounded-md text-xs font-bold transition-colors",
            n === niveau
              ? "bg-brand-500 text-white"
              : n < niveau
                ? "bg-brand-100 text-brand-400"
                : "bg-slate-100 text-slate-400"
          )}
        >
          {NIVEAUX[n].court}
        </div>
      ))}
    </div>
  );
}
