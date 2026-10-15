import type { Eleve, RendezVous, Utilisateur } from "@/types";

/** Rendez-vous enrichi de l'apprenant associé (pour l'affichage) */
export interface MeetVM {
  rdv: RendezVous;
  eleve?: Eleve;
}

export const nomEleve = (vm: MeetVM) => (vm.eleve ? `${vm.eleve.prenom} ${vm.eleve.nom}` : "Apprenant inconnu");

/* ── Couleurs d'assignation (dérivées de la couleur du membre) ───────── */

const STYLES_PAR_COULEUR: Record<string, { puce: string; point: string }> = {
  "bg-brand-500": {
    puce: "bg-brand-400/15 text-brand-700 ring-1 ring-brand-300/40",
    point: "bg-brand-500",
  },
  "bg-violet-500": {
    puce: "bg-violet-400/15 text-violet-700 ring-1 ring-violet-300/40",
    point: "bg-violet-500",
  },
  "bg-rose-500": {
    puce: "bg-rose-400/15 text-rose-700 ring-1 ring-rose-300/40",
    point: "bg-rose-500",
  },
  "bg-sky-500": {
    puce: "bg-sky-400/15 text-sky-700 ring-1 ring-sky-300/40",
    point: "bg-sky-500",
  },
  "bg-emerald-500": {
    puce: "bg-emerald-400/15 text-emerald-700 ring-1 ring-emerald-300/40",
    point: "bg-emerald-500",
  },
  "bg-amber-500": {
    puce: "bg-amber-400/15 text-amber-700 ring-1 ring-amber-300/40",
    point: "bg-amber-500",
  },
  "bg-indigo-500": {
    puce: "bg-indigo-400/15 text-indigo-700 ring-1 ring-indigo-300/40",
    point: "bg-indigo-500",
  },
  "bg-fuchsia-500": {
    puce: "bg-fuchsia-400/15 text-fuchsia-700 ring-1 ring-fuchsia-300/40",
    point: "bg-fuchsia-500",
  },
  "bg-teal-500": {
    puce: "bg-teal-400/15 text-teal-700 ring-1 ring-teal-300/40",
    point: "bg-teal-500",
  },
};

export const STYLE_NON_ASSIGNE = {
  puce: "border border-dashed border-amber-400/70 bg-amber-400/10 text-amber-700",
  point: "bg-amber-400",
};

const STYLE_INCONNU = {
  puce: "bg-white/60 text-slate-600 ring-1 ring-slate-200/70",
  point: "bg-slate-300",
};

export function styleAssignation(
  nom: string,
  utilisateurs: Utilisateur[]
): { puce: string; point: string } {
  if (!nom) return STYLE_NON_ASSIGNE;
  const membre = utilisateurs.find((u) => u.nom === nom);
  return (membre && STYLES_PAR_COULEUR[membre.couleur]) || STYLE_INCONNU;
}
