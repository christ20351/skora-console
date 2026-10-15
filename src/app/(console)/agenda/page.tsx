"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Loader2,
  PhoneCall,
  Table2,
  Target,
  TriangleAlert,
  UserCog,
} from "lucide-react";
import { analyserRisque, AUJOURDHUI } from "@/features/risque";
import { joursEntre } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { ROLE_LABEL } from "@/types";
import { Avatar, Badge, Card, CardHeader, EmptyState } from "@/components/ui";
import { CalendarMois } from "@/components/agenda/CalendarMois";
import { CalendarSemaine } from "@/components/agenda/CalendarSemaine";
import { TableauMeets } from "@/components/agenda/TableauMeets";
import { MeetDetailModal } from "@/components/agenda/MeetDetailModal";
import { lundiDe, iso } from "@/features/agenda/dates";
import { synchroniserMeet, verifierSynchronisation } from "@/features/agenda/sync";
import type { EtatSync } from "@/features/agenda/sync";
import type { MeetVM } from "@/components/agenda/vm";

const VUES = [
  { cle: "mois", label: "Mois", icon: CalendarDays },
  { cle: "semaine", label: "Semaine", icon: CalendarRange },
  { cle: "tableau", label: "Tableau", icon: Table2 },
] as const;
type CleVue = (typeof VUES)[number]["cle"];

interface Toast {
  id: number;
  genre: "ok" | "erreur";
  texte: string;
}

