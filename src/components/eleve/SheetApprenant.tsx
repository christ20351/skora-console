"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ClipboardList, X } from "lucide-react";
import { notionParId } from "@/data/notions";
import { Avatar, BadgeRisque, BadgeSeverite, ProgressBar } from "@/components/ui";
import { JaugeRisque, Tendance } from "@/components/charts";
import { cn, formatDate } from "@/lib/utils";
import { POIDS_SEVERITE } from "@/types";
import type { AnalyseRisque, Eleve, Lacune, Severite } from "@/types";

/** Données calculées pour la sheet (une ligne du tableau) */
export interface ApprenantSelectionne {
  eleve: Eleve;
  risque: AnalyseRisque;
  lacunesActives: Lacune[];
  parSeverite: Record<Severite, number>;
}

const AXES = [
  { cle: "bulletin", label: "Bulletin" },
  { cle: "lacunes", label: "Lacunes" },
  { cle: "contexte", label: "Contexte" },
] as const;

/** Sheet latérale : profil bref de l'apprenant sélectionné dans le tableau */
export function SheetApprenant({
  selection,
  onClose,
}: {
  selection: ApprenantSelectionne | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!selection) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selection, onClose]);

  return (
    <AnimatePresence>
      {selection ? (
        <SheetContenu selection={selection} onClose={onClose} />
      ) : null}
    </AnimatePresence>
  );
}

function SheetContenu({
  selection,
  onClose,
}: {
  selection: ApprenantSelectionne;
  onClose: () => void;
}) {
  const { eleve, risque, lacunesActives, parSeverite } = selection;

  const lacunesTriees = [...lacunesActives].sort(
    (a, b) =>
      POIDS_SEVERITE[b.severite] - POIDS_SEVERITE[a.severite] ||
      a.maitrisePct - b.maitrisePct
  );

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="glass absolute inset-y-4 right-4 flex w-full max-w-md flex-col overflow-hidden rounded-3xl shadow-2xl"
        role="dialog"
        aria-label={`Profil de ${eleve.prenom} ${eleve.nom}`}
      >
        {/* ── En-tête identité ── */}
        <header className="relative shrink-0 border-b border-slate-200/70 bg-slate-50/60 px-5 pt-5 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl bg-white p-1.5 text-slate-400 ring-1 ring-slate-200/70 transition-colors hover:text-slate-700"
            aria-label="Fermer"
          >
            <X size={17} />
          </button>
          <div className="flex items-start gap-3.5">
            <Avatar prenom={eleve.prenom} nom={eleve.nom} couleur={eleve.couleur} taille="lg" />
            <div className="min-w-0 pr-8">
              <h2 className="text-lg leading-6 font-bold text-ink">
                {eleve.prenom} {eleve.nom}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {eleve.niveauScolaire}
                {eleve.ecole ? ` · ${eleve.ecole}` : ""}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <BadgeRisque label={risque.label} />
                <Tendance t={risque.tendance} />
              </div>
            </div>
          </div>
        </header>

        {/* ── Corps défilant ── */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {/* Priorité : score + axes */}
          <section>
            <TitreSection>Priorité</TitreSection>
            <div className="mt-2 flex items-center gap-4 rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-200/70">
              <div className="flex shrink-0 flex-col items-center gap-0.5">
                <JaugeRisque score={risque.score} taille={62} />
                <span className="text-[10px] font-medium text-slate-400">Score</span>
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                {AXES.map((a) => (
                  <div key={a.cle} className="flex items-center gap-2.5">
                    <span className="w-18 shrink-0 text-xs font-medium text-slate-500">{a.label}</span>
                    <ProgressBar valeur={risque.axes[a.cle]} />
                    <span className="w-7 shrink-0 text-right text-xs font-bold text-slate-600">
                      {risque.axes[a.cle]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <Info label="Âge">{eleve.age ? `${eleve.age} ans` : "—"}</Info>
              <Info label="Inscrit le">{formatDate(eleve.inscritLe)}</Info>
              <Info label="Matière prioritaire">
                {risque.matierePrioritaire ? (
                  <span className="font-semibold text-brand-600">
                    {risque.matierePrioritaire.matiere}{" "}
                    <span className="font-normal text-slate-500">
                      ({risque.matierePrioritaire.note}/{risque.matierePrioritaire.sur})
                    </span>
                  </span>
                ) : (
                  "—"
                )}
              </Info>
              <Info label="Prochaine action">
                <span
                  className={cn(
                    "font-semibold",
                    risque.action.type === "ok" ? "text-emerald-600" : "text-slate-700"
                  )}
                >
                  {risque.action.libelle}
                </span>
              </Info>
            </dl>
          </section>

          {/* Lacunes actives */}
          <section>
            <TitreSection>Lacunes actives ({lacunesActives.length})</TitreSection>
            {lacunesActives.length === 0 ? (
              <p className="mt-2 rounded-2xl bg-emerald-50 px-3.5 py-3 text-sm font-medium text-emerald-600 ring-1 ring-emerald-200/70">
                Aucune lacune active 🎉
              </p>
            ) : (
              <>
                <p className="mt-2 flex flex-wrap gap-2 text-xs">
                  {(Object.entries(parSeverite) as [Severite, number][])
                    .filter(([, n]) => n > 0)
                    .map(([sev, n]) => (
                      <span key={sev} className="inline-flex items-center gap-1">
                        <BadgeSeverite severite={sev} />
                        <span className="font-semibold text-slate-500">×{n}</span>
                      </span>
                    ))}
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {lacunesTriees.map((l) => (
                    <li
                      key={l.id}
                      className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200/70"
                    >
                      <BadgeSeverite severite={l.severite} />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                        {notionParId(l.notionId).nom}
                      </span>
                      <span className="shrink-0 text-xs font-bold text-slate-400">
                        {l.maitrisePct} %
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>

        {/* ── Actions ── */}
        <footer className="shrink-0 space-y-2 border-t border-slate-200/70 bg-slate-50/60 px-5 py-4">
          <Link href={`/eleves/${eleve.id}`} className="btn-brand w-full px-4 py-2.5">
            Voir la fiche complète <ArrowRight size={15} />
          </Link>
          <Link
            href={`/diagnostics?eleve=${eleve.id}`}
            className="glass-soft flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:bg-white"
          >
            <ClipboardList size={15} /> Faire passer un test
          </Link>
        </footer>
      </motion.aside>
    </div>
  );
}

function TitreSection({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
      {children}
    </h3>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200/70">
      <dt className="text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">{label}</dt>
      <dd className="mt-0.5 truncate text-sm text-slate-700">{children}</dd>
    </div>
  );
}
