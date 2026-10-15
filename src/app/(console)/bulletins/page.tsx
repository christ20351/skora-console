"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClipboardList, Plus } from "lucide-react";
import { pctNote } from "@/features/risque";
import { useStore } from "@/store";
import { Avatar, Bouton, Card, CardHeader, EmptyState } from "@/components/ui";
import { NouveauEleveModal } from "@/components/bulletins/NouveauEleveModal";
import { cn, formatDate } from "@/lib/utils";

function BulletinsInterne() {
  const { eleves, bulletins } = useStore();
  const params = useSearchParams();
  const [modal, setModal] = useState(params.get("nouveau") === "1");
  const [creeId, setCreeId] = useState<string | null>(null);

  const liste = eleves
    .map((e) => ({ eleve: e, trimestres: bulletins[e.id] ?? [] }))
    .sort((a, b) => {
      if (a.eleve.id === creeId) return -1;
      if (b.eleve.id === creeId) return 1;
      return b.eleve.inscritLe.localeCompare(a.eleve.inscritLe);
    });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title={`Bulletins saisis (${liste.length})`}
          subtitle="Le bulletin physique est recopié à la main — aucune image, aucun scan. C'est notre point de départ pour prioriser."
          icon={<ClipboardList size={16} />}
          action={
            <Bouton taille="sm" onClick={() => setModal(true)}>
              <Plus size={14} /> Nouvel élève
            </Bouton>
          }
        />
        {liste.length === 0 ? (
          <EmptyState
            titre="Aucun bulletin"
            description="Inscrivez un élève pour commencer son accompagnement."
            icon={<ClipboardList size={28} />}
          />
        ) : (
          <div className="divide-y divide-white/50">
            {liste.map(({ eleve, trimestres }) => {
              const dernier = trimestres[trimestres.length - 1];
              const pire = dernier
                ? [...dernier.lignes].sort((a, b) => pctNote(a) - pctNote(b)).at(0)
                : undefined;
              return (
                <Link
                  key={eleve.id}
                  href={`/eleves/${eleve.id}`}
                  className="flex flex-wrap items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/50"
                >
                  <Avatar prenom={eleve.prenom} nom={eleve.nom} couleur={eleve.couleur} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-ink">
                        {eleve.prenom} {eleve.nom}
                      </span>
                      {eleve.id === creeId ? (
                        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs font-bold text-emerald-600 ring-1 ring-emerald-300/40">
                          Nouveau
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-500">
                      {eleve.niveauScolaire}
                      {eleve.ecole ? ` · ${eleve.ecole}` : ""} · inscrit le {formatDate(eleve.inscritLe)}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-xs font-bold tracking-[0.12em] text-slate-400 uppercase">
                      Bulletin d'entrée
                    </p>
                    {dernier ? (
                      <p className="mt-0.5 text-xs text-slate-600">
                        {dernier.lignes.length} matières ·{" "}
                        {pire ? (
                          <>
                            pire note :{" "}
                            <span
                              className={cn(
                                "font-bold",
                                pctNote(pire) < 50 ? "text-brand-600" : "text-slate-700"
                              )}
                            >
                              {pire.matiere} ({pire.note}/{pire.sur})
                            </span>
                          </>
                        ) : (
                          "—"
                        )}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-xs text-slate-400">non saisi</p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "rounded-xl px-2.5 py-1.5 text-xs font-bold",
                      trimestres.length > 1
                        ? "bg-emerald-400/15 text-emerald-600 ring-1 ring-emerald-300/40"
                        : "bg-white/60 text-slate-500 ring-1 ring-white/70"
                    )}
                  >
                    {trimestres.length} trimestre{trimestres.length > 1 ? "s" : ""}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

      <NouveauEleveModal
        ouvert={modal}
        onClose={() => setModal(false)}
        onCree={(id) => setCreeId(id)}
      />
    </div>
  );
}

export default function PageBulletins() {
  return (
    <Suspense>
      <BulletinsInterne />
    </Suspense>
  );
}
