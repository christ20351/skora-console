"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AUJOURDHUI } from "@/lib/constantes";
import { JOURS, MOIS_COMPLETS, grilleMois } from "@/features/agenda/dates";
import { PuceMeet } from "./PuceMeet";
import type { MeetVM } from "./vm";

/** Vue mensuelle : les puces à venir se glissent d'un jour à l'autre */
export function CalendarMois({
  vms,
  annee,
  mois,
  surChangerMois,
  surAujourdhui,
  peutDeplacer,
  enSync,
  onDeplacer,
  onOuvrir,
}: {
  vms: MeetVM[];
  annee: number;
  mois: number;
  surChangerMois: (delta: number) => void;
  surAujourdhui: () => void;
  peutDeplacer: (vm: MeetVM) => boolean;
  enSync: (id: string) => boolean;
  onDeplacer: (vm: MeetVM, dateISO: string) => void;
  onOuvrir: (vm: MeetVM) => void;
}) {
  const semaines = grilleMois(annee, mois);
  const [survol, setSurvol] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {/* Barre de navigation */}
      <div className="flex items-center justify-between gap-3 border-b border-white/60 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => surChangerMois(-1)}
            className="glass-soft rounded-lg px-2.5 py-1.5 text-slate-600 transition-colors hover:bg-white/75 hover:text-ink"
            aria-label="Mois précédent"
          >
            ‹
          </button>
          <button
            onClick={() => surChangerMois(1)}
            className="glass-soft rounded-lg px-2.5 py-1.5 text-slate-600 transition-colors hover:bg-white/75 hover:text-ink"
            aria-label="Mois suivant"
          >
            ›
          </button>
          <button
            onClick={surAujourdhui}
            className="glass-soft ml-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-white/75 hover:text-ink"
          >
            Aujourd&apos;hui
          </button>
        </div>
        <p className="text-sm font-bold text-ink">
          {MOIS_COMPLETS[mois]} {annee}
        </p>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-7 border-b border-white/60 bg-white/30">
        {JOURS.map((j) => (
          <div key={j} className="px-2 py-1.5 text-center text-xs font-bold tracking-wider text-slate-400 uppercase">
            {j}
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-7">
        {semaines.flat().map((dateISO) => {
          const [, m, d] = dateISO.split("-").map(Number);
          const horsMois = m - 1 !== mois;
          const duJour = vms
            .filter((vm) => vm.rdv.date === dateISO)
            .sort((a, b) => a.rdv.heure.localeCompare(b.rdv.heure));
          const estAujourdhui = dateISO === AUJOURDHUI;
          return (
            <div
              key={dateISO}
              onDragOver={(e) => {
                e.preventDefault();
                setSurvol(dateISO);
              }}
              onDragLeave={() => setSurvol((s) => (s === dateISO ? null : s))}
              onDrop={(e) => {
                e.preventDefault();
                setSurvol(null);
                const id = e.dataTransfer.getData("text/plain");
                const vm = vms.find((v) => v.rdv.id === id);
                if (vm && peutDeplacer(vm) && vm.rdv.date !== dateISO) onDeplacer(vm, dateISO);
              }}
              className={cn(
                "min-h-[96px] space-y-1 border-r border-b border-white/50 p-1.5 transition-colors",
                horsMois && "bg-white/15",
                survol === dateISO && "bg-brand-400/10 ring-2 ring-brand-400/50 ring-inset"
              )}
            >
              <div className="flex items-center justify-end px-1">
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold tabular-nums",
                    estAujourdhui
                      ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_4px_10px_-3px_rgba(220,53,69,0.6)]"
                      : horsMois
                        ? "text-slate-300"
                        : "text-slate-500"
                  )}
                >
                  {d}
                </span>
              </div>
              {duJour.slice(0, 3).map((vm) => (
                <PuceMeet
                  key={vm.rdv.id}
                  vm={vm}
                  variante="mois"
                  draggable={peutDeplacer(vm)}
                  enSync={enSync(vm.rdv.id)}
                  onOuvrir={onOuvrir}
                />
              ))}
              {duJour.length > 3 ? (
                <p className="px-1 text-xs font-semibold text-slate-400">
                  + {duJour.length - 3} autre{duJour.length - 3 > 1 ? "s" : ""}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
