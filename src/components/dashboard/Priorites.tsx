"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, PhoneCall, Sparkles, Target, Users } from "lucide-react";
import { analyserRisque } from "@/features/risque";
import { useStore } from "@/store";
import { BadgeRisque, Bouton, Card, CardHeader } from "@/components/ui";
import { JaugeRisque, Tendance } from "@/components/charts";
import { cn } from "@/lib/utils";
import type { TypeAction } from "@/types";

const ACTION_ICON: Record<TypeAction, typeof Target> = {
  test: Target,
  contenu: Sparkles,
  appel: PhoneCall,
  ok: BookOpenCheck,
};

export function Priorites() {
  const { eleves, lacunes, appels, tests, bulletins } = useStore();

  const analyses = eleves
    .map((eleve) => ({
      eleve,
      risque: analyserRisque(eleve, lacunes, appels, tests, bulletins),
    }))
    .sort((a, b) => b.risque.score - a.risque.score);

  return (
    <Card className="xl:col-span-2">
      <CardHeader
        title="Priorités d'accompagnement"
        subtitle="Score de risque = bulletin (40 %) + lacunes (40 %) + contexte des appels (20 %)"
        icon={<Users size={16} />}
        action={
          <Link href="/eleves">
            <Bouton variant="secondaire" taille="sm">
              Tous <ArrowRight size={13} />
            </Bouton>
          </Link>
        }
      />
      <div className="divide-y divide-white/50">
        {analyses.slice(0, 5).map(({ eleve, risque }) => {
          const Icone = ACTION_ICON[risque.action.type];
          return (
            <Link
              key={eleve.id}
              href={`/eleves/${eleve.id}`}
              className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/50"
            >
              <JaugeRisque score={risque.score} taille={54} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-ink">
                    {eleve.prenom} {eleve.nom}
                  </span>
                  <BadgeRisque label={risque.label} />
                  <Tendance t={risque.tendance} />
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {eleve.niveauScolaire}
                  {eleve.ecole ? ` · ${eleve.ecole}` : ""} · priorité :{" "}
                  <span className="font-semibold text-brand-600">
                    {risque.matierePrioritaire
                      ? `${risque.matierePrioritaire.matiere} (${risque.matierePrioritaire.note}/${risque.matierePrioritaire.sur})`
                      : "—"}
                  </span>
                </p>
              </div>
              <div
                className={cn(
                  "hidden items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold backdrop-blur md:flex",
                  risque.action.type === "ok"
                    ? "bg-emerald-400/15 text-emerald-600 ring-1 ring-emerald-300/40"
                    : "bg-white/60 text-slate-600 ring-1 ring-white/70"
                )}
              >
                <Icone size={13} />
                {risque.action.libelle}
              </div>
              <ArrowRight
                size={15}
                className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-500"
              />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
