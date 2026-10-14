import type { Notion, Question } from "@/types";
import { q } from "./question";

/** Histoire-Géo + ECM — niveau lycée */
export const NOTIONS_SOCIETES: Notion[] = [
  {
    id: "guerre-froide",
    matiere: "Histoire-Géo",
    nom: "La Guerre froide",
    pointsCles: [
      "1947-1991 : affrontement indirect entre le bloc américain (capitalisme, OTAN) et le bloc soviétique (communisme, pacte de Varsovie).",
      "Deux principes : l'affrontement se fait PAR procuration (guerres de Corée, du Vietnam, crise de Cuba) et l'équilibre de la terreur (nucléaire) empêche l'affrontement direct.",
      "Dates repères : doctrine Truman 1947, blocus de Berlin 1948-49, mur de Berlin 1961, crise de Cuba 1962, détente années 1970, chute du mur 1989, fin de l'URSS 1991.",
      "L'Afrique devient un enjeu : soutenance de régimes, crises (Congo 1960-65, Angola 1975).",
    ],
    exemple: {
      enonce: "Pourquoi la crise de Cuba (1962) illustre-t-elle l'équilibre de la terreur ?",
      resolution: [
        "L'URSS installe des missiles nucléaires à Cuba, à quelques minutes des États-Unis.",
        "Le blocus américain met les deux puissances au bord de la guerre nucléaire.",
        "La négociation (retrait des missiles de Cuba contre celui des missiles de Turquie) montre que la peur du nucléaire impose le dialogue : personne ne peut gagner.",
      ],
    },
    piege: "Croire que la Guerre froide est une guerre « froide » sans combats : des dizaines de milliers de morts dans les guerres périphériques — ce qui est froid, c'est l'absence d'affrontement direct USA-URSS.",
    testDisponible: true,
  },
  {
    id: "decolonisation",
    matiere: "Histoire-Géo",
    nom: "Décolonisations & indépendances",
    pointsCles: [
      "Trois voies : négociation (Ghana 1957, majorité de l'Afrique francophone 1960), guerre (Algérie 1954-62, Vietnam), ou combination des deux.",
      "La conférence de Bandung (1955) affirme le non-alignement et le droit des peuples d'Asie et d'Afrique à disposer d'eux-mêmes.",
      "1960 : « année de l'Afrique » — 17 États accèdent à l'indépendance, dont la plupart des colonies françaises.",
      "Les indépendances n'effacent pas tout : néocolonialisme économique, fronts de libération, organisations panafricaines (OUA 1963 → UA).",
    ],
    exemple: {
      enonce: "Comparer la voie d'accession à l'indépendance du Ghana (1957) et de l'Algérie (1962).",
      resolution: [
        "Ghana : pression politique non armée de Nkrumah et du CPP, élections, indépendance négociée avec la Grande-Bretagne en 1957.",
        "Algérie : Front de libération nationale, guerre de 8 ans (1954-1962), accords d'Évian.",
        "Constat : les deux aboutissent à la souveraineté, mais le coût humain et politique diffère radicalement.",
      ],
    },
    piege: "Dater la décolonisation uniquement des années 1960 : elle commence en Asie dès 1947 (Inde) et se poursuit jusqu'aux années 1975-1990 (Angola, Namibie).",
    testDisponible: true,
  },
  {
    id: "mondialisation",
    matiere: "Histoire-Géo",
    nom: "Mondialisation & développement durable",
    pointsCles: [
      "La mondialisation = mise en relation des économies et des sociétés : flux de marchandises, de capitaux (FDI), d'informations et d'humains.",
      "Acteurs multiples : États, FMN (firmes multinationales), organisations internationales (OMC, FMI), économies émergentes (BRICS).",
      "L'espace mondial est inégalement intégré : métropoles et axes majeurs concentrent, les marges restent à l'écart.",
      "Développement durable : concilier les trois piliers — économique, social, environnemental — sans sacrifier les générations futures.",
    ],
    exemple: {
      enonce: "Le téléphone « made in China » vendu à Dakar illustre quoi, concrètement ?",
      resolution: [
        "Production éclatée : minerais (Afrique), composants (Corée, Taïwan), assemblage (Chine).",
        "Flux financiers et logistiques : FMN, ports, conteneurs, câbles sous-marins.",
        "L'objet condense la mondialisation des flux — et pose la question du recyclage (déchets électroniques).",
      ],
    },
    piege: "Réduire la mondialisation aux échanges de marchandises : les flux financiers, migratoires et numériques sont au moins aussi structurants.",
    testDisponible: true,
  },
  {
    id: "droits-humains",
    matiere: "ECM",
    nom: "Droits de l'Homme & citoyenneté",
    pointsCles: [
      "DUDH (1948) : tous les êtres humains naissent libres et égaux en dignité et en droits — texte fondateur, non contraignant juridiquement.",
      "Générations de droits : civils et politiques (exprimer, voter) ; économiques et sociaux (santé, éducation) ; solidarité (développement, environnement).",
      "Un État de droit suppose la séparation des pouvoirs, l'égalité devant la loi et des juges indépendants.",
      "Les droits s'accompagnent de devoirs : respecter les droits d'autrui, payer ses impôts, défendre le patrimoine public.",
    ],
    exemple: {
      enonce: "Un élève est exclu d'une école publique parce que sa famille ne peut pas payer des « frais interdits ». Quels principes sont violés ?",
      resolution: [
        "Droit à l'éducation (droit économique et social, DUDH art. 26, constitutions nationales).",
        "Principe d'égalité devant le service public : les frais illégaux créent une discrimination financière.",
        "Recours : saisir le chef d'établissement, l'inspection académique, les associations de droits humains.",
      ],
    },
    piege: "Penser que les droits de l'Homme se limitent à la liberté d'expression : ils couvrent aussi la santé, l'éducation, le travail et un environnement sain.",
    testDisponible: true,
  },
  {
    id: "democratie",
    matiere: "ECM",
    nom: "Démocratie & institutions",
    pointsCles: [
      "Démocratie = pouvoir du peuple : suffrage universel libre, pluralisme politique, élections régulières et transparentes.",
      "Séparation des pouvoirs (Montesquieu) : exécutif fait appliquer, législatif vote la loi, judiciaire juge — chacun limite les autres.",
      "Les contre-pouvoirs (presse libre, société civile, Cour constitutionnelle) protègent la démocratie entre les élections.",
      "Participation citoyenne : voter, mais aussi contrôler, pétitionner, siéger dans les instances locales.",
    ],
    exemple: {
      enonce: "Pourquoi la séparation des pouvoirs protège-t-elle la liberté des citoyens ?",
      resolution: [
        "Si un seul organe fait les lois, les exécute et juge, il peut abuser sans limite.",
        "Le législatif contrôle l'exécutif ; le judiciaire sanctionne les excès de l'un et de l'autre.",
        "Chaque pouvoir bloque les dérives des autres : c'est un système de garanties réciproques.",
      ],
    },
    piege: "Confondre élections et démocratie : sans presse libre, justice indépendante et pluralisme, des élections peuvent être tenues sans démocratie réelle.",
    testDisponible: true,
  },
  {
    id: "civisme",
    matiere: "ECM",
    nom: "Intégrité & lutte contre la corruption",
    pointsCles: [
      "La corruption = abus d'un pouvoir confié à des fins privées (pot-de-vin, détournement, favoritisme, népotisme).",
      "Elle détourne les ressources publiques : écoles, hôpitaux et routes non financés, inégalités renforcées.",
      "L'intégrité publique : refuser et signaler, rendre compte de la gestion, traiter à égalité les usagers.",
      "Les recours du citoyen : refuser de payer, exiger un reçu, saisir les organes anti-corruption et la société civile.",
    ],
    exemple: {
      enonce: "Un agent exige 10 000 F pour délivrer un document gratuit par la loi. Que faire, concrètement ?",
      resolution: [
        "Le service est dû sans contrepartie : exiger le document et un reçu officiel.",
        "En cas de refus : noter le nom/l'horodatage et saisir l'inspection hiérarchique ou l'organe anti-corruption.",
        "Payer entretient le système ; signaler (même anonymement) le fragilise.",
      ],
    },
    piege: "Croire qu'un « geste de remerciement » pour un service dû est anodin : c'est déjà la corruption, et elle institutionnalise l'inégalité d'accès aux services publics.",
    testDisponible: true,
  },
];

