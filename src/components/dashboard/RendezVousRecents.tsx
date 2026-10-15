"use client";

import Link from "next/link";
import { Video } from "lucide-react";
import { Avatar, Card, CardHeader } from "@/components/ui";
import { useStore } from "@/store";
import { STATUT_RDV_LABEL } from "@/types";
import type { RendezVous, StatutRdv } from "@/types";
import { formatDateCourte, cn } from "@/lib/utils";

const STYLES_STATUT: Record<StatutRdv, string> = {
  "a-venir": "bg-brand-400/10 text-brand-600 ring-1 ring-brand-300/40",
  termine: "bg-white/60 text-slate-500 ring-1 ring-slate-200/60",
  annule: "bg-white/60 text-slate-400 line-through ring-1 ring-slate-200/60",
};

function BadgeStatutRdv({ statut }: { statut: StatutRdv }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        STYLES_STATUT[statut]
      )}
    >
      {statut === "a-venir" ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" /> : null}
      {STATUT_RDV_LABEL[statut]}
    </span>
  );
}

/** Rendez-vous Meet : les prochains d'abord, puis les consultations récentes */
export function RendezVousRecents() {
  const { meets, eleves } = useStore();

  const RANG: Record<StatutRdv, number> = { "a-venir": 0, termine: 1, annule: 2 };
  const affiches = [...meets]
    .sort((a, b) => {
      if (RANG[a.statut] !== RANG[b.statut]) return RANG[a.statut] - RANG[b.statut];
      const cmp = (a.date + a.heure).localeCompare(b.date + b.heure);
      return a.statut === "a-venir" ? cmp : -cmp;
    })
    .slice(0, 6);

  return (
    <Card>
      <CardHeader
        icon={<Video size={15} />}
        title="Rendez-vous Meet"
        subtitle="Prochaines sessions et consultations récentes"
        action={
          <Link href="/agenda" className="shrink-0 text-xs font-semibold text-brand-600 hover:underline">
            Agenda →
          </Link>
        }
      />
      <ul className="space-y-1 px-3 py-3">
        {affiches.map((rdv: RendezVous) => {
          const eleve = eleves.find((e) => e.id === rdv.eleveId);
          return (
            <li key={rdv.id}>
              <Link
                href={`/eleves/${rdv.eleveId}`}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-white/60"
              >
                {eleve ? (
                  <Avatar prenom={eleve.prenom} nom={eleve.nom} couleur={eleve.couleur} taille="sm" />
                ) : (
                  <span className="h-8 w-8 shrink-0 rounded-full bg-slate-200" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {eleve ? `${eleve.prenom} ${eleve.nom}` : "Apprenant supprimé"}
                  </p>
                  <p className="truncate text-xs text-slate-500">{rdv.sujet}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-bold tabular-nums text-slate-600">
                    {formatDateCourte(rdv.date)} · {rdv.heure}
                  </p>
                  <div className="mt-1 flex justify-end">
                    <BadgeStatutRdv statut={rdv.statut} />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
