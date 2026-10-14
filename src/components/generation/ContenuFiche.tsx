"use client";

import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  FileText,
  Lightbulb,
  PenLine,
} from "lucide-react";
import { notionParId } from "@/data/notions";
import { NIVEAUX } from "@/types";
import type { ContenuGenere } from "@/types";
import { libelleCalibrage } from "@/features/contenu/generation";
import { formatDate } from "@/lib/utils";

/** Rendu d'une fiche de renfort générée */
export function ContenuFiche({ contenu }: { contenu: ContenuGenere }) {
  const notion = notionParId(contenu.notionId);
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
          <FileText size={22} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{contenu.titre}</h3>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-200">
              {libelleCalibrage(contenu.calibreNiveau)}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">
            Généré le {formatDate(contenu.date)} · {notion.matiere}
            {contenu.contexteUtilise ? ` · ${contenu.contexteUtilise}` : ""}
          </p>
        </div>
      </div>

      <section>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
          <BookOpen size={15} className="text-brand-500" /> L'essentiel en quelques points
        </h4>
        <ul className="space-y-1.5 rounded-xl bg-slate-50 p-4">
          {contenu.essentiel.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
          <Lightbulb size={15} className="text-amber-500" /> Exemple guidé
        </h4>
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="font-medium text-slate-800">{contenu.exemple.enonce}</p>
          <ol className="mt-3 space-y-1.5">
            {contenu.exemple.resolution.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800">
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
          <PenLine size={15} className="text-brand-500" /> Exercices progressifs
        </h4>
        <div className="space-y-2">
          {contenu.exercices.map((ex, i) => (
            <details key={i} className="group rounded-xl border border-slate-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                <span className="flex items-center gap-2.5 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-slate-700">{ex.enonce}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                    {NIVEAUX[ex.niveau].court}
                  </span>
                  <ChevronDown
                    size={15}
                    className="text-slate-400 transition-transform group-open:rotate-180"
                  />
                </span>
              </summary>
              <div className="border-t border-slate-100 px-4 py-3 text-sm text-emerald-700">
                <span className="font-semibold">Corrigé : </span>
                {ex.correction}
              </div>
            </details>
          ))}
        </div>
        <div className="mt-3 flex gap-2.5 rounded-xl border border-brand-200 bg-brand-50 p-4">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-brand-500" />
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-brand-700">Le piège à éviter : </span>
            {notion.piege}
          </p>
        </div>
      </section>

      {contenu.autoCheck.length > 0 ? (
        <section>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
            <BadgeCheck size={15} className="text-emerald-500" /> Auto-check — avant de passer à la
            suite
          </h4>
          <div className="space-y-2">
            {contenu.autoCheck.map((qa, i) => (
              <details key={i} className="group rounded-xl border border-slate-200 bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm text-slate-700">
                  {qa.question}
                  <ChevronDown
                    size={15}
                    className="shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="border-t border-slate-100 px-4 py-2.5 text-sm text-emerald-700">
                  <span className="font-semibold">Réponse : </span>
                  {qa.reponse}
                </div>
              </details>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Réussi ? La notion repassera au prochain test adaptatif pour confirmer la remontée de
            maîtrise.
          </p>
        </section>
      ) : null}
    </div>
  );
}
