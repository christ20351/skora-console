"use client";

import { useState } from "react";
import { PhoneCall } from "lucide-react";
import { Card, CardHeader, FiltrePeriode } from "@/components/ui";
import type { Periode } from "@/components/ui";
import { Donut, PALETTE_DONUT } from "@/components/charts";
import type { DonneeDonut } from "@/components/charts";
import { useStore } from "@/store";
import { AUJOURDHUI } from "@/lib/constantes";
import {
  fenetreJours,
  fenetreMois,
  fenetreSemaines,
  libelleJour,
  libelleMois,
} from "@/lib/utils";

const FENETRES: Record<Periode, string> = {
  jour: "7 derniers jours",
  semaine: "6 dernières semaines",
  mois: "6 derniers mois",
};

/** Appels réalisés — diagramme circulaire filtrable jour / semaine / mois */
export function AppelsCirculaire() {
  const { appels } = useStore();
  const [periode, setPeriode] = useState<Periode>("mois");
  const effectues = appels.filter((a) => a.statut === "effectue");

  const dansFenetre = (debut: string, fin: string) =>
    effectues.filter((a) => a.date >= debut && a.date <= fin).length;

  const buckets =
    periode === "jour"
      ? fenetreJours(AUJOURDHUI, 7).map((j) => ({
          label: libelleJour(j),
          valeur: dansFenetre(j, j),
        }))
      : periode === "semaine"
        ? fenetreSemaines(AUJOURDHUI, 6).map((s) => ({
            label: s.label,
            valeur: dansFenetre(s.debut, s.fin),
          }))
        : fenetreMois(AUJOURDHUI, 6).map((m) => ({
            label: libelleMois(m),
            valeur: dansFenetre(`${m}-01`, `${m}-31`),
          }));

  const donnees: DonneeDonut[] = buckets.map((b, i) => ({
    ...b,
    couleur: PALETTE_DONUT[i % PALETTE_DONUT.length],
  }));
  const total = donnees.reduce((s, d) => s + d.valeur, 0);

  return (
    <Card>
      <CardHeader
        icon={<PhoneCall size={15} />}
        title="Appels réalisés"
        subtitle={`${FENETRES[periode]} · répartition par ${periode === "jour" ? "jour" : periode === "semaine" ? "semaine" : "mois"}`}
        action={<FiltrePeriode valeur={periode} onChange={setPeriode} />}
      />
      <div className="flex flex-col items-center justify-center gap-6 px-5 py-6 sm:flex-row lg:gap-12">
        <Donut donnees={donnees}>
          <p className="text-3xl font-bold tracking-tight text-ink">{total}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">appels</p>
        </Donut>
        <ul className="grid w-full max-w-xs grid-cols-2 gap-x-6 gap-y-2">
          {donnees.map((d) => (
            <li key={d.label} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: d.valeur === 0 ? "#cbd5e1" : d.couleur }}
              />
              <span className="truncate font-semibold text-slate-600">{d.label}</span>
              <span className="ml-auto font-bold tabular-nums text-ink">{d.valeur}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
