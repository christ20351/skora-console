"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Eye,
  FileCode,
  User,
  X,
} from "lucide-react";
import { TYPE_EXAMEN_LABEL } from "@/types";
import type { Eleve, Examen } from "@/types";
import { Avatar } from "@/components/ui";
import { BadgeMatiere, Markdown } from "@/components/examen";
import { styleNote, tailleKo, telecharger } from "@/components/examen/helpers";
import { cn, formatDate } from "@/lib/utils";

/** Ligne « libellé → valeur » du volet d'informations */
function Ligne({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="shrink-0 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        {label}
      </span>
      <div className="min-w-0 text-right">{children}</div>
    </div>
  );
}

/**
 * Fiche de consultation d'un examen : grande feuille posée au-dessus du tableau,
 * divisée en deux volets — à gauche les informations de l'épreuve,
 * à droite l'aperçu du fichier Markdown (rendu ou source).
 */
export function ConsultationExamen({
  examen,
  eleve,
  onRetour,
}: {
  examen: Examen | null;
  eleve?: Eleve;
  onRetour: () => void;
}) {
  const [vueSource, setVueSource] = useState(false);

  /* Chaque examen consulté repart sur la vue « Rendu »
     (ajustement de state pendant le rendu — pattern React officiel) */
  const [dernierId, setDernierId] = useState<string | null>(null);
  const idCourant = examen?.id ?? null;
  if (idCourant !== dernierId) {
    setDernierId(idCourant);
    setVueSource(false);
  }

  /* Fermeture au clavier + blocage du défilement de fond */
  useEffect(() => {
    if (!examen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onRetour();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [examen, onRetour]);

  return (
    <AnimatePresence>
      {examen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white/40 backdrop-blur-md"
            onClick={onRetour}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="relative flex h-[92vh] w-[97vw] max-w-[1500px] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-2xl backdrop-blur-2xl"
          >
            {/* ── En-tête : retour au tableau + identité du fichier ── */}
            <header className="flex shrink-0 items-center gap-3 border-b border-white/60 px-4 py-3">
              <button
                onClick={onRetour}
                className="glass-soft flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white/70 hover:text-ink"
              >
                <ArrowLeft size={15} className="text-brand-500" />
                <span className="hidden sm:inline">Retour au tableau</span>
                <span className="sm:hidden">Retour</span>
              </button>
              <div className="min-w-0 flex-1 text-center">
                <p className="truncate text-sm font-bold text-ink">{examen.titre}</p>
                <p className="truncate text-[11px] text-slate-400">
                  {TYPE_EXAMEN_LABEL[examen.type]} · {formatDate(examen.date)}
                </p>
              </div>
              <button
                onClick={onRetour}
                className="shrink-0 rounded-xl bg-white/70 p-2 text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </header>

            {/* ── Deux volets : infos à gauche, aperçu à droite ── */}
            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(280px,320px)_1fr]">
              {/* Volet gauche : informations de l'examen */}
              <aside className="min-h-0 space-y-4 overflow-y-auto border-b border-white/60 px-5 py-4 lg:border-r lg:border-b-0">
                {eleve ? (
                  <Link
                    href={`/eleves/${eleve.id}`}
                    className="glass-soft flex items-center gap-3 p-3 transition-colors hover:bg-white/70"
                  >
                    <Avatar
                      prenom={eleve.prenom}
                      nom={eleve.nom}
                      couleur={eleve.couleur}
                      taille="sm"
                    />
                    <div className="min-w-0 text-left">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {eleve.prenom} {eleve.nom}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {eleve.niveauScolaire}
                        {eleve.ecole ? ` · ${eleve.ecole}` : ""}
                      </p>
                    </div>
                    <User size={13} className="ml-auto shrink-0 text-slate-300" />
                  </Link>
                ) : null}

                <div className="divide-y divide-slate-100/80">
                  <Ligne label="Matière">
                    <BadgeMatiere matiere={examen.matiere} />
                  </Ligne>
                  <Ligne label="Type">
                    <span className="text-xs font-medium text-slate-600">
                      {TYPE_EXAMEN_LABEL[examen.type]}
                    </span>
                  </Ligne>
                  <Ligne label="Date épreuve">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <CalendarDays size={12} className="text-slate-400" />
                      {formatDate(examen.date)}
                    </span>
                  </Ligne>
                  {examen.trimestre ? (
                    <Ligne label="Période">
                      <span className="text-xs font-medium text-slate-600">
                        {examen.trimestre}
                      </span>
                    </Ligne>
                  ) : null}
                  <Ligne label="Note">
                    {examen.note === undefined ? (
                      <span className="inline-flex items-center rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-semibold text-amber-600 ring-1 ring-amber-300/40">
                        En attente
                      </span>
                    ) : (
                      <span className={cn("text-lg", styleNote(examen.note, examen.sur ?? 20))}>
                        {examen.note}
                        <span className="text-xs font-normal text-slate-400">
                          /{examen.sur ?? 20}
                        </span>
                      </span>
                    )}
                  </Ligne>
                  {examen.deposePar ? (
                    <Ligne label="Déposé par">
                      <span className="text-xs font-medium text-slate-600">
                        {examen.deposePar}
                      </span>
                    </Ligne>
                  ) : null}
                </div>

                {/* Fichier source */}
                <div className="glass-soft p-3">
                  <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    Fichier
                  </p>
                  <p className="truncate font-mono text-xs font-semibold text-slate-700">
                    {examen.fichier}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    markdown · {tailleKo(examen.contenu)}
                  </p>
                  <button
                    onClick={() => telecharger(examen)}
                    className="btn-violet mt-3 w-full px-3 py-2 text-xs"
                  >
                    <Download size={13} /> Télécharger le .md
                  </button>
                </div>
              </aside>

              {/* Volet droit : aperçu du fichier */}
              <section className="flex min-h-0 flex-col">
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/60 px-5 py-2.5">
                  <p className="text-[11px] text-slate-400">
                    {vueSource
                      ? "Source Markdown brute"
                      : "Aperçu : titres, tableaux, listes et blocs de code"}
                  </p>
                  <div className="glass-soft inline-flex gap-1 rounded-xl p-1">
                    {(
                      [
                        { cle: false, label: "Rendu", icon: Eye },
                        { cle: true, label: "Source", icon: FileCode },
                      ] as const
                    ).map((v) => {
                      const on = vueSource === v.cle;
                      return (
                        <button
                          key={v.label}
                          onClick={() => setVueSource(v.cle)}
                          className={cn(
                            "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                            on ? "text-ink" : "text-slate-500 hover:text-slate-700"
                          )}
                        >
                          {on ? (
                            <motion.span
                              layoutId="vue-examen-fichier"
                              className="absolute inset-0 rounded-lg border border-white/70 bg-white/90 shadow-[0_6px_18px_-8px_rgba(90,60,120,0.3)]"
                              transition={{ type: "spring", stiffness: 420, damping: 34 }}
                            />
                          ) : null}
                          <v.icon size={13} className="relative z-10" />
                          <span className="relative z-10">{v.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                  {vueSource ? (
                    <pre className="overflow-x-auto rounded-xl bg-[#241f26] p-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-slate-100">
                      {examen.contenu}
                    </pre>
                  ) : (
                    <Markdown contenu={examen.contenu} />
                  )}
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
