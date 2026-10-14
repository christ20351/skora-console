import type {
  Appel,
  Bulletin,
  ContenuGenere,
  Eleve,
  EtapeTest,
  Lacune,
  TestAdaptatif,
} from "@/types";

/* ── Élèves (lycée) ──────────────────────────────────────────────────── */

export const ELEVES: Eleve[] = [
  { id: "e1", prenom: "Aminata", nom: "Diallo", niveauScolaire: "Tle D", ecole: "Lycée Moderne", age: 18, inscritLe: "2026-09-08", couleur: "bg-rose-500" },
  { id: "e2", prenom: "Kouadio", nom: "Yao", niveauScolaire: "Tle A", ecole: "Lycée Classique", age: 19, inscritLe: "2026-09-12", couleur: "bg-violet-500" },
  { id: "e3", prenom: "Fatou", nom: "Ndiaye", niveauScolaire: "1ère D", ecole: "Groupe Scolaire La Réussite", age: 17, inscritLe: "2026-09-05", couleur: "bg-emerald-500" },
  { id: "e4", prenom: "Moussa", nom: "Traoré", niveauScolaire: "1ère A2", ecole: "Cours Baraka", age: 16, inscritLe: "2026-10-06", couleur: "bg-amber-500" },
  { id: "e5", prenom: "Awa", nom: "Koné", niveauScolaire: "Tle D", ecole: "Lycée Moderne", age: 18, inscritLe: "2026-09-09", couleur: "bg-sky-500" },
  { id: "e6", prenom: "Ibrahima", nom: "Sow", niveauScolaire: "1ère C", ecole: "Lycée Technique", age: 16, inscritLe: "2026-09-15", couleur: "bg-indigo-500" },
  { id: "e7", prenom: "Mariam", nom: "Cissé", niveauScolaire: "Tle C", ecole: "Excellence Academy", age: 18, inscritLe: "2026-09-20", couleur: "bg-teal-500" },
  { id: "e8", prenom: "Séraphin", nom: "Mbemba", niveauScolaire: "1ère D", ecole: "Lycée Jean-Mermoz", age: 16, inscritLe: "2026-09-10", couleur: "bg-fuchsia-500" },
];

/* ── Bulletins (saisis à la main, pas de scan) ───────────────────────── */

