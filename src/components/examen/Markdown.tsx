import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ── Formattage en ligne : `code`, **gras**, *italique*, [texte](lien) ── */

const INLINE =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\n]+\*)|(\[[^\]]+\]\([^)\s]+\))/g;

function inline(texte: string, base: string): ReactNode[] {
  const out: ReactNode[] = [];
  const fin = texte.length;
  let dernier = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(texte)) !== null) {
    if (m.index > dernier) out.push(texte.slice(dernier, m.index));
    const t = m[0];
    const key = `${base}-${k++}`;
    if (t.startsWith("`")) {
      out.push(
        <code
          key={key}
          className="rounded-md bg-slate-100/90 px-1.5 py-0.5 font-mono text-[0.82em] text-brand-700"
        >
          {t.slice(1, -1)}
        </code>
      );
    } else if (t.startsWith("**")) {
      out.push(
        <strong key={key} className="font-bold text-ink">
          {t.slice(2, -2)}
        </strong>
      );
    } else if (t.startsWith("[")) {
      const lien = /\[([^\]]+)\]\(([^)]+)\)/.exec(t)!;
      out.push(
        <a
          key={key}
          href={lien[2]}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700"
        >
          {lien[1]}
        </a>
      );
    } else {
      out.push(
        <em key={key} className="italic">
          {t.slice(1, -1)}
        </em>
      );
    }
    dernier = m.index + t.length;
  }
  if (dernier < fin) out.push(texte.slice(dernier));
  return out;
}

/* ── Blocs ───────────────────────────────────────────────────────────── */

