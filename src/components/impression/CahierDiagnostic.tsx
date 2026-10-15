"use client";

import { notionParId, questionParId } from "@/data/notions";
import { matierePrioritaire, pctNote } from "@/features/risque";
import { SEVERITE_LABEL, NIVEAUX, STATUT_LACUNE_LABEL } from "@/types";
import type { AnalyseRisque, Bulletin, Eleve, Lacune, TestAdaptatif } from "@/types";

/** Sections 1 à 4 du cahier : diagnostic, bulletin, lacunes précises, notions à apprendre */
export function CahierDiagnostic({
  eleve,
  risque,
  bulletin,
  lacunes,
  tests,
}: {
  eleve: Eleve;
  risque: AnalyseRisque;
  bulletin?: Bulletin;
  lacunes: Lacune[];
  tests: TestAdaptatif[];
}) {
  const prio = matierePrioritaire(eleve);
  const dernier = bulletin?.lignes ? [...bulletin.lignes].sort((a, b) => pctNote(a) - pctNote(b)) : [];

  return (
    <>
      {/* 1. Diagnostic en bref */}
      <section className="break-inside-avoid">
        <Titre>1 · Le diagnostic en bref</Titre>
        <div className="grid grid-cols-4 gap-3">
          <Bloc label="Matière prioritaire">
            {prio ? (
              <><strong>{prio.matiere}</strong><br />{prio.note}/{prio.sur} — {prio.trimestre}</>
            ) : ("—")}
          </Bloc>
          <Bloc label="Score de risque">
            <strong>{risque.score}/100</strong><br />{risque.label}
          </Bloc>
          <Bloc label="Lacunes à retravailler">
            <strong>{lacunes.length}</strong><br />
            dont {lacunes.filter((l) => l.severite === "critique").length} critique(s)
          </Bloc>
          <Bloc label="Tests adaptatifs passés">
            <strong>{tests.length}</strong><br />toutes matières
          </Bloc>
        </div>
      </section>

      {/* 2. Bulletin */}
      {dernier.length > 0 ? (
        <section className="break-inside-avoid">
          <Titre>2 · Le bulletin ({bulletin?.trimestre}) — recopié à la main</Titre>
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-300 text-slate-500">
                <th className="py-1.5 pr-2">Matière</th>
                <th className="py-1.5 pr-2">Note</th>
                <th className="py-1.5 pr-2">Sur</th>
                <th className="py-1.5">Lecture Skora</th>
              </tr>
            </thead>
            <tbody>
              {dernier.map((l) => {
                const pct = pctNote(l);
                return (
                  <tr key={l.matiere} className="border-b border-slate-100">
                    <td className="py-1.5 pr-2 font-semibold">{l.matiere}</td>
                    <td className="py-1.5 pr-2">{l.note}</td>
                    <td className="py-1.5 pr-2">{l.sur}</td>
                    <td className="py-1.5">
                      {pct < 40 ? (
                        <span className="font-semibold text-brand-600">Priorité d'accompagnement</span>
                      ) : pct < 55 ? (
                        <span className="text-orange-600">À surveiller</span>
                      ) : (
                        <span className="text-emerald-600">Acquis correct</span>
                      )}
                      {l.moyenneClasse !== undefined ? (
                        <span className="ml-2 text-slate-400">(classe : {l.moyenneClasse}/20)</span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ) : null}

      {/* 3. Lacunes précises, avec preuves */}
      <section className="break-inside-avoid">
        <Titre>3 · Les lacunes précises — ce qui a été raté, et où</Titre>
        <div className="space-y-2.5">
          {lacunes.map((l) => {
            const notion = notionParId(l.notionId);
            // preuves : jusqu'à 2 questions ratées dans les tests d'origine
            const preuves = tests
              .filter((t) => l.origineTestIds.includes(t.id))
              .flatMap((t) => t.etapes.filter((e) => e.notionId === l.notionId && !e.correct))
              .slice(0, 2);
            return (
              <div key={l.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm">
                  <strong>{notion.nom}</strong>
                  <span className="ml-2 text-slate-500">({notion.matiere})</span>
                  <span className="ml-2 rounded bg-brand-50 px-1.5 py-0.5 text-xs font-bold text-brand-600">
                    {SEVERITE_LABEL[l.severite]}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">
                    maîtrise {l.maitrisePct} % · suivi : {STATUT_LACUNE_LABEL[l.statut]}
                  </span>
                </p>
                {preuves.length > 0 ? (
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-600">
                    {preuves.map((e, i) => (
                      <li key={i}>
                        ✗ Échec au niveau {NIVEAUX[e.niveauAvant].nom} — «{" "}
                        {questionParId(e.questionId)?.enonce ?? "question " + e.questionId} »
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Notions à apprendre */}
      <section className="break-inside-avoid">
        <Titre>4 · Les notions à apprendre — le programme de {eleve.prenom}</Titre>
        <div className="space-y-2.5">
          {lacunes.map((l) => {
            const notion = notionParId(l.notionId);
            return (
              <div key={l.id} className="rounded-lg bg-slate-50 p-3">
                <p className="text-sm font-bold">{notion.nom}</p>
                <ul className="mt-1 ml-4 list-disc space-y-0.5 text-xs text-slate-700">
                  {notion.pointsCles.slice(0, 3).map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function Titre({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-sm font-bold tracking-wide text-brand-600 uppercase">{children}</h2>;
}

function Bloc({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="mb-1 text-xs font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="text-xs">{children}</p>
    </div>
  );
}
