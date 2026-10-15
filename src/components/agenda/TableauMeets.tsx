"use client";

import Link from "next/link";
import { NotebookPen, Video } from "lucide-react";
import { Avatar, EmptyState } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { TYPE_APPEL_LABEL } from "@/types";
import { BadgeAssigne, BadgeStatutRdv } from "./PuceMeet";
import type { MeetVM } from "./vm";

const classesInput =
  "glass-soft rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-300/60 disabled:opacity-60";

/** Vue tableau : date et heure éditables en ligne, assignation réservée à l'admin */
export function TableauMeets({
  vms,
  peutDeplacer,
  estAdmin,
  enSync,
  onDeplacer,
  onAssigner,
  onOuvrir,
}: {
  vms: MeetVM[];
  peutDeplacer: (vm: MeetVM) => boolean;
  estAdmin: boolean;
  enSync: (id: string) => boolean;
  onDeplacer: (vm: MeetVM, date: string, heure: string) => void;
  onAssigner: (vm: MeetVM, nom: string) => void;
  onOuvrir: (vm: MeetVM) => void;
}) {
  const { utilisateurs } = useStore();
  const parDate = (a: MeetVM, b: MeetVM) =>
    (a.rdv.date + a.rdv.heure).localeCompare(b.rdv.date + b.rdv.heure);
  const aVenir = vms.filter((vm) => vm.rdv.statut === "a-venir").sort(parDate);
  const historique = vms
    .filter((vm) => vm.rdv.statut !== "a-venir")
    .sort(parDate)
    .reverse();

  if (vms.length === 0) {
    return (
      <EmptyState
        titre="Aucun rendez-vous"
        description="Aucun Meet ne vous est assigné pour le moment."
        icon={<Video size={26} />}
      />
    );
  }

  return (
    <div className="space-y-1 px-2 py-2">
      {/* ── À venir ── */}
      <LigneSection libelle="À venir — glissez dans l'agenda ou éditez la date / l'heure" />
      {aVenir.map((vm) => {
        const editable = peutDeplacer(vm);
        return (
          <div
            key={vm.rdv.id}
            className={cn(
              "glass-soft flex flex-wrap items-center gap-2.5 rounded-xl px-3 py-2",
              enSync(vm.rdv.id) && "animate-pulse"
            )}
          >
            <input
              type="date"
              value={vm.rdv.date}
              disabled={!editable}
              onChange={(e) => e.target.value && onDeplacer(vm, e.target.value, vm.rdv.heure)}
              className={cn(classesInput, "w-[128px]")}
              aria-label="Date du Meet"
            />
            <input
              type="time"
              value={vm.rdv.heure}
              disabled={!editable}
              step={300}
              onChange={(e) => e.target.value && onDeplacer(vm, vm.rdv.date, e.target.value)}
              className={cn(classesInput, "w-[86px]")}
              aria-label="Heure du Meet"
            />
            {vm.eleve ? (
              <Link href={`/eleves/${vm.eleve.id}`} className="flex min-w-0 items-center gap-2">
                <Avatar prenom={vm.eleve.prenom} nom={vm.eleve.nom} couleur={vm.eleve.couleur} taille="sm" />
                <span className="truncate text-sm font-semibold text-slate-800 hover:text-brand-600">
                  {vm.eleve.prenom} {vm.eleve.nom}
                </span>
              </Link>
            ) : (
              <span className="text-sm text-slate-400">Apprenant inconnu</span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-slate-600">{vm.rdv.sujet}</p>
              <p className="text-xs text-slate-400">
                {TYPE_APPEL_LABEL[vm.rdv.type]} · {vm.rdv.dureeMin} min
              </p>
            </div>

            {estAdmin ? (
              <select
                value={vm.rdv.assigneA}
                onChange={(e) => onAssigner(vm, e.target.value)}
                className={cn(classesInput, "cursor-pointer")}
                aria-label="Assigner à"
              >
                <option value="">— Non assigné —</option>
                {utilisateurs.map((u) => (
                  <option key={u.nom} value={u.nom}>
                    {u.nom}
                  </option>
                ))}
              </select>
            ) : (
              <BadgeAssigne nom={vm.rdv.assigneA} />
            )}

            {vm.rdv.meetLink ? (
              <a
                href={vm.rdv.meetLink}
                target="_blank"
                rel="noreferrer"
                className="glass-soft rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/75 hover:text-brand-600"
                title="Ouvrir dans Google Meet"
              >
                <Video size={15} />
              </a>
            ) : null}
            <button
              onClick={() => onOuvrir(vm)}
              className="glass-soft rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/75 hover:text-ink"
              title="Détails"
            >
              <NotebookPen size={15} />
            </button>
          </div>
        );
      })}

      {/* ── Historique ── */}
      {historique.length > 0 ? (
        <>
          <LigneSection libelle="Passés — cliquer sur un appel pour lire les notes Google Meet" />
          {historique.map((vm) => (
            <button
              key={vm.rdv.id}
              onClick={() => onOuvrir(vm)}
              className={cn(
                "glass-soft flex w-full flex-wrap items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all hover:-translate-y-px hover:bg-white/75",
                vm.rdv.statut === "annule" && "opacity-60"
              )}
            >
              <span className="w-[128px] px-2 text-xs font-bold text-slate-600">
                {vm.rdv.date.split("-").reverse().slice(0, 2).join("/")}
              </span>
              <span className="w-[86px] text-xs font-semibold tabular-nums text-slate-500">
                {vm.rdv.heure}
              </span>
              {vm.eleve ? (
                <span className="flex min-w-0 items-center gap-2">
                  <Avatar prenom={vm.eleve.prenom} nom={vm.eleve.nom} couleur={vm.eleve.couleur} taille="sm" />
                  <span className="truncate text-sm font-semibold text-slate-800">
                    {vm.eleve.prenom} {vm.eleve.nom}
                  </span>
                </span>
              ) : (
                <span className="text-sm text-slate-400">Apprenant inconnu</span>
              )}
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm text-slate-600", vm.rdv.statut === "annule" && "line-through")}>
                  {vm.rdv.sujet}
                </p>
                <p className="text-xs text-slate-400">
                  {TYPE_APPEL_LABEL[vm.rdv.type]} · {vm.rdv.dureeMin} min · avec {vm.rdv.assigneA || "—"}
                </p>
              </div>
              <BadgeStatutRdv statut={vm.rdv.statut} />
              {vm.rdv.resumeMeet ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-400/15 px-2 py-0.5 text-xs font-semibold text-violet-600">
                  <NotebookPen size={11} /> Notes Meet
                </span>
              ) : null}
            </button>
          ))}
        </>
      ) : null}
    </div>
  );
}

function LigneSection({ libelle }: { libelle: string }) {
  return (
    <p className="px-2 pt-2 pb-1 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">
      {libelle}
    </p>
  );
}
