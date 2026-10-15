import type { Examen } from "@/types";

/** Délimiteur de bloc de code Markdown (évite tout backtick littéral ci-dessous) */
const F = "```";

/* ── Examens suivis (fichiers markdown déposés dans la console) ──────── */

const BAC_BLANC_MATHS = `# Bac blanc n°1 — Mathématiques
**Série D** · Durée : **4 h** · Coefficient 5 · Calculatrice non autorisée

> L'usage de la calculatrice est interdit. Toute réponse doit être **justifiée** :
> une valeur exacte non accompagnée d'un raisonnement ne rapporte aucun point.

## Exercice 1 — Suites numériques (5 points)

Soit la suite *(uₙ)* définie par :

${F}text
u₀ = 2   et   u(n+1) = (1/2) · u(n) + 3
${F}

1. Calculer *u₁* et *u₂* (valeurs exactes).
2. Soit *(vₙ)* la suite définie par *vₙ = uₙ − 6*. Montrer que *(vₙ)* est **géométrique**.
3. En déduire l'expression de *uₙ* en fonction de *n*, puis la limite de *(uₙ)*.

## Exercice 2 — Probabilités conditionnelles (5 points)

Un lycée organise une sortie. 60 % des élèves inscrits sont en 2nde.
Parmi les 2nde, 30 % viennent en bus ; parmi les autres, 55 % viennent en bus.

| Groupe | Proportion | Viennent en bus |
| --- | --- | --- |
| 2nde | 60 % | 30 % |
| 1ère / Tle | 40 % | 55 % |

1. Construire l'**arbre pondéré** décrivant la situation.
2. Calculer la probabilité qu'un élève choisi au hasard vienne en bus.
3. Un élève vient en bus : quelle est la probabilité qu'il soit en 2nde ?

## Exercice 3 — Dérivation (5 points)

1. Dériver les fonctions *f(x) = 3x² − 5x + 2* puis *g(x) = (2x + 1)·√x*.
2. Étudier les variations de *f* sur ℝ et dresser son **tableau de variations**.

## Exercice 4 — Question ouverte (5 points)

*Aminata a cité les intérêts composés en classe : un capital de 25 000 F est placé
à 4 % par an, les intérêts étant ajoutés chaque année au capital.*

Au bout de combien d'années le capital dépasse-t-il 40 000 F ? Justifier par un raisonnement
par récurrence ou à l'aide d'une suite auxiliaire.

---
**Barème indicatif** : la rédaction, l'orthographe et la présentation comptent pour 1 point
réparti sur les quatre exercices.`;

const COMPO_FRANCAIS = `# Composition française — Français
**Série A** · Durée : **3 h** · Coefficient 4

> Traiter **un seul** des deux sujets, au choix. La copie doit comporter une
> introduction, un développement organisé en paragraphes et une conclusion.

## Sujet I — Résumé et discussion

*L'argent ne fait pas le bonheur, disait-on autrefois. Aujourd'hui, beaucoup
affirment l'inverse : sans argent, point de projets, point d'avenir.*

1. Résumez le texte en **100 mots** (± 10 %).
2. Discutez cette affirmation en vous appuyant sur des arguments **ordonnés**
   et des exemples tirés de votre expérience ou de vos lectures.

## Sujet II — Commentaire de texte

Texte proposé : un extrait de *Sous l'orage* de Seydou Badian (scène de la dispute).

1. Relevez les **figures de style** présentes dans le passage (métaphores, comparaisons, apostrophes).
2. Montrez comment le dialogue révèle le **conflit de générations**.
3. Dans quelle mesure ce conflit reste-t-il d'actualité ?

---
*Conseil de rédaction* : une idée = un paragraphe. Relisez-vous pour la ponctuation
et les connecteurs logiques (d'abord, ensuite, en outre, pourtant…).`;

