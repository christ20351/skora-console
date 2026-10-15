"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
} from "lucide-react";
import { analyserRisque, pctNote } from "@/features/risque";
import { useStore } from "@/store";
import { Avatar, BadgeRisque, Card, EmptyState } from "@/components/ui";
import { Tendance } from "@/components/charts";
import { SheetApprenant } from "@/components/eleve/SheetApprenant";
import type { ApprenantSelectionne } from "@/components/eleve/SheetApprenant";
import { cn, formatDate } from "@/lib/utils";
import type { Eleve, LabelRisque, Lacune, Severite } from "@/types";

const PAR_PAGE = 10;

const PRIORITES: ("toutes" | LabelRisque)[] = [
  "toutes",
  "Critique",
  "Élevé",
  "Modéré",
  "Vigilance",
];

const FILTRES_LACUNES = [
  { valeur: "toutes", label: "Toutes" },
  { valeur: "avec", label: "Avec lacunes" },
  { valeur: "sans", label: "Sans lacune" },
  { valeur: "critique", label: "≥ 1 critique" },
] as const;
type FiltreLacunes = (typeof FILTRES_LACUNES)[number]["valeur"];

/** 2nde < 1ère < Tle — ordre de progression dans le lycée */
function rangNiveau(n: string): number {
  if (n.startsWith("2nde")) return 0;
  if (n.startsWith("1è")) return 1;
  if (n.startsWith("Tle")) return 2;
  return 3;
}

interface LigneApprenant {
  eleve: Eleve;
  risque: ReturnType<typeof analyserRisque>;
  lacunesActives: Lacune[];
  parSeverite: Record<Severite, number>;
}

