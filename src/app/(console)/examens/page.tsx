"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, GraduationCap, Search } from "lucide-react";
import { normalise } from "@/features/risque";
import { TYPE_EXAMEN_LABEL } from "@/types";
import type { Examen } from "@/types";
import { useStore } from "@/store";
import { Avatar, Card, CardHeader, EmptyState } from "@/components/ui";
import {
  BadgeMatiere,
  ConsultationExamen,
  styleNote,
  tailleKo,
  triMatiere,
} from "@/components/examen";
import { cn, formatDate } from "@/lib/utils";

type Tri = "recent" | "ancien";

const selectCls =
  "glass-soft rounded-xl px-3 py-2 text-sm text-slate-600 outline-none focus:bg-white/70 focus:ring-2 focus:ring-brand-300/50";

export default function PageExamens() {
  const { examens, eleves } = useStore();
  const [consulte, setConsulte] = useState<Examen | null>(null);
  const [recherche, setRecherche] = useState("");
  const [eleveFiltre, setEleveFiltre] = useState("tous");
  const [matiereFiltre, setMatiereFiltre] = useState("toutes");
  const [typeFiltre, setTypeFiltre] = useState("tous");
  const [tri, setTri] = useState<Tri>("recent");

  const eleveParId = (id: string) => eleves.find((e) => e.id === id);

  /** Matières réellement présentes dans les examens suivis */
  const matieres = useMemo(
    () => [...new Set(examens.map((x) => x.matiere))].sort(triMatiere),
    [examens]
  );

  const lignes = useMemo(() => {
    const q = normalise(recherche.trim());
    const filtres = examens.filter((x) => {
      if (eleveFiltre !== "tous" && x.eleveId !== eleveFiltre) return false;
      if (matiereFiltre !== "toutes" && x.matiere !== matiereFiltre) return false;
      if (typeFiltre !== "tous" && x.type !== typeFiltre) return false;
      if (!q) return true;
      const el = eleveParId(x.eleveId);
      const soit = `${el ? `${el.prenom} ${el.nom}` : ""} ${x.titre} ${x.matiere} ${TYPE_EXAMEN_LABEL[x.type]} ${x.fichier}`;
      return normalise(soit).includes(q);
    });
    return filtres.sort((a, b) =>
      tri === "recent" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examens, eleves, recherche, eleveFiltre, matiereFiltre, typeFiltre, tri]);

  const nbEleves = new Set(lignes.map((x) => x.eleveId)).size;
  const parMatiere = new Map<string, number>();
  for (const m of matieres) {
    parMatiere.set(m, examens.filter((x) => x.matiere === m).length);
  }

  const consulter = (ex: Examen) => {
    setConsulte(ex);
  };

  if (examens.length === 0) {
    return (
      <Card>
        <EmptyState
          titre="Aucun examen suivi"
          description="Les copies et sujets déposés dans la console apparaîtront ici, lisibles en Markdown."
          icon={<GraduationCap size={26} />}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          icon={<GraduationCap size={17} />}
          title="Examens suivis, par matière"
          subtitle={`${lignes.length} examen(s) · ${nbEleves} apprenant(s) · ${matieres.length} matière(s) · cliquez sur une ligne pour lire le fichier en Markdown`}
        />

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-2.5 border-b border-white/60 px-5 py-3">
          <div className="relative min-w-[200px] flex-1">
            <Search
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
            <input
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un apprenant, un examen, un fichier…"
              className="glass-soft w-full rounded-xl py-2 pr-3 pl-8 text-sm outline-none placeholder:text-slate-400 focus:bg-white/70 focus:ring-2 focus:ring-brand-300/50"
            />
          </div>
          <select
            value={eleveFiltre}
            onChange={(e) => setEleveFiltre(e.target.value)}
            className={selectCls}
          >
            <option value="tous">Tous les apprenants</option>
            {eleves.map((el) => (
              <option key={el.id} value={el.id}>
                {el.prenom} {el.nom}
              </option>
            ))}
          </select>
          <select
            value={typeFiltre}
            onChange={(e) => setTypeFiltre(e.target.value)}
            className={selectCls}
          >
            <option value="tous">Tous les types</option>
            {(Object.keys(TYPE_EXAMEN_LABEL) as (keyof typeof TYPE_EXAMEN_LABEL)[]).map((t) => (
              <option key={t} value={t}>
                {TYPE_EXAMEN_LABEL[t]}
              </option>
            ))}
          </select>
          <select
            value={tri}
            onChange={(e) => setTri(e.target.value as Tri)}
            className={selectCls}
          >
            <option value="recent">Plus récents d’abord</option>
            <option value="ancien">Plus anciens d’abord</option>
          </select>
        </div>

        {/* Filtres matière (compteurs sur l'ensemble des examens suivis) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/60 px-5 py-3">
          {(["toutes", ...matieres] as const).map((m) => {
            const on = matiereFiltre === m;
            const nb = m === "toutes" ? examens.length : (parMatiere.get(m) ?? 0);
            return (
              <button
                key={m}
                onClick={() => setMatiereFiltre(m)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all",
                  on
                    ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_4px_14px_-4px_rgba(220,53,69,0.5)]"
                    : "glass-soft text-slate-500 hover:text-ink"
                )}
              >
                {m === "toutes" ? "Toutes les matières" : m}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs",
                    on ? "bg-white/25" : "bg-white/70"
                  )}
                >
                  {nb}
                </span>
              </button>
            );
          })}
        </div>

        {lignes.length === 0 ? (
          <EmptyState
            titre="Aucun examen ne correspond"
            description="Ajustez la recherche ou réinitialisez les filtres."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-bold tracking-wider text-slate-400 uppercase">
                  <th className="px-5 py-2.5">Apprenant</th>
                  <th className="px-3 py-2.5">Matière</th>
                  <th className="px-3 py-2.5">Examen</th>
                  <th className="px-3 py-2.5">Date épreuve</th>
                  <th className="px-3 py-2.5">Note</th>
                  <th className="px-3 py-2.5">Fichier</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lignes.map((x) => {
                  const el = eleveParId(x.eleveId);
                  return (
                    <tr
                      key={x.id}
                      onClick={() => consulter(x)}
                      className="cursor-pointer transition-colors hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          {el ? (
                            <Avatar
                              prenom={el.prenom}
                              nom={el.nom}
                              couleur={el.couleur}
                              taille="sm"
                            />
                          ) : null}
                          <div className="min-w-0">
                            {el ? (
                              <Link
                                href={`/eleves/${el.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="block truncate font-semibold text-slate-800 hover:text-brand-600"
                              >
                                {el.prenom} {el.nom}
                              </Link>
                            ) : (
                              <span className="font-semibold text-slate-800">
                                Apprenant inconnu
                              </span>
                            )}
                            <p className="truncate text-xs text-slate-400">
                              {el?.niveauScolaire}
                              {el?.ecole ? ` · ${el.ecole}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <BadgeMatiere matiere={x.matiere} />
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-slate-800">{x.titre}</p>
                        <p className="text-xs text-slate-400">
                          {TYPE_EXAMEN_LABEL[x.type]}
                          {x.trimestre ? ` · ${x.trimestre}` : ""}
                        </p>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-slate-500">
                        {formatDate(x.date)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {x.note === undefined ? (
                          <span className="inline-flex items-center rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-semibold text-amber-600 ring-1 ring-amber-300/40">
                            En attente
                          </span>
                        ) : (
                          <span className={cn("text-sm", styleNote(x.note, x.sur ?? 20))}>
                            {x.note}
                            <span className="text-xs font-normal text-slate-400">
                              /{x.sur ?? 20}
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="max-w-[220px] px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                            <FileText size={13} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-mono text-xs text-slate-600">
                              {x.fichier}
                            </p>
                            <p className="text-xs text-slate-400">
                              markdown · {tailleKo(x.contenu)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <span className="text-xs font-semibold text-brand-600">
                          Consulter
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="text-center text-xs text-slate-400">
        Les fichiers sont déposés au format Markdown par l’équipe — cliquez sur un examen pour
        le lire en rendu (titres, tableaux, listes) ou en source brute.
      </p>

      {/* Grande feuille de consultation (infos + aperçu Markdown) */}
      <ConsultationExamen
        examen={consulte}
        eleve={consulte ? eleveParId(consulte.eleveId) : undefined}
        onRetour={() => setConsulte(null)}
      />
    </div>
  );
}
