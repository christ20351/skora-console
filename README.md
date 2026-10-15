# Skora — Console d'accompagnement pédagogique

Frontend 100 % (Next.js 16 App Router + Tailwind v4 + TypeScript + framer-motion).
Design glassmorphism (palette Skora `#dc3545`, violet d'accent, Instrument Sans).

La boucle complète d'accompagnement, démontrée à l'école :

```
Bulletin (saisi à la main) → matière la plus basse = PRIORITÉ
   → Test adaptatif niveau lycée (réussi → difficulté +1, raté → −1, chaque question taguée par notion)
      → Lacunes diagnostiquées (sévérité = niveau le plus bas auquel la notion a cédé)
         → Appels (contexte humain + auto-déclarations « ce que je ne comprends pas »)
            → Fiches de renfort générées, calibrées sur le niveau d'échec
               → Cahier de renfort imprimable (PDF) remis à l'apprenant
                  → Re-test → la maîtrise remonte → lacunes « en amélioration » → « résolues »
```

## Démarrage

```bash
pnpm install
pnpm dev        # → http://localhost:3000
pnpm build      # vérification production
```

## Les 9 écrans

| Écran | Rôle |
|---|---|
| Vue d'ensemble | KPIs, priorités par score de risque, spotlight, lacunes par matière |
| Élèves | Liste filtrable par risque, recherche, fiche complète en 5 onglets animés |
| Diagnostics | Test adaptatif jouable en live (7 matières lycée, banque de ~80 questions) |
| Appels | Historique structuré + planification, croisement déclarations ↔ lacunes |
| Agenda | Meets liés à Google Calendar : vues mois / semaine (glisser-déposer pour replanifier) et tableau (date-heure éditables en ligne) ; clic sur un appel passé → notes Google Meet ; rôles : l'admin voit tout et assigne, un animateur ne voit que ses visios |
| Contenus | Fiches de renfort générées, consultation |
| Bulletins | Saisie manuelle + inscription d'un nouvel élève (bulletin d'entrée) |
| Impact école | La preuve chiffrée à présenter à l'établissement |
| Paramètres | Console, équipe, identité visuelle |

## Architecture

```
src/
  app/(console)/        # les 9 écrans (AppRouter)
  app/impression/       # cahier de renfort A4 (hors console, @media print)
  components/           # ui · charts · generation · eleve · dashboard · test · appels · bulletins · impression · layout
  features/             # risque (score 40/40/20) · test-adaptatif (moteur) · contenu (génération) · suivi
  data/notions/         # banque lycée : maths, PC/SVT, FR/EN, HG/ECM (21 notions, ~84 questions)
  data/mock.ts          # 8 élèves (faiblesses variées : maths, fr, SVT, ECM, anglais, PC, HG)
  store.tsx             # état global + actions (enregistrerTest, ajouterEleve, …)
  types/  lib/          # contrat de données · utils
```

Convention : aucun fichier métier ne dépasse ~200 lignes (seules les données mock sont plus longues).

## Rampe de mise en prod

Les données sont mockées et l'état vit dans `store.tsx` : brancher les actions
(`enregistrerTest`, `ajouterEleve`, `enregistrerAppel`, `planifierAppel`, `ajouterContenu`,
`deplacerMeet`, `assignerMeet`) sur l'API Skora suffit à passer en réel.

## Agenda & Google Calendar

L'agenda est synchronisé avec Google Calendar :

- **Replanification** — glisser-déposer d'une visio (vues mois/semaine) ou édition
  de la date et de l'heure dans le tableau : la modification est appliquée
  localement puis poussée vers l'événement via `PATCH /api/agenda/events/[id]`.
- **Assignation** — réservée au rôle admin : l'animateur assigné est stocké dans
  les propriétés privées de l'événement (`extendedProperties.skoraAssignee`) et
  chaque animateur ne voit que les visios qui lui sont assignées.
- **Notes Meet** — les visios passées exposent leurs notes (« Prendre des notes
  pour moi ») dans la fenêtre de détail, avec points clés, déclarations de
  l'apprenant et prochaine étape.

Sans configuration, la console tourne en **mode démo** (badge ambre dans
l'agenda : les changements restent locaux). Pour la synchronisation réelle :

1. Créer un compte de service Google avec le scope `…/auth/calendar`
   (`src/lib/google-calendar.ts` signe un JWT RS256, aucune dépendance requise).
2. Partager l'agenda cible avec ce compte de service (droit « apporter des
   modifications aux événements »).
3. Renseigner `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`,
   `GOOGLE_CALENDAR_ID` (voir `.env.example`), redémarrer : le badge devient
   « Google Calendar connecté » et chaque déplacement/assignation est propagé.
