"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AUJOURDHUI } from "@/lib/constantes";
import {
  JOURS,
  ajouterJours,
  heureEnMinutes,
  minutesVersHeure,
  jourSemaine,
} from "@/features/agenda/dates";
import { PuceMeet } from "./PuceMeet";
import type { MeetVM } from "./vm";

const HEURE_DEBUT = 8; // 08:00
const HEURE_FIN = 20; // 20:00
const SLOT_MIN = 30;
const SLOT_H = 34; // px par créneau de 30 min
const NB_SLOTS = ((HEURE_FIN - HEURE_DEBUT) * 60) / SLOT_MIN;
const HAUT = NB_SLOTS * SLOT_H;

/** Vue hebdomadaire : glisser une puce change le jour ET le créneau horaire */
export function CalendarSemaine({
  vms,
  debutSemaine,
  surChangerSemaine,
  surAujourdhui,
  peutDeplacer,
  enSync,
  onDeplacer,
  onOuvrir,
}: {
  vms: MeetVM[];
  debutSemaine: string;
  surChangerSemaine: (delta: number) => void;
  surAujourdhui: () => void;
  peutDeplacer: (vm: MeetVM) => boolean;
  enSync: (id: string) => boolean;
  onDeplacer: (vm: MeetVM, dateISO: string, heure: string) => void;
  onOuvrir: (vm: MeetVM) => void;
}) {
  const jours = Array.from({ length: 7 }, (_, i) => ajouterJours(debutSemaine, i));
  const [survol, setSurvol] = useState<string | null>(null);

  const topPour = (rdv: MeetVM["rdv"]) =>
    ((heureEnMinutes(rdv.heure) - HEURE_DEBUT * 60) / SLOT_MIN) * SLOT_H;

  const finSemaine = ajouterJours(debutSemaine, 6);
  const labelPeriode = `${debutSemaine.slice(8)} – ${finSemaine.slice(8)} ${
    ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."][
      Number(finSemaine.slice(5, 7)) - 1
    ]
  }`;

  return (
    <div className="flex flex-col">
      {/* Barre de navigation */}
      <div className="flex items-center justify-between gap-3 border-b border-white/60 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => surChangerSemaine(-7)}
            className="glass-soft rounded-lg px-2.5 py-1.5 text-slate-600 transition-colors hover:bg-white/75 hover:text-ink"
            aria-label="Semaine précédente"
          >
            ‹
          </button>
          <button
            onClick={() => surChangerSemaine(7)}
            className="glass-soft rounded-lg px-2.5 py-1.5 text-slate-600 transition-colors hover:bg-white/75 hover:text-ink"
            aria-label="Semaine suivante"
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
        <p className="text-sm font-bold text-ink">Semaine du {labelPeriode}</p>
      </div>

      {/* En-têtes de jours */}
      <div className="flex border-b border-white/60 bg-white/30">
        <div className="w-11 shrink-0" />
        {jours.map((j) => {
          const estAujourdhui = j === AUJOURDHUI;
          return (
            <div
              key={j}
              className={cn(
                "flex-1 border-r border-white/40 py-1.5 text-center last:border-r-0",
                estAujourdhui && "bg-brand-400/10"
              )}
            >
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                {JOURS[jourSemaine(j)]}
              </p>
              <p
                className={cn(
                  "mx-auto mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                  estAujourdhui
                    ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_4px_10px_-3px_rgba(220,53,69,0.6)]"
                    : "text-slate-500"
                )}
              >
                {Number(j.slice(8))}
              </p>
            </div>
          );
        })}
      </div>

      {/* Grille horaire */}
      <div className="overflow-y-auto">
        <div className="flex" style={{ height: HAUT }}>
          {/* Rangée d'heures */}
          <div className="w-11 shrink-0">
            {Array.from({ length: HEURE_FIN - HEURE_DEBUT }, (_, i) => (
              <div key={i} style={{ height: SLOT_H * 2 }} className="relative">
                <span className="absolute -top-1.5 right-1.5 text-xs font-semibold tabular-nums text-slate-400">
                  {String(HEURE_DEBUT + i).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Colonnes jours */}
          {jours.map((j) => {
            const estAujourdhui = j === AUJOURDHUI;
            const duJour = vms.filter((vm) => vm.rdv.date === j);
            return (
              <div
                key={j}
                className={cn(
                  "relative flex-1 border-r border-white/40 last:border-r-0",
                  estAujourdhui && "bg-brand-400/[0.04]"
                )}
              >
                {/* Créneaux (cibles de dépôt) */}
                {Array.from({ length: NB_SLOTS }, (_, s) => {
                  const cle = `${j}|${s}`;
                  return (
                    <div
                      key={s}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setSurvol(cle);
                      }}
                      onDragLeave={() => setSurvol((sv) => (sv === cle ? null : sv))}
                      onDrop={(e) => {
                        e.preventDefault();
                        setSurvol(null);
                        const id = e.dataTransfer.getData("text/plain");
                        const vm = vms.find((v) => v.rdv.id === id);
                        if (!vm || !peutDeplacer(vm)) return;
                        const heure = minutesVersHeure(HEURE_DEBUT * 60 + s * SLOT_MIN);
                        if (vm.rdv.date !== j || vm.rdv.heure !== heure) onDeplacer(vm, j, heure);
                      }}
                      className={cn(
                        "border-b border-white/40 transition-colors",
                        s % 2 === 0 && "border-white/60",
                        survol === cle && "bg-brand-400/15 ring-2 ring-brand-400/50 ring-inset"
                      )}
                      style={{ height: SLOT_H }}
                    />
                  );
                })}

                {/* Puces positionnées */}
                {duJour.map((vm) => {
                  const haut = Math.max((vm.rdv.dureeMin / SLOT_MIN) * SLOT_H - 2, 26);
                  return (
                    <div
                      key={vm.rdv.id}
                      className="absolute inset-x-0.5 z-10"
                      style={{ top: topPour(vm.rdv), height: haut }}
                    >
                      <PuceMeet
                        vm={vm}
                        variante="semaine"
                        draggable={peutDeplacer(vm)}
                        enSync={enSync(vm.rdv.id)}
                        onOuvrir={onOuvrir}
                        className="h-full"
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
