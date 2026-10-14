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
| Agenda | Appels planifiés, recommandations d'action, cadence |
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
(`enregistrerTest`, `ajouterEleve`, `enregistrerAppel`, `planifierAppel`, `ajouterContenu`)
sur l'API Skora suffit à passer en réel.