const DEVOIR_PHYSIQUE = `# Devoir surveillé n°2 — Physique-Chimie
**1ère C** · Durée : **2 h** · Calculatrice autorisée

## Partie A — Lois de Newton (10 points)

Un solide de masse **m = 2,0 kg** est tiré sur une table horizontale par une force F
inclinée de 30° par rapport à l'horizontale. Les frottements sont équivalents à une
force unique de valeur f = 3,0 N.

${F}text
Données : g = 9,8 N·kg⁻¹   ·   F = 10 N   ·   α = 30°
${F}

1. Faire le **bilan des forces** et le représenter sur un schéma.
2. Énoncer la **deuxième loi de Newton**.
3. Calculer la valeur de l'accélération du solide.
4. Le solide part du repos : calculer sa vitesse après 2,0 s.

## Partie B — Chimie (10 points)

On dissout **5,85 g** de chlorure de sodium NaCl dans une fiole jaugée de 500 mL.

| Grandeur | Valeur |
| --- | --- |
| M(Na) | 23,0 g·mol⁻¹ |
| M(Cl) | 35,5 g·mol⁻¹ |

1. Calculer la **quantité de matière** n de NaCl dissoute.
2. En déduire la concentration molaire C de la solution.
3. Écrire l'équation de dissociation dans l'eau.

> **Rappel de méthode** : toujours convertir les unités *avant* l'application numérique.
> Une réponse sans unité est considérée comme fausse.`;

const COMPREHENSION_ANGLAIS = `# Reading & Writing Test — Anglais
**Terminale D** · Durée : **1 h 30** · Coefficient 2

## Partie 1 — Reading comprehension (10 points)

Read the following extract carefully, then answer the questions **in English**.

> *If I had known how difficult the exam would be, I would have started revising
> earlier. Now, unless I work every day until June, I won't pass. My sister keeps
> telling me that if she could go back to school, she would never waste a single
> lesson. She is right — and if I pass with a good grade, she promised to buy me
> the dictionary I have wanted for months.*

1. True or False ? Justify each answer with a **quotation** from the text :
   - [ ] The narrator started revising early.
   - [ ] The sister regrets her own school years.
   - [ ] The narrator will be rewarded if he succeeds.
2. Find in the text **three** sentences with a conditional. Classify them
   (type 1, type 2 or type 3) and explain the difference.
3. Rewrite using the passive voice : *"She promised to buy me the dictionary."*

## Partie 2 — Writing (10 points)

Write **120 to 150 words** on the following topic :

> *"If you could change one thing about your school, what would it be ?"*

Your teacher will assess : **organisation** (paragraphs, connectors), accuracy of
the conditional forms, and range of vocabulary. *Mind your punctuation.*`;

const COMPOSITION_HISTOIRE_GEO = `# Composition — Histoire-Géo
**Tle C** · Durée : **3 h** · Coefficient 3

## Histoire — La Guerre froide (sur 10)

*De 1947 à 1991, le monde vit sous la menace de deux blocs opposés.*

1. Présentez les **phases** de la Guerre froide (1947-1953, 1953-1962, 1962-1975, 1975-1991)
   en caractérisant chaque phase par un exemple majeur.
2. La crise de Cuba (1962) : montrez qu'elle illustre à la fois l'**affrontement**
   et la **coexistence pacifique**.
3. Croquis : légender le schéma des deux blocs et des pays non alignés.

${F}text
1955  ─ Conférence de Bandung
1961  ─ Mur de Berlin
1962  ─ Crise de Cuba
1989  ─ Chute du mur
${F}

## Géographie — Mondialisation et décolonisation (sur 10)

1. Définissez **mondialisation** et donnez trois manifestations concrètes en Afrique de l'Ouest.
2. Étude de cas : la **décolonisation de l'Afrique noire française** (1958-1960) —
   expliquer le passage de la Communauté aux indépendances.

> **Méthode** : introduction (accroche, problématique, annonce du plan) —
> développement en 2 ou 3 parties équilibrées — conclusion (réponse + ouverture).
> Une copie sans plan apparent est pénalisée.`;