export default function PageApprenants() {
  const { eleves, lacunes, appels, tests, bulletins } = useStore();
  const [recherche, setRecherche] = useState("");
  const [niveau, setNiveau] = useState("tous");
  const [priorite, setPriorite] = useState<"toutes" | LabelRisque>("toutes");
  const [filtreLacunes, setFiltreLacunes] = useState<FiltreLacunes>("toutes");
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useState<ApprenantSelectionne | null>(null);

  const lignes = useMemo<LigneApprenant[]>(
    () =>
      eleves.map((eleve) => {
        const duEleve = lacunes.filter((l) => l.eleveId === eleve.id);
        const lacunesActives = duEleve.filter((l) => l.statut !== "resolue");
        const parSeverite: Record<Severite, number> = {
          critique: 0,
          elevee: 0,
          moderee: 0,
          legere: 0,
        };
        for (const l of lacunesActives) parSeverite[l.severite] += 1;
        return {
          eleve,
          risque: analyserRisque(eleve, lacunes, appels, tests, bulletins),
          lacunesActives,
          parSeverite,
        };
      }),
    [eleves, lacunes, appels, tests, bulletins]
  );

  const niveaux = useMemo(
    () =>
      [...new Set(eleves.map((e) => e.niveauScolaire))].sort(
        (a, b) =>
          rangNiveau(a) - rangNiveau(b) || a.localeCompare(b, "fr", { numeric: true })
      ),
    [eleves]
  );

  const filtrees = useMemo(
    () =>
      lignes
        .filter(({ eleve }) =>
          `${eleve.prenom} ${eleve.nom} ${eleve.ecole ?? ""} ${eleve.niveauScolaire}`
            .toLowerCase()
            .includes(recherche.toLowerCase())
        )
        .filter(({ eleve }) => niveau === "tous" || eleve.niveauScolaire === niveau)
        .filter(({ risque }) => priorite === "toutes" || risque.label === priorite)
        .filter(({ lacunesActives, parSeverite }) => {
          if (filtreLacunes === "avec") return lacunesActives.length > 0;
          if (filtreLacunes === "sans") return lacunesActives.length === 0;
          if (filtreLacunes === "critique") return parSeverite.critique > 0;
          return true;
        })
        .sort((a, b) => b.risque.score - a.risque.score),
    [lignes, recherche, niveau, priorite, filtreLacunes]
  );

  const nbPages = Math.max(1, Math.ceil(filtrees.length / PAR_PAGE));
  const pageSure = Math.min(page, nbPages);
  const visibles = filtrees.slice((pageSure - 1) * PAR_PAGE, pageSure * PAR_PAGE);
  const pages = pagesVoisines(pageSure, nbPages);

  return (
    <div className="space-y-4">
      {/* ── Recherche + filtres ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            value={recherche}
            onChange={(e) => {
              setRecherche(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un apprenant, une école…"
            className="glass-soft w-full rounded-xl py-2.5 pr-3 pl-9 text-sm outline-none placeholder:text-slate-400 focus:bg-white/75 focus:ring-2 focus:ring-brand-300/50"
          />
        </div>

        <select
          value={niveau}
          onChange={(e) => {
            setNiveau(e.target.value);
            setPage(1);
          }}
          aria-label="Filtrer par niveau d'étude"
          className="glass-soft cursor-pointer rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:bg-white/75 focus:ring-2 focus:ring-brand-300/50"
        >
          <option value="tous">Tous niveaux</option>
          {niveaux.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <select
          value={priorite}
          onChange={(e) => {
            setPriorite(e.target.value as "toutes" | LabelRisque);
            setPage(1);
          }}
          aria-label="Filtrer par priorité"
          className="glass-soft cursor-pointer rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:bg-white/75 focus:ring-2 focus:ring-brand-300/50"
        >
          {PRIORITES.map((p) => (
            <option key={p} value={p}>
              {p === "toutes" ? "Toutes priorités" : p}
            </option>
          ))}
        </select>

        <select
          value={filtreLacunes}
          onChange={(e) => {
            setFiltreLacunes(e.target.value as FiltreLacunes);
            setPage(1);
          }}
          aria-label="Filtrer par lacunes"
          className="glass-soft cursor-pointer rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:bg-white/75 focus:ring-2 focus:ring-brand-300/50"
        >
          {FILTRES_LACUNES.map((f) => (
            <option key={f.valeur} value={f.valeur}>
              {f.valeur === "toutes" ? "Lacunes : toutes" : f.label}
            </option>
          ))}
        </select>

        <p className="ml-auto text-xs text-slate-400">
          {filtrees.length} apprenant{filtrees.length > 1 ? "s" : ""} · triés par priorité
        </p>
      </div>

      {/* ── Tableau ── */}
      <Card>
        {filtrees.length === 0 ? (
          <EmptyState
            titre="Aucun apprenant trouvé"
            description="Ajustez la recherche ou les filtres, ou inscrivez un nouvel apprenant."
            icon={<Users size={28} />}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/70 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                    <th className="px-5 py-3 font-bold">Apprenant</th>
                    <th className="px-3 py-3 font-bold">Niveau</th>
                    <th className="px-3 py-3 font-bold">Priorité</th>
                    <th className="px-3 py-3 font-bold">Lacunes</th>
                    <th className="px-3 py-3 font-bold">Matière prioritaire</th>
                    <th className="px-3 py-3 font-bold">Tendance</th>
                    <th className="px-3 py-3 font-bold">Inscrit le</th>
                    <th className="w-10 px-3 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70">
                  {visibles.map((ligne) => (
                    <LigneTable
                      key={ligne.eleve.id}
                      ligne={ligne}
                      onOuvrir={() => setSelection(ligne)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 px-5 py-3">
              <p className="text-xs text-slate-500">
                {(pageSure - 1) * PAR_PAGE + 1}–
                {Math.min(pageSure * PAR_PAGE, filtrees.length)} sur {filtrees.length}{" "}
                apprenant{filtrees.length > 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(pageSure - 1)}
                  disabled={pageSure === 1}
                  aria-label="Page précédente"
                  className="glass-soft rounded-lg p-1.5 text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  <ChevronLeft size={15} />
                </button>
                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "min-w-8 rounded-lg px-2 py-1.5 text-xs font-semibold backdrop-blur transition-all",
                      p === pageSure
                        ? "btn-brand"
                        : "glass-soft text-slate-600 hover:bg-white hover:-translate-y-0.5"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(pageSure + 1)}
                  disabled={pageSure === nbPages}
                  aria-label="Page suivante"
                  className="glass-soft rounded-lg p-1.5 text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* ── Sheet profil de l'apprenant sélectionné ── */}
      <SheetApprenant selection={selection} onClose={() => setSelection(null)} />
    </div>
  );
}

/** Fenêtre glissante de numéros de page (max 5) */
function pagesVoisines(courante: number, total: number): number[] {
  const debut = Math.max(1, Math.min(courante - 2, total - 4));
  const fin = Math.min(total, debut + 4);
  return Array.from({ length: fin - debut + 1 }, (_, i) => debut + i);
}

function LigneTable({
  ligne,
  onOuvrir,
}: {
  ligne: LigneApprenant;
  onOuvrir: () => void;
}) {
  const { eleve, risque, lacunesActives, parSeverite } = ligne;
  const critiques = parSeverite.critique;

  return (
    <tr
      onClick={onOuvrir}
      aria-haspopup="dialog"
      className="group cursor-pointer transition-colors hover:bg-slate-50"
    >
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar prenom={eleve.prenom} nom={eleve.nom} couleur={eleve.couleur} taille="sm" />
          <div className="min-w-0">
            <p className="truncate font-bold text-ink">
              {eleve.prenom} {eleve.nom}
            </p>
            <p className="truncate text-xs text-slate-400">{eleve.ecole ?? "—"}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 font-medium text-slate-600">{eleve.niveauScolaire}</td>
      <td className="px-3 py-3">
        <BadgeRisque label={risque.label} />
      </td>
      <td className="px-3 py-3">
        <p className="font-semibold text-slate-700">
          <span className={cn(critiques > 0 && "text-brand-600")}>{lacunesActives.length}</span>
          {critiques > 0 ? (
            <span className="ml-1 text-xs font-normal text-slate-400">
              dont {critiques} critique{critiques > 1 ? "s" : ""}
            </span>
          ) : null}
        </p>
      </td>
      <td className="px-3 py-3">
        {risque.matierePrioritaire ? (
          <p>
            <span
              className={cn(
                "font-semibold",
                pctNote(risque.matierePrioritaire) < 50 ? "text-brand-600" : "text-slate-700"
              )}
            >
              {risque.matierePrioritaire.matiere}
            </span>{" "}
            <span className="text-xs text-slate-400">
              {risque.matierePrioritaire.note}/{risque.matierePrioritaire.sur}
            </span>
          </p>
        ) : (
          <p className="text-slate-300">—</p>
        )}
      </td>
      <td className="px-3 py-3">
        <Tendance t={risque.tendance} />
      </td>
      <td className="px-3 py-3 text-xs text-slate-500">{formatDate(eleve.inscritLe)}</td>
      <td className="px-3 py-3">
        <ChevronRight
          size={15}
          className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-500"
        />
      </td>
    </tr>
  );
}
