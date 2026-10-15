"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Info,
  Pencil,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import { useStore } from "@/store";
import { ROLE_AIDE, ROLE_LABEL, permissionsDe } from "@/types";
import type { Role, Utilisateur } from "@/types";
import { Bouton, Card, CardHeader, EmptyState, ProgressBar } from "@/components/ui";
import { MembreModal } from "@/components/equipe/MembreModal";
import { MatricePermissions } from "@/components/equipe/MatricePermissions";
import { cn } from "@/lib/utils";

export default function PageEquipe() {
  const {
    utilisateurs, meets, appels, utilisateur,
    definirUtilisateur, ajouterUtilisateur, modifierUtilisateur, supprimerUtilisateur,
  } = useStore();

  const estAdmin = utilisateur.role === "admin";
  const admins = utilisateurs.filter((u) => u.role === "admin");

  const [modalOuvert, setModalOuvert] = useState(false);
  const [enEdition, setEnEdition] = useState<Utilisateur | null>(null);
  const [suppressionId, setSuppressionId] = useState<string | null>(null);

  /* Hiérarchie : les admins d'abord, puis l'ordre alphabétique */
  const tri = useMemo(
    () =>
      [...utilisateurs].sort(
        (a, b) =>
          (a.role === "admin" ? 0 : 1) - (b.role === "admin" ? 0 : 1) ||
          a.nom.localeCompare(b.nom)
      ),
    [utilisateurs]
  );

  /* Charge : visios à venir + appels menés, par membre (le nom est la clé) */
  const charge = useMemo(() => {
    const visios = new Map<string, number>();
    const nbAppels = new Map<string, number>();
    for (const u of utilisateurs) {
      visios.set(u.nom, 0);
      nbAppels.set(u.nom, 0);
    }
    for (const m of meets)
      if (m.statut === "a-venir" && m.assigneA && visios.has(m.assigneA))
        visios.set(m.assigneA, visios.get(m.assigneA)! + 1);
    for (const a of appels)
      if (nbAppels.has(a.animateur)) nbAppels.set(a.animateur, nbAppels.get(a.animateur)! + 1);
    return { visios, nbAppels };
  }, [utilisateurs, meets, appels]);

  const maxVisios = Math.max(1, ...charge.visios.values());
  const estDernierAdmin = (u: Utilisateur) => u.role === "admin" && admins.length <= 1;

  const ouvrirAjout = () => {
    setEnEdition(null);
    setModalOuvert(true);
  };
  const ouvrirEdition = (u: Utilisateur) => {
    setEnEdition(u);
    setModalOuvert(true);
  };
  const enregistrer = (b: Parameters<typeof ajouterUtilisateur>[0]) => {
    if (enEdition) modifierUtilisateur(enEdition.id, b);
    else ajouterUtilisateur(b);
  };
  const surSupprimer = (u: Utilisateur) => {
    if (suppressionId === u.id) {
      supprimerUtilisateur(u.id);
      setSuppressionId(null);
      return;
    }
    setSuppressionId(u.id);
    window.setTimeout(
      () => setSuppressionId((cur) => (cur === u.id ? null : cur)),
      3000
    );
  };

  /* Un animateur consulte tout l'annuaire mais ne suit que sa propre charge */
  const chargeAffichee = estAdmin ? tri : tri.filter((u) => u.id === utilisateur.id);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-5">
        {/* ── Barre d'outils ── */}
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
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

            {estAdmin ? (
              <Bouton onClick={ouvrirAjout}>
                <UserPlus size={14} /> Ajouter un membre
              </Bouton>
            ) : (
              <span className="glass-soft rounded-xl px-3 py-2 text-xs font-semibold text-slate-400">
                Lecture seule — rôle {ROLE_LABEL[utilisateur.role]}
              </span>
            )}
          </div>
        </Card>

        {/* ── Rappel des droits pour un animateur ── */}
        {!estAdmin ? (
          <div className="glass-soft flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm text-slate-600 ring-1 ring-amber-200/60">
            <Info size={16} className="mt-0.5 shrink-0 text-amber-500" />
            <span>
              <b>Consultation seule.</b> Seuls les admins peuvent inviter des membres, changer
              les rôles ou retirer quelqu&apos;un — demandez à {admins[0]?.nom ?? "un admin"}.
            </span>
          </div>
        ) : null}

        {/* ── Annuaire ── */}
        <Card>
          <CardHeader
            title={`Membres (${utilisateurs.length})`}
            subtitle="Fonction, rôle et charge de chacun — le nom sert de clé d'assignation des visios"
            icon={<Users size={16} />}
          />
          {tri.length === 0 ? (
            <EmptyState
              titre="Aucun membre"
              description="Invitez votre premier animateur pour commencer à répartir les visios."
              icon={<Users size={34} />}
            />
          ) : (
            <div className="divide-y divide-white/50">
              {tri.map((u) => (
                <LigneMembre
                  key={u.id}
                  u={u}
                  courant={u.id === utilisateur.id}
                  estAdmin={estAdmin}
                  dernierAdmin={estDernierAdmin(u)}
                  visios={charge.visios.get(u.nom) ?? 0}
                  nbAppels={charge.nbAppels.get(u.nom) ?? 0}
                  enSuppression={suppressionId === u.id}
                  surEditer={() => ouvrirEdition(u)}
                  surChangerRole={(role) => modifierUtilisateur(u.id, { role })}
                  surSupprimer={() => surSupprimer(u)}
                />
              ))}
            </div>
          )}
        </Card>

        {/* ── Matrice des droits ── */}
        <Card>
          <CardHeader
            title="Droits par rôle"
            subtitle="Ce que chaque rôle peut faire dans la console et l'agenda"
            icon={<ShieldCheck size={16} />}
          />
          <div className="overflow-x-auto">
            <MatricePermissions roleCourant={utilisateur.role} />
          </div>
        </Card>
      </div>

      {/* ── Colonne latérale ── */}
      <div className="space-y-5">
        <Card>
          <div className="bg-gradient-to-br from-violet-500/15 via-brand-500/10 to-amber-400/15 px-5 py-4">
            <p className="text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">Votre équipe</p>
            <div className="mt-2 flex items-end gap-4">
              <span className="text-3xl font-bold text-ink">{utilisateurs.length}</span>
              <span className="pb-1 text-xs text-slate-500">
                membres · {admins.length} admin{admins.length > 1 ? "s" : ""} ·{" "}
                {utilisateurs.length - admins.length} animateur{utilisateurs.length - admins.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title={estAdmin ? "Charge de l'équipe" : "Votre charge"}
            subtitle="Visios à venir assignées à chacun"
            icon={<BadgeCheck size={16} />}
          />
          <div className="space-y-3 px-5 py-4">
            {chargeAffichee.map((u) => {
              const v = charge.visios.get(u.nom) ?? 0;
              return (
                <div key={u.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{u.nom}</span>
                    <span className="text-slate-400">
                      {v} visio{v > 1 ? "s" : ""} · {charge.nbAppels.get(u.nom) ?? 0} appel
                      {(charge.nbAppels.get(u.nom) ?? 0) > 1 ? "s" : ""}
                    </span>
                  </div>
                  <ProgressBar valeur={(100 * v) / maxVisios} couleur={u.couleur} className="mt-1" />
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Vos droits"
            subtitle={`${ROLE_LABEL[utilisateur.role]} · ${utilisateur.fonction}`}
            icon={<UserCog size={16} />}
          />
          <div className="space-y-2.5 px-5 py-4">
            <p className="text-sm text-slate-600">{ROLE_AIDE[utilisateur.role]}</p>
            <ul className="space-y-1.5">
              {permissionsDe(utilisateur.role).map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* ── Invitation / édition (monté seulement ouvert : champs réinitialisés) ── */}
      {modalOuvert ? (
        <MembreModal
          key={enEdition?.id ?? "nouveau"}
          ouvert
          onClose={() => setModalOuvert(false)}
          initial={enEdition ?? undefined}
          nomsPris={utilisateurs.filter((u) => u.id !== enEdition?.id).map((u) => u.nom)}
          rolesAutorises={enEdition && estDernierAdmin(enEdition) ? ["admin"] : undefined}
          onEnregistrer={enregistrer}
        />
      ) : null}
    </div>
  );
}

/** Une ligne d'annuaire — les actions n'apparaissent que pour un admin */
function LigneMembre({
  u,
  courant,
  estAdmin,
  dernierAdmin,
  visios,
  nbAppels,
  enSuppression,
  surEditer,
  surChangerRole,
  surSupprimer,
}: {
  u: Utilisateur;
  courant: boolean;
  estAdmin: boolean;
  dernierAdmin: boolean;
  visios: number;
  nbAppels: number;
  enSuppression: boolean;
  surEditer: () => void;
  surChangerRole: (role: Role) => void;
  surSupprimer: () => void;
}) {
  const bloque = courant || dernierAdmin;
  const motifBloque = courant
    ? "Vous ne pouvez pas retirer votre propre compte"
    : dernierAdmin
      ? "Il doit rester au moins un admin"
      : undefined;

  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-3.5">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-[0_5px_12px_-6px_rgba(15,23,42,0.3)]",
          u.couleur
        )}
      >
        {u.nom.slice(0, 2).toUpperCase()}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-800">
          {u.nom}
          {courant ? (
            <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-600 uppercase ring-1 ring-brand-200/60">
              Vous
            </span>
          ) : null}
          <span className="ml-2 text-xs font-normal text-slate-400">{u.fonction}</span>
        </p>
        <p className="text-xs text-slate-500">
          {visios} visio{visios > 1 ? "s" : ""} à venir · {nbAppels} appel{nbAppels > 1 ? "s" : ""} mené
          {nbAppels > 1 ? "s" : ""}
        </p>
      </div>

      {estAdmin ? (
        <div className="flex items-center gap-1.5">
          <select
            value={u.role}
            onChange={(e) => surChangerRole(e.target.value as Role)}
            className="glass-soft cursor-pointer rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none"
            aria-label={`Rôle de ${u.nom}`}
          >
            <option value="admin">Admin</option>
            <option value="animateur" disabled={dernierAdmin}>
              Animateur
            </option>
          </select>
          <button
            onClick={surEditer}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/70 hover:text-slate-700"
            aria-label={`Modifier ${u.nom}`}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={surSupprimer}
            disabled={bloque && !enSuppression}
            title={motifBloque}
            className={cn(
              "rounded-lg p-2 transition-colors",
              enSuppression
                ? "bg-brand-400/15 px-2.5 text-xs font-bold text-brand-700"
                : "text-slate-400 hover:bg-brand-400/10 hover:text-brand-600",
              bloque && "cursor-not-allowed opacity-40 hover:bg-transparent"
            )}
          >
            {enSuppression ? "Confirmer ?" : <Trash2 size={14} />}
          </button>
        </div>
      ) : (
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-bold ring-1",
            u.role === "admin"
              ? "bg-brand-400/15 text-brand-600 ring-brand-300/40"
              : "bg-violet-400/15 text-violet-600 ring-violet-300/40"
          )}
        >
          {ROLE_LABEL[u.role]}
        </span>
      )}
    </div>
  );
}
