/**
 * Grille de curriculum : pour chaque matière, les chapitres et leurs
 * dépendances (prérequis). Un chapitre ne se travaille bien que si ses
 * prérequis sont solides — l'arbre du diagnostic suit ce graphe
 * (de la base vers les notions avancées : additions → fractions → …).
 */
export interface ChapitreGrille {
  id: string;
  matiere: string;
  nom: string;
  /** notions de la banque (avec test, fiches…) rattachées au chapitre */
  notionIds: string[];
  /** notions de base du chapitre, hors banque (additions, conjugaison…) */
  notionsBase: string[];
  /** ids des chapitres prérequis */
  prerequis: string[];
}

export const GRILLE: ChapitreGrille[] = [
  /* ── Mathématiques ── */
  {
    id: "m-nombres",
    matiere: "Mathématiques",
    nom: "Nombres & opérations",
    notionIds: [],
    notionsBase: ["Additions & soustractions", "Multiplications & divisions"],
    prerequis: [],
  },
  {
    id: "m-fractions",
    matiere: "Mathématiques",
    nom: "Fractions & proportionnalité",
    notionIds: [],
    notionsBase: ["Fractions", "Pourcentages"],
    prerequis: ["m-nombres"],
  },
  {
    id: "m-equations",
    matiere: "Mathématiques",
    nom: "Équations & inéquations",
    notionIds: [],
    notionsBase: ["Équations 1er degré", "Inéquations"],
    prerequis: ["m-fractions"],
  },
  {
    id: "m-second-degre",
    matiere: "Mathématiques",
    nom: "Équations du 2nd degré",
    notionIds: ["second-degre"],
    notionsBase: [],
    prerequis: ["m-equations"],
  },
  {
    id: "m-suites",
    matiere: "Mathématiques",
    nom: "Suites numériques",
    notionIds: ["suites"],
    notionsBase: [],
    prerequis: ["m-second-degre"],
  },
  {
    id: "m-derivation",
    matiere: "Mathématiques",
    nom: "Dérivation & variations",
    notionIds: ["derivation"],
    notionsBase: [],
    prerequis: ["m-suites"],
  },
  {
    id: "m-probas",
    matiere: "Mathématiques",
    nom: "Probabilités conditionnelles",
    notionIds: ["probabilites"],
    notionsBase: [],
    prerequis: ["m-fractions"],
  },

  /* ── Français ── */
  {
    id: "f-phrase",
    matiere: "Français",
    nom: "Phrase & accords",
    notionIds: [],
    notionsBase: ["Types de phrases", "Accords", "Conjugaison"],
    prerequis: [],
  },
  {
    id: "f-grammaire",
    matiere: "Français",
    nom: "Subordination & syntaxe",
    notionIds: ["grammaire"],
    notionsBase: [],
    prerequis: ["f-phrase"],
  },
  {
    id: "f-figures",
    matiere: "Français",
    nom: "Figures de style & commentaire",
    notionIds: ["figures-style"],
    notionsBase: [],
    prerequis: ["f-grammaire"],
  },
  {
    id: "f-argumentation",
    matiere: "Français",
    nom: "Argumentation & dissertation",
    notionIds: ["argumentation"],
    notionsBase: [],
    prerequis: ["f-figures"],
  },

  /* ── Anglais ── */
  {
    id: "a-temps",
    matiere: "Anglais",
    nom: "Temps simples & continus",
    notionIds: [],
    notionsBase: ["Present simple", "Past simple", "Futurs"],
    prerequis: [],
  },
  {
    id: "a-passive",
    matiere: "Anglais",
    nom: "Passive voice & reporting",
    notionIds: ["voix-passive"],
    notionsBase: [],
    prerequis: ["a-temps"],
  },
  {
    id: "a-conditionnels",
    matiere: "Anglais",
    nom: "Conditionals & hypotheticals",
    notionIds: ["conditionnels"],
    notionsBase: [],
    prerequis: ["a-passive"],
  },

  /* ── Physique-Chimie ── */
  {
    id: "p-grandeurs",
    matiere: "Physique-Chimie",
    nom: "Grandeurs & unités",
    notionIds: [],
    notionsBase: ["Unités SI", "Conversions", "Notation scientifique"],
    prerequis: [],
  },
  {
    id: "p-moles",
    matiere: "Physique-Chimie",
    nom: "Quantité de matière & concentration",
    notionIds: ["moles"],
    notionsBase: [],
    prerequis: ["p-grandeurs"],
  },
  {
    id: "p-newton",
    matiere: "Physique-Chimie",
    nom: "Lois de Newton",
    notionIds: ["newton"],
    notionsBase: [],
    prerequis: ["p-grandeurs", "p-moles"],
  },

  /* ── SVT ── */
  {
    id: "s-cellule",
    matiere: "SVT",
    nom: "Cellule & ADN",
    notionIds: [],
    notionsBase: ["La cellule", "ADN & gènes", "Divisions cellulaires"],
    prerequis: [],
  },
  {
    id: "s-genetique",
    matiere: "SVT",
    nom: "Génétique & hérédité",
    notionIds: ["genetique"],
    notionsBase: [],
    prerequis: ["s-cellule"],
  },
  {
    id: "s-immunite",
    matiere: "SVT",
    nom: "Immunité & défenses",
    notionIds: ["immunite"],
    notionsBase: [],
    prerequis: ["s-genetique"],
  },

  /* ── Histoire-Géo ── */
  {
    id: "h-reperes",
    matiere: "Histoire-Géo",
    nom: "Le monde au XXe siècle",
    notionIds: [],
    notionsBase: ["Repères 1900-1945", "Empires coloniaux"],
    prerequis: [],
  },
  {
    id: "h-decolonisation",
    matiere: "Histoire-Géo",
    nom: "Décolonisations & indépendances",
    notionIds: ["decolonisation"],
    notionsBase: [],
    prerequis: ["h-reperes"],
  },
  {
    id: "h-guerre-froide",
    matiere: "Histoire-Géo",
    nom: "La Guerre froide",
    notionIds: ["guerre-froide"],
    notionsBase: [],
    prerequis: ["h-reperes"],
  },
  {
    id: "h-mondialisation",
    matiere: "Histoire-Géo",
    nom: "Mondialisation",
    notionIds: ["mondialisation"],
    notionsBase: [],
    prerequis: ["h-guerre-froide", "h-decolonisation"],
  },

  /* ── ECM ── */
  {
    id: "c-valeurs",
    matiere: "ECM",
    nom: "Valeurs & citoyenneté",
    notionIds: [],
    notionsBase: ["Valeurs républicaines", "Symboles & institutions"],
    prerequis: [],
  },
  {
    id: "c-droits",
    matiere: "ECM",
    nom: "Droits humains",
    notionIds: ["droits-humains"],
    notionsBase: [],
    prerequis: ["c-valeurs"],
  },
  {
    id: "c-democratie",
    matiere: "ECM",
    nom: "Démocratie & institutions",
    notionIds: ["democratie"],
    notionsBase: [],
    prerequis: ["c-droits"],
  },
  {
    id: "c-civisme",
    matiere: "ECM",
    nom: "Civisme & engagement",
    notionIds: ["civisme"],
    notionsBase: [],
    prerequis: ["c-democratie"],
  },
];

export const MATIERES_GRILLE = [...new Set(GRILLE.map((c) => c.matiere))];

export const chapitresParMatiere = (matiere: string): ChapitreGrille[] =>
  GRILLE.filter((c) => c.matiere === matiere);

/** Profondeur d'un chapitre = plus longue chaîne de prérequis depuis une base */
export function profondeursChapitres(
  chapitres: Pick<ChapitreGrille, "id" | "prerequis">[]
): Record<string, number> {
  const prof: Record<string, number> = {};
  const calc = (id: string, chemin: Set<string>): number => {
    if (prof[id] !== undefined) return prof[id];
    if (chemin.has(id)) return 0; // garde-fou anti-cycle
    chemin.add(id);
    const c = chapitres.find((x) => x.id === id);
    const p =
      c && c.prerequis.length
        ? Math.max(...c.prerequis.map((r) => calc(r, chemin))) + 1
        : 0;
    prof[id] = p;
    return p;
  };
  chapitres.forEach((c) => calc(c.id, new Set()));
  return prof;
}
