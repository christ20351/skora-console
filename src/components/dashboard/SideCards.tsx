"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, FileWarning } from "lucide-react";
import { analyserRisque, lacunesParMatiere } from "@/features/risque";
import { useStore } from "@/store";
import { Avatar, Card, CardHeader } from "@/components/ui";
import { JaugeRisque, Tendance } from "@/components/charts";
import { cn, formatDate } from "@/lib/utils";

/** Répartition des lacunes actives par matière */
export function LacunesMatiere() {
  const { lacunes } = useStore();
  const parMatiere = lacunesParMatiere(lacunes);
  const max = Math.max(1, ...parMatiere.map((p) => p.nb));
  const teintes = [
    "from-rose-400 to-brand-600",
    "from-violet-400 to-violet-600",
    "from-sky-400 to-blue-500",
    "from-amber-400 to-orange-500",
    "from-emerald-400 to-teal-500",
    "from-fuchsia-400 to-purple-500",
    "from-indigo-400 to-blue-600",
  ];

  return (
    <Card>
      <CardHeader
        title="Lacunes par matière"
        subtitle="Où se concentrent les difficultés"
        icon={<FileWarning size={16} />}
      />
      <div className="space-y-3.5 px-5 py-4">
        {parMatiere.map(({ matiere, nb }, i) => (
          <div key={matiere}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">{matiere}</span>
              <span className="font-bold text-ink">{nb}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/60 ring-1 ring-white/70">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r", teintes[i % teintes.length])}
                style={{ width: `${(nb / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Panneau « spotlight » : l'élève à accompagner en premier */
export function Spotlight() {
  const { eleves, lacunes, appels, tests, bulletins } = useStore();
  const [prioritaire] = eleves
    .map((e) => ({ eleve: e, risque: analyserRisque(e, lacunes, appels, tests, bulletins) }))
    .sort((a, b) => b.risque.score - a.risque.score);

  return (
    <Card className="overflow-hidden border-white/50 !p-0">
      <div className="relative bg-gradient-to-br from-violet-500/15 via-brand-500/10 to-amber-400/15 px-5 pt-5 pb-4">
        <p className="text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">
          Priorité n°1
        </p>
        <div className="mt-3 flex items-center gap-4">
          <JaugeRisque score={prioritaire.risque.score} taille={70} />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-ink">
              {prioritaire.eleve.prenom} {prioritaire.eleve.nom}
            </p>
            <p className="text-xs text-slate-500">
              {prioritaire.eleve.niveauScolaire}
              {prioritaire.eleve.ecole ? ` · ${prioritaire.eleve.ecole}` : ""}
            </p>
            <div className="mt-1.5">
              <Tendance t={prioritaire.risque.tendance} />
            </div>
          </div>
        </div>
        <p className="mt-3 rounded-xl bg-white/55 px-3 py-2 text-xs leading-relaxed text-slate-600 backdrop-blur">
          Prochaine action :{" "}
          <span className="font-semibold text-brand-600">{prioritaire.risque.action.libelle}</span>
        </p>
      </div>
      <Link
        href={`/eleves/${prioritaire.eleve.id}`}
        className="group flex items-center justify-between border-t border-white/60 px-5 py-3 text-sm font-semibold text-brand-600 transition-colors hover:bg-white/50"
      >
        Ouvrir le plan d'accompagnement
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </Card>
  );
}

/** Appels planifiés à venir */
export function AppelsAVenir() {
  const { appels, eleves } = useStore();
  const planifies = appels
    .filter((a) => a.statut === "planifie")
    .sort((a, b) => a.date.localeCompare(b.date));
  const eleveParId = (id: string) => eleves.find((e) => e.id === id)!;

  return (
    <Card>
      <CardHeader
        title="Appels à venir"
        subtitle="Le contexte humain derrière les chiffres"
        icon={<CalendarClock size={16} />}
      />
      <div className="divide-y divide-white/50">
        {planifies.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-slate-400">Aucun appel planifié.</p>
        ) : (
          planifies.slice(0, 3).map((a) => {
            const el = eleveParId(a.eleveId);
            return (
              <Link
                key={a.id}
                href={`/eleves/${a.eleveId}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/50"
              >
                <Avatar prenom={el.prenom} nom={el.nom} couleur={el.couleur} taille="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {el.prenom} {el.nom}
                  </p>
                  <p className="truncate text-xs text-slate-400">{a.motif}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-brand-400/15 px-2 py-1 text-xs font-bold text-brand-600">
                  {formatDate(a.date)}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </Card>
  );
}
