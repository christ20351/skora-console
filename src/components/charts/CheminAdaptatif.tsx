"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { notionParId } from "@/data/notions";
import { NIVEAUX } from "@/types";
import type { TestAdaptatif } from "@/types";
import { cn } from "@/lib/utils";

/** Le chemin adaptatif question par question : la difficulté qui monte/descend */
export function CheminAdaptatif({ test }: { test: TestAdaptatif }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {test.etapes.map((e, i) => {
        const notion = notionParId(e.notionId);
        const nom = notion.nom.length > 18 ? notion.nom.slice(0, 17) + "…" : notion.nom;
        return (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 ? <span className="text-slate-300">→</span> : null}
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2 py-1",
                e.correct ? "border-emerald-200 bg-emerald-50" : "border-brand-200 bg-brand-50"
              )}
              title={`${nom} — ${NIVEAUX[e.niveauAvant].nom}${
                e.correct ? " ✓" : " ✗ → " + NIVEAUX[e.niveauApres].nom
              }`}
            >
              {e.correct ? (
                <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
              ) : (
                <XCircle size={13} className="shrink-0 text-brand-500" />
              )}
              <span className="text-xs font-medium text-slate-700">{nom}</span>
              <span
                className={cn(
                  "rounded px-1 py-0.5 text-xs font-bold",
                  e.correct ? "bg-emerald-100 text-emerald-600" : "bg-brand-100 text-brand-600"
                )}
              >
                {NIVEAUX[e.niveauAvant].court}
              </span>
              {!e.correct ? (
                <span className="text-xs font-semibold text-brand-400">
                  ↓ {NIVEAUX[e.niveauApres].court}
                </span>
              ) : e.niveauApres > e.niveauAvant ? (
                <span className="text-xs font-semibold text-emerald-500">
                  ↑ {NIVEAUX[e.niveauApres].court}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
