"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  APPELS as APPELS_INIT,
  BULLETINS as BULLETINS_INIT,
  CONTENUS as CONTENUS_INIT,
  ELEVES as ELEVES_INIT,
  LACUNES as LACUNES_INIT,
  MEETS as MEETS_INIT,
  TESTS as TESTS_INIT,
} from "@/data/mock";
import { UTILISATEURS } from "@/data/equipe";
import { EXAMENS as EXAMENS_INIT } from "@/data/mock-examens";
import { notionParId } from "@/data/notions";
import { normalise } from "@/features/risque";
import { remplirContenu } from "@/features/contenu/generation";
import { integrerTest } from "@/features/suivi/suivi";
import { questionsParNotion } from "@/data/notions";
import { COULEURS_AVATAR } from "@/types";
import type {
  Appel,
  Bulletin,
  BulletinLigne,
  ContenuGenere,
  Eleve,
  Examen,
  Lacune,
  RendezVous,
  TestAdaptatif,
  Utilisateur,
} from "@/types";

interface NouveauEleve {
  prenom: string;
  nom: string;
  niveauScolaire: string;
  ecole?: string;
  age?: number;
  /** bulletin saisi à la main au moment de l'inscription */
  lignes: BulletinLigne[];
}

interface Actions {
  enregistrerTest: (t: TestAdaptatif) => void;
  ajouterContenu: (c: ContenuGenere) => void;
  enregistrerAppel: (a: Appel) => void;
  planifierAppel: (p: {
    eleveId: string;
    date: string;
    type: Appel["type"];
    motif: string;
    animateur: string;
  }) => void;
  ajouterEleve: (e: NouveauEleve) => Eleve;
  /** Replanification d'un Meet (propagée à Google Calendar par l'appelant) */
  deplacerMeet: (id: string, date: string, heure: string, dureeMin?: number) => void;
  /** Assignation d'un Meet à un membre de l'équipe ("" = non assigné) */
  assignerMeet: (id: string, assigneA: string) => void;
  /** Change l'utilisateur courant (démo : bascule de rôle admin / animateur) */
  definirUtilisateur: (u: Utilisateur) => void;
  /** Invite un membre dans l'équipe (admin only) */
  ajouterUtilisateur: (u: Omit<Utilisateur, "id">) => Utilisateur;
  /** Modifie un membre ; un renommage est répercuté sur les visios et appels */
  modifierUtilisateur: (id: string, patch: Partial<Omit<Utilisateur, "id">>) => void;
  /** Retire un membre ; ses visios à venir redeviennent non assignées */
  supprimerUtilisateur: (id: string) => void;
}

interface Etat {
  eleves: Eleve[];
  bulletins: Record<string, Bulletin[]>;
  tests: TestAdaptatif[];
  lacunes: Lacune[];
  appels: Appel[];
  contenus: ContenuGenere[];
  meets: RendezVous[];
  examens: Examen[];
  utilisateurs: Utilisateur[];
  utilisateur: Utilisateur;
}

const CLE_UTILISATEUR = "skora.utilisateur";

/* ── Utilisateur courant (external store : localStorage + écouteurs) ── */

let cacheUtilisateurId: string | null = null;
const ecouteursUtilisateur = new Set<() => void>();

function lireUtilisateurId(): string {
  if (cacheUtilisateurId === null) {
    cacheUtilisateurId = window.localStorage.getItem(CLE_UTILISATEUR) ?? "";
  }
  return cacheUtilisateurId;
}

function ecrireUtilisateurId(id: string) {
  cacheUtilisateurId = id;
  window.localStorage.setItem(CLE_UTILISATEUR, id);
  ecouteursUtilisateur.forEach((f) => f());
}

function souscrireUtilisateur(ecoute: () => void) {
  ecouteursUtilisateur.add(ecoute);
  return () => {
    ecouteursUtilisateur.delete(ecoute);
  };
}