export const BULLETINS: Record<string, Bulletin[]> = {
  e1: [
    {
      trimestre: "1er trimestre 2025-2026",
      lignes: [
        { matiere: "Mathématiques", note: 10, sur: 20, moyenneClasse: 10.5 },
        { matiere: "Physique-Chimie", note: 11, sur: 20, moyenneClasse: 10.8 },
        { matiere: "SVT", note: 12, sur: 20, moyenneClasse: 11.5 },
        { matiere: "Français", note: 12, sur: 20, moyenneClasse: 11.9 },
        { matiere: "Anglais", note: 14, sur: 20, moyenneClasse: 11.2 },
        { matiere: "Histoire-Géo", note: 13, sur: 20, moyenneClasse: 11.6 },
        { matiere: "ECM", note: 12, sur: 20, moyenneClasse: 12.4 },
      ],
    },
    {
      trimestre: "2ème trimestre 2025-2026",
      lignes: [
        { matiere: "Mathématiques", note: 8, sur: 20, moyenneClasse: 10.8 },
        { matiere: "Physique-Chimie", note: 10, sur: 20, moyenneClasse: 10.9 },
        { matiere: "SVT", note: 12, sur: 20, moyenneClasse: 11.7 },
        { matiere: "Français", note: 12, sur: 20, moyenneClasse: 12 },
        { matiere: "Anglais", note: 15, sur: 20, moyenneClasse: 11.3 },
        { matiere: "Histoire-Géo", note: 12, sur: 20, moyenneClasse: 11.5 },
        { matiere: "ECM", note: 12, sur: 20, moyenneClasse: 12.2 },
      ],
    },
  ],
  e2: [
    {
      trimestre: "2ème trimestre 2025-2026",
      lignes: [
        { matiere: "Français", note: 7, sur: 20, moyenneClasse: 11.2 },
        { matiere: "Mathématiques", note: 11, sur: 20, moyenneClasse: 10.6 },
        { matiere: "Anglais", note: 10, sur: 20, moyenneClasse: 11 },
        { matiere: "Histoire-Géo", note: 12, sur: 20, moyenneClasse: 11.5 },
        { matiere: "Physique-Chimie", note: 9, sur: 20, moyenneClasse: 10.3 },
        { matiere: "ECM", note: 11, sur: 20, moyenneClasse: 12 },
      ],
    },
  ],
  e3: [
    {
      trimestre: "2ème trimestre 2025-2026",
      lignes: [
        { matiere: "SVT", note: 9, sur: 20, moyenneClasse: 11.4 },
        { matiere: "Mathématiques", note: 11, sur: 20, moyenneClasse: 10.9 },
        { matiere: "Physique-Chimie", note: 12, sur: 20, moyenneClasse: 10.8 },
        { matiere: "Français", note: 14, sur: 20, moyenneClasse: 12 },
        { matiere: "Anglais", note: 13, sur: 20, moyenneClasse: 11.2 },
        { matiere: "ECM", note: 13, sur: 20, moyenneClasse: 12.1 },
      ],
    },
  ],
  e4: [
    {
      trimestre: "2ème trimestre 2025-2026",
      lignes: [
        { matiere: "ECM", note: 8, sur: 20, moyenneClasse: 12.2 },
        { matiere: "Mathématiques", note: 10, sur: 20, moyenneClasse: 10.4 },
        { matiere: "Français", note: 9, sur: 20, moyenneClasse: 11.1 },
        { matiere: "Histoire-Géo", note: 11, sur: 20, moyenneClasse: 11 },
        { matiere: "Anglais", note: 10, sur: 20, moyenneClasse: 10.7 },
        { matiere: "SVT", note: 9, sur: 20, moyenneClasse: 10.5 },
      ],
    },
  ],
  e5: [
    {
      trimestre: "2ème trimestre 2025-2026",
      lignes: [
        { matiere: "Anglais", note: 9, sur: 20, moyenneClasse: 11.8 },
        { matiere: "Mathématiques", note: 12, sur: 20, moyenneClasse: 10.9 },
        { matiere: "Français", note: 13, sur: 20, moyenneClasse: 11.9 },
        { matiere: "SVT", note: 12, sur: 20, moyenneClasse: 11.5 },
        { matiere: "Histoire-Géo", note: 11, sur: 20, moyenneClasse: 11.4 },
        { matiere: "ECM", note: 12, sur: 20, moyenneClasse: 12 },
      ],
    },
  ],
  e6: [
    {
      trimestre: "2ème trimestre 2025-2026",
      lignes: [
        { matiere: "Physique-Chimie", note: 8, sur: 20, moyenneClasse: 10.6 },
        { matiere: "Mathématiques", note: 10, sur: 20, moyenneClasse: 10.2 },
        { matiere: "SVT", note: 11, sur: 20, moyenneClasse: 11 },
        { matiere: "Français", note: 12, sur: 20, moyenneClasse: 11.2 },
        { matiere: "Anglais", note: 13, sur: 20, moyenneClasse: 11.4 },
        { matiere: "ECM", note: 12, sur: 20, moyenneClasse: 12.1 },
      ],
    },
  ],
  e7: [
    {
      trimestre: "2ème trimestre 2025-2026",
      lignes: [
        { matiere: "Histoire-Géo", note: 12, sur: 20, moyenneClasse: 11.6 },
        { matiere: "Mathématiques", note: 16, sur: 20, moyenneClasse: 11 },
        { matiere: "Physique-Chimie", note: 15, sur: 20, moyenneClasse: 10.7 },
        { matiere: "SVT", note: 14, sur: 20, moyenneClasse: 11.3 },
        { matiere: "Anglais", note: 18, sur: 20, moyenneClasse: 11.8 },
        { matiere: "Français", note: 17, sur: 20, moyenneClasse: 12 },
      ],
    },
  ],
  e8: [
    {
      trimestre: "2ème trimestre 2025-2026",
      lignes: [
        { matiere: "Mathématiques", note: 7, sur: 20, moyenneClasse: 10.3 },
        { matiere: "Français", note: 10, sur: 20, moyenneClasse: 11.7 },
        { matiere: "Anglais", note: 11, sur: 20, moyenneClasse: 11.5 },
        { matiere: "Physique-Chimie", note: 9, sur: 20, moyenneClasse: 10.6 },
        { matiere: "SVT", note: 10, sur: 20, moyenneClasse: 11.1 },
        { matiere: "ECM", note: 10, sur: 20, moyenneClasse: 12 },
      ],
    },
  ],
};

