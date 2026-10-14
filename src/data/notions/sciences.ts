import type { Notion, Question } from "@/types";
import { q } from "./question";

/** Physique-Chimie + SVT — niveau lycée */
export const NOTIONS_SCIENCES: Notion[] = [
  {
    id: "newton",
    matiere: "Physique-Chimie",
    nom: "Lois de Newton",
    pointsCles: [
      "1ʳᵉ loi (inertie) : si ΣF = 0, le centre d'inertie est au repos ou en mouvement rectiligne uniforme.",
      "2ᵉ loi : ΣF = m·a — la résultante des forces crée l'accélération, dans la même direction et le même sens.",
      "3ᵉ loi (actions réciproques) : A exerce sur B une force opposée à celle que B exerce sur A.",
      "Chute libre sans frottement : a = g ≈ 9,8 m·s⁻², indépendante de la masse.",
    ],
    exemple: {
      enonce: "Un mobile de 2 kg est soumis à une force résultante de 10 N. Déterminer son accélération, puis sa vitesse après 3 s (parti de repos).",
      resolution: [
        "2ᵉ loi de Newton : a = ΣF / m = 10 / 2 = 5 m·s⁻².",
        "Mouvement uniformément accéléré : v = a·t.",
        "v(3 s) = 5 × 3 = 15 m·s⁻¹.",
      ],
    },
    piege: "Confondre vitesse et accélération : a = Δv/Δt. Et sur la 2ᵉ loi, ne pas oublier que ΣF est la somme VECTORIELLE des forces, pas leur somme arithmétique.",
    testDisponible: true,
  },
  {
    id: "moles",
    matiere: "Physique-Chimie",
    nom: "Quantité de matière & concentration",
    pointsCles: [
      "Quantité de matière : n = m / M (masse en g, masse molaire en g·mol⁻¹, n en mol).",
      "Pour un gaz : n = V / Vm avec Vm ≈ 24 L·mol⁻¹ dans les conditions ambiantes.",
      "Concentration molaire : C = n / V (mol·L⁻¹). Concentration massique : Cm = C × M.",
      "À la dilution, la quantité se conserve : C₁·V₁ = C₂·V₂.",
    ],
    exemple: {
      enonce: "On dissout 5,85 g de chlorure de sodium NaCl (M = 58,5 g·mol⁻¹) dans 500 mL d'eau. Quelle est la concentration molaire ?",
      resolution: [
        "n = m / M = 5,85 / 58,5 = 0,1 mol.",
        "V = 500 mL = 0,5 L.",
        "C = n / V = 0,1 / 0,5 = 0,2 mol·L⁻¹.",
      ],
    },
    piege: "Mélanger concentration molaire (mol·L⁻¹) et massique (g·L⁻¹) — et oublier de convertir les mL en L avant de diviser.",
    testDisponible: true,
  },
  {
    id: "genetique",
    matiere: "SVT",
    nom: "Génétique & hérédité",
    pointsCles: [
      "L'information génétique est portée par l'ADN : 4 bases (A, T, C, G), un gène = une portion d'ADN.",
      "Chaque gène peut exister en plusieurs versions (allèles) ; un individu diploïde en porte 2.",
      "Allèle dominant : s'exprime en un exemplaire (Aa). Récessif : exige 2 exemplaires (aa).",
      "Échiquier de croisement : on prédit les proportions génotypiques et phénotypiques.",
    ],
    exemple: {
      enonce: "Croisement entre deux individus Aa × Aa (A dominant). Proportions attendues ?",
      resolution: [
        "Chaque parent produit les gamètes A et a en proportions égales.",
        "Échiquier : AA, Aa, Aa, aa.",
        "3/4 expriment le caractère dominant (A_), 1/4 le caractère récessif (aa).",
      ],
    },
    piege: "Confondre génotype (les allèles portés) et phénotype (le caractère exprimé) : un Aa et un AA ont le même phénotype dominant mais pas le même génotype.",
    testDisponible: true,
  },
  {
    id: "immunite",
    matiere: "SVT",
    nom: "Immunité & vaccination",
    pointsCles: [
      "L'immunité innée est immédiate et non spécifique ; l'immunité acquise est spécifique et garde une mémoire.",
      "Les lymphocytes B produisent les anticorps ; les lymphocytes T8 détruisent les cellules infectées.",
      "Le vaccin présente un antigène inoffensif → mémoire immunitaire sans la maladie.",
      "Le VIH affaiblit l'immunité en détruisant les lymphocytes T4 (séropositivité = anticorps détectés).",
    ],
    exemple: {
      enonce: "Pourquoi une personne vaccinée contre la rougeole ne tombe-t-elle généralement pas malade au contact du virus ?",
      resolution: [
        "La vaccination a déclenché une réponse primaire sans symptômes graves.",
        "Des lymphocytes B mémoires spécifiques de l'antigène persistent dans l'organisme.",
        "Au contact du virus, la réponse secondaire est rapide et intense : le virus est neutralisé avant toute maladie.",
      ],
    },
    piege: "Confondre séropositif (présence d'anticorps détectés) et malade du sida : la séropositivité VIH précède de plusieurs années la phase sida si non traitée.",
    testDisponible: true,
  },
];

