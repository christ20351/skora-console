"use client";

import { useState } from "react";
import { MessageSquare, Sparkles, Target } from "lucide-react";
import { notionParId } from "@/data/notions";
import { NIVEAU_PAR_SEVERITE } from "@/types";
import type { Lacune } from "@/types";
import { useStore } from "@/store";
import {
  Badge,
  BadgeSeverite,
  BadgeStatutLacune,
  Bouton,
  Card,
  CardHeader,
  EmptyState,
  ProgressBar,
} from "@/components/ui";
import { Sparkline } from "@/components/charts";
import { GenerationFlow } from "@/components/generation";
import { formatDate } from "@/lib/utils";

/** Onglet Lacunes : diagnostics, sévérité, progression, génération de renfort */
export function OngletLacunes({ eleveId }: { eleveId: string }) {
  const { lacunes, appels } = useStore();
  const [generation, setGeneration] = useState<Lacune | null>(null);
  const miennes = lacunes.filter((l) => l.eleveId === eleveId);
  const actives = miennes.filter((l) => l.statut !== "resolue");
  const resolues = miennes.filter((l) => l.statut === "resolue");

  /** contexte repris de l'appel où l'élève a déclaré cette notion */
  const contextePour = (l: Lacune) => {
    const nom = notionParId(l.notionId).nom;
    const appel = appels.find(
      (a) => a.eleveId === eleveId && a.statut === "effectue" && a.declarations.includes(nom)
    );
    return appel ? `Contexte repris de l'appel du ${formatDate(appel.date)}` : undefined;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title={`Lacunes diagnostiquées (${actives.length})`}
          subtitle="Sévérité = niveau le plus bas auquel la notion a été ratée lors des tests adaptatifs"
          icon={<Target size={17} />}
        />
        {actives.length === 0 ? (
          <EmptyState
            titre="Aucune lacune active"
            description="Faites passer un test adaptatif pour diagnostiquer les notions fragiles."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {actives.map((l) => {
              const notion = notionParId(l.notionId);
              return (
                <div key={l.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{notion.nom}</span>
                      <Badge className="bg-slate-50">{notion.matiere}</Badge>
                      <BadgeSeverite severite={l.severite} />
                      <BadgeStatutLacune statut={l.statut} />
                      {l.confirmeOral ? (
                        <Badge className="bg-violet-50 text-violet-600">
                          <MessageSquare size={11} /> Confirmée à l'oral
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Origine : {l.origineTestIds.join(", ")} · maîtrise {l.maitrisePct} %
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <ProgressBar
                        valeur={l.maitrisePct}
                        couleur={l.maitrisePct >= 60 ? "bg-emerald-500" : "bg-brand-500"}
                      />
                    </div>
                    <Sparkline valeurs={l.historique.map((h) => h.maitrisePct)} />
                    <Bouton
                      taille="sm"
                      onClick={() => setGeneration(l)}
                      disabled={l.statut === "renfort" || l.statut === "amelioration"}
                    >
                      <Sparkles size={13} />
                      {l.statut === "detectee" ? "Générer le renfort" : "Renfort en cours"}
                    </Bouton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {resolues.length > 0 ? (
        <Card>
          <CardHeader
            title={`Lacunes résolues (${resolues.length})`}
            subtitle="La preuve que l'accompagnement fonctionne"
          />
          <div className="flex flex-wrap gap-2 px-5 py-4">
            {resolues.map((l) => (
              <Badge key={l.id} className="bg-emerald-50 text-emerald-600">
                {notionParId(l.notionId).nom} · {l.maitrisePct} %
              </Badge>
            ))}
          </div>
        </Card>
      ) : null}

      {generation ? (
        <GenerationFlow
          ouvert
          onClose={() => setGeneration(null)}
          eleveId={eleveId}
          notionId={generation.notionId}
          lacuneId={generation.id}
          niveauEchec={NIVEAU_PAR_SEVERITE[generation.severite] as 1 | 2 | 3 | 4}
          contexteUtilise={contextePour(generation)}
        />
      ) : null}
    </div>
  );
}