const BAC_BLANC_SVT = `# Épreuve de SVT — Bac blanc n°1
**Série D** · Durée : **3 h 30** · Coefficient 6

> La restitution organisée des connaissances compte pour **8 points**.
> Le raisonnement scientifique et la qualité du schéma sont évalués.

## Partie 1 — Restitution organisée des connaissances (8 points)

Montrez que la **vaccination** permet à un organisme d'acquérir une immunité
durable. Votre exposé inclura :

- [ ] le déroulement de la **réponse immunitaire primaire** ;
- [ ] la mise en mémoire par les **lymphocytes B mémoire** ;
- [ ] la différence entre immunité naturelle et immunité **artificielle**.

## Partie 2 — Problème à résoudre (12 points)

*Chez la drosophile, l'allèle « corps gris » (G) est dominant sur « corps noir » (g),
et l'allèle « ailes longues » (V) est dominant sur « ailes vestigiales » (v).
Les deux gènes sont situés sur le même chromosome.*

Un croisement entre femelles GgVv et mâles gg vv donne la descendance suivante :

| Phénotype | Nombre d'individus |
| --- | --- |
| gris, ailes longues | 41 |
| gris, ailes vestigiales | 9 |
| noir, ailes longues | 11 |
| noir, ailes vestigiales | 39 |

1. Analysez les résultats : les gènes sont-ils **indépendants** ou **liés** ?
2. Calculez le **taux de recombinaison** et déduisez-en la position relative des gènes.
3. Réalisez le schéma de la méiose expliquant les quatre phénotypes obtenus.

${F}text
     chromosome           chromatides recombinées
     ┌──────┐               ┌──G──V──┐
     │ G  V │      méiose   │──✕─────│ → échange de fragments
     │ g  v │      ⇢        └──g──v──┘
     └──────┘
${F}`;

const INTERROGATION_PROBAS = `# Interrogation écrite — Probabilités
**1ère D** · Durée : **30 min** · Une page, calculatrice autorisée

## Exercice unique (sur 10)

Dans une classe de 30 élèves, **18** étudient l'anglais, **12** l'espagnol et
**6** étudient les deux langues. On interroge un élève au hasard.

1. Calculer P(A) et P(E), puis P(A ∩ E).
2. Les événements A (« étudie l'anglais ») et E (« étudie l'espagnol ») sont-ils
   **indépendants** ? Justifier par le calcul.
3. Un élève étudié l'espagnol : quelle est la probabilité qu'il étudie aussi l'anglais ?
4. **BONUS** — Reprendre la situation avec un **arbre de probabilités**.

---
*Sans justifications écrites, aucune réponse n'est comptabilisée.*`;

const DEVOIR_COMMUN_MATHS = `# Devoir commun — Mathématiques
**1ère D** · Durée : **2 h** · Sujet commun aux trois classes

## Exercice 1 — QCM (4 points)

*Une seule réponse correcte par question — +1 si juste, 0 sinon.*

| Question | A | B | C |
| --- | --- | --- | --- |
| La dérivée de x³ est… | 3x | 3x² | x² |
| P(A ∪ B) = … | P(A) + P(B) | P(A) + P(B) − P(A ∩ B) | P(A) · P(B) |
| La suite uₙ = 5 + 2n est… | arithmétique | géométrique | ni l'un ni l'autre |

## Exercice 2 — Équations du second degré (8 points)

Résoudre dans ℝ : **x² − 5x + 6 = 0**, puis **2x² + 4x + 5 = 0**.
Préciser pour chaque équation le signe du **discriminant** avant de conclure.

## Exercice 3 — Problème (8 points)

Un club de mathématiques vend des gateaux : le premier jour 12, le deuxième 18,
puis les ventes augmentent de 6 gateaux par jour.

1. Quelle est la nature de la suite des ventes ? Exprimer *vₙ*.
2. À partir de quel jour le stock initial de 300 gateaux est-il épuisé ?`;

