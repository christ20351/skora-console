"use client";

import { ArrowDown, ArrowUp, Target } from "lucide-react";
import { NIVEAUX, reussitePct } from "@/types";
import type { TestAdaptatif } from "@/types";
import { useStore } from "@/store";
import { Card, CardHeader, EmptyState } from "@/components/ui";
import { CheminAdaptatif } from "@/components/charts";
import { cn, formatDate } from "@/lib/utils";

/** Onglet Tests : l'historique des tests adaptatifs et leur chemin */
export function OngletTests({ eleveId }: { eleveId: string }) {
  const { tests } = useStore();
  const miens = tests
    .filter((t) => t.eleveId === eleveId)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (miens.length === 0) {
    return (
      <Card>
        <CardHeader title="Tests adaptatifs" icon={<Target size={17} />} />
        <EmptyState
          titre="Aucun test passé"
          description="Le test adaptatif départ au niveau standard : raté → difficulté réduite, réussi → augmentée."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {miens.map((t) => (
        <CarteTest key={t.id} test={t} />
      ))}
    </div>
  );
}

function CarteTest({ test }: { test: TestAdaptatif }) {
  const pct = reussitePct(test);
  const variation = test.niveauFinal - test.niveauInitial;
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
        <div>
          <span className="font-semibold text-slate-900">{test.matiere}</span>
          <span className="ml-2 text-sm text-slate-400">
            {formatDate(test.date)} · {test.dureeMin} min · {test.etapes.length} questions
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
            Niveau : {NIVEAUX[test.niveauInitial].nom} → {NIVEAUX[test.niveauFinal].nom}
          </span>
          {variation !== 0 ? (
            variation > 0 ? (
              <span className="flex items-center font-bold text-emerald-600">
                <ArrowUp size={13} /> +{variation}
              </span>
            ) : (
              <span className="flex items-center font-bold text-brand-500">
                <ArrowDown size={13} /> {variation}
              </span>
            )
          ) : null}
          <span
            className={cn(
              "rounded-full px-2.5 py-1 font-bold",
              pct >= 60
                ? "bg-emerald-50 text-emerald-600"
                : pct >= 40
                  ? "bg-amber-50 text-amber-600"
                  : "bg-brand-50 text-brand-600"
            )}
          >
            {pct} % réussite
          </span>
        </div>
      </div>
      <div className="px-5 py-4">
        <CheminAdaptatif test={test} />
      </div>
    </Card>
  );
}
