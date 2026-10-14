"use client";

import Link from "next/link";
import { CalendarDays, PhoneCall, Target } from "lucide-react";
import { analyserRisque, AUJOURDHUI } from "@/features/risque";
import { useStore } from "@/store";
import { Avatar, Badge, Card, CardHeader, EmptyState } from "@/components/ui";
import { AppelPlanifieCard } from "@/components/appels/AppelCard";
import { formatDate, joursEntre } from "@/lib/utils";

export default function PageAgenda() {
  const { eleves, appels, lacunes, tests, bulletins } = useStore();
  const eleveParId = (id: string) => eleves.find((e) => e.id === id)!;

  const planifies = appels
    .filter((a) => a.statut === "planifie")
    .sort((a, b) => a.date.localeCompare(b.date));

  // Recommandations : élèves dont la prochaine action est un appel ou un test
  const recommandations = eleves
    .map((e) => ({ eleve: e, risque: analyserRisque(e, lacunes, appels, tests, bulletins) }))
    .filter(({ risque }) => risque.action.type === "appel" || risque.action.type === "test")
    .sort((a, b) => b.risque.score - a.risque.score);

  const semaine = planifies.filter((a) => Math.abs(joursEntre(AUJOURDHUI, a.date)) <= 7);

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="space-y-5 xl:col-span-2">
        <Card>
          <CardHeader
            title="Appels planifiés"
            subtitle="Rappel : élève critique → toutes les 2 semaines · élevé → chaque mois"
            icon={<CalendarDays size={16} />}
          />
          {planifies.length === 0 ? (
            <EmptyState
              titre="Rien de planifié"
              description="Planifiez depuis la fiche d'un élève, onglet Appels."
              icon={<PhoneCall size={26} />}
            />
          ) : (
            <div className="divide-y divide-white/50">
              {planifies.map((a) => {
                const el = eleveParId(a.eleveId);
                return (
                  <AppelPlanifieCard
                    key={a.id}
                    appel={a}
                    eleveNom={el ? `${el.prenom} ${el.nom}` : "—"}
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
            title="Recommandés maintenant"
            subtitle="Élèves dont la prochaine action recommandée est un appel ou un premier test"
            icon={<Target size={16} />}
          />
          {recommandations.length === 0 ? (
            <EmptyState titre="Tout est à jour" description="Aucune action urgente recommandée." />
          ) : (
            <div className="divide-y divide-white/50">
              {recommandations.map(({ eleve, risque }) => (
                <Link
                  key={eleve.id}
                  href={risque.action.type === "test" ? `/diagnostics?eleve=${eleve.id}` : `/eleves/${eleve.id}`}
                  className="flex flex-wrap items-center gap-3 px-5 py-3 transition-colors hover:bg-white/50"
                >
                  <Avatar prenom={eleve.prenom} nom={eleve.nom} couleur={eleve.couleur} taille="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {eleve.prenom} {eleve.nom}
                      <span className="ml-2 text-xs font-normal text-slate-400">
                        {eleve.niveauScolaire}
                      </span>
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      Score {risque.score} ·{" "}
                      {risque.matierePrioritaire
                        ? `${risque.matierePrioritaire.matiere} (${risque.matierePrioritaire.note}/${risque.matierePrioritaire.sur})`
                        : "—"}
                    </p>
                  </div>
                  <Badge
                    className={
                      risque.action.type === "appel"
                        ? "bg-sky-400/15 text-sky-600"
                        : "bg-violet-400/15 text-violet-600"
                    }
                  >
                    {risque.action.type === "appel" ? <PhoneCall size={11} /> : <Target size={11} />}
                    {risque.action.libelle}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-violet-500/15 via-brand-500/10 to-amber-400/15 px-5 py-5">
            <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
              Cette semaine
            </p>
            <p className="mt-2 text-3xl font-bold text-ink">{semaine.length}</p>
            <p className="text-xs text-slate-500">appel(s) planifié(s) à ± 7 jours</p>
          </div>
          <div className="divide-y divide-white/50">
            {semaine.length === 0 ? (
              <p className="px-5 py-4 text-sm text-slate-400">Semaine calme.</p>
            ) : (
              semaine.map((a) => {
                const el = eleveParId(a.eleveId);
                return (
                  <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="rounded-lg bg-brand-400/15 px-2 py-1 text-[11px] font-bold text-brand-600">
                      {formatDate(a.date)}
                    </span>
                    <span className="truncate text-sm text-slate-700">
                      {el ? `${el.prenom} ${el.nom}` : "—"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Cadence recommandée" icon={<PhoneCall size={16} />} />
          <div className="space-y-2.5 px-5 py-4 text-sm text-slate-600">
            <p className="flex justify-between"><span>Risque critique</span><span className="font-bold text-brand-600">toutes les 2 semaines</span></p>
            <p className="flex justify-between"><span>Risque élevé</span><span className="font-bold text-orange-500">chaque mois</span></p>
            <p className="flex justify-between"><span>Modéré / vigilant</span><span className="font-bold text-slate-600">ponctuel</span></p>
            <p className="mt-3 rounded-xl bg-white/55 p-3 text-xs leading-relaxed text-slate-500">
              Un appel sans nouvelle lacune traitée = un signal à creuser : motivation, contexte familial, méthode.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
