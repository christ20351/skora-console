"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  APPELS as APPELS_INIT,
  BULLETINS as BULLETINS_INIT,
  CONTENUS as CONTENUS_INIT,
  ELEVES as ELEVES_INIT,
  LACUNES as LACUNES_INIT,
  TESTS as TESTS_INIT,
} from "@/data/mock";
import { notionParId } from "@/data/notions";
import { normalise } from "@/features/risque";
import { remplirContenu } from "@/features/contenu/generation";
import { integrerTest } from "@/features/suivi/suivi";
import { questionsParNotion } from "@/data/notions";
import { COULEURS_AVATAR, MAITRISE_INITIALE } from "@/types";
import type {
  Appel,
  Bulletin,
  BulletinLigne,
  ContenuGenere,
  Eleve,
  Lacune,
  TestAdaptatif,
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
}

interface Etat {
  eleves: Eleve[];
  bulletins: Record<string, Bulletin[]>;
  tests: TestAdaptatif[];
  lacunes: Lacune[];
  appels: Appel[];
  contenus: ContenuGenere[];
}

const StoreCtx = createContext<Etat & Actions | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<Etat>(() => ({
    eleves: ELEVES_INIT,
    bulletins: BULLETINS_INIT,
    tests: TESTS_INIT,
    lacunes: LACUNES_INIT,
    appels: APPELS_INIT,
    // les fiches mock partiellement vides sont remplies depuis la banque
    contenus: CONTENUS_INIT.map((c) =>
      remplirContenu(c, questionsParNotion(c.notionId))
    ),
  }));

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

  const value = useMemo(
    () => ({ ...etat, enregistrerTest, ajouterContenu, enregistrerAppel, planifierAppel, ajouterEleve }),
    [etat, enregistrerTest, ajouterContenu, enregistrerAppel, planifierAppel, ajouterEleve]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): Etat & Actions {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore doit être utilisé dans <StoreProvider>");
  return ctx;
}
