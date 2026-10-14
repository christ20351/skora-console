"use client";

import { formatDate } from "@/lib/utils";
import type { ContenuGenere } from "@/types";

/** Une fiche de renfort prête à imprimer (sans corrigés) */
export function CahierFiche({
  contenu,
  numero,
}: {
  contenu: ContenuGenere;
  numero: number;
}) {
  const c = contenu;
  return (
    <article className="mb-5 break-inside-avoid">
      <h3 className="mb-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-bold text-white">
        Fiche {numero} — {c.titre.replace("Renfort — ", "")}{" "}
        <span className="font-normal opacity-80">· {formatDate(c.date)}</span>
      </h3>
      <div className="space-y-3 px-1">
        <div>
          <p className="font-bold">📌 L'essentiel</p>
          <ul className="ml-4 list-disc space-y-1">
            {c.essentiel.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold">💡 Exemple guidé</p>
          <p className="ml-4 font-medium">{c.exemple.enonce}</p>
          <ol className="ml-8 list-decimal space-y-0.5">
            {c.exemple.resolution.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
        </div>
        <div>
          <p className="font-bold">✏️ À toi de jouer</p>
          <ol className="ml-4 list-decimal space-y-1">
            {c.exercices.map((ex, i) => (
              <li key={i}>{ex.enonce}</li>
            ))}
          </ol>
        </div>
        <div>
          <p className="font-bold">✅ Auto-check : as-tu compris ?</p>
          <ol className="ml-4 list-decimal space-y-1">
            {c.autoCheck.map((qa, i) => (
              <li key={i}>{qa.question}</li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}

/** Corrigés d'une fiche (page séparée, espace parents) */
export function CahierCorriges({ contenu }: { contenu: ContenuGenere }) {
  const c = contenu;
  return (
    <div className="mb-4 break-inside-avoid">
      <p className="font-bold">{c.titre}</p>
      <ol className="ml-4 list-decimal space-y-1">
        {c.exercices.map((ex, i) => (
          <li key={i}>
            {ex.enonce}
            <br />
            <span className="text-emerald-700">
              <strong>Corrigé :</strong> {ex.correction}
            </span>
          </li>
        ))}
        {c.autoCheck.map((qa, i) => (
          <li key={`ac-${i}`}>
            {qa.question}
            <br />
            <span className="text-emerald-700">
              <strong>Réponse :</strong> {qa.reponse}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
