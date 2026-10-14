"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpenCheck, Printer, Sparkles } from "lucide-react";
import { notionParId } from "@/data/notions";
import { NIVEAU_PAR_SEVERITE, SEVERITE_LABEL } from "@/types";
import type { ContenuGenere, Lacune } from "@/types";
import { useStore } from "@/store";
import { Badge, Bouton, Card, CardHeader, EmptyState, Modal } from "@/components/ui";
import { ContenuFiche, GenerationFlow } from "@/components/generation";
import { formatDate } from "@/lib/utils";

/** Onglet Contenus : les fiches de renfort générées + génération à la demande */
export function OngletContenus({ eleveId }: { eleveId: string }) {
  const { contenus, lacunes } = useStore();
  const [aGenerer, setAGenerer] = useState<Lacune | null>(null);
  const [consulte, setConsulte] = useState<ContenuGenere | null>(null);

  const miens = contenus
    .filter((c) => c.eleveId === eleveId)
    .sort((a, b) => b.date.localeCompare(a.date));
  const generables = lacunes.filter(
    (l) => l.eleveId === eleveId && (l.statut === "detectee" || l.statut === "renfort")
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Fiches de renfort générées"
          subtitle="Chaque fiche est calibrée sur le niveau auquel la notion a été ratée"
          icon={<BookOpenCheck size={17} />}
        />
        {miens.length === 0 ? (
          <EmptyState
            titre="Aucun contenu généré"
            description="Générez un renfort depuis l'onglet Lacunes, ou après un test adaptatif."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {miens.map((c) => (
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
                    {formatDate(c.date)}
                    {c.contexteUtilise ? ` · ${c.contexteUtilise}` : ""}
                  </p>
                </div>
                <Badge className="bg-indigo-50 text-indigo-600">
                  {SEVERITE_LABEL[
                    (Object.keys(NIVEAU_PAR_SEVERITE) as Array<keyof typeof NIVEAU_PAR_SEVERITE>).find(
                      (k) => NIVEAU_PAR_SEVERITE[k] === c.calibreNiveau
                    ) ?? "elevee"
                  ]}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </Card>

      {generables.length > 0 ? (
        <Card className="border-dashed">
          <div className="flex flex-wrap items-center gap-3 px-5 py-4">
            <Sparkles size={16} className="text-brand-500" />
            <span className="flex-1 text-sm text-slate-600">
              Générer un renfort pour :{" "}
              {generables.map((l, i) => (
                <span key={l.id}>
                  {i > 0 ? ", " : ""}
                  <span className="font-semibold text-slate-800">
                    {notionParId(l.notionId).nom}
                  </span>
                </span>
              ))}
            </span>
            <Bouton taille="sm" onClick={() => setAGenerer(generables[0])}>
              <Sparkles size={13} /> Générer
            </Bouton>
          </div>
        </Card>
      ) : null}

      <Link
        href={`/impression/${eleveId}`}
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 print:hidden"
      >
        <Printer size={15} /> Voir le cahier de renfort imprimable (PDF pour l'élève)
      </Link>

      {aGenerer ? (
        <GenerationFlow
          ouvert
          onClose={() => setAGenerer(null)}
          eleveId={eleveId}
          notionId={aGenerer.notionId}
          lacuneId={aGenerer.id}
          niveauEchec={NIVEAU_PAR_SEVERITE[aGenerer.severite] as 1 | 2 | 3 | 4}
        />
      ) : null}

      {consulte ? (
        <Modal ouvert onClose={() => setConsulte(null)} large>
          <ContenuFiche contenu={consulte} />
        </Modal>
      ) : null}
    </div>
  );
}
