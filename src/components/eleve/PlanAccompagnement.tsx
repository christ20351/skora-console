"use client";

import { Check, Circle, ListChecks } from "lucide-react";
import { analyserRisque, matierePrioritaire } from "@/features/risque";
import { useStore } from "@/store";
import { Card, CardHeader } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Eleve } from "@/types";

/** Le plan d'accompagnement en 4 étapes, avec l'état de chaque étape */
export function PlanAccompagnement({ eleve }: { eleve: Eleve }) {
  const { lacunes, appels, tests, contenus, bulletins } = useStore();
  const risque = analyserRisque(eleve, lacunes, appels, tests, bulletins);
  const matiere = matierePrioritaire(eleve, bulletins)?.matiere;

  const etapes = [
    {
      label: "Bulletin saisi à la main",
      detail: "Le point de départ : on repère les notes les plus basses.",
      fait: true,
    },
    {
      label: `Test adaptatif ${matiere ? `de ${matiere}` : ""}`.trim(),
      detail: "Départ au niveau standard ; raté → difficulté réduite, réussi → augmentée.",
      fait: tests.some((t) => (matiere ? t.matiere === matiere : true)),
    },
    {
      label: "Fiches de renfort générées",
      detail: "Une fiche calibrée par lacune, avec exercices et corrigés.",
      fait:
        contenus.some((c) => c.eleveId === eleve.id) ||
        lacunes.some((l) => l.eleveId === eleve.id && l.statut !== "detectee"),
    },
    {
      label: "Appels de suivi",
      detail: "Comprendre le contexte, tenir la motivation, ajuster le plan.",
      fait: appels.some((a) => a.eleveId === eleve.id && a.statut === "effectue"),
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Plan d'accompagnement"
        subtitle="Le circuit complet de l'élève chez nous"
        icon={<ListChecks size={17} />}
      />
      <ol className="space-y-0 px-5 py-4">
        {etapes.map((e, i) => (
          <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
            {i < etapes.length - 1 ? (
              <span
                className={cn(
                  "absolute top-6 left-[11px] h-full w-px",
                  e.fait ? "bg-brand-300" : "bg-slate-200"
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                e.fait ? "bg-brand-500 text-white" : "border border-slate-300 bg-white text-slate-300"
              )}
            >
              {e.fait ? <Check size={13} /> : <Circle size={7} fill="currentColor" />}
            </span>
            <div>
              <p className={cn("text-sm font-semibold", e.fait ? "text-slate-800" : "text-slate-400")}>
                {e.label}
              </p>
              <p className="text-xs text-slate-400">{e.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
        Priorité actuelle : {risque.action.libelle} — déduite du bulletin, des tests et des appels.
      </p>
    </Card>
  );
}
