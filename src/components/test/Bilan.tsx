"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, Trophy, User } from "lucide-react";
import { notionParId } from "@/data/notions";
import { SEVERITE_PAR_NIVEAU, SEVERITE_LABEL, NIVEAUX } from "@/types";
import type { EtapeTest } from "@/types";
import type { Bilan as BilanType } from "@/features/test-adaptatif/moteur";
import { useStore } from "@/store";
import { BadgeSeverite, Bouton, Card, EmptyState } from "@/components/ui";
import { GenerationFlow } from "@/components/generation";

/** Étape 3 : bilan — ce qui a été raté et à quel niveau → lacunes */
export function Bilan({
  eleveId,
  elevePrenom,
  matiere,
  bilan,
  etapes,
  enregistre,
  onEnregistrer,
}: {
  eleveId: string;
  elevePrenom: string;
  matiere: string;
  bilan: BilanType;
  etapes: EtapeTest[];
  /** dureeMin du test, pour l'enregistrement */
  dureeMin: number;
  enregistre: boolean;
  onEnregistrer: () => void;
}) {
  const [generation, setGeneration] = useState<string | null>(null);
  const { lacunes } = useStore();

  const lacuneDe = (notionId: string) =>
    lacunes.find((l) => l.eleveId === eleveId && l.notionId === notionId);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card className="p-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          {bilan.notionsRatees.length === 0 ? <Trophy size={26} /> : <User size={26} />}
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Test terminé — {bilan.reussitePct} % de réussite
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {elevePrenom} · {matiere} · niveau {NIVEAUX[bilan.niveauFinal].nom}
          {bilan.niveauFinal > 2
            ? " (au-dessus du standard)"
            : bilan.niveauFinal < 2
              ? " (sous le standard)"
              : ""}
        </p>
      </Card>

      <Card>
        <div className="border-b border-slate-100 px-5 py-3.5">
          <h3 className="font-semibold text-slate-900">
            {bilan.notionsRatees.length > 0
              ? `Lacunes détectées (${bilan.notionsRatees.length})`
              : "Aucune lacune détectée"}
          </h3>
          <p className="text-xs text-slate-500">
            Chaque notion ratée devient une lacune dont la sévérité dépend du niveau auquel elle a
            été ratée.
          </p>
        </div>
        {bilan.notionsRatees.length === 0 ? (
          <EmptyState
            titre="Sans faute !"
            description="Aucun renfort nécessaire — le niveau monté jusqu'à Expert le confirme."
            icon={<Trophy size={26} />}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {bilan.notionsRatees.map((nr) => {
              const severite = SEVERITE_PAR_NIVEAU[nr.niveauEchec];
              const lacune = enregistre ? lacuneDe(nr.notionId) : undefined;
              return (
                <div key={nr.notionId} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {notionParId(nr.notionId).nom}
                      </span>
                      <BadgeSeverite severite={severite} />
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {nr.nbEchecs} échec{nr.nbEchecs > 1 ? "s" : ""} — ratée au niveau{" "}
                      {NIVEAUX[nr.niveauEchec].nom} ({SEVERITE_LABEL[severite].toLowerCase()})
                    </p>
                  </div>
                  {enregistre ? (
                    <Bouton
                      taille="sm"
                      onClick={() => setGeneration(nr.notionId)}
                      disabled={lacune?.statut === "renfort"}
                    >
                      <Sparkles size={13} />
                      {lacune?.statut === "renfort" ? "Renfort généré" : "Générer le renfort"}
                    </Bouton>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="flex flex-wrap justify-between gap-3">
        {!enregistre ? (
          <Bouton onClick={onEnregistrer}>
            <CheckCircle2 size={15} /> Enregistrer dans le suivi de l'élève
          </Bouton>
        ) : (
          <span className="flex items-center text-sm font-semibold text-emerald-600">
            <CheckCircle2 size={15} className="mr-1.5" /> Test enregistré — visible sur la fiche
            élève
          </span>
        )}
        <Link href={`/eleves/${eleveId}`}>
          <Bouton variant="secondaire">Voir la fiche de {elevePrenom}</Bouton>
        </Link>
      </div>

      {generation ? (
        <GenerationFlow
          ouvert
          onClose={() => setGeneration(null)}
          eleveId={eleveId}
          notionId={generation}
          lacuneId={lacuneDe(generation)?.id}
          niveauEchec={bilan.notionsRatees.find((n) => n.notionId === generation)?.niveauEchec ?? 2}
        />
      ) : null}
    </div>
  );
}