/* ── Tests adaptatifs passés ─────────────────────────────────────────── */

const et = (
  questionId: string,
  notionId: string,
  avant: number,
  apres: number,
  correct: boolean
): EtapeTest => ({
  questionId,
  notionId,
  niveauAvant: avant as EtapeTest["niveauAvant"],
  niveauApres: apres as EtapeTest["niveauApres"],
  correct,
});

export const TESTS: TestAdaptatif[] = [
  {
    id: "t1", eleveId: "e1", matiere: "Mathématiques", date: "2026-09-30", dureeMin: 24,
    niveauInitial: 2, niveauFinal: 2,
    etapes: [
      et("su2", "suites", 2, 1, false),
      et("su1", "suites", 1, 2, true),
      et("dv2", "derivation", 2, 1, false),
      et("dv1", "derivation", 1, 2, true),
      et("su3", "suites", 2, 3, true),
      et("su4", "suites", 3, 2, false),
      et("dv3", "derivation", 2, 3, true),
      et("dv4", "derivation", 3, 2, false),
    ],
  },
  {
    id: "t2", eleveId: "e1", matiere: "Mathématiques", date: "2026-10-09", dureeMin: 18,
    niveauInitial: 2, niveauFinal: 2,
    etapes: [
      et("su2", "suites", 2, 3, true),
      et("su3", "suites", 3, 4, true),
      et("su4", "suites", 4, 3, false),
      et("dv3", "derivation", 3, 4, true),
      et("dv4", "derivation", 4, 3, false),
      et("pr3", "probabilites", 3, 2, false),
      et("pr2", "probabilites", 2, 3, true),
      et("pr3", "probabilites", 3, 2, false),
    ],
  },
  {
    id: "t3", eleveId: "e2", matiere: "Français", date: "2026-10-06", dureeMin: 20,
    niveauInitial: 2, niveauFinal: 2,
    etapes: [
      et("ar2", "argumentation", 2, 1, false),
      et("ar1", "argumentation", 1, 1, false),
      et("fs1", "figures-style", 1, 2, true),
      et("gr2", "grammaire", 2, 3, true),
      et("ar3", "argumentation", 3, 2, false),
      et("fs2", "figures-style", 2, 3, true),
      et("gr3", "grammaire", 3, 2, false),
      et("fs3", "figures-style", 2, 2, false),
    ],
  },
  {
    id: "t4", eleveId: "e3", matiere: "SVT", date: "2026-10-01", dureeMin: 15,
    niveauInitial: 2, niveauFinal: 2,
    etapes: [
      et("im2", "immunite", 2, 3, true),
      et("im3", "immunite", 3, 2, false),
      et("ge2", "genetique", 2, 3, true),
      et("ge3", "genetique", 3, 4, true),
      et("im4", "immunite", 3, 3, false),
      et("ge4", "genetique", 3, 3, false),
      et("ge1", "genetique", 2, 3, true),
      et("im3", "immunite", 3, 2, false),
    ],
  },
  {
    id: "t5", eleveId: "e5", matiere: "Anglais", date: "2026-09-26", dureeMin: 16,
    niveauInitial: 2, niveauFinal: 1,
    etapes: [
      et("cd2", "conditionnels", 2, 1, false),
      et("cd1", "conditionnels", 1, 2, true),
      et("cd3", "conditionnels", 2, 3, true),
      et("vp4", "voix-passive", 3, 3, false),
      et("vp3", "voix-passive", 3, 2, false),
      et("vp2", "voix-passive", 2, 3, true),
      et("cd4", "conditionnels", 3, 2, false),
      et("vp3", "voix-passive", 2, 1, false),
    ],
  },
  {
    id: "t6", eleveId: "e6", matiere: "Physique-Chimie", date: "2026-09-20", dureeMin: 22,
    niveauInitial: 2, niveauFinal: 1,
    etapes: [
      et("nw2", "newton", 2, 1, false),
      et("nw1", "newton", 1, 1, false),
      et("nw1", "newton", 1, 2, true),
      et("nw2", "newton", 2, 1, false),
      et("nw1", "newton", 1, 2, true),
      et("nw2", "newton", 2, 1, false),
    ],
  },
  {
    id: "t7", eleveId: "e7", matiere: "Histoire-Géo", date: "2026-10-10", dureeMin: 12,
    niveauInitial: 2, niveauFinal: 1,
    etapes: [
      et("gf2", "guerre-froide", 2, 3, true),
      et("gf3", "guerre-froide", 3, 2, false),
      et("mg2", "mondialisation", 2, 3, true),
      et("gf4", "guerre-froide", 3, 2, false),
      et("dc3", "decolonisation", 2, 1, false),
    ],
  },
  {
    id: "t8", eleveId: "e8", matiere: "Mathématiques", date: "2026-09-18", dureeMin: 26,
    niveauInitial: 2, niveauFinal: 1,
    etapes: [
      et("pr2", "probabilites", 2, 1, false),
      et("sd1", "second-degre", 1, 1, false),
      et("sd1", "second-degre", 1, 2, true),
      et("pr1", "probabilites", 2, 1, false),
      et("pr1", "probabilites", 1, 2, true),
      et("sd2", "second-degre", 2, 1, false),
      et("pr1", "probabilites", 1, 2, true),
      et("sd2", "second-degre", 2, 1, false),
    ],
  },
];

