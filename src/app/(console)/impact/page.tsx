"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, Sparkles, TrendingUp, Trophy } from "lucide-react";
import { notionParId } from "@/data/notions";
import { lacunesParMatiere, reussitePct } from "@/features/risque";
import { useStore } from "@/store";
import { Card, CardHeader, ProgressBar } from "@/components/ui";
import { Sparkline } from "@/components/charts";
import { formatDate } from "@/lib/utils";

/** Rapport à présenter à l'établissement : la preuve chiffrée de l'impact */
export default function PageImpact() {
  const { eleves, lacunes, tests, contenus } = useStore();

  const enProgres = lacunes.filter((l) => l.statut === "amelioration" || l.statut === "resolue");
  const avecHistoire = enProgres.filter((l) => l.historique.length >= 2);
  const gainMoyen = avecHistoire.length
    ? Math.round(
        avecHistoire.reduce((s, l) => s + (l.historique.at(-1)!.maitrisePct - l.historique[0].maitrisePct), 0) /
          avecHistoire.length
      )
    : 0;
  const maitriseMoy = Math.round(
    lacunes.reduce((s, l) => s + l.maitrisePct, 0) / Math.max(1, lacunes.length)
  );
  const reussite = Math.round(tests.reduce((s, t) => s + reussitePct(t), 0) / Math.max(1, tests.length));

  const parMatiere = lacunesParMatiere(lacunes);
  const maitriseParMatiere = parMatiere.map(({ matiere }) => {
    const ids = lacunes.filter((l) => l.statut !== "resolue" && notionParId(l.notionId).matiere === matiere);
    return {
      matiere,
      maitrise: Math.round(ids.reduce((s, l) => s + l.maitrisePct, 0) / Math.max(1, ids.length)),
      nb: ids.length,
    };
  });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Tuile icon={TrendingUp} label="Gain de maîtrise moyen" valeur={`+${gainMoyen} pts`} note="sur les lacunes retravaillées" tile="from-emerald-400 to-teal-500" />
        <Tuile icon={Trophy} label="Lacunes en progrès ou résolues" valeur={`${enProgres.length}/${lacunes.length}`} note="depuis le début du suivi" tile="from-rose-400 to-brand-600" />
        <Tuile icon={GraduationCap} label="Réussite moyenne aux tests" valeur={`${reussite} %`} note={`${tests.length} tests adaptatifs`} tile="from-violet-400 to-indigo-500" />
        <Tuile icon={Sparkles} label="Fiches de renfort générées" valeur={`${contenus.length}`} note={`pour ${eleves.length} élèves`} tile="from-amber-400 to-orange-500" />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Maîtrise actuelle par matière"
            subtitle="Moyenne des lacunes actives — plus la barre monte, plus le renfort porte ses fruits"
            icon={<TrendingUp size={16} />}
          />
          <div className="space-y-4 px-5 py-5">
            {maitriseParMatiere.map(({ matiere, maitrise, nb }) => (
              <div key={matiere}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-slate-700">
                    {matiere} <span className="text-xs font-normal text-slate-400">({nb} lacune{nb > 1 ? "s" : ""})</span>
                  </span>
                  <span className="font-bold text-ink">{maitrise} %</span>
                </div>
                <ProgressBar
                  valeur={maitrise}
                  couleur={maitrise >= 60 ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-rose-400 to-brand-600"}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Réussites en cours"
            subtitle="Ces notions remontent — la boucle fonctionne"
            icon={<Trophy size={16} />}
          />
          <div className="divide-y divide-white/50">
            {avecHistoire.slice(0, 5).map((l) => {
              const el = eleves.find((e) => e.id === l.eleveId);
              const delta = l.historique.at(-1)!.maitrisePct - l.historique[0].maitrisePct;
              return (
                <Link key={l.id} href={`/eleves/${l.eleveId}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/50">
                  <Sparkline valeurs={l.historique.map((h) => h.maitrisePct)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {el?.prenom} · {notionParId(l.notionId).nom}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(l.historique[0].date)} → {formatDate(l.historique.at(-1)!.date)}
                    </p>
                  </div>
                  <span className="rounded-lg bg-emerald-400/15 px-2 py-1 text-xs font-bold text-emerald-600">
                    +{delta} pts
                  </span>
                  <ArrowRight size={14} className="text-slate-300" />
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Ce qu'on présente à l'école"
          subtitle="Le message en une phrase, appuyé par les chiffres ci-dessus"
          icon={<Sparkles size={16} />}
        />
        <p className="px-5 py-5 text-sm leading-relaxed text-slate-600">
          « Chaque élève est diagnostiqué par un test qui s'adapte à son niveau réel, compris dans son contexte
          grâce à des appels d'accompagnement, puis renforcé par des fiches générées précisément sur SES lacunes.
          Résultat mesuré :{" "}
          <span className="font-bold text-brand-600">+{gainMoyen} points de maîtrise</span> en moyenne sur les
          notions retravaillées, et {enProgres.length} lacunes déjà en progression ou résolues sur les{" "}
          {lacunes.length} diagnostiquées. »
        </p>
      </Card>
    </div>
  );
}

function Tuile({
  icon: Icon,
  label,
  valeur,
  note,
  tile,
}: {
  icon: typeof Sparkles;
  label: string;
  valeur: string;
  note: string;
  tile: string;
}) {
  return (
    <div className="glass glass-hover p-4">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-[0_8px_18px_-8px_rgba(70,40,110,0.5)] bg-gradient-to-br ${tile}`}>
          <Icon size={16} />
        </span>
        <span className="text-[11px] leading-4 font-semibold text-slate-500">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-ink">{valeur}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{note}</p>
    </div>
  );
}