export const QUESTIONS_SCIENCES: Question[] = [
  q("nw1", "newton", 1, "Avec une masse constante, la 2ᵉ loi de Newton s'écrit :", "ΣF = m·a", ["ΣF = m·v", "ΣF = m/a", "E = m·c²"], "La résultante des forces est égale au produit de la masse par l'accélération du centre d'inertie."),
  q("nw2", "newton", 2, "Un objet de masse 2 kg subit une force résultante de 10 N. Son accélération vaut :", "5 m·s⁻²", ["20 m·s⁻²", "0,2 m·s⁻²", "12 m·s⁻²"], "a = ΣF/m = 10/2 = 5 m·s⁻²."),
  q("nw3", "newton", 3, "D'après le principe d'inertie, si ΣF = 0, le mouvement est :", "rectiligne uniforme (ou immobile)", ["accéléré", "circulaire uniforme", "uniformément ralenti"], "Sans force résultante, la vitesse ne change ni en norme ni en direction."),
  q("nw4", "newton", 4, "Dans la chute libre sans frottement, l'accélération du corps :", "vaut g ≈ 9,8 m·s⁻², indépendante de la masse", ["est proportionnelle à sa masse", "est nulle", "dépend de son volume"], "Tous les corps tombent avec la même accélération g : Galilée l'a montré, la masse disparaît dans m·a = m·g."),
  q("mo1", "moles", 1, "La quantité de matière s'exprime en :", "mol", ["g", "L", "kg"], "La mole est l'unité de quantité de matière ; le gramme est une masse."),
  q("mo2", "moles", 2, "Quelle quantité de matière représente 18 g d'eau (M = 18 g·mol⁻¹) ?", "1 mol", ["18 mol", "0,1 mol", "36 mol"], "n = m/M = 18/18 = 1 mol."),
  q("mo3", "moles", 3, "On dissout 0,5 mol de sucre dans 2 L d'eau. La concentration molaire est :", "0,25 mol·L⁻¹", ["1 mol·L⁻¹", "0,1 mol·L⁻¹", "2,5 mol·L⁻¹"], "C = n/V = 0,5/2 = 0,25 mol·L⁻¹."),
  q("mo4", "moles", 4, "Quelle est la masse molaire du CO₂ (C = 12 ; O = 16) ?", "44 g·mol⁻¹", ["28 g·mol⁻¹", "56 g·mol⁻¹", "22 g·mol⁻¹"], "M(CO₂) = 12 + 2 × 16 = 44 g·mol⁻¹."),
  q("ge1", "genetique", 1, "L'ADN contient combien de bases différentes ?", "4 (A, T, C, G)", ["2", "6", "20"], "Adénine, thymine, cytosine, guanine : 4 bases qui s'apparient A-T et C-G."),
  q("ge2", "genetique", 2, "Un allèle récessif ne s'exprime que s'il est présent en :", "deux exemplaires (aa)", ["un seul exemplaire", "trois exemplaires", "aucun exemplaire"], "Récessif = masqué par le dominant : il faut l'homozygotie aa pour l'exprimer."),
  q("ge3", "genetique", 3, "Croisement Aa × aa : quelle proportion de descendants Aa ?", "50 %", ["100 %", "25 %", "75 %"], "Gamètes A/a × a/a → Aa, Aa, aa, aa : 50 % de Aa."),
  q("ge4", "genetique", 4, "Chez l'humain, quel chromosome sexuel le père transmet-il à ses fils ?", "Y", ["X", "X ou Y au hasard", "aucun"], "Le père donne Y aux garçons et X aux filles ; la mère donne toujours un X."),
  q("im1", "immunite", 1, "Les anticorps sont produits par :", "les lymphocytes B", ["les globules rouges", "les plaquettes", "les neurones"], "Les plasmocytes, issus de la différenciation des lymphocytes B, sécrètent les anticorps."),
  q("im2", "immunite", 2, "Le VIH cible préférentiellement :", "les lymphocytes T4", ["les hématies", "les plaquettes", "les cellules de la peau"], "Le virus affaiblit l'immunité en détruisant les lymphocytes T4 auxiliaires."),
  q("im3", "immunite", 3, "Un vaccin confère une immunité :", "acquise et active", ["innée", "passive et temporaire", "génétique"], "Le vaccin déclenche une réponse active du corps qui garde une mémoire immunitaire."),
  q("im4", "immunite", 4, "Dire qu'une personne est « séropositive au VIH » signifie que son sang contient :", "des anticorps spécifiques du VIH", ["le virus visible à l'œil nu", "uniquement des lymphocytes T8", "des anticorps contre toutes les maladies"], "Le dépistage détecte les anticorps produits par l'organisme contre le VIH."),
];