/* ── Lacunes ─────────────────────────────────────────────────────────── */

export const LACUNES: Lacune[] = [
  { id: "l1", eleveId: "e1", notionId: "suites", severite: "legere", maitrisePct: 60,
    historique: [{ date: "2026-09-30", maitrisePct: 30 }, { date: "2026-10-09", maitrisePct: 60 }],
    origineTestIds: ["t1", "t2"], confirmeOral: true, statut: "amelioration" },
  { id: "l2", eleveId: "e1", notionId: "derivation", severite: "legere", maitrisePct: 55,
    historique: [{ date: "2026-09-30", maitrisePct: 35 }, { date: "2026-10-09", maitrisePct: 55 }],
    origineTestIds: ["t1", "t2"], statut: "amelioration" },
  { id: "l3", eleveId: "e1", notionId: "probabilites", severite: "moderee", maitrisePct: 45,
    historique: [{ date: "2026-10-09", maitrisePct: 45 }],
    origineTestIds: ["t2"], statut: "detectee" },
  { id: "l4", eleveId: "e2", notionId: "argumentation", severite: "critique", maitrisePct: 20,
    historique: [{ date: "2026-10-06", maitrisePct: 20 }],
    origineTestIds: ["t3"], confirmeOral: true, statut: "renfort" },
  { id: "l5", eleveId: "e2", notionId: "figures-style", severite: "moderee", maitrisePct: 50,
    historique: [{ date: "2026-10-06", maitrisePct: 50 }],
    origineTestIds: ["t3"], statut: "detectee" },
  { id: "l6", eleveId: "e2", notionId: "grammaire", severite: "moderee", maitrisePct: 45,
    historique: [{ date: "2026-10-06", maitrisePct: 45 }],
    origineTestIds: ["t3"], statut: "detectee" },
  { id: "l7", eleveId: "e3", notionId: "immunite", severite: "moderee", maitrisePct: 45,
    historique: [{ date: "2026-10-01", maitrisePct: 45 }],
    origineTestIds: ["t4"], statut: "detectee" },
  { id: "l8", eleveId: "e3", notionId: "genetique", severite: "legere", maitrisePct: 65,
    historique: [{ date: "2026-10-01", maitrisePct: 65 }],
    origineTestIds: ["t4"], statut: "detectee" },
  { id: "l9", eleveId: "e5", notionId: "conditionnels", severite: "elevee", maitrisePct: 35,
    historique: [{ date: "2026-09-26", maitrisePct: 35 }],
    origineTestIds: ["t5"], statut: "renfort" },
  { id: "l10", eleveId: "e5", notionId: "voix-passive", severite: "elevee", maitrisePct: 30,
    historique: [{ date: "2026-09-26", maitrisePct: 30 }],
    origineTestIds: ["t5"], statut: "detectee" },
  { id: "l11", eleveId: "e6", notionId: "newton", severite: "critique", maitrisePct: 25,
    historique: [{ date: "2026-09-20", maitrisePct: 25 }],
    origineTestIds: ["t6"], statut: "detectee" },
  { id: "l12", eleveId: "e7", notionId: "guerre-froide", severite: "moderee", maitrisePct: 55,
    historique: [{ date: "2026-10-10", maitrisePct: 55 }],
    origineTestIds: ["t7"], statut: "detectee" },
  { id: "l13", eleveId: "e7", notionId: "decolonisation", severite: "elevee", maitrisePct: 30,
    historique: [{ date: "2026-10-10", maitrisePct: 30 }],
    origineTestIds: ["t7"], statut: "detectee" },
  { id: "l14", eleveId: "e8", notionId: "probabilites", severite: "critique", maitrisePct: 15,
    historique: [{ date: "2026-09-18", maitrisePct: 15 }],
    origineTestIds: ["t8"], confirmeOral: true, statut: "renfort" },
  { id: "l15", eleveId: "e8", notionId: "second-degre", severite: "critique", maitrisePct: 20,
    historique: [{ date: "2026-09-18", maitrisePct: 20 }],
    origineTestIds: ["t8"], statut: "renfort" },
];

