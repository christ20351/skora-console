"use client";

import { GraduationCap, Play, Target } from "lucide-react";
import { MATIERES_TESTABLES } from "@/data/notions";
import { Avatar, Bouton, Card } from "@/components/ui";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

/** Étape 1 : choisir l'élève et la matière à diagnostiquer */
export function Configuration({
  eleveId,
  matiere,
  onSelect,
  onDemarrer,
}: {
  eleveId: string | null;
  matiere: string | null;
  onSelect: (eleveId: string, matiere: string) => void;
  onDemarrer: () => void;
}) {
  const { eleves } = useStore();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
            <Target size={20} />
          </span>
          <div>
            <h2 className="font-bold text-slate-900">Diagnostic par test adaptatif</h2>
            <p className="mt-1 text-sm text-slate-500">
              L'élève démarre au <strong>niveau standard</strong>. Il réussit → la difficulté
              augmente. Il rate → elle diminue. Chaque question est taguée par notion : à la fin, on
              recense tout ce qui a été raté et à quel niveau — c'est ça qui crée les lacunes.
            </p>
          </div>
        </div>

        <p className="mt-6 mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
          1. Qui passe le test ?
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {eleves.map((e) => (
            <button
              key={e.id}
              onClick={() => onSelect(e.id, matiere ?? MATIERES_TESTABLES[0])}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                eleveId === e.id
                  ? "border-brand-400 bg-brand-50 ring-1 ring-brand-200"
                  : "border-slate-200 hover:bg-slate-50"
              )}
            >
              <Avatar prenom={e.prenom} nom={e.nom} couleur={e.couleur} taille="sm" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {e.prenom} {e.nom}
                </p>
                <p className="text-xs text-slate-400">{e.niveauScolaire}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
          2. Quelle matière ?
        </p>
        <div className="flex flex-wrap gap-2">
          {MATIERES_TESTABLES.map((m) => (
            <button
              key={m}
              disabled={!eleveId}
              onClick={() => eleveId && onSelect(eleveId, m)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors disabled:opacity-40",
                matiere === m
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Bouton disabled={!eleveId || !matiere} onClick={onDemarrer}>
            <Play size={14} /> Commencer le test (8 questions)
          </Bouton>
        </div>
      </Card>

      <p className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <GraduationCap size={14} /> Démo pensée pour être jouée en live devant l'école.
      </p>
    </div>
  );
}
