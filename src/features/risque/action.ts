import type { AnalyseRisque, Appel, Bulletin, Eleve, Lacune, TestAdaptatif } from "@/types";
import { pctNote, joursDepuisDernierAppel, matierePrioritaire } from "./scores";

/**
 * La prochaine action recommandée, par règles de priorité :
 * 1. bulletin faible + pas de test      → faire passer le test (pas de renfort sans diagnostic)
 * 2. lacune critique/élevée non traitée → générer le renfort
 * 3. appel déjà planifié                → pipeline en route
 * 4. renfort en cours + silence > 14 j  → appel de suivi
 * 5. aucun appel                        → appel de cadrage
 */
export function prochaineAction(
  eleve: Eleve,
  lacunes: Lacune[],
  appels: Appel[],
  tests: TestAdaptatif[],
  bulletins: Record<string, Bulletin[]>
): AnalyseRisque["action"] {
  const prio = matierePrioritaire(eleve, bulletins);

  if (prio && pctNote(prio) < 55) {
    const teste = tests.some((t) => t.matiere === prio.matiere);
    if (!teste)
      return { type: "test", libelle: `Faire passer le test ${prio.matiere}`, cible: prio.matiere };
  }

  const aRenerfort = lacunes.find(
    (l) =>
      (l.severite === "critique" || l.severite === "elevee") &&
      l.statut === "detectee"
  );
  if (aRenerfort)
    return { type: "contenu", libelle: "Générer le renfort", cible: aRenerfort.notionId };

  if (appels.some((a) => a.statut === "planifie"))
    return { type: "ok", libelle: "Appel planifié ✓" };

  const enRenfort = lacunes.some((l) => l.statut === "renfort");
  if (enRenfort && joursDepuisDernierAppel(appels) > 14)
    return { type: "appel", libelle: "Appel de suivi" };

  if (appels.length === 0) return { type: "appel", libelle: "Appel de cadrage" };

  return { type: "ok", libelle: "À jour" };
}
