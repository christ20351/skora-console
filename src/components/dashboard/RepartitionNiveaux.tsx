"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Badge, Card, CardHeader } from "@/components/ui";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

const CYCLES = [
  { motif: "2nde", label: "2nde", barre: "bg-brand-300", puce: "bg-brand-300" },
  { motif: "1ère", label: "1ère", barre: "bg-brand-400", puce: "bg-brand-400" },
  { motif: "Tle", label: "Tle", barre: "bg-brand-600", puce: "bg-brand-600" },
] as const;

/** Rang de tri : cycle (2nde → 1ère → Tle) puis série (A, C, D…) */
function cleTri(niveau: string): number {
  const i = CYCLES.findIndex((c) => niveau.startsWith(c.motif));
  const suffixe = niveau.replace(/^(2nde|1ère|Tle)\s*/, "");
  return i * 100 + (suffixe.charCodeAt(0) || 0);
}

/** Répartition des apprenants par niveau de classe */
export function RepartitionNiveaux() {
  const { eleves } = useStore();

  const parNiveau = [...new Set(eleves.map((e) => e.niveauScolaire))]
    .sort((a, b) => cleTri(a) - cleTri(b))
    .map((niveau) => ({
      niveau,
      count: eleves.filter((e) => e.niveauScolaire === niveau).length,
    }));
  const max = Math.max(...parNiveau.map((n) => n.count), 1);
  const parCycle = CYCLES.map((c) => ({
    ...c,
    total: eleves.filter((e) => e.niveauScolaire.startsWith(c.motif)).length,
  }));

  return (
    <Card>
      <CardHeader
        icon={<BarChart3 size={15} />}
        title="Répartition par niveau"
        subtitle={`${eleves.length} apprenants · ${parNiveau.length} classes`}
      />
      <div className="space-y-3.5 px-5 py-5">
        {parNiveau.map((n, i) => (
          <div key={n.niveau} className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-xs font-bold text-slate-600">{n.niveau}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200/60">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(n.count / max) * 100}%` }}
                transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "h-full rounded-full",
                  CYCLES.find((c) => n.niveau.startsWith(c.motif))!.barre
                )}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-xs font-bold tabular-nums text-ink">
              {n.count}
            </span>
          </div>
        ))}
        <div className="flex flex-wrap gap-2 border-t border-slate-200/70 pt-3.5">
          {parCycle.map((c) => (
            <Badge key={c.motif}>
              <span className={cn("h-1.5 w-1.5 rounded-full", c.puce)} />
              {c.label} · {c.total}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
