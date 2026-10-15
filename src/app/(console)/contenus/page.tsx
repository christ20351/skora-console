"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpenCheck, Printer, Search, Sparkles } from "lucide-react";
import { libelleCalibrage } from "@/features/contenu/generation";
import { normalise } from "@/features/risque";
import { notionParId } from "@/data/notions";
import { NIVEAUX } from "@/types";
import type { ContenuGenere, Niveau } from "@/types";
import { useStore } from "@/store";
import { Avatar, Card, CardHeader, EmptyState, Modal } from "@/components/ui";
import { ContenuFiche } from "@/components/generation";
import { cn, formatDate } from "@/lib/utils";

type Vue = "tableau" | "par-eleve";

/** Couleurs du badge calibrage, alignées sur la sévérité du niveau d'échec */
const STYLE_NIVEAU: Record<Niveau, string> = {
  1: "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_4px_14px_-4px_rgba(220,53,69,0.5)]",
  2: "bg-orange-400/15 text-orange-600 ring-1 ring-orange-300/40",
  3: "bg-amber-400/15 text-amber-600 ring-1 ring-amber-300/40",
  4: "bg-white/60 text-slate-500 ring-1 ring-slate-200/60",
};

const selectCls =
  "glass-soft rounded-xl px-3 py-2 text-sm text-slate-600 outline-none focus:bg-white/70 focus:ring-2 focus:ring-brand-300/50";

