import type { Notion, Question } from "@/types";
import { q } from "./question";

export const NOTIONS_MATHS: Notion[] = [
  {
    id: "second-degre",
    matiere: "Mathématiques",
    nom: "Équations du 2nd degré",
    pointsCles: [
      "Forme canonique : ax² + bx + c = 0 (a ≠ 0). Tout repose sur le discriminant Δ = b² − 4ac.",
      "Δ > 0 → deux racines réelles : x = (−b ± √Δ) / 2a.",
      "Δ = 0 → une racine double : x = −b / 2a. Δ < 0 → aucune racine réelle.",
      "Somme des racines = −b/a, produit = c/a : utile pour vérifier un calcul en 10 secondes.",
    ],
    exemple: {
      enonce: "Résoudre dans ℝ : x² − 5x + 6 = 0",
      resolution: [
        "Δ = (−5)² − 4 × 1 × 6 = 25 − 24 = 1 > 0 → deux racines.",
        "x₁ = (5 − 1)/2 = 2 et x₂ = (5 + 1)/2 = 3.",
        "Vérification par somme/produit : 2 + 3 = 5 = −b/a ✓ et 2 × 3 = 6 = c/a ✓",
      ],
    },
    piege: "Oublier le signe de b dans Δ : ici b = −5, donc −b = 5. Écrire (−5)² − 4ac comme −5² − 4ac est l'erreur classique (le carré porte sur −5 entier).",
    testDisponible: true,
  },
  {
    id: "derivation",
    matiere: "Mathématiques",
    nom: "Dérivation & variations",
    pointsCles: [
      "Formules de base : (xⁿ)' = n·xⁿ⁻¹, (u + v)' = u' + v', (ku)' = k·u'.",
      "Composée : (uⁿ)' = n·u'·uⁿ⁻¹ — ne jamais oublier la dérivée de la fonction intérieure.",
      "Le signe de f' donne le sens de variation : f' > 0 → croissante, f' < 0 → décroissante.",
      "Un extremum local a lieu là où f' s'annule EN changeant de signe.",
    ],
    exemple: {
      enonce: "Dériver f(x) = (2x + 1)³ et étudier le sens de variation",
      resolution: [
        "Posons u(x) = 2x + 1, u'(x) = 2. Alors f = u³.",
        "f'(x) = 3 × u'(x) × u(x)² = 3 × 2 × (2x + 1)² = 6(2x + 1)².",
        "(2x + 1)² ≥ 0 et 6 > 0 → f' ≥ 0 : f est croissante sur ℝ.",
      ],
    },
    piege: "Oublier de multiplier par u' dans la dérivée d'une composée : (2x + 1)³ → 3(2x + 1)² est FAUX, il manque le ×2.",
    testDisponible: true,
  },
  {
    id: "suites",
    matiere: "Mathématiques",
    nom: "Suites numériques",
    pointsCles: [
      "Suite arithmétique : on ajoute la raison r → uₙ = u₀ + n·r. Suite géométrique : on multiplie par la raison q → uₙ = u₀·qⁿ.",
      "Somme des n premiers entiers : 1 + 2 + … + n = n(n + 1)/2.",
      "Somme d'une suite arithmétique : (nombre de termes) × (1er + dernier) / 2.",
      "Somme d'une suite géométrique de raison q ≠ 1 : u₀·(1 − qⁿ⁺¹)/(1 − q).",
    ],
    exemple: {
      enonce: "Un capital de 500 000 FCFA est placé à 4 % par an, à intérêts composés. Montant après 3 ans ?",
      resolution: [
        "Intérêts composés → suite géométrique de raison q = 1,04.",
        "uₙ = 500 000 × (1,04)ⁿ, donc u₃ = 500 000 × (1,04)³.",
        "u₃ ≈ 562 430 FCFA.",
      ],
    },
    piege: "Confondre raison arithmétique (on ajoute) et raison géométrique (on multiplie). Une hausse de 4 % multiplie par 1,04 : ce n'est PAS +4 sur le rang.",
    testDisponible: true,
  },
  {
    id: "probabilites",
    matiere: "Mathématiques",
    nom: "Probabilités conditionnelles",
    pointsCles: [
      "0 ≤ P(A) ≤ 1 et P(Ā) = 1 − P(A).",
      "Indépendance : P(A ∩ B) = P(A) × P(B). En général, P(A ∩ B) ≠ P(A) + P(B).",
      "Probabilité conditionnelle : P(B|A) = P(A ∩ B) / P(A).",
      "Arbre pondéré : on multiplie le long des branches, on additionne les chemins.",
    ],
    exemple: {
      enonce: "Dans une classe, 60 % des élèves possèdent une calculatrice, et la moitié de ceux-là savent l'utiliser en mode statistique. Quelle est la probabilité qu'un élève pris au hasard possède une calculatrice ET sache l'utiliser en mode statistique ?",
      resolution: [
        "P(C) = 0,6 ; P(B|C) = 0,5.",
        "P(C ∩ B) = P(C) × P(B|C) = 0,6 × 0,5.",
        "P(C ∩ B) = 0,30.",
      ],
    },
    piege: "Additionner des probabilités d'événements qui ne sont pas incompatibles : P(A ∪ B) = P(A) + P(B) − P(A ∩ B), jamais P(A) + P(B) brut.",
    testDisponible: true,
  },
];