/* ── Appels ──────────────────────────────────────────────────────────── */

export const APPELS: Appel[] = [
  {
    id: "a1", eleveId: "e1", date: "2026-10-03", dureeMin: 18, animateur: "Ferot",
    type: "diagnostic", sentiment: "preoccupant",
    resume: "Aminata prépare le Bac D. Les suites la découragent depuis la 1ère : elle confond raison et coefficient multiplicateur. Le déclic vient quand on parle d'intérêts composés (elle gère l'argent de son petit commerce). La chute de 10 à 8 en maths suit le décès de sa grand-mère, période où elle a beaucoup manqué.",
    points: ["Méthode de travail", "Événement familial", "Changement de rythme"],
    declarations: ["Suites numériques", "Dérivation & variations"],
    prochaineEtape: "Renfort suites ancré finance personnelle. Rappel dans deux semaines.",
    statut: "effectue",
  },
  {
    id: "a2", eleveId: "e1", date: "2026-10-17", dureeMin: 0, animateur: "Ferot",
    type: "suivi-renfort", sentiment: "neutre", resume: "", points: [], declarations: [],
    prochaineEtape: "", statut: "planifie",
    motif: "Faire le point après le test du 09/10 et la fiche suites.",
  },
  {
    id: "a3", eleveId: "e2", date: "2026-10-08", dureeMin: 14, animateur: "Ferot",
    type: "diagnostic", sentiment: "neutre",
    resume: "Kouadio prépare le Bac A. Il lit beaucoup de romans mais « écrit comme il parle » : il n'a jamais appris à structurer un paragraphe argumentatif. Il connaît les figures de style à l'oral, incapable de les exploiter à l'écrit. Motivé par le métier de journaliste.",
    points: ["Méthode de rédaction", "Habitudes de lecture"],
    declarations: ["Argumentation & dissertation"],
    prochaineEtape: "Renfort argumentation + faire rédiger un paragraphe par appel.",
    statut: "effectue",
  },
  {
    id: "a4", eleveId: "e3", date: "2026-10-05", dureeMin: 12, animateur: "Adja",
    type: "diagnostic", sentiment: "positif",
    resume: "Fatou vise médecine. L'immunologie la freine : elle apprend par cœur sans schémas. Le diagnostic montre que la génétique est presque acquise. Elle demande des exercices supplémentaires — très autonome.",
    points: ["Objectif concours", "Autonomie"],
    declarations: ["Immunité & vaccination"],
    prochaineEtape: "Renfort immunologie avec schémas + refaire passer la partie génétique plus tard.",
    statut: "effectue",
  },
  {
    id: "a5", eleveId: "e5", date: "2026-10-02", dureeMin: 16, animateur: "Adja",
    type: "diagnostic", sentiment: "neutre",
    resume: "Awa comprend l'anglais en regardant des séries en VO mais n'ose jamais construire une phrase hypothétique — elle évite systématiquement les conditionnels. Confusion totale entre types 1, 2 et 3. Le blocage est de la confiance plus que de la compétence.",
    points: ["Confiance en soi", "Exposition à la langue"],
    declarations: ["Conditionals & hypotheticals"],
    prochaineEtape: "Valider le renfort conditionnels puis refaire passer la partie grammaire.",
    statut: "effectue",
  },
  {
    id: "a6", eleveId: "e6", date: "2026-09-22", dureeMin: 21, animateur: "Ferot",
    type: "diagnostic", sentiment: "preoccupant",
    resume: "Révélation clé : Ibrahima n'a jamais eu le chapitre sur les lois de Newton — il a changé d'établissement en cours d'année et le chapitre a été sauté. Il est sérieux mais découragé en physique (« je rate tout, c'est trop tard pour moi »). Dédramatisé en fin d'appel.",
    points: ["Changement d'établissement", "Chapitre jamais vu", "Découragement"],
    declarations: ["Lois de Newton"],
    prochaineEtape: "Reconstruire la base : ΣF = m·a avant tout nouveau chapitre de mécanique.",
    statut: "effectue",
  },
  {
    id: "a7", eleveId: "e7", date: "2026-10-11", dureeMin: 10, animateur: "Adja",
    type: "diagnostic", sentiment: "positif",
    resume: "Mariam vise un concours d'ingénieur. La Histoire-Géo la pénalise dans la moyenne : elle confond les phases de la Guerre froide par précipitation et récite sans comprendre les enjeux de la décolonisation. Aucun souci de motivation.",
    points: ["Objectif concours", "Autonomie"],
    declarations: [],
    prochaineEtape: "Fiches repères Guerre froide + décolonisation en autonomie.",
    statut: "effectue",
  },
  {
    id: "a8", eleveId: "e8", date: "2026-09-21", dureeMin: 25, animateur: "Ferot",
    type: "diagnostic", sentiment: "preoccupant",
    resume: "Séraphin cachait ses difficultés : « ça va » à chaque question. Après 15 minutes, il admet ne plus suivre en maths depuis la 2nde — les probabilités conditionnelles supposent des bases qu'il n'a plus. Il a peur de décevoir sa grande sœur qui l'a inscrit. Réceptif dès qu'on dédramatise.",
    points: ["Confiance en soi", "Suivi à la maison", "Décrochage ancien"],
    declarations: ["Probabilités conditionnelles", "Équations du 2nd degré"],
    prochaineEtape: "Deux fiches de renfort + appel des parents la semaine prochaine.",
    statut: "effectue",
  },
  {
    id: "a9", eleveId: "e8", date: "2026-10-16", dureeMin: 0, animateur: "Ferot",
    type: "parent", sentiment: "neutre", resume: "", points: [], declarations: [],
    prochaineEtape: "", statut: "planifie",
    motif: "Impliquer la famille dans le suivi quotidien des fiches de renfort.",
  },
];