const RX_VIDE = /^\s*$/;
const RX_FENCE = /^\s*```/;
const RX_TITRE = /^(#{1,4})\s+(.*)$/;
const RX_CITATION = /^\s*>\s?(.*)$/;
const RX_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const RX_CASE = /^\[( |x|X)\]\s+(.*)$/;
const RX_HR = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/;
const RX_TABLEAU_DEBUT = /^\s*\|.*\|\s*$/;
const RX_TABLEAU_SEP = /^\s*\|?[\s:|-]+\|\s*$/;

const cellules = (ligne: string) =>
  ligne.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

interface ItemListe {
  texte: string;
  ordonnee: boolean;
  enfants: ItemListe[];
}

/** Regroupe un fragment en blocs React (titres, paragraphes, listes, tableaux…) */
function blocs(fragment: string, base: string): ReactNode[] {
  const lignes = fragment.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;
  const key = () => `${base}-b${k++}`;

  const estSpeciale = (l: string) =>
    RX_FENCE.test(l) ||
    RX_TITRE.test(l) ||
    RX_CITATION.test(l) ||
    RX_ITEM.test(l) ||
    RX_HR.test(l) ||
    RX_TABLEAU_DEBUT.test(l);

  while (i < lignes.length) {
    const ligne = lignes[i];

    if (RX_VIDE.test(ligne)) {
      i++;
      continue;
    }

    /* Bloc de code clôturé */
    if (RX_FENCE.test(ligne)) {
      const lang = ligne.trim().slice(3).trim();
      i++;
      const code: string[] = [];
      while (i < lignes.length && !RX_FENCE.test(lignes[i])) code.push(lignes[i++]);
      i++; // fermeture
      out.push(
        <pre
          key={key()}
          className="relative my-3 overflow-x-auto rounded-xl bg-[#241f26] p-4 pt-5 font-mono text-xs leading-relaxed text-slate-100"
        >
          {lang ? (
            <span className="absolute top-2.5 right-3 text-[9px] font-bold tracking-[0.18em] text-slate-500 uppercase">
              {lang}
            </span>
          ) : null}
          <code>{code.join("\n")}</code>
        </pre>
      );
      continue;
    }

    /* Tableau (séparateur `| --- |` sur la ligne suivante) */
    if (
      RX_TABLEAU_DEBUT.test(ligne) &&
      i + 1 < lignes.length &&
      RX_TABLEAU_SEP.test(lignes[i + 1])
    ) {
      const entete = cellules(ligne);
      i += 2;
      const corps: string[][] = [];
      while (i < lignes.length && RX_TABLEAU_DEBUT.test(lignes[i])) {
        corps.push(cellules(lignes[i++]));
      }
      out.push(
        <div key={key()} className="glass-soft my-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70 bg-white/60 text-left">
                {entete.map((c, j) => (
                  <th key={j} className="px-3 py-2 text-xs font-bold text-slate-600">
                    {inline(c, `${key}-h${j}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {corps.map((r, j) => (
                <tr key={j}>
                  {r.map((c, l) => (
                    <td key={l} className="px-3 py-1.5 text-slate-600">
                      {inline(c, `${key}-c${j}-${l}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    /* Titre */
    const titre = RX_TITRE.exec(ligne);
    if (titre) {
      const niveau = titre[1].length;
      const contenu = inline(titre[2], `${key}-t`);
      const cls =
        niveau === 1
          ? "text-xl font-bold tracking-tight text-ink"
          : niveau === 2
            ? "mt-6 mb-2 border-b border-slate-100 pb-1.5 text-base font-bold text-ink"
            : niveau === 3
              ? "mt-4 mb-1.5 text-sm font-bold text-ink"
              : "mt-3 mb-1 text-xs font-bold text-slate-700";
      const Tag = `h${niveau}` as "h1" | "h2" | "h3" | "h4";
      out.push(
        <Tag key={key()} className={cls}>
          {contenu}
        </Tag>
      );
      i++;
      continue;
    }

    /* Filet horizontal */
    if (RX_HR.test(ligne)) {
      out.push(<hr key={key()} className="my-4 border-0 border-t border-slate-200/80" />);
      i++;
      continue;
    }

    /* Citation (contenu re-parse : titres, listes… autorisés dedans) */
    const citation = RX_CITATION.exec(ligne);
    if (citation) {
      const citee: string[] = [];
      while (i < lignes.length && RX_CITATION.test(lignes[i])) {
        citee.push(RX_CITATION.exec(lignes[i++])![1]);
      }
      out.push(
        <blockquote
          key={key()}
          className="my-3 rounded-r-xl border-l-[3px] border-brand-400 bg-brand-50/60 py-2.5 pr-4 pl-4 text-sm text-slate-600"
        >
          {blocs(citee.join("\n"), `${key}-q`)}
        </blockquote>
      );
      continue;
    }

    /* Liste (imbrication par indentation, cases à cocher supportées) */
    if (RX_ITEM.test(ligne)) {
      const items: ItemListe[] = [];
      const pile: { indent: number; item: ItemListe }[] = [];
      while (i < lignes.length && !RX_VIDE.test(lignes[i]) && RX_ITEM.test(lignes[i])) {
        const m = RX_ITEM.exec(lignes[i++])!;
        const indent = m[1].length;
        const item: ItemListe = {
          texte: m[3],
          ordonnee: /\d/.test(m[2]),
          enfants: [],
        };
        while (pile.length && pile[pile.length - 1].indent >= indent) pile.pop();
        if (pile.length) pile[pile.length - 1].item.enfants.push(item);
        else items.push(item);
        pile.push({ indent, item });
      }
      out.push(liste(items, `${key}-l`));
      continue;
    }

    /* Paragraphe : lignes consécutives réunies (comportement Markdown standard) */
    const paragraphe: string[] = [];
    while (i < lignes.length && !RX_VIDE.test(lignes[i]) && !estSpeciale(lignes[i])) {
      paragraphe.push(lignes[i++].trim());
    }
    if (paragraphe.length) {
      out.push(
        <p key={key()} className="my-2 text-sm leading-relaxed text-slate-600">
          {inline(paragraphe.join(" "), key())}
        </p>
      );
    }
  }
  return out;
}

function liste(items: ItemListe[], base: string): ReactNode {
  const ordonnee = items[0]?.ordonnee ?? false;
  const Tag = ordonnee ? "ol" : "ul";
  return (
    <Tag
      className={cn(
        "my-2 space-y-1 pl-5 text-sm text-slate-600",
        ordonnee ? "list-decimal" : "list-disc"
      )}
    >
      {items.map((it, idx) => {
        const cased = RX_CASE.exec(it.texte);
        return (
          <li key={`${base}-${idx}`} className="leading-relaxed marker:text-brand-400/70">
            {cased ? (
              <span className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] text-xs font-bold ring-1",
                    cased[1].toLowerCase() === "x"
                      ? "bg-brand-500 text-white ring-brand-400"
                      : "bg-white/70 text-transparent ring-slate-300"
                  )}
                >
                  ✓
                </span>
                <span>{inline(cased[2], `${base}-${idx}-c`)}</span>
              </span>
            ) : (
              inline(it.texte, `${base}-${idx}-i`)
            )}
            {it.enfants.length ? liste(it.enfants, `${base}-${idx}-e`) : null}
          </li>
        );
      })}
    </Tag>
  );
}

/** Rendu d'un fichier Markdown complet */
export function Markdown({ contenu, className }: { contenu: string; className?: string }) {
  return (
    <div
      className={cn(
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
    >
      {blocs(contenu, "md").map((b, i) => (
        <Fragment key={i}>{b}</Fragment>
      ))}
    </div>
  );
}