export const QUESTIONS_SOCIETES: Question[] = [
  q("gf1", "guerre-froide", 1, "La Guerre froide oppose principalement :", "les États-Unis et l'URSS", ["la France et l'Allemagne", "la Chine et le Japon", "le Royaume-Uni et l'URSS"], "1947-1991 : deux superpuissances aux idéologies opposées, capitalisme contre communisme."),
  q("gf2", "guerre-froide", 2, "Le mur de Berlin tombe en :", "1989", ["1961", "1945", "1991"], "Le 9 novembre 1989 ; l'URSS se dissout en 1991."),
  q("gf3", "guerre-froide", 3, "La doctrine Truman (1947) vise à :", "endiguer l'expansion du communisme", ["soutenir militairement l'URSS", "désarmer l'Europe", "coloniser l'Asie"], "C'est le containment : soutenir les peuples « libres » menacés par le communisme."),
  q("gf4", "guerre-froide", 4, "La crise de Cuba (1962) se termine par :", "une négociation et le retrait des missiles soviétiques", ["une invasion américaine de Cuba", "un bombardement de Moscou", "l'usage de l'arme nucléaire"], "L'équilibre de la terreur impose la négociation : l'URSS retire ses missiles, les USA s'engagent à ne pas envahir Cuba."),
  q("dc1", "decolonisation", 1, "Pourquoi parle-t-on de « 1960, année de l'Afrique » ?", "17 États africains accèdent à l'indépendance", ["l'OUA est créée", "le Ghana devient indépendant", "l'Afrique du Sud s'apartheid"], "En 1960, la quasi-totalité de l'Afrique française (et le Congo belge) devient souveraine."),
  q("dc2", "decolonisation", 2, "La conférence de Bandung (1955) :", "affirme le non-alignement des pays d'Asie et d'Afrique", ["crée l'OTAN", "divise l'Allemagne", "crée l'Union africaine"], "29 pays d'Asie et d'Afrique y revendiquent l'indépendance et refusent l'alignement sur les deux blocs."),
  q("dc3", "decolonisation", 3, "La guerre d'Algérie se conclut en 1962 par :", "les accords d'Évian", ["la conférence de Berlin", "le discours de Brazzaville", "le pacte de Varsovie"], "Après 8 ans de guerre, la France et le FLN signent les accords d'Évian (mars 1962)."),
  q("dc4", "decolonisation", 4, "Le Ghana (1957) accède à l'indépendance par :", "la voie politique négociée portée par Nkrumah", ["une guerre de trente ans", "un plébiscite sous supervision soviétique", "la conférence de Yalta"], "Nkrumah et le CPP obtiennent par élections et pression politique l'indépendance pacifique de la Gold Coast."),
  q("mg1", "mondialisation", 1, "La mondialisation désigne :", "la mise en relation croissante des économies et des sociétés", ["la colonisation du XXᵉ siècle", "une guerre commerciale permanente", "le retour au protectionnisme"], "C'est l'intégration du monde par les flux : marchandises, capitaux, informations, humains."),
  q("mg2", "mondialisation", 2, "Un IDE (investissement direct à l'étranger) est :", "une entreprise qui installe ou rachète une activité dans un autre pays", ["un accord militaire", "une taxe douanière", "une devise forte"], "Les FMN investissent à l'étranger : usines, filiales, rachats — moteur de la mondialisation productive."),
  q("mg3", "mondialisation", 3, "Les BRICS regroupent :", "Brésil, Russie, Inde, Chine, Afrique du Sud", ["des pays exclus du commerce mondial", "uniquement des pays d'Europe", "des membres de l'OTAN"], "Économies émergentes majeures pesant de plus en plus dans la production et le commerce mondiaux."),
  q("mg4", "mondialisation", 4, "Le développement durable articule trois piliers :", "économique, social, environnemental", ["industriel, commercial, bancaire", "local, national, international", "militaire, politique, culturel"], "Concilier croissance, équité sociale et préservation de l'environnement pour les générations futures."),
  q("dh1", "droits-humains", 1, "La Déclaration universelle des droits de l'Homme a été adoptée en :", "1948", ["1919", "1945", "1989"], "Adoptée par l'ONU le 10 décembre 1948, après la Seconde Guerre mondiale."),
  q("dh2", "droits-humains", 2, "Le droit à l'éducation et le droit à la santé appartiennent aux droits :", "économiques et sociaux", ["civils et politiques", "de solidarité exclusivement", "de première génération uniquement"], "Ce sont les droits de « deuxième génération » : ils exigent des moyens, pas seulement une abstention de l'État."),
  q("dh3", "droits-humains", 3, "Un État de droit implique :", "la séparation des pouvoirs et l'égalité devant la loi", ["un parti unique éclairé", "des tribunaux d'exception", "l'immunité totale des dirigeants"], "Loi suprême appliquée à tous, juges indépendants, pouvoirs qui se limitent mutuellement."),
  q("dh4", "droits-humains", 4, "Ratifier une convention de droits humains engage l'État à :", "respecter et faire respecter ces droits", ["les ignorer en cas de crise", "les réserver à ses nationaux", "les appliquer seulement aux élites"], "La ratification crée des obligations juridiques : respect, protection, mise en œuvre."),
  q("dm1", "democratie", 1, "Dans une démocratie, la souveraineté appartient :", "au peuple", ["au chef de l'État", "à l'armée", "aux juges"], "« Gouvernement du peuple, par le peuple, pour le peuple » : la source du pouvoir est le corps électoral."),
  q("dm2", "democratie", 2, "Le suffrage universel signifie :", "tous les citoyens majeurs votent sans condition de fortune ni de statut", ["seuls les lettrés votent", "le vote des femmes est différé", "le vote est payant"], "Universel = égalité de participation, conquise historiquement contre le suffrage censitaire."),
  q("dm3", "democratie", 3, "La séparation des pouvoirs distingue :", "exécutif, législatif, judiciaire", ["armée, police, douane", "mairie, préfecture, école", "centre, région, commune"], "Montesquieu : celui qui fait les lois ne doit ni les exécuter ni juger."),
  q("dm4", "democratie", 4, "La motion de censure permet :", "au parlement de renverser le gouvernement", ["au président de dissoudre le peuple", "aux juges de légiférer", "au roi de nommer les ministres"], "Contre-pouvoir législatif : le gouvernement doit avoir la confiance de l'assemblée."),
  q("cv1", "civisme", 1, "La corruption se définit comme :", "l'abus d'un pouvoir confié à des fins privées", ["un cadeau d'affaires déclaré", "un impôt local légal", "une erreur comptable"], "Pot-de-vin, détournement, favoritisme, népotisme : détourner une fonction publique de sa finalité."),
  q("cv2", "civisme", 2, "Attribuer un marché public à son cousin sans concours est :", "du favoritisme, une forme de corruption", ["une pratique normale", "une prime de parenté", "une négociation privée légitime"], "Le népotisme viole l'égalité d'accès à la commande publique et gaspille l'argent collectif."),
  q("cv3", "civisme", 3, "Face à une demande de pot-de-vin pour un service gratuit, le citoyen doit :", "refuser et signaler aux organes compétents", ["payer pour aller vite", "négocier un rabais", "exiger un service en retour"], "Payer entretient le système. Refuser, exiger le service légal et signaler le fragilise."),
  q("cv4", "civisme", 4, "La Déclaration des droits de l'Homme et du citoyen (1789) affirme que :", "les hommes naissent et demeurent libres et égaux en droits", ["seuls les propriétaires sont citoyens", "le roi est infaillible", "le vote est réservé aux nobles"], "Texte fondateur : liberté, propriété, sûreté, résistance à l'oppression comme droits naturels."),
];
