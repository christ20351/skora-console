"use client";

import { BookOpen, TrendingDown, TrendingUp } from "lucide-react";
import { pctNote } from "@/features/risque";
import { Card, CardHeader } from "@/components/ui";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

/** Bulletin saisi à la main — trié pire note d'abord (base de la priorisation) */
export function Bulletin({ eleveId }: { eleveId: string }) {
  const { bulletins: tous } = useStore();
  const bulletins = tous[eleveId] ?? [];
  if (bulletins.length === 0) return null;
  const dernier = bulletins[bulletins.length - 1];
  const precedent = bulletins.length >= 2 ? bulletins[bulletins.length - 2] : null;
  const lignes = [...dernier.lignes].sort((a, b) => pctNote(a) - pctNote(b));
  const notePrecedente = (matiere: string) =>
    precedent?.lignes.find((l) => l.matiere === matiere);

  return (
    <Card>
      <CardHeader
        title="Bulletin"
        subtitle={`${dernier.trimestre} · saisi à la main à partir du bulletin physique — trié pire note d'abord`}
        icon={<BookOpen size={17} />}
      />
      <div className="space-y-3 px-5 py-4">
        {lignes.map((l) => {
          const pct = pctNote(l);
          const prec = notePrecedente(l.matiere);
          const delta = prec ? pct - pctNote(prec) : null;
          return (
            <div key={l.matiere}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                <span className={cn("font-medium", pct < 50 ? "text-brand-600" : "text-slate-700")}>
                  {l.matiere}
                  {pct < 50 ? (
                    <span className="ml-2 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600">
                      PRIORITAIRE
                    </span>
                  ) : null}
                </span>
                <span className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">
                    classe : {l.moyenneClasse?.toFixed(1).replace(".", ",") ?? "—"}/20
                  </span>
                  {delta !== null ? (
                    <span
                      className={cn(
                        "flex items-center gap-0.5 font-semibold",
                        delta < 0 ? "text-brand-500" : "text-emerald-600"
                      )}
                    >
                      {delta < 0 ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                      {delta > 0 ? "+" : ""}
                      {(l.note - (prec?.note ?? l.note)).toFixed(0)}
                    </span>
                  ) : null}
                  <span className="font-bold text-slate-800">
                    {l.note}/{l.sur}
                  </span>
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    pct < 50 ? "bg-brand-500" : pct < 65 ? "bg-amber-400" : "bg-emerald-500"
                  )}
                  style={{ width: `${pct}%` }}
                />
                {l.moyenneClasse !== undefined ? (
                  <div
                    className="absolute top-0 h-full w-0.5 bg-slate-400"
                    style={{ left: `${(l.moyenneClasse / l.sur) * 100}%` }}
                    title={`Moyenne de classe : ${l.moyenneClasse}/20`}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
