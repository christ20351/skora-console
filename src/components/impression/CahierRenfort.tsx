"use client";

import { Compass, Printer } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { analyserRisque } from "@/features/risque";
import type { ContenuGenere, Eleve } from "@/types";
import { useStore } from "@/store";
import { AUJOURDHUI } from "@/lib/constantes";
import { formatDate } from "@/lib/utils";
import { Bouton } from "@/components/ui";
import { CahierCorriges, CahierFiche } from "./CahierFiche";
import { CahierDiagnostic } from "./CahierDiagnostic";

/** Cahier de renfort imprimable (Ctrl+P → PDF) remis à l'apprenant */
export function CahierRenfort({ eleve }: { eleve: Eleve }) {
  const { lacunes, contenus, tests, appels, bulletins } = useStore();
  const risque = analyserRisque(eleve, lacunes, appels, tests, bulletins);
  const miennes = lacunes.filter((l) => l.eleveId === eleve.id && l.statut !== "resolue");
  const fiches: ContenuGenere[] = contenus.filter((c) => c.eleveId === eleve.id);
  const prochainAppel = appels
    .filter((a) => a.eleveId === eleve.id && a.statut === "planifie")
    .sort((a, b) => a.date.localeCompare(b.date))
    .at(0);

  return (
    <div className="mx-auto max-w-[820px] space-y-6 text-xs leading-relaxed text-slate-800">
      {/* Barre d'actions (masquée à l'impression) */}
      <div className="print:hidden sticky top-0 z-10 -mx-6 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur">
        <Link href={`/eleves/${eleve.id}`} className="text-sm font-medium text-slate-500 hover:text-slate-800">
          ← Retour à la console
        </Link>
        <Bouton onClick={() => window.print()}>
          <Printer size={15} /> Imprimer / Enregistrer en PDF
        </Bouton>
      </div>

      <EnTete eleve={eleve} />

      <CahierDiagnostic
        eleve={eleve}
        risque={risque}
        bulletin={bulletins[eleve.id]?.at(-1)}
        lacunes={miennes}
        tests={tests.filter((t) => t.eleveId === eleve.id)}
      />

      {/* 5 · Fiches d'apprentissage */}
      <section>
        <h2 className="mb-1 text-sm font-bold tracking-wide text-brand-600 uppercase">
          5 · Fiches d'apprentissage — ton programme de renfort
        </h2>
        <p className="mb-3 text-xs text-slate-500">
          Une fiche par notion fragile : le cours à retenir, un exemple résolu, des exercices dans
          l'ordre, puis l'auto-check. Les corrigés sont à la dernière page.
        </p>
        {fiches.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            Aucune fiche générée pour le moment — génère un renfort depuis la fiche élève, puis
            réimprime ce cahier.
          </p>
        ) : (
          fiches.map((c, idx) => <CahierFiche key={c.id} contenu={c} numero={idx + 1} />)
        )}
      </section>

      {/* 6 · Suivi */}
      <section className="break-inside-avoid">
        <h2 className="mb-2 text-sm font-bold tracking-wide text-brand-600 uppercase">
          6 · Le suivi — comment on avance ensemble
        </h2>
        <div className="rounded-lg border border-slate-200 p-4 text-xs">
          {prochainAppel ? (
            <p>
              <strong>Prochain appel d'accompagnement : {formatDate(prochainAppel.date)}</strong>
              <br />
              {prochainAppel.motif} — avec {prochainAppel.animateur}.
            </p>
          ) : (
            <p>
              <strong>Appel d'accompagnement à planifier.</strong> Cadence : toutes les 2 semaines
              pour un suivi critique, chaque mois sinon.
            </p>
          )}
          <p className="mt-2">
            <strong>Re-test :</strong> chaque notion retravaillée repasse dans un test adaptatif —
            réussite = la maîtrise remonte et la lacune s'efface du tableau.
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4"].map((s) => (
              <div key={s} className="rounded border border-dashed border-slate-300 p-2 text-center text-xs text-slate-400">
                <p className="font-semibold text-slate-500">{s}</p>
                <p className="mt-4">notes…</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · Corrigés (page séparée) */}
      {fiches.length > 0 ? (
        <section className="break-before-page">
          <h2 className="mb-2 text-sm font-bold tracking-wide text-brand-600 uppercase">
            7 · Corrigés — à garder de côté (espace parents / accompagnant)
          </h2>
          {fiches.map((c) => (
            <CahierCorriges key={c.id} contenu={c} />
          ))}
        </section>
      ) : null}

      <footer className="break-inside-avoid border-t border-slate-200 pt-3 text-center text-xs text-slate-400">
        Skora — accompagnement pédagogique personnalisé · Cahier généré le {formatDate(AUJOURDHUI)} à
        partir du diagnostic de {eleve.prenom} {eleve.nom}
      </footer>
    </div>
  );
}

function EnTete({ eleve }: { eleve: Eleve }) {
  return (
    <header className="break-inside-avoid flex items-start justify-between border-b-2 border-brand-500 pb-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
          <Compass size={22} />
        </span>
        <div>
          <p className="text-lg font-bold text-slate-900">Skora</p>
          <p className="text-xs text-slate-500">Cahier de renfort personnalisé</p>
        </div>
      </div>
      <div className="text-right text-xs text-slate-500">
        <p className="text-base font-bold text-slate-900">
          {eleve.prenom} {eleve.nom}
        </p>
        <p>
          {eleve.niveauScolaire}
          {eleve.ecole ? ` · ${eleve.ecole}` : ""}
        </p>
        <p>Édité le {formatDate(AUJOURDHUI)}</p>
      </div>
    </header>
  );
}

export type { ReactNode };
