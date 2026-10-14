"use client";

import { Target } from "lucide-react";
import { notionParId } from "@/data/notions";
import { reussitePct } from "@/features/risque";
import { useStore } from "@/store";
import { Avatar, Card, CardHeader } from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";

export function DerniersTests() {
  const { tests, eleves } = useStore();
  const derniers = [...tests].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <Card>
      <CardHeader
        title="Derniers tests adaptatifs"
        subtitle="Chaque question est taguée par notion : ce qui est raté crée les lacunes"
        icon={<Target size={16} />}
      />
      <div className="divide-y divide-white/50">
        {derniers.map((t) => {
          const el = eleves.find((e) => e.id === t.eleveId);
          if (!el) return null;
          const ratees = [...new Set(t.etapes.filter((e) => !e.correct).map((e) => e.notionId))];
          const pct = reussitePct(t);
          return (
            <div key={t.id} className="flex flex-wrap items-center gap-4 px-5 py-3">
              <Avatar prenom={el.prenom} nom={el.nom} couleur={el.couleur} taille="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {el.prenom} {el.nom}
                  <span className="ml-2 font-normal text-slate-400">
                    {t.matiere} · {formatDate(t.date)} · {t.dureeMin} min
                  </span>
                </p>
                <p className="truncate text-xs text-slate-500">
                  {ratees.length > 0
                    ? `Raté : ${ratees.map((n) => notionParId(n).nom).join(", ")}`
                    : "Aucune notion ratée — excellent"}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-xl px-2.5 py-1 text-xs font-bold backdrop-blur",
                  pct >= 60
                    ? "bg-emerald-400/15 text-emerald-600 ring-1 ring-emerald-300/40"
                    : pct >= 40
                      ? "bg-amber-400/15 text-amber-600 ring-1 ring-amber-300/40"
                      : "bg-brand-400/15 text-brand-600 ring-1 ring-brand-300/40"
                )}
              >
                {pct} % réussite
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
