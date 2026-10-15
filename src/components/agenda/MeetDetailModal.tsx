"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarSync,
  ExternalLink,
  MessageSquare,
  NotebookPen,
  Sparkles,
  Video,
} from "lucide-react";
import { Avatar, Badge, BadgeSentiment, Bouton, Modal } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { TYPE_APPEL_LABEL } from "@/types";
import { BadgeAssigne, BadgeStatutRdv } from "./PuceMeet";
import { nomEleve } from "./vm";
import type { MeetVM } from "./vm";

const DUREES = [15, 20, 30, 45, 60];

const classesChamp =
  "glass-soft w-full rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-brand-300/60";

/**
 * Détail d'un rendez-vous :
 *  - passé  → notes Google Meet (résumé, points clés, prochaine étape)
 *  - à venir → replanification (date, heure, durée) + assignation (admin)
 */
export function MeetDetailModal({
  vm,
  estAdmin,
  ouvert,
  onClose,
  onEnregistrer,
  onAssigner,
}: {
  vm: MeetVM | null;
  estAdmin: boolean;
  ouvert: boolean;
  onClose: () => void;
  onEnregistrer: (vm: MeetVM, date: string, heure: string, dureeMin: number) => void;
  onAssigner: (vm: MeetVM, nom: string) => void;
}) {
  /* Remonté pour chaque rendez-vous (key côté page) : les champs de
     replanification partent des valeurs du RDV ouvert. */
  const [date, setDate] = useState(vm?.rdv.date ?? "");
  const [heure, setHeure] = useState(vm?.rdv.heure ?? "");
  const [duree, setDuree] = useState(vm?.rdv.dureeMin ?? 30);
  const [assigne, setAssigne] = useState(vm?.rdv.assigneA ?? "");
  const { utilisateurs } = useStore();

  if (!vm) return null;
  const { rdv } = vm;
  const notes = rdv.resumeMeet;
  const modifiable = rdv.statut === "a-venir";

  return (
    <Modal ouvert={ouvert} onClose={onClose} large>
      {/* ── En-tête ── */}
      <div className="border-b border-white/60 bg-gradient-to-br from-violet-500/10 via-brand-500/5 to-amber-400/10 px-6 py-5">
        <div className="flex items-center gap-3">
          {vm.eleve ? (
            <Avatar prenom={vm.eleve.prenom} nom={vm.eleve.nom} couleur={vm.eleve.couleur} taille="lg" />
          ) : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-bold text-ink">{nomEleve(vm)}</h3>
              <BadgeStatutRdv statut={rdv.statut} />
              <Badge>{TYPE_APPEL_LABEL[rdv.type]}</Badge>
            </div>
            <p className="mt-0.5 truncate text-sm text-slate-500">{rdv.sujet}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {rdv.date.split("-").reverse().join("/")} · {rdv.heure}
              {rdv.statut === "termine" && notes ? ` · ${notes.dureeReelleMin} min réelles` : ` · ${rdv.dureeMin} min`}
              {rdv.assigneA ? ` · avec ${rdv.assigneA}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ── Notes Google Meet (appel passé) ── */}
      {rdv.statut === "termine" ? (
        notes ? (
          <div className="space-y-4 px-6 py-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400/20 to-brand-400/20 text-violet-600">
                <Sparkles size={15} />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">Notes Google Meet</p>
                <p className="text-xs text-slate-400">
                  Générées automatiquement pendant la visio ({rdv.conferenceId ?? "conférence Meet"})
                </p>
              </div>
              <BadgeSentiment sentiment={notes.sentiment} />
            </div>

            <p className="rounded-2xl bg-white/60 p-4 text-sm leading-relaxed text-slate-600 ring-1 ring-white/70">
              {notes.texte}
            </p>

            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Points clés</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {notes.pointsCles.map((p) => (
                  <Badge key={p}>{p}</Badge>
                ))}
              </div>
            </div>

            {notes.declarations.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2">
                <MessageSquare size={13} className="text-violet-500" />
                <span className="text-xs font-semibold text-violet-700">
                  L&apos;apprenant déclare ne pas comprendre :
                </span>
                {notes.declarations.map((d) => (
                  <span key={d} className="text-xs font-medium text-violet-600">
                    {d}
                  </span>
                ))}
              </div>
            ) : null}

            {notes.prochaineEtape ? (
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Prochaine étape : </span>
                {notes.prochaineEtape}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/60 pt-4">
              <a
                href={rdv.meetLink ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="glass-soft inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-white/75 hover:text-ink"
              >
                <Video size={14} /> Ouvrir la conférence Meet <ExternalLink size={11} />
              </a>
              {vm.eleve ? (
                <Link
                  href={`/eleves/${vm.eleve.id}`}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  Fiche de l&apos;apprenant →
                </Link>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="px-6 py-10 text-center">
            <NotebookPen size={26} className="mx-auto text-slate-300" />
            <p className="mt-2 font-medium text-slate-600">Pas de notes Meet</p>
            <p className="text-sm text-slate-400">
              Aucune note n&apos;a été générée pour cette visio (« Prendre des notes pour moi » désactivé).
            </p>
          </div>
        )
      ) : null}

      {/* ── Replanification (à venir) ── */}
      {modifiable ? (
        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400/20 to-violet-400/20 text-brand-600">
              <CalendarSync size={15} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Replanifier la visio</p>
              <p className="text-xs text-slate-400">
                La modification est propagée directement à l&apos;événement Google Calendar / Meet.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Date</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={classesChamp} />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Heure</span>
              <input type="time" step={300} value={heure} onChange={(e) => setHeure(e.target.value)} className={classesChamp} />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Durée</span>
              <select value={duree} onChange={(e) => setDuree(Number(e.target.value))} className={classesChamp}>
                {DUREES.map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </label>
          </div>

          {estAdmin ? (
            <div className="space-y-1.5">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Assignée à</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    setAssigne("");
                    onAssigner(vm, "");
                  }}
                  className={cn(
                    "glass-soft rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                    assigne === "" ? "border-amber-400/70 bg-amber-400/15 text-amber-700" : "text-slate-500 hover:bg-white/75"
                  )}
                >
                  — Personne —
                </button>
                {utilisateurs.map((u) => (
                  <button
                    key={u.nom}
                    onClick={() => {
                      setAssigne(u.nom);
                      onAssigner(vm, u.nom);
                    }}
                    className={cn(
                      "glass-soft rounded-xl px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-px hover:bg-white/75",
                      assigne === u.nom ? "border-brand-400/70 bg-brand-400/15 text-brand-700" : "text-slate-600"
                    )}
                  >
                    {u.nom}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400">
                {rdv.assignePar ? `Assignée initialement par ${rdv.assignePar}. ` : ""}
                L&apos;animateur assigné ne voit que ses rendez-vous.
              </p>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <BadgeAssigne nom={rdv.assigneA} /> — seule l&apos;équipe admin peut réassigner une visio.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/60 pt-4">
            <a
              href={rdv.meetLink ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="btn-neutral px-3.5 py-2 text-xs"
            >
              <Video size={14} /> Rejoindre le Meet
            </a>
            <Bouton
              onClick={() => onEnregistrer(vm, date, heure, duree)}
              disabled={!date || !heure}
            >
              <CalendarSync size={14} /> Enregistrer dans Google Calendar
            </Bouton>
          </div>
        </div>
      ) : null}

      {/* ── Annulé ── */}
      {rdv.statut === "annule" ? (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-slate-500">
            Cette visio a été annulée. Réactivez-la en la replanifiant depuis Google Calendar.
          </p>
        </div>
      ) : null}
    </Modal>
  );
}
