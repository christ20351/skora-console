"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Users } from "lucide-react";
import { analyserRisque, pctNote } from "@/features/risque";
import { useStore } from "@/store";
import { Avatar, BadgeRisque, Card, EmptyState } from "@/components/ui";
import { JaugeRisque, Tendance } from "@/components/charts";
import { cn } from "@/lib/utils";

const FILTRES = ["tous", "Critique", "Élevé", "Modéré", "Vigilance"] as const;

export default function PageEleves() {
  const { eleves, lacunes, appels, tests, bulletins } = useStore();
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState<(typeof FILTRES)[number]>("tous");

  const lignes = useMemo(
    () =>
      eleves
        .map((eleve) => ({
          eleve,
          risque: analyserRisque(eleve, lacunes, appels, tests, bulletins),
        }))
        .filter(({ eleve }) =>
          `${eleve.prenom} ${eleve.nom} ${eleve.ecole ?? ""} ${eleve.niveauScolaire}`
            .toLowerCase()
            .includes(recherche.toLowerCase())
        )
        .filter(({ risque }) => filtre === "tous" || risque.label === filtre)
        .sort((a, b) => b.risque.score - a.risque.score),
    [eleves, recherche, filtre, lacunes, appels, tests, bulletins]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un élève, une école…"
            className="glass-soft w-full rounded-xl py-2.5 pr-3 pl-9 text-sm outline-none placeholder:text-slate-400 focus:bg-white/75 focus:ring-2 focus:ring-brand-300/50"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTRES.map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold backdrop-blur transition-all",
                filtre === f
                  ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_6px_18px_-6px_rgba(220,53,69,0.5)]"
                  : "glass-soft text-slate-600 hover:bg-white/75"
              )}
            >
              {f === "tous" ? "Tous" : f}
            </button>
          ))}
        </div>
        <p className="ml-auto text-xs text-slate-400">Triés par score de risque décroissant</p>
      </div>

      <Card>
        {lignes.length === 0 ? (
          <EmptyState
            titre="Aucun élève trouvé"
            description="Ajustez la recherche ou les filtres, ou inscrivez un nouvel élève."
            icon={<Users size={28} />}
          />
        ) : (
          <div className="divide-y divide-white/50">
            {lignes.map(({ eleve, risque }) => (
              <LigneEleve
                key={eleve.id}
                eleveId={eleve.id}
                risque={risque}
                nbLacunes={
                  lacunes.filter((l) => l.eleveId === eleve.id && l.statut !== "resolue").length
                }
                critiques={
                  lacunes.filter(
                    (l) =>
                      l.eleveId === eleve.id &&
                      l.severite === "critique" &&
                      l.statut !== "resolue"
                  ).length
                }
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function LigneEleve({
  eleveId,
  risque,
  nbLacunes,
  critiques,
}: {
  eleveId: string;
  risque: ReturnType<typeof analyserRisque>;
  nbLacunes: number;
  critiques: number;
}) {
  const { eleves } = useStore();
  const eleve = eleves.find((e) => e.id === eleveId)!;

  return (
    <Link
      href={`/eleves/${eleveId}`}
      className="group flex flex-wrap items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/50"
    >
      <JaugeRisque score={risque.score} taille={54} />
      <Avatar prenom={eleve.prenom} nom={eleve.nom} couleur={eleve.couleur} />
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
          {eleve.ecole ? ` · ${eleve.ecole}` : ""}
        </p>
      </div>

      <div className="hidden w-44 sm:block">
        <p className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
          Matière prioritaire
        </p>
        {risque.matierePrioritaire ? (
          <p className="mt-0.5 text-sm">
            <span
              className={cn(
                "font-semibold",
                pctNote(risque.matierePrioritaire) < 50 ? "text-brand-600" : "text-slate-700"
              )}
            >
              {risque.matierePrioritaire.matiere}
            </span>{" "}
            <span className="text-slate-500">
              {risque.matierePrioritaire.note}/{risque.matierePrioritaire.sur}
            </span>
          </p>
        ) : (
          <p className="text-sm text-slate-400">—</p>
        )}
      </div>

      <div className="hidden w-32 md:block">
        <p className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">Lacunes</p>
        <p className="mt-0.5 text-sm text-slate-700">
          <span className={cn("font-bold", critiques > 0 && "text-brand-600")}>{nbLacunes}</span>
          {critiques > 0 ? ` dont ${critiques} critique${critiques > 1 ? "s" : ""}` : ""}
        </p>
      </div>

      <div className="hidden max-w-44 flex-1 lg:block">
        <p className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
          Prochaine action
        </p>
        <p
          className={cn(
            "mt-0.5 truncate text-xs font-semibold",
            risque.action.type === "ok" ? "text-emerald-600" : "text-slate-600"
          )}
        >
          {risque.action.libelle}
        </p>
      </div>

      <ArrowRight
        size={15}
        className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-500"
      />
    </Link>
  );
}
