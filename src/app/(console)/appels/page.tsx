"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { useStore } from "@/store";
import { AppelCard, AppelPlanifieCard } from "@/components/appels/AppelCard";
import { Card, CardHeader, EmptyState } from "@/components/ui";

export default function PageAppels() {
  const { appels, eleves } = useStore();
  const eleveParId = (id: string) => eleves.find((e) => e.id === id);

  const planifies = appels
    .filter((a) => a.statut === "planifie")
    .sort((a, b) => a.date.localeCompare(b.date));
  const passes = appels
    .filter((a) => a.statut === "effectue")
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title={`Appels planifiés (${planifies.length})`}
          subtitle="Élève critique : toutes les 2 semaines · élève élevé : chaque mois"
          icon={<PhoneCall size={17} />}
        />
        {planifies.length === 0 ? (
          <EmptyState
            titre="Aucun appel planifié"
            description="Planifiez depuis la fiche d'un élève, onglet Appels."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {planifies.map((a) => {
              const el = eleveParId(a.eleveId);
              return (
                <AppelPlanifieCard
                  key={a.id}
                  appel={a}
                  eleveNom={el ? `${el.prenom} ${el.nom}` : "Élève inconnu"}
                  lien={
                    el ? (
                      <Link
                        href={`/eleves/${el.id}`}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        Fiche élève
                      </Link>
                    ) : undefined
                  }
                />
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader
          title={`Historique (${passes.length})`}
          subtitle="Chaque appel croise ses déclarations avec les lacunes diagnostiquées"
        />
        <div className="divide-y divide-slate-100">
          {passes.map((a) => {
            const el = eleveParId(a.eleveId);
            return (
              <div key={a.id}>
                <div className="flex items-center gap-3 border-b border-slate-50 px-5 pt-3 text-sm">
                  {el ? (
                    <Link
                      href={`/eleves/${el.id}`}
                      className="font-semibold text-slate-800 hover:text-brand-600"
                    >
                      {el.prenom} {el.nom}
                    </Link>
                  ) : (
                    <span className="font-semibold text-slate-800">Élève inconnu</span>
                  )}
                  <span className="text-xs text-slate-400">
                    {el?.niveauScolaire}
                    {el?.ecole ? ` · ${el.ecole}` : ""}
                  </span>
                </div>
                <AppelCard appel={a} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
