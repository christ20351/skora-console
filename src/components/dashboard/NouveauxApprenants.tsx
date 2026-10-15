"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Card, CardHeader, FiltrePeriode } from "@/components/ui";
import type { Periode } from "@/components/ui";
import { Barres } from "@/components/charts";
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

/** Inscriptions des apprenants — bandes filtrables jour / semaine / mois */
export function NouveauxApprenants() {
  const { eleves } = useStore();
  const [periode, setPeriode] = useState<Periode>("mois");

  const dansFenetre = (debut: string, fin: string) =>
    eleves.filter((e) => e.inscritLe >= debut && e.inscritLe <= fin).length;

  const donnees =
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

  const total = donnees.reduce((s, d) => s + d.valeur, 0);

  return (
    <Card>
      <CardHeader
        icon={<UserPlus size={15} />}
        title="Nouveaux apprenants"
        subtitle={`${total} inscriptions · ${FENETRES[periode]}`}
        action={<FiltrePeriode valeur={periode} onChange={setPeriode} />}
      />
      <div className="px-5 py-5">
        <Barres donnees={donnees} barre="bg-brand-400" />
      </div>
    </Card>
  );
}
