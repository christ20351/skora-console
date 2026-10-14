import type { Notion, Question } from "@/types";
import { q } from "./question";

export const NOTIONS_LANGUES: Notion[] = [
  {
    id: "figures-style",
    matiere: "Français",
    nom: "Figures de style & commentaire",
    pointsCles: [
      "Métaphore : image SANS outil de comparaison (« cette femme est un roc »). Comparaison : AVEC outil (« comme », « semblable à »).",
      "Hyperbole : exagération (« mourir de faim »). Euphémisme : atténuation (« il nous a quittés »). Litote : dire moins pour suggérer plus.",
      "Au commentaire, une figure n'est jamais citée pour elle-même : on dit ce qu'elle AJOUTE au sens (force, ironie, gravité…).",
      "Repérer le champ lexical d'un passage aide à nommer son effet (terreur, tendresse, dérision…).",
    ],
    exemple: {
      enonce: "« Paris est une fête » (Miller). Nommer la figure et son effet.",
      resolution: [
        "Pas d'outil de comparaison : métaphore — la ville est assimilée à une fête.",
        "Effet : la ville devient vivante, joyeuse, animée par une seule image.",
        "Au commentaire : cette métaphore traduit le regard enchanté du narrateur sur la capitale.",
      ],
    },
    piege: "Confondre métaphore et comparaison : dès qu'il y a « comme », « tel », « semblable à », c'est une comparaison, pas une métaphore.",
    testDisponible: true,
  },
  {
    id: "argumentation",
    matiere: "Français",
    nom: "Argumentation & dissertation",
    pointsCles: [
      "Plan d'un paragraphe : argument → explication → exemple → conclusion partielle. Un exemple ne remplace jamais un argument.",
      "L'introduction amène le sujet, pose la problématique, annonce le plan. La conclusion répond à la problématique et ouvre.",
      "Connecteurs logiques à maîtriser : d'abord / en outre (ajout), cependant / pourtant (opposition), donc / ainsi (conséquence).",
      "La concession-réfutation (« certes… mais ») montre qu'on a examiné la thèse adverse avant de la dépasser.",
    ],
    exemple: {
      enonce: "Rédiger l'ossature d'un paragraphe : « Le numérique favorise-t-il l'apprentissage ? » (thèse : oui, avec nuance)",
      resolution: [
        "Argument : l'accès immédiat à des ressources diversifiées développe l'autonomie.",
        "Explication : l'élève compare les sources, ce qui exerce son esprit critique.",
        "Exemple + nuance : les cours en ligne (MOOC) — certes, la désinformation exige un tri rigoureux, mais ce tri est justement une compétence scolaire.",
      ],
    },
    piege: "Empiler des exemples sans arguments : le correcteur note le raisonnement. Un exemple sans argument expliqué ne rapporte rien.",
    testDisponible: true,
  },
  {
    id: "grammaire",
    matiere: "Français",
    nom: "Subordination & syntaxe",
    pointsCles: [
      "Proposition subordonnée conjonctive (« que », « parce que », « bien que ») : complément de la principale.",
      "Proposition relative (« qui », « que », « dont ») : complète un nom — son pronom relatif peut être COD d'accord.",
      "« Bien que », « avant que », « pour que » exigent le SUBJONCTIF ; « parce que », « puisque » prennent l'indicatif.",
      "Nommer la valeur logique : cause (parce que), conséquence (si bien que), concession (bien que), but (pour que).",
    ],
    exemple: {
      enonce: "Analyser : « Bien qu'il fût fatigué, il termina son devoir. »",
      resolution: [
        "« Bien qu'il fût fatigué » : subordonnée de concession au subjonctif (imparfait du subjonctif).",
        "Valeur logique : concession — l'obstacle (la fatigue) n'a pas empêché l'action.",
        "« Il termina son devoir » : proposition principale, passé simple.",
      ],
    },
    piege: "Mettre l'indicatif après « bien que » et « pour que » : ces conjonctions exigent le subjonctif (bien qu'il SOIT, pour qu'il VIENNE).",
    testDisponible: true,
  },
  {
    id: "conditionnels",
    matiere: "Anglais",
    nom: "Conditionals & hypotheticals",
    pointsCles: [
      "Type 1 (probable) : If + present simple → will + base. « If it rains, I will stay. »",
      "Type 2 (irréel du présent) : If + past simple → would + base. « If I were rich, I would travel. »",
      "Type 3 (irréel du passé) : If + past perfect → would have + participe passé. « If she had studied, she would have passed. »",
      "« I wish + past simple » exprime un regret sur le présent : « I wish I knew » = je regrette de ne pas savoir.",
    ],
    exemple: {
      enonce: "Traduire : « Si j'avais révisé, j'aurais eu mon examen. »",
      resolution: [
        "Regret sur le passé → type 3 : if + past perfect → would have + participe passé.",
        "« If I had revised, I would have passed my exam. »",
        "Réalité sous-entendue : je n'ai pas révisé, je n'ai pas eu mon examen.",
      ],
    },
    piege: "Mettre un « will » ou un « would » dans la clause en IF : elle prend le présent (type 1), le past simple (type 2) ou le past perfect (type 3), jamais un futur.",
    testDisponible: true,
  },
  {
    id: "voix-passive",
    matiere: "Anglais",
    nom: "Passive voice & reporting",
    pointsCles: [
      "Voix passive : be (conjugué) + participe passé. L'accent porte sur l'action ou sa victime, pas l'agent.",
      "« They built the bridge » → « The bridge was built (by them) ». Le temps vit dans BE : is being built, was built, has been built.",
      "« by » introduit le complément d'agent, seulement s'il est important.",
      "Discours indirect : backshift — « I am tired » → He said he WAS tired.",
    ],
    exemple: {
      enonce: "Mettre au passif : « Someone is repairing the road. »",
      resolution: [
        "Le COD « the road » devient sujet ; le temps présent progressif reste dans BE : is being + participe passé.",
        "« The road is being repaired. »",
        "L'agent « someone » est flou : on l'omet, comme souvent au passif.",
      ],
    },
    piege: "Oublier d'accorder le temps de BE : « The bridge is built » (présent) ≠ « was built » (passé) ≠ « is being built » (en cours).",
    testDisponible: true,
  },
];