export const QUESTIONS_MATHS: Question[] = [
  q("sd1", "second-degre", 1, "Combien de racines réelles peut admettre une équation du second degré ax² + bx + c = 0 (a ≠ 0) ?", "0, 1 ou 2 selon le signe du discriminant", ["toujours 2", "toujours 1", "au plus 1"], "Δ > 0 → 2 racines ; Δ = 0 → 1 racine double ; Δ < 0 → aucune racine réelle."),
  q("sd2", "second-degre", 2, "Quel est le discriminant de 2x² − 3x − 5 = 0 ?", "49", ["−31", "9", "31"], "Δ = b² − 4ac = (−3)² − 4 × 2 × (−5) = 9 + 40 = 49."),
  q("sd3", "second-degre", 3, "Les racines de x² − 5x + 6 = 0 sont :", "2 et 3", ["−2 et −3", "1 et 6", "−1 et 6"], "Δ = 25 − 24 = 1 → x = (5 ± 1)/2, soit 2 et 3."),
  q("sd4", "second-degre", 4, "Pour quelles valeurs de m l'équation x² + mx + 9 = 0 admet-elle une racine double ?", "m = ±6", ["m = 6 seulement", "m = ±3", "m = ±9"], "Racine double ⇔ Δ = 0 : m² − 36 = 0 → m = 6 ou m = −6."),
  q("dv1", "derivation", 1, "La dérivée de f(x) = x² est :", "f'(x) = 2x", ["f'(x) = x", "f'(x) = 2", "f'(x) = x²/2"], "Formule (xⁿ)' = n·xⁿ⁻¹ : avec n = 2, (x²)' = 2x."),
  q("dv2", "derivation", 2, "La dérivée de f(x) = 3x³ − 5x + 2 est :", "9x² − 5", ["3x² − 5", "9x² + 5", "x² − 5"], "(3x³)' = 9x², (−5x)' = −5, (2)' = 0 → f'(x) = 9x² − 5."),
  q("dv3", "derivation", 3, "f est dérivable sur [a ; b] et f'(x) > 0 pour tout x de [a ; b]. Alors f est :", "strictement croissante sur [a ; b]", ["strictement décroissante sur [a ; b]", "constante sur [a ; b]", "non monotone sur [a ; b]"], "Le signe de la dérivée donne le sens de variation : f' > 0 → f strictement croissante."),
  q("dv4", "derivation", 4, "La dérivée de f(x) = (2x + 1)³ est :", "6(2x + 1)²", ["3(2x + 1)²", "6(2x + 1)³", "2(2x + 1)²"], "(u³)' = 3u'·u² avec u = 2x + 1 et u' = 2 → f'(x) = 6(2x + 1)²."),
  q("su1", "suites", 1, "Dans une suite arithmétique de raison r, on passe d'un terme au suivant en :", "ajoutant r", ["multipliant par r", "élevant au carré", "soustrayant r"], "Arithmétique = on ajoute la raison. Géométrique = on multiplie."),
  q("su2", "suites", 2, "(uₙ) est arithmétique avec u₀ = 5 et r = 3. Que vaut u₃ ?", "14", ["11", "8", "15"], "uₙ = u₀ + n·r → u₃ = 5 + 3 × 3 = 14."),
  q("su3", "suites", 3, "(vₙ) est géométrique de raison 2 avec v₀ = 3. Que vaut v₄ ?", "48", ["24", "12", "96"], "vₙ = v₀·qⁿ → v₄ = 3 × 2⁴ = 3 × 16 = 48."),
  q("su4", "suites", 4, "Un capital de 100 000 F est placé à intérêts composés de 10 % par an. Au bout de 2 ans, il vaut :", "121 000 F", ["120 000 F", "110 000 F", "100 200 F"], "Raison q = 1,10 → 100 000 × 1,1² = 100 000 × 1,21 = 121 000 F. Les intérêts produisent eux-mêmes des intérêts."),
  q("pr1", "probabilites", 1, "Probabilité d'obtenir un 6 en lançant un dé équilibré à 6 faces :", "1/6", ["1/2", "5/6", "1/3"], "Cas favorable : 1. Cas possibles : 6. P = 1/6."),
  q("pr2", "probabilites", 2, "Si P(A) = 0,3, alors P(Ā) vaut :", "0,7", ["0,3", "1,3", "−0,3"], "Événement contraire : P(Ā) = 1 − P(A) = 1 − 0,3 = 0,7."),
  q("pr3", "probabilites", 3, "A et B sont indépendants, P(A) = 0,5 et P(B) = 0,4. Alors P(A ∩ B) =", "0,20", ["0,90", "0,10", "0,45"], "Indépendance → P(A ∩ B) = P(A) × P(B) = 0,5 × 0,4 = 0,20."),
  q("pr4", "probabilites", 4, "P(A) = 0,6 et P(B|A) = 0,5. Alors P(A ∩ B) =", "0,30", ["0,83", "1,10", "0,20"], "P(B|A) = P(A ∩ B)/P(A) → P(A ∩ B) = 0,6 × 0,5 = 0,30."),
];
