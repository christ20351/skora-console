"use client";

import { Compass, Info, Palette, Users } from "lucide-react";
import { ANIMATEURS, ANNEE_SCOLAIRE } from "@/lib/constantes";
import { Card, CardHeader } from "@/components/ui";

export default function PageParametres() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card>
        <CardHeader title="Console" subtitle="Informations de la démo" icon={<Compass size={16} />} />
        <div className="space-y-3 px-5 py-4 text-sm">
          <Ligne label="Produit" valeur="Skora — Console d'accompagnement pédagogique" />
          <Ligne label="Année scolaire" valeur={ANNEE_SCOLAIRE} />
          <Ligne label="Données" valeur="100 % locales (démo) — aucune donnée réelle d'élève" />
          <Ligne label="Version" valeur="0.2.0" />
        </div>
      </Card>

      <Card>
        <CardHeader title="Équipe d'accompagnement" subtitle="Animateurs qui réalisent les appels" icon={<Users size={16} />} />
        <div className="flex flex-wrap gap-2 px-5 py-4">
          {ANIMATEURS.map((a) => (
            <span key={a} className="glass-soft flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 text-[10px] font-bold text-white">
                {a.slice(0, 2).toUpperCase()}
              </span>
              {a}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Identité visuelle" subtitle="Alignée sur le produit Skora" icon={<Palette size={16} />} />
        <div className="flex flex-wrap gap-2 px-5 py-4">
          {(["#dc3545", "#eb6673", "#f7a1aa", "#7c5cff", "#ffb478", "#241f26"] as const).map((c) => (
            <div key={c} className="flex flex-col items-center gap-1.5">
              <span className="h-11 w-11 rounded-xl shadow-inner ring-1 ring-white/60" style={{ background: c }} />
              <span className="text-[10px] font-medium text-slate-400">{c}</span>
            </div>
          ))}
          <p className="mt-1 w-full text-xs text-slate-500">
            Rouge Skora (#dc3545) en action principale, violet en accent, Instrument Sans pour le texte.
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader title="À propos de la boucle" subtitle="Le modèle d'accompagnement" icon={<Info size={16} />} />
        <div className="space-y-2 px-5 py-4 text-sm text-slate-600">
          <p>1. Bulletin saisi à la main → matières les plus basses priorisées.</p>
          <p>2. Test adaptatif : réussi → difficulté +1, raté → −1, chaque échec tagué par notion.</p>
          <p>3. Lacunes diagnostiquées, sévérisées par le niveau auquel elles ont cédé.</p>
          <p>4. Appels : le contexte humain + ce que l'élève déclare ne pas comprendre.</p>
          <p>5. Fiches de renfort calibrées → cahier imprimable remis à l'élève.</p>
          <p>6. Re-test : la maîtrise remonte, le score de risque baisse.</p>
        </div>
      </Card>
    </div>
  );
}

function Ligne({ label, valeur }: { label: string; valeur: string }) {
  return (
    <p className="flex justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-semibold text-slate-700">{valeur}</span>
    </p>
  );
}