export default function PageContenus() {
  const { contenus, eleves } = useStore();
  const [vue, setVue] = useState<Vue>("tableau");
  const [consulte, setConsulte] = useState<ContenuGenere | null>(null);
  const [recherche, setRecherche] = useState("");
  const [eleveFiltre, setEleveFiltre] = useState("tous");
  const [matiereFiltre, setMatiereFiltre] = useState("toutes");
  const [tri, setTri] = useState<"recent" | "ancien">("recent");

  const eleveParId = (id: string) => eleves.find((e) => e.id === id);

  const matieres = useMemo(
    () => [...new Set(contenus.map((c) => notionParId(c.notionId).matiere))].sort(),
    [contenus]
  );

  /** Vue tableau : toutes les fiches, chronologie du suivi */
  const lignes = useMemo(() => {
    const q = normalise(recherche.trim());
    const filtres = contenus.filter((c) => {
      if (eleveFiltre !== "tous" && c.eleveId !== eleveFiltre) return false;
      if (matiereFiltre !== "toutes" && notionParId(c.notionId).matiere !== matiereFiltre)
        return false;
      if (!q) return true;
      const el = eleves.find((e) => e.id === c.eleveId);
      const soit = `${el ? `${el.prenom} ${el.nom}` : ""} ${c.titre} ${notionParId(c.notionId).matiere} ${libelleCalibrage(c.calibreNiveau)}`;
      return normalise(soit).includes(q);
    });
    return filtres.sort((a, b) =>
      tri === "recent" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );
  }, [contenus, eleves, recherche, eleveFiltre, matiereFiltre, tri]);

  const nbElevesSuivis = new Set(lignes.map((c) => c.eleveId)).size;

  /* ── Vue « Par élève » : cartes groupées (conservée) ── */
  const groupes = new Map<string, ContenuGenere[]>();
  for (const c of contenus) {
    groupes.set(c.eleveId, [...(groupes.get(c.eleveId) ?? []), c]);
  }

  const bascule = (
    <div className="glass-soft inline-flex gap-1 rounded-xl p-1">
      {(
        [
          { cle: "tableau", label: "Vue tableau" },
          { cle: "par-eleve", label: "Par élève" },
        ] as const
      ).map((v) => {
        const on = vue === v.cle;
        return (
          <button
            key={v.cle}
            onClick={() => setVue(v.cle)}
            className={cn(
              "relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              on ? "text-brand-600" : "text-slate-500 hover:text-ink"
            )}
          >
            {on ? (
              <motion.span
                layoutId="vue-contenus"
                className="absolute inset-0 rounded-lg border border-white/70 bg-white/90 shadow-[0_6px_18px_-8px_rgba(90,60,120,0.3)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            <span className="relative z-10">{v.label}</span>
          </button>
        );
      })}
    </div>
  );

  if (contenus.length === 0) {
    return (
      <Card>
        <EmptyState
          titre="Aucun contenu généré"
          description="Les fiches de renfort se génèrent depuis la fiche d'un élève (onglet Lacunes) ou après un test adaptatif."
          icon={<Sparkles size={26} />}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bascule de vue, toujours accessible */}
      <div className="flex justify-end">{bascule}</div>

      {vue === "tableau" ? (
        <Card>
          <CardHeader
            icon={<BookOpenCheck size={17} />}
            title="Tous les contenus générés"
            subtitle={`${lignes.length} fiche(s) · ${nbElevesSuivis} élève(s) suivi(s) · cliquez sur une ligne pour consulter la fiche`}
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
                placeholder="Rechercher un élève, une fiche, une matière…"
                className="glass-soft w-full rounded-xl py-2 pr-3 pl-8 text-sm outline-none placeholder:text-slate-400 focus:bg-white/70 focus:ring-2 focus:ring-brand-300/50"
              />
            </div>
            <select
              value={eleveFiltre}
              onChange={(e) => setEleveFiltre(e.target.value)}
              className={selectCls}
            >
              <option value="tous">Tous les élèves</option>
              {eleves.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.prenom} {el.nom}
                </option>
              ))}
            </select>
            <select
              value={matiereFiltre}
              onChange={(e) => setMatiereFiltre(e.target.value)}
              className={selectCls}
            >
              <option value="toutes">Toutes les matières</option>
              {matieres.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={tri}
              onChange={(e) => setTri(e.target.value as "recent" | "ancien")}
              className={selectCls}
            >
              <option value="recent">Plus récents d&apos;abord</option>
              <option value="ancien">Plus anciens d&apos;abord</option>
            </select>
          </div>

          {lignes.length === 0 ? (
            <EmptyState
              titre="Aucun contenu ne correspond"
              description="Ajustez la recherche ou réinitialisez les filtres."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-bold tracking-wider text-slate-400 uppercase">
                    <th className="px-5 py-2.5">Élève</th>
                    <th className="px-3 py-2.5">Contenu</th>
                    <th className="px-3 py-2.5">Calibrage</th>
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-3 py-2.5">Contexte réutilisé</th>
                    <th className="px-5 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lignes.map((c) => {
                    const el = eleveParId(c.eleveId);
                    const notion = notionParId(c.notionId);
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setConsulte(c)}
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
                                  Élève inconnu
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
                          <p className="font-semibold text-slate-800">{c.titre}</p>
                          <p className="text-xs text-slate-400">{notion.matiere}</p>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            title={libelleCalibrage(c.calibreNiveau)}
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                              STYLE_NIVEAU[c.calibreNiveau]
                            )}
                          >
                            {NIVEAUX[c.calibreNiveau].court}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-slate-500">
                          {formatDate(c.date)}
                        </td>
                        <td className="max-w-[240px] px-3 py-3">
                          <p className="truncate text-xs text-slate-400">
                            {c.contexteUtilise ?? "—"}
                          </p>
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
      ) : (
        [...groupes.entries()].map(([eleveId, liste]) => {
          const el = eleveParId(eleveId);
          if (!el) return null;
          return (
            <Card key={eleveId}>
              <CardHeader
                icon={<Avatar prenom={el.prenom} nom={el.nom} couleur={el.couleur} taille="sm" />}
                title={`${el.prenom} ${el.nom}`}
                subtitle={`${el.niveauScolaire}${el.ecole ? ` · ${el.ecole}` : ""} · ${liste.length} fiche(s)`}
                action={
                  <Link
                    href={`/impression/${el.id}`}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    <Printer size={13} /> Cahier imprimable
                  </Link>
                }
              />
              <div className="divide-y divide-slate-100">
                {liste.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setConsulte(c)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                      <BookOpenCheck size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{c.titre}</p>
                      <p className="truncate text-xs text-slate-400">
                        {formatDate(c.date)} · {libelleCalibrage(c.calibreNiveau)}
                        {c.contexteUtilise ? ` · ${c.contexteUtilise}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-brand-600">
                      Consulter
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          );
        })
      )}

      {vue === "par-eleve" ? (
        <p className="text-center text-xs text-slate-400">
          Le cahier imprimable d&apos;un élève regroupe toutes ses fiches — accessible depuis
          chaque carte.
        </p>
      ) : null}

      {consulte ? (
        <Modal ouvert onClose={() => setConsulte(null)} large>
          <ContenuFiche contenu={consulte} />
        </Modal>
      ) : null}
    </div>
  );
}