/* ── Contenus déjà générés (essentiel/exemple/exercices remplis
      par la génération à l'affichage si vides) ───────────────────────── */

export const CONTENUS: ContenuGenere[] = [
  { id: "c1", eleveId: "e1", notionId: "suites", lacuneId: "l1", date: "2026-10-04",
    titre: "Renfort — Suites numériques", calibreNiveau: 1, essentiel: [],
    exemple: { enonce: "", resolution: [] }, exercices: [], autoCheck: [],
    contexteUtilise: "Exemples ancrés finance personnelle (appel du 03/10)" },
  { id: "c2", eleveId: "e2", notionId: "argumentation", lacuneId: "l4", date: "2026-10-08",
    titre: "Renfort — Argumentation & dissertation", calibreNiveau: 1, essentiel: [],
    exemple: { enonce: "", resolution: [] }, exercices: [], autoCheck: [] },
  { id: "c3", eleveId: "e5", notionId: "conditionnels", lacuneId: "l9", date: "2026-10-02",
    titre: "Renfort — Conditionals & hypotheticals", calibreNiveau: 2, essentiel: [],
    exemple: { enonce: "", resolution: [] }, exercices: [], autoCheck: [] },
  { id: "c4", eleveId: "e6", notionId: "newton", lacuneId: "l11", date: "2026-09-22",
    titre: "Renfort — Lois de Newton", calibreNiveau: 1, essentiel: [],
    exemple: { enonce: "", resolution: [] }, exercices: [], autoCheck: [] },
  { id: "c5", eleveId: "e8", notionId: "probabilites", lacuneId: "l14", date: "2026-09-23",
    titre: "Renfort — Probabilités conditionnelles", calibreNiveau: 1, essentiel: [],
    exemple: { enonce: "", resolution: [] }, exercices: [], autoCheck: [] },
  { id: "c6", eleveId: "e8", notionId: "second-degre", lacuneId: "l15", date: "2026-09-23",
    titre: "Renfort — Équations du 2nd degré", calibreNiveau: 1, essentiel: [],
    exemple: { enonce: "", resolution: [] }, exercices: [], autoCheck: [] },
];
