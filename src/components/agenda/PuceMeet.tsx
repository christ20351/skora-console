"use client";

import { cn } from "@/lib/utils";
import { STATUT_RDV_LABEL } from "@/types";
import type { RendezVous } from "@/types";
import { useStore } from "@/store";
import { styleAssignation, nomEleve } from "./vm";
import type { MeetVM } from "./vm";

/**
 * Puce d'un rendez-vous dans les vues calendaires.
 * Passée → cliquable (notes Meet). À venir → déplaçable (drag & drop).
 */
export function PuceMeet({
  vm,
  variante,
  draggable,
  enSync,
  surDebutDeplacement,
  surFinDeplacement,
  onOuvrir,
  className,
}: {
  vm: MeetVM;
  variante: "mois" | "semaine";
  draggable: boolean;
  enSync?: boolean;
  surDebutDeplacement?: (vm: MeetVM) => void;
  surFinDeplacement?: () => void;
  onOuvrir: (vm: MeetVM) => void;
  className?: string;
}) {
  const { rdv } = vm;
  const { utilisateurs } = useStore();
  const passe = rdv.statut === "termine";
  const annule = rdv.statut === "annule";
  const style = styleAssignation(rdv.assigneA, utilisateurs);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOuvrir(vm)}
      onKeyDown={(e) => e.key === "Enter" && onOuvrir(vm)}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", rdv.id);
        e.dataTransfer.effectAllowed = "move";
        surDebutDeplacement?.(vm);
      }}
      onDragEnd={surFinDeplacement}
      title={`${rdv.heure} · ${nomEleve(vm)} — ${rdv.sujet}${
        rdv.assigneA ? ` (avec ${rdv.assigneA})` : " (non assigné)"
      }${passe ? " — cliquer pour les notes Meet" : draggable ? " — glisser pour replanifier" : ""}`}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-lg px-2 py-1 text-left transition-all",
        style.puce,
        passe && "opacity-55 saturate-50",
        annule && "line-through opacity-45",
        draggable && "cursor-grab hover:-translate-y-px hover:shadow-md active:cursor-grabbing",
        enSync && "animate-pulse",
        variante === "semaine" && "shadow-[0_4px_14px_-6px_rgba(60,40,90,0.35)]",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        {rdv.statut === "a-venir" && !rdv.assigneA ? (
          <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-amber-500" title="Non assigné" />
        ) : rdv.assigneA ? (
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", style.point)} />
        ) : null}
        {enSync ? (
          <span className="text-xs font-bold tabular-nums">sync…</span>
        ) : (
          <span className="text-xs font-bold tabular-nums">{rdv.heure}</span>
        )}
        <span className="truncate text-xs font-semibold">
          {vm.eleve?.prenom ?? rdv.sujet}
        </span>
        {passe ? (
          <span className="ml-auto hidden shrink-0 text-[9px] font-bold opacity-70 group-hover:inline">notes →</span>
        ) : null}
      </div>
      {variante === "semaine" ? (
        <p className="truncate text-xs opacity-75">{rdv.sujet}</p>
      ) : null}
    </div>
  );
}

/** Libellé compact d'un statut (tableau, modal) */
export function BadgeStatutRdv({ statut }: { statut: RendezVous["statut"] }) {
  const styles: Record<RendezVous["statut"], string> = {
    "a-venir": "bg-violet-400/15 text-violet-600 ring-1 ring-violet-300/40",
    termine: "bg-white/60 text-slate-500 ring-1 ring-slate-200/60",
    annule: "bg-brand-400/15 text-brand-600 ring-1 ring-brand-300/40",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        styles[statut]
      )}
    >
      {statut === "a-venir" ? (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
      ) : null}
      {STATUT_RDV_LABEL[statut]}
    </span>
  );
}

/** Pastille assignée (lecture seule) */
export function BadgeAssigne({ nom }: { nom: string }) {
  const { utilisateurs } = useStore();
  if (!nom) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-amber-400/70 bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-700">
        Non assigné
      </span>
    );
  }
  const style = styleAssignation(nom, utilisateurs);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-white/70">
      <span className={cn("h-1.5 w-1.5 rounded-full", style.point)} />
      {nom}
    </span>
  );
}