export default function PageAgenda() {
  const {
    meets, eleves, lacunes, appels, tests, bulletins, utilisateurs,
    utilisateur, deplacerMeet, assignerMeet, definirUtilisateur,
  } = useStore();

  const [vue, setVue] = useState<CleVue>("mois");
  const [ancre, setAncre] = useState(AUJOURDHUI);
  const [sync, setSync] = useState<EtatSync | null>(null);
  const [syncEnCours, setSyncEnCours] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [rdvOuvert, setRdvOuvert] = useState<MeetVM | null>(null);

  /* État de la connexion Google Calendar */
  useEffect(() => {
    verifierSynchronisation().then(setSync);
  }, []);

  const estAdmin = utilisateur.role === "admin";

  /* Rôle : l'admin voit tout, un animateur voit seulement ce qui lui est assigné */
  const vms: MeetVM[] = useMemo(
    () =>
      meets
        .filter((m) => estAdmin || m.assigneA === utilisateur.nom)
        .map((rdv) => ({ rdv, eleve: eleves.find((e) => e.id === rdv.eleveId) }))
        .sort((a, b) => (a.rdv.date + a.rdv.heure).localeCompare(b.rdv.date + b.rdv.heure)),
    [meets, eleves, estAdmin, utilisateur.nom]
  );

  const peutDeplacer = (vm: MeetVM) =>
    vm.rdv.statut === "a-venir" && (estAdmin || vm.rdv.assigneA === utilisateur.nom);
  const enSync = (id: string) => syncEnCours.has(id);

  function ajouterToast(genre: Toast["genre"], texte: string) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, genre, texte }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }

  /** Optimiste : mise à jour locale immédiate, puis propagation Google Calendar */
  async function deplacerAvecSync(
    vm: MeetVM,
    date: string,
    heure: string,
    dureeMin?: number
  ) {
    if (vm.rdv.date === date && vm.rdv.heure === heure && vm.rdv.dureeMin === (dureeMin ?? vm.rdv.dureeMin))
      return;
    deplacerMeet(vm.rdv.id, date, heure, dureeMin);
    setSyncEnCours((prev) => new Set(prev).add(vm.rdv.id));
    const res = await synchroniserMeet(vm.rdv.id, { date, heure, dureeMin: dureeMin ?? vm.rdv.dureeMin });
    setSyncEnCours((prev) => {
      const suivant = new Set(prev);
      suivant.delete(vm.rdv.id);
      return suivant;
    });
    if (res.ok && res.mode === "google")
      ajouterToast("ok", `« ${vm.rdv.sujet} » replanifié — synchronisé avec Google Calendar ✓`);
    else if (res.ok) ajouterToast("ok", `« ${vm.rdv.sujet} » replanifié`);
    else ajouterToast("erreur", `Synchro Google échouée (${res.erreur}) — modification conservée localement.`);
  }

  async function assignerAvecSync(vm: MeetVM, nom: string) {
    assignerMeet(vm.rdv.id, nom);
    setSyncEnCours((prev) => new Set(prev).add(vm.rdv.id));
    const res = await synchroniserMeet(vm.rdv.id, { assigneA: nom });
    setSyncEnCours((prev) => {
      const suivant = new Set(prev);
      suivant.delete(vm.rdv.id);
      return suivant;
    });
    const cible = nom ? `assigné à ${nom}` : "désassigné";
    if (res.ok && res.mode === "google") ajouterToast("ok", `Meet ${cible} — synchronisé avec Google Calendar ✓`);
    else if (res.ok) ajouterToast("ok", `Meet ${cible}`);
    else ajouterToast("erreur", `Synchro Google échouée (${res.erreur}) — modification conservée localement.`);
  }

  /* Navigation temporelle */
  const surChangerMois = (delta: number) => {
    const [y, m] = ancre.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setAncre(iso(d.getFullYear(), d.getMonth(), d.getDate()));
  };
  const annee = Number(ancre.slice(0, 4));
  const mois = Number(ancre.slice(5, 7)) - 1;

  /* Stats et listes annexes */
  const aVenir = vms.filter((vm) => vm.rdv.statut === "a-venir");
  const cetteSemaine = aVenir.filter(
    (vm) => Math.abs(joursEntre(AUJOURDHUI, vm.rdv.date)) <= 7
  );
  const nonAssignes = estAdmin ? aVenir.filter((vm) => !vm.rdv.assigneA) : [];
  const notesDisponibles = vms.filter((vm) => vm.rdv.resumeMeet).length;

  const recommandations = eleves
    .map((e) => ({ eleve: e, risque: analyserRisque(e, lacunes, appels, tests, bulletins) }))
    .filter(({ risque }) => risque.action.type === "appel" || risque.action.type === "test")
    .sort((a, b) => b.risque.score - a.risque.score)
    .slice(0, 4);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-5">
        {/* ── Barre d'outils + vue courante ── */}
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="glass-soft flex rounded-xl p-1">
              {VUES.map((v) => (
                <button
                  key={v.cle}
                  onClick={() => setVue(v.cle)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                    vue === v.cle
                      ? "bg-white/90 text-ink shadow-[0_4px_12px_-6px_rgba(90,60,120,0.35)]"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <v.icon size={13} /> {v.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* État de la synchronisation (visible uniquement quand Google est connecté) */}
              {sync === null ? (
                <span className="glass-soft flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400">
                  <Loader2 size={12} className="animate-spin" /> Connexion…
                </span>
              ) : sync.mode === "google" ? (
                <span
                  className="glass-soft flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-600"
                  title={sync.agenda ?? undefined}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Google Calendar connecté
                </span>
              ) : null}

              {/* Utilisateur courant */}
              <label className="glass-soft flex items-center gap-2 rounded-xl px-3 py-2 text-xs">
                <UserCog size={13} className="text-slate-400" />
                <span className="text-slate-400">Connecté :</span>
                <select
                  value={utilisateur.id}
                  onChange={(e) => {
                    const u = utilisateurs.find((x) => x.id === e.target.value);
                    if (u) definirUtilisateur(u);
                  }}
                  className="cursor-pointer bg-transparent font-bold text-slate-700 outline-none"
                >
                  {utilisateurs.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nom} · {ROLE_LABEL[u.role]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="border-t border-white/60">
            {vue === "mois" ? (
              <CalendarMois
                vms={vms}
                annee={annee}
                mois={mois}
                surChangerMois={surChangerMois}
                surAujourdhui={() => setAncre(AUJOURDHUI)}
                peutDeplacer={peutDeplacer}
                enSync={enSync}
                onDeplacer={(vm, date) => deplacerAvecSync(vm, date, vm.rdv.heure)}
                onOuvrir={setRdvOuvert}
              />
            ) : vue === "semaine" ? (
              <CalendarSemaine
                vms={vms}
                debutSemaine={lundiDe(ancre)}
                surChangerSemaine={(delta) => setAncre((a) => {
                  const [y, m, d] = a.split("-").map(Number);
                  const dt = new Date(y, m - 1, d + delta);
                  return iso(dt.getFullYear(), dt.getMonth(), dt.getDate());
                })}
                surAujourdhui={() => setAncre(AUJOURDHUI)}
                peutDeplacer={peutDeplacer}
                enSync={enSync}
                onDeplacer={(vm, date, heure) => deplacerAvecSync(vm, date, heure)}
                onOuvrir={setRdvOuvert}
              />
            ) : (
              <TableauMeets
                vms={vms}
                peutDeplacer={peutDeplacer}
                estAdmin={estAdmin}
                enSync={enSync}
                onDeplacer={(vm, date, heure) => deplacerAvecSync(vm, date, heure)}
                onAssigner={assignerAvecSync}
                onOuvrir={setRdvOuvert}
              />
            )}
          </div>
        </Card>

        {/* Aide mémoire selon la vue */}
        <p className="px-1 text-xs text-slate-400">
          {vue === "tableau"
            ? "Modifiez directement la date ou l'heure dans le tableau — chaque changement est poussé vers l'événement Google Calendar / Meet."
            : "Glissez-déposez une visio d'un jour à l'autre (ou de créneau en créneau en vue semaine) pour la replanifier : le changement est appliqué dans Google Calendar et sur le lien Meet."}
          {" "}Un appel passé se clique pour lire ses notes Google Meet.
        </p>
      </div>

      {/* ── Colonne latérale ── */}
      <div className="space-y-5">
        <Card>
          <div className="bg-gradient-to-br from-violet-500/15 via-brand-500/10 to-amber-400/15 px-5 py-4">
            <p className="text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">
              {estAdmin ? "Tous les rendez-vous" : `Rendez-vous de ${utilisateur.nom}`}
            </p>
            <div className="mt-2 flex items-end gap-4">
              <span className="text-3xl font-bold text-ink">{aVenir.length}</span>
              <span className="pb-1 text-xs text-slate-500">
                à venir · {cetteSemaine.length} cette semaine · {notesDisponibles} avec notes Meet
              </span>
            </div>
          </div>
        </Card>

        {estAdmin ? (
          <Card>
            <CardHeader
              title="À assigner"
              subtitle="Visios sans animateur — cliquez pour assigner"
              icon={<TriangleAlert size={15} />}
            />
            {nonAssignes.length === 0 ? (
              <p className="px-5 py-4 text-sm text-slate-400">Tout est assigné 🎉</p>
            ) : (
              <div className="divide-y divide-white/50">
                {nonAssignes.map((vm) => (
                  <div key={vm.rdv.id} className="px-4 py-3">
                    <button onClick={() => setRdvOuvert(vm)} className="block w-full text-left">
                      <p className="text-sm font-semibold text-slate-800">{vm.rdv.sujet}</p>
                      <p className="text-xs text-slate-400">
                        {vm.eleve?.prenom} {vm.eleve?.nom} · {vm.rdv.date.split("-").reverse().slice(0, 2).join("/")} à {vm.rdv.heure}
                      </p>
                    </button>
                    <div className="mt-2 flex gap-1.5">
                      {utilisateurs.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => assignerAvecSync(vm, u.nom)}
                          className="glass-soft rounded-lg px-2.5 py-1 text-xs font-bold text-slate-600 transition-all hover:-translate-y-px hover:bg-white/80"
                        >
                          → {u.nom}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ) : null}

        <Card>
          <CardHeader
            title="Recommandés maintenant"
            subtitle="Prochaine action recommandée : appel ou premier test"
            icon={<Target size={16} />}
          />
          {recommandations.length === 0 ? (
            <EmptyState titre="Tout est à jour" description="Aucune action urgente recommandée." />
          ) : (
            <div className="divide-y divide-white/50">
              {recommandations.map(({ eleve, risque }) => (
                <Link
                  key={eleve.id}
                  href={risque.action.type === "test" ? `/diagnostics?eleve=${eleve.id}` : `/eleves/${eleve.id}`}
                  className="flex flex-wrap items-center gap-3 px-5 py-3 transition-colors hover:bg-white/50"
                >
                  <Avatar prenom={eleve.prenom} nom={eleve.nom} couleur={eleve.couleur} taille="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {eleve.prenom} {eleve.nom}
                      <span className="ml-2 text-xs font-normal text-slate-400">{eleve.niveauScolaire}</span>
                    </p>
                    <p className="truncate text-xs text-slate-500">Score {risque.score}</p>
                  </div>
                  <Badge
                    className={
                      risque.action.type === "appel"
                        ? "bg-sky-400/15 text-sky-600"
                        : "bg-violet-400/15 text-violet-600"
                    }
                  >
                    {risque.action.type === "appel" ? <PhoneCall size={11} /> : <Target size={11} />}
                    {risque.action.libelle}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── Détail / notes Meet ── */}
      {rdvOuvert ? (
        <MeetDetailModal
          key={rdvOuvert.rdv.id}
          vm={rdvOuvert}
          estAdmin={estAdmin}
          ouvert
          onClose={() => setRdvOuvert(null)}
          onEnregistrer={(vm, date, heure, duree) => {
            deplacerAvecSync(vm, date, heure, duree);
            setRdvOuvert(null);
          }}
          onAssigner={assignerAvecSync}
        />
      ) : null}

      {/* ── Toasts de synchronisation ── */}
      <div className="pointer-events-none fixed right-5 bottom-5 z-[60] flex w-80 flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={cn(
                "glass-strong pointer-events-auto flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm",
                t.genre === "ok" && "text-emerald-700",
                t.genre === "erreur" && "text-brand-700"
              )}
            >
              {t.genre === "ok" ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : null}
              {t.genre === "erreur" ? <TriangleAlert size={16} className="mt-0.5 shrink-0" /> : null}
              <span className="font-medium">{t.texte}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