const StoreCtx = createContext<Etat & Actions | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const idBrut = useSyncExternalStore(
    souscrireUtilisateur,
    lireUtilisateurId,
    () => ""
  );

  const [etat, setEtat] = useState<Omit<Etat, "utilisateur">>(() => ({
    eleves: ELEVES_INIT,
    bulletins: BULLETINS_INIT,
    tests: TESTS_INIT,
    lacunes: LACUNES_INIT,
    appels: APPELS_INIT,
    // les fiches mock partiellement vides sont remplies depuis la banque
    contenus: CONTENUS_INIT.map((c) =>
      remplirContenu(c, questionsParNotion(c.notionId))
    ),
    meets: MEETS_INIT,
    examens: EXAMENS_INIT,
    utilisateurs: UTILISATEURS,
  }));

  /* Utilisateur courant : id stocké, sinon repli sur le premier admin */
  const utilisateur =
    etat.utilisateurs.find((u) => u.id === idBrut) ??
    (etat.utilisateurs.find((u) => u.role === "admin") ?? etat.utilisateurs[0]);

  /** Démo : l'utilisateur choisi (rôle) est mémorisé d'une session à l'autre */
  const definirUtilisateur = useCallback<Actions["definirUtilisateur"]>((u) => {
    ecrireUtilisateurId(u.id);
  }, []);

  /** Nouveau test → maj/création des lacunes correspondantes */
  const enregistrerTest = useCallback((t: TestAdaptatif) => {
    setEtat((prev) => ({
      ...prev,
      ...integrerTest(prev.tests, prev.lacunes, prev.appels, t),
    }));
  }, []);

  const ajouterContenu = useCallback((c: ContenuGenere) => {
    setEtat((prev) => ({
      ...prev,
      contenus: [c, ...prev.contenus],
      lacunes: prev.lacunes.map((l) =>
        l.id === c.lacuneId && l.statut === "detectee" ? { ...l, statut: "renfort" } : l
      ),
    }));
  }, []);

  /** Appel réalisé → croisement déclarations ↔ lacunes (confirmé à l'oral) */
  const enregistrerAppel = useCallback((a: Appel) => {
    setEtat((prev) => {
      const declarations = new Set(a.declarations.map(normalise));
      return {
        ...prev,
        appels: [a, ...prev.appels],
        lacunes: prev.lacunes.map((l) =>
          l.eleveId === a.eleveId && declarations.has(normalise(notionParId(l.notionId).nom))
            ? { ...l, confirmeOral: true }
            : l
        ),
      };
    });
  }, []);

  const planifierAppel = useCallback<Actions["planifierAppel"]>((p) => {
    setEtat((prev) => ({
      ...prev,
      appels: [
        {
          id: `a-${Date.now().toString(36)}`,
          eleveId: p.eleveId,
          date: p.date,
          dureeMin: 0,
          animateur: p.animateur,
          type: p.type,
          sentiment: "neutre",
          resume: "",
          points: [],
          declarations: [],
          prochaineEtape: "",
          statut: "planifie",
          motif: p.motif,
        },
        ...prev.appels,
      ],
    }));
  }, []);

  /** Replanification locale (l'appelant déclenche la synchro Google) */
  const deplacerMeet = useCallback<Actions["deplacerMeet"]>((id, date, heure, dureeMin) => {
    setEtat((prev) => ({
      ...prev,
      meets: prev.meets.map((m) =>
        m.id === id
          ? { ...m, date, heure, dureeMin: dureeMin ?? m.dureeMin }
          : m
      ),
    }));
  }, []);

  const assignerMeet = useCallback<Actions["assignerMeet"]>((id, assigneA) => {
    setEtat((prev) => ({
      ...prev,
      meets: prev.meets.map((m) => (m.id === id ? { ...m, assigneA } : m)),
    }));
  }, []);

  /** Inscription d'un élève : identité + premier bulletin saisi à la main */
  const ajouterEleve = useCallback<Actions["ajouterEleve"]>((e) => {
    const id = `e-${Date.now().toString(36)}`;
    const eleve: Eleve = {
      id,
      prenom: e.prenom.trim(),
      nom: e.nom.trim(),
      niveauScolaire: e.niveauScolaire,
      ecole: e.ecole?.trim() || undefined,
      age: e.age,
      inscritLe: new Date().toISOString().slice(0, 10),
      couleur: COULEURS_AVATAR[Math.floor(Math.random() * COULEURS_AVATAR.length)],
    };
    setEtat((prev) => ({
      ...prev,
      eleves: [eleve, ...prev.eleves],
      bulletins: e.lignes.length
        ? {
            ...prev.bulletins,
            [id]: [{ trimestre: "Bulletin d'entrée", lignes: e.lignes }],
          }
        : prev.bulletins,
    }));
    return eleve;
  }, []);

  /* ── Gestion de l'équipe (onglet Équipe, rôle admin) ── */

  const ajouterUtilisateur = useCallback<Actions["ajouterUtilisateur"]>((u) => {
    const membre: Utilisateur = { ...u, id: `u-${Date.now().toString(36)}` };
    setEtat((prev) => ({ ...prev, utilisateurs: [...prev.utilisateurs, membre] }));
    return membre;
  }, []);

  /** Le nom sert de clé d'assignation : un renommage est propagé aux visios et appels */
  const modifierUtilisateur = useCallback<Actions["modifierUtilisateur"]>((id, patch) => {
    setEtat((prev) => {
      const avant = prev.utilisateurs.find((u) => u.id === id);
      if (!avant) return prev;
      const apres = { ...avant, ...patch };
      const renomme = apres.nom !== avant.nom;
      return {
        ...prev,
        utilisateurs: prev.utilisateurs.map((u) => (u.id === id ? apres : u)),
        meets: renomme
          ? prev.meets.map((m) => (m.assigneA === avant.nom ? { ...m, assigneA: apres.nom } : m))
          : prev.meets,
        appels: renomme
          ? prev.appels.map((a) => (a.animateur === avant.nom ? { ...a, animateur: apres.nom } : a))
          : prev.appels,
      };
    });
  }, []);

  const supprimerUtilisateur = useCallback<Actions["supprimerUtilisateur"]>((id) => {
    setEtat((prev) => {
      const cible = prev.utilisateurs.find((u) => u.id === id);
      if (!cible) return prev;
      if (lireUtilisateurId() === id) ecrireUtilisateurId("");
      return {
        ...prev,
        utilisateurs: prev.utilisateurs.filter((u) => u.id !== id),
        meets: prev.meets.map((m) => (m.assigneA === cible.nom ? { ...m, assigneA: "" } : m)),
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      ...etat,
      utilisateur,
      enregistrerTest,
      ajouterContenu,
      enregistrerAppel,
      planifierAppel,
      ajouterEleve,
      deplacerMeet,
      assignerMeet,
      definirUtilisateur,
      ajouterUtilisateur,
      modifierUtilisateur,
      supprimerUtilisateur,
    }),
    [
      etat,
      utilisateur,
      enregistrerTest,
      ajouterContenu,
      enregistrerAppel,
      planifierAppel,
      ajouterEleve,
      deplacerMeet,
      assignerMeet,
      definirUtilisateur,
      ajouterUtilisateur,
      modifierUtilisateur,
      supprimerUtilisateur,
    ]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): Etat & Actions {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore doit être utilisé dans <StoreProvider>");
  return ctx;
}