export const QUESTIONS_LANGUES: Question[] = [
  q("fs1", "figures-style", 1, "« Cette femme est un roc. » Quelle figure de style ?", "une métaphore", ["une comparaison", "une hyperbole", "une litote"], "Assimilation sans outil de comparaison : la femme EST le roc → métaphore."),
  q("fs2", "figures-style", 2, "« Je meurs de faim. » Quelle figure de style ?", "une hyperbole", ["une métaphore", "une antithèse", "un euphémisme"], "Exagération volontaire pour frapper l'esprit : hyperbole."),
  q("fs3", "figures-style", 3, "« Riche comme Crésus. » Quelle figure de style ?", "une comparaison", ["une métaphore", "une personnification", "un oxymore"], "L'outil « comme » rapproche deux termes : comparaison."),
  q("fs4", "figures-style", 4, "Dire « il nous a quittés » pour annoncer une mort relève de :", "l'euphémisme", ["l'hyperbole", "la litote", "l'ironie"], "Formule atténuée d'une réalité brutale : euphémisme. La litote, elle, suggère en disant moins (« ce n'est pas mauvais »)."),
  q("ar1", "argumentation", 1, "Dans une dissertation, l'introduction doit :", "amener le sujet, poser la problématique et annoncer le plan", ["donner tous les arguments", "présenter les exemples", "conclure"], "L'introduction contextualise, problématise et annonce : le développement viendra après."),
  q("ar2", "argumentation", 2, "« D'une part… d'autre part… » structure :", "une énumération d'arguments", ["une concession", "une conclusion", "une digression"], "Ces connecteurs organisent l'ajout successif d'arguments parallèles."),
  q("ar3", "argumentation", 3, "Admettre un point de la thèse adverse avant de le dépasser s'appelle :", "la concession-réfutation", ["l'ironie", "l'ellipse", "l'anaphore"], "Schéma « certes… mais » : on accorde un point pour mieux le réfuter, ce qui renforce la crédibilité."),
  q("ar4", "argumentation", 4, "Dans un paragraphe argumentatif, l'exemple sert à :", "illustrer et étayer l'argument", ["remplacer l'argument", "occuper l'espace", "introduire un nouveau sujet"], "Structure : argument → explication → exemple. L'exemple prouve, il ne raisonne pas à la place de l'argument."),
  q("gr1", "grammaire", 1, "« Qu'il vienne demain » est une proposition :", "subordonnée conjonctive (complétive)", ["principale", "relative", "coordonnée"], "Introduite par la conjonction « que », elle complète le verbe de la principale."),
  q("gr2", "grammaire", 2, "Dans « le livre que tu m'as prêté », « que » est :", "un pronom relatif", ["une conjonction de subordination", "un adverbe", "un déterminant"], "« que » relie la relative à son antécédent « le livre » et y fonctionne comme COD."),
  q("gr3", "grammaire", 3, "Après « bien que », on emploie :", "le subjonctif", ["l'indicatif", "le conditionnel", "l'impératif"], "« Bien que » exprime la concession et exige le subjonctif : bien qu'il SOIT fatigué."),
  q("gr4", "grammaire", 4, "« parce qu'il pleuvait » exprime :", "la cause", ["la conséquence", "le temps", "le but"], "« parce que » introduit la cause. La conséquence : « si bien que ». Le but : « pour que » (+ subjonctif)."),
  q("cd1", "conditionnels", 1, "« If I were rich, I would travel. » Ce conditionnel exprime :", "l'irréel du présent", ["le futur certain", "le passé", "une habitude"], "Type 2 : situation hypothétique du présent (je ne suis pas riche)."),
  q("cd2", "conditionnels", 2, "Type 1 (probable) : « If it rains, … » se poursuit par :", "« I will stay home » (will + base)", ["« I would stay home »", "« I stayed home »", "« I had stayed »"], "Type 1 : If + present simple → will + base verbale."),
  q("cd3", "conditionnels", 3, "« If she had studied, she would have passed. » Que peut-on déduire ?", "Elle n'a pas étudié et a échoué", ["Elle a étudié et a réussi", "Elle étudie toujours", "Elle réussira l'an prochain"], "Type 3 = irréel du passé : la condition et le résultat n'ont pas eu lieu."),
  q("cd4", "conditionnels", 4, "« I wish I knew the answer. » Cette phrase exprime :", "un regret sur le présent", ["une certitude future", "un ordre", "un souvenir d'enfance"], "wish + past simple = regret : je ne connais pas la réponse et je le déplore."),
  q("vp1", "voix-passive", 1, "La voix passive se forme avec :", "be (conjugué) + participe passé", ["have + participe passé", "do + base verbale", "will + base verbale"], "Le temps grammatical porte entièrement sur BE : is built, was built, has been built…"),
  q("vp2", "voix-passive", 2, "Passif de « They built the bridge » :", "The bridge was built", ["The bridge is built", "The bridge has built", "The bridge were built"], "Prétérit actif → was/were + participe passé : the bridge WAS built."),
  q("vp3", "voix-passive", 3, "« The letter is being written » signifie :", "on est en train d'écrire la lettre", ["la lettre est écrite chaque jour", "la lettre sera écrite", "la lettre a été écrite"], "is being + participe passé = passif du présent progressif : action en cours."),
  q("vp4", "voix-passive", 4, "Dans une phrase passive, la préposition « by » introduit :", "le complément d'agent", ["le lieu", "le temps", "le but"], "« The novel was written by Achebe » : by + agent. On l'omet si l'agent est sans importance."),
];
