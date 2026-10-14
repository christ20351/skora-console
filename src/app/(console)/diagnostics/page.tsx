"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ELEVES } from "@/data/mock";
import { AUJOURDHUI } from "@/lib/constantes";
import {
  NIVEAU_DEPART,
  NOMBRE_QUESTIONS,
  choisirQuestion,
  etablirBilan,
  niveauSuivant,
} from "@/features/test-adaptatif/moteur";
import { uid } from "@/lib/utils";
import { useStore } from "@/store";
import { Configuration } from "@/components/test/Configuration";
import { Session } from "@/components/test/Session";
import { Bilan } from "@/components/test/Bilan";
import type { EtapeTest, Niveau, Question, TestAdaptatif } from "@/types";

type Phase = "config" | "session" | "bilan";

function TestAdaptatifPage() {
  const params = useSearchParams();
  const { enregistrerTest } = useStore();

  const [phase, setPhase] = useState<Phase>("config");
  const [eleveId, setEleveId] = useState<string | null>(params.get("eleve"));
  const [matiere, setMatiere] = useState<string | null>(null);
  const [niveau, setNiveau] = useState<Niveau>(NIVEAU_DEPART);
  const [question, setQuestion] = useState<Question | null>(null);
  const [choix, setChoix] = useState<number | null>(null);
  const [etapes, setEtapes] = useState<EtapeTest[]>([]);
  const [exclues, setExclues] = useState<Set<string>>(new Set());
  const [enregistre, setEnregistre] = useState(false);

  const demarrer = () => {
    if (!matiere) return;
    setPhase("session");
    setNiveau(NIVEAU_DEPART);
    setEtapes([]);
    setExclues(new Set());
    setEnregistre(false);
    setQuestion(choisirQuestion(matiere, NIVEAU_DEPART, new Set()));
  };

  const repondre = (index: number) => setChoix(index);

  const suivant = (etape: EtapeTest) => {
    const nouvelles = [...etapes, etape];
    setEtapes(nouvelles);
    const prochain = niveauSuivant(niveau, etape.correct);
    setNiveau(prochain);
    if (nouvelles.length >= NOMBRE_QUESTIONS || !matiere) {
      setPhase("bilan");
      setQuestion(null);
      return;
    }
    const excluesMaj = new Set(exclues);
    excluesMaj.add(etape.questionId);
    setExclues(excluesMaj);
    setChoix(null);
    setQuestion(choisirQuestion(matiere, prochain, excluesMaj));
  };

  const enregistrer = () => {
    if (!eleveId || !matiere) return;
    const bilan = etablirBilan(etapes, niveau);
    const test: TestAdaptatif = {
      id: uid("t"),
      eleveId,
      matiere,
      date: AUJOURDHUI,
      dureeMin: Math.max(5, Math.round(etapes.length * 2.5)),
      niveauInitial: NIVEAU_DEPART,
      niveauFinal: bilan.niveauFinal,
      etapes,
    };
    enregistrerTest(test);
    setEnregistre(true);
  };

  const eleve = ELEVES.find((e) => e.id === eleveId);
  const bilan = phase === "bilan" ? etablirBilan(etapes, niveau) : null;

  if (phase === "bilan" && bilan && eleve && matiere) {
    return (
      <Bilan
        eleveId={eleve.id}
        elevePrenom={eleve.prenom}
        matiere={matiere}
        bilan={bilan}
        etapes={etapes}
        dureeMin={Math.max(5, Math.round(etapes.length * 2.5))}
        enregistre={enregistre}
        onEnregistrer={enregistrer}
      />
    );
  }

  if (phase === "config" || !eleve || !matiere || !question) {
    return (
      <Configuration
        eleveId={eleveId}
        matiere={matiere}
        onSelect={(e, m) => {
          setEleveId(e);
          setMatiere(m);
        }}
        onDemarrer={demarrer}
      />
    );
  }

  return (
    <Session
      matiere={matiere}
      question={question}
      numero={etapes.length + 1}
      total={NOMBRE_QUESTIONS}
      niveau={niveau}
      choix={choix}
      onRepondre={repondre}
      onSuivant={suivant}
    />
  );
}

export default function PageTestAdaptatif() {
  return (
    <Suspense>
      <TestAdaptatifPage />
    </Suspense>
  );
}
