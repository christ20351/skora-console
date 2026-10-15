"use client";

import { useState } from "react";
import { ShieldCheck, UserRound } from "lucide-react";
import { Bouton, Modal } from "@/components/ui";
import { ROLE_AIDE, ROLE_LABEL } from "@/types";
import type { Role, Utilisateur } from "@/types";
import { cn } from "@/lib/utils";

/** Palette d'identité des membres (mêmes familles de couleurs que les avatars) */
const PALETTE = [
  "bg-brand-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-fuchsia-500",
];

export interface BrouillonMembre {
  nom: string;
  fonction: string;
  role: Role;
  couleur: string;
}

/**
 * Invitation / édition d'un membre. Le nom est la clé d'assignation des
 * visios : il doit être renseigné et unique.
 */
export function MembreModal({
  ouvert,
  onClose,
  onEnregistrer,
  initial,
  nomsPris,
  rolesAutorises = ["admin", "animateur"],
}: {
  ouvert: boolean;
  onClose: () => void;
  onEnregistrer: (m: BrouillonMembre) => void;
  /** membre en cours d'édition (absent = création) */
  initial?: Utilisateur;
  /** noms déjà utilisés par les autres membres */
  nomsPris: string[];
  /** rôles sélectionnables (ex. un dernier admin ne peut pas être rétrogradé) */
  rolesAutorises?: Role[];
}) {
  /* Monté seulement quand le modal est ouvert (key = membre édité) :
     les champs partent des valeurs passées en props. */
  const [nom, setNom] = useState(initial?.nom ?? "");
  const [fonction, setFonction] = useState(initial?.fonction ?? "");
  const [role, setRole] = useState<Role>(
    initial
      ? rolesAutorises.includes(initial.role)
        ? initial.role
        : rolesAutorises[0]
      : "animateur"
  );
  const [couleur, setCouleur] = useState(initial?.couleur ?? PALETTE[0]);
  const [erreur, setErreur] = useState("");

  const soumettre = () => {
    const n = nom.trim();
    if (!n) {
      setErreur("Le nom est requis — il sert à assigner les visios.");
      return;
    }
    if (nomsPris.includes(n)) {
      setErreur(`« ${n} » est déjà utilisé par un autre membre.`);
      return;
    }
    onEnregistrer({
      nom: n,
      fonction: fonction.trim() || (role === "admin" ? "Coordinateur" : "Animateur"),
      role,
      couleur,
    });
    onClose();
  };

  return (
    <Modal ouvert={ouvert} onClose={onClose}>
      <div className="space-y-4 p-6">
        <div>
          <h3 className="font-bold text-ink">{initial ? `Modifier ${initial.nom}` : "Ajouter un membre"}</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {initial
              ? "Le nouveau nom est répercuté sur ses visios et ses appels."
              : "Le nouveau membre apparaît aussitôt dans l'agenda et les assignations."}
          </p>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          <span
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-[0_5px_12px_-6px_rgba(15,23,42,0.3)]",
              couleur
            )}
          >
            {(nom.trim() || "?").slice(0, 2).toUpperCase()}
          </span>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Nom</label>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex. : Awa"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Fonction</label>
              <input
                value={fonction}
                onChange={(e) => setFonction(e.target.value)}
                placeholder={role === "admin" ? "Coordinateur pédagogique" : "Animatrice d'appels"}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Rôle</label>
          <div className="grid grid-cols-2 gap-2">
            {(["admin", "animateur"] as Role[]).map((r) => {
              const autorise = rolesAutorises.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => autorise && setRole(r)}
                  disabled={!autorise}
                  title={autorise ? undefined : "Il doit rester au moins un admin dans l'équipe"}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition-all",
                    role === r
                      ? "border-brand-400/70 bg-brand-400/10 ring-1 ring-brand-300/50"
                      : "border-slate-200 hover:bg-slate-50",
                    !autorise && "cursor-not-allowed opacity-50 hover:bg-transparent"
                  )}
                >
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    {r === "admin" ? <ShieldCheck size={14} className="text-brand-500" /> : <UserRound size={14} className="text-violet-500" />}
                    {ROLE_LABEL[r]}
                  </span>
                  <span className="mt-1 block text-[11px] leading-4 text-slate-500">{ROLE_AIDE[r]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Couleur</label>
          <div className="flex flex-wrap gap-2">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCouleur(c)}
                aria-label={`Couleur ${c}`}
                className={cn(
                  "h-8 w-8 rounded-xl transition-all",
                  c,
                  couleur === c
                    ? "scale-110 ring-2 ring-slate-700/60 ring-offset-2 ring-offset-white"
                    : "opacity-70 hover:scale-105 hover:opacity-100"
                )}
              />
            ))}
          </div>
        </div>

        {erreur ? (
          <p className="rounded-xl bg-brand-400/10 px-3 py-2 text-xs font-medium text-brand-700 ring-1 ring-brand-300/40">
            {erreur}
          </p>
        ) : null}

        <div className="flex justify-end gap-2 pt-1">
          <Bouton variant="secondaire" onClick={onClose}>
            Annuler
          </Bouton>
          <Bouton onClick={soumettre}>{initial ? "Enregistrer" : "Ajouter le membre"}</Bouton>
        </div>
      </div>
    </Modal>
  );
}
