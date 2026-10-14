"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpenCheck, Printer, Sparkles } from "lucide-react";
import { libelleCalibrage } from "@/features/contenu/generation";
import { useStore } from "@/store";
import { Avatar, Card, CardHeader, EmptyState, Modal } from "@/components/ui";
import { ContenuFiche } from "@/components/generation";
import { formatDate } from "@/lib/utils";
import type { ContenuGenere } from "@/types";

export default function PageContenus() {
  const { contenus, eleves } = useStore();
  const [consulte, setConsulte] = useState<ContenuGenere | null>(null);
  const eleveParId = (id: string) => eleves.find((e) => e.id === id);

  const groupes = new Map<string, ContenuGenere[]>();
  for (const c of contenus) {
    groupes.set(c.eleveId, [...(groupes.get(c.eleveId) ?? []), c]);
  }

  return (
    <div className="space-y-6">
      {contenus.length === 0 ? (
        <Card>
          <EmptyState
            titre="Aucun contenu généré"
            description="Les fiches de renfort se génèrent depuis la fiche d'un élève (onglet Lacunes) ou après un test adaptatif."
            icon={<Sparkles size={26} />}
          />
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
                    <span className="shrink-0 text-xs font-semibold text-brand-600">Consulter</span>
                  </button>
                ))}
              </div>
            </Card>
          );
        })
      )}

      {consulte ? (
        <Modal ouvert onClose={() => setConsulte(null)} large>
          <ContenuFiche contenu={consulte} />
        </Modal>
      ) : null}
    </div>
  );
}
