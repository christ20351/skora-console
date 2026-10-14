"use client";

import { RadarMaitrise } from "@/components/charts";
import { maitriseParNotion } from "@/features/risque";
import { notionParId } from "@/data/notions";
import { useStore } from "@/store";
import { Bulletin } from "./Bulletin";
import { PlanAccompagnement } from "./PlanAccompagnement";
import { Card, CardHeader } from "@/components/ui";
import type { Eleve } from "@/types";

/** Onglet Synthèse : bulletin priorisé + radar de maîtrise + plan */
export function OngletSynthese({ eleve }: { eleve: Eleve }) {
  const { lacunes, tests, bulletins } = useStore();
  const radar = maitriseParNotion(
    tests.filter((t) => t.eleveId === eleve.id),
    lacunes.filter((l) => l.eleveId === eleve.id)
  ).map(({ notionId, maitrise }) => ({ label: notionParId(notionId).nom, valeur: maitrise }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Bulletin eleveId={eleve.id} />
      <div className="space-y-6">
        <Card>
          <CardHeader
            title="Maîtrise par notion (tests adaptatifs)"
            subtitle="Plus la zone rouge est petite, plus la notion est fragile"
          />
          <div className="py-2">
            {radar.length >= 3 ? (
              <RadarMaitrise donnees={radar} />
            ) : (
              <p className="px-5 py-8 text-center text-sm text-slate-400">
                Pas encore assez de notions testées pour tracer le radar — faites passer un test
                adaptatif.
              </p>
            )}
          </div>
        </Card>
        <PlanAccompagnement eleve={eleve} />
      </div>
    </div>
  );
}