const INTERROGATION_ANGLAIS_ATTENTE = `# Vocabulary Quiz — Anglais
**1ère D** · Durée : **20 min**

## Part 1 — Translate (5 points)

Translate the following sentences into **English** :

1. Si j'avais su, je serais venu plus tôt.
2. À moins que tu ne travailles, tu échoueras.
3. Elle souhaite qu'elle ait plus de temps.

## Part 2 — Word building (5 points)

| Verb | Noun | Adjective |
| --- | --- | --- |
| decide | ? | ? |
| ? | confidence | ? |
| revise | ? | ? |

## Part 3 — Connectors (5 points)

Fill in the blanks with : *however · therefore · although · unless · moreover*.

1. ___ he was tired, he finished his homework.
2. She didn't revise ; ___, she failed the quiz.
3. You won't progress ___ you practise every day.

*Copies rendues — correction prévue après le point de suivi de la semaine 43.*`;

export const EXAMENS: Examen[] = [
  {
    id: "x1", eleveId: "e1", matiere: "Mathématiques",
    titre: "Bac blanc n°1", type: "bac-blanc", date: "2026-10-02",
    trimestre: "1er trimestre 2026-2027", note: 8, sur: 20,
    fichier: "bac-blanc-1_maths_aminata-diallo.md", contenu: BAC_BLANC_MATHS, deposePar: "Ferot",
  },
  {
    id: "x2", eleveId: "e2", matiere: "Français",
    titre: "Composition française", type: "composition", date: "2026-10-07",
    trimestre: "1er trimestre 2026-2027", note: 7, sur: 20,
    fichier: "compo_francais_kouadio-yao.md", contenu: COMPO_FRANCAIS, deposePar: "Adja",
  },
  {
    id: "x3", eleveId: "e3", matiere: "SVT",
    titre: "Bac blanc n°1", type: "bac-blanc", date: "2026-10-05",
    trimestre: "1er trimestre 2026-2027", note: 9, sur: 20,
    fichier: "bac-blanc-1_svt_fatou-ndiaye.md", contenu: BAC_BLANC_SVT, deposePar: "Ferot",
  },
  {
    id: "x4", eleveId: "e5", matiere: "Anglais",
    titre: "Reading & Writing Test", type: "devoir", date: "2026-10-01",
    trimestre: "1er trimestre 2026-2027", note: 9, sur: 20,
    fichier: "test-rw_anglais_awa-kone.md", contenu: COMPREHENSION_ANGLAIS, deposePar: "Adja",
  },
  {
    id: "x5", eleveId: "e6", matiere: "Physique-Chimie",
    titre: "Devoir surveillé n°2", type: "devoir", date: "2026-09-24",
    trimestre: "1er trimestre 2026-2027", note: 8, sur: 20,
    fichier: "ds-2_physique-chimie_ibrahima-sow.md", contenu: DEVOIR_PHYSIQUE, deposePar: "Ferot",
  },
  {
    id: "x6", eleveId: "e7", matiere: "Histoire-Géo",
    titre: "Composition Histoire-Géo", type: "composition", date: "2026-10-08",
    trimestre: "1er trimestre 2026-2027", note: 12, sur: 20,
    fichier: "compo_histoire-geo_mariam-cisse.md", contenu: COMPOSITION_HISTOIRE_GEO, deposePar: "Adja",
  },
  {
    id: "x7", eleveId: "e8", matiere: "Mathématiques",
    titre: "Interrogation — Probabilités", type: "interrogation", date: "2026-09-25",
    trimestre: "1er trimestre 2026-2027", note: 7, sur: 10,
    fichier: "interro_probabilites_seraphin-mbemba.md", contenu: INTERROGATION_PROBAS, deposePar: "Ferot",
  },
  {
    id: "x8", eleveId: "e3", matiere: "Mathématiques",
    titre: "Devoir commun", type: "devoir", date: "2026-10-10",
    trimestre: "1er trimestre 2026-2027", note: 11, sur: 20,
    fichier: "devoir-commun_maths_fatou-ndiaye.md", contenu: DEVOIR_COMMUN_MATHS, deposePar: "Ferot",
  },
  {
    id: "x9", eleveId: "e5", matiere: "Anglais",
    titre: "Vocabulary Quiz", type: "interrogation", date: "2026-10-13",
    trimestre: "1er trimestre 2026-2027",
    fichier: "quiz-vocabulaire_anglais_awa-kone.md", contenu: INTERROGATION_ANGLAIS_ATTENTE, deposePar: "Adja",
  },
];
