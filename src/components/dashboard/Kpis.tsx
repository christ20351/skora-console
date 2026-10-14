"use client";

import { motion } from "framer-motion";
import { FileWarning, PhoneCall, Sparkles, Target, Users } from "lucide-react";
import { reussitePct } from "@/features/risque";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

export function Kpis() {
  const { eleves, lacunes, tests, appels } = useStore();

  const actives = lacunes.filter((l) => l.statut !== "resolue");
  const critiques = actives.filter((l) => l.severite === "critique").length;
  const enAmelioration = lacunes.filter(
    (l) => l.statut === "amelioration" || l.statut === "resolue"
  ).length;
  const effectues = appels.filter((a) => a.statut === "effectue").length;
  const planifies = appels.filter((a) => a.statut === "planifie").length;
  const reussite = Math.round(
    tests.reduce((s, t) => s + reussitePct(t), 0) / Math.max(1, tests.length)
  );

  const kpis = [
    { icon: Users, label: "Élèves accompagnés", valeur: eleves.length, note: "bulletins saisis à la main", tile: "from-rose-400 to-brand-600" },
    { icon: FileWarning, label: "Lacunes critiques", valeur: critiques, note: `${actives.length} lacunes actives`, tile: "from-orange-400 to-rose-500" },
    { icon: Target, label: "Tests adaptatifs", valeur: tests.length, note: `${reussite} % de réussite moyenne`, tile: "from-violet-400 to-indigo-500" },
    { icon: PhoneCall, label: "Appels réalisés", valeur: effectues, note: `${planifies} planifié(s)`, tile: "from-sky-400 to-blue-500" },
    { icon: Sparkles, label: "Preuve d'impact", valeur: enAmelioration, note: "lacunes en progrès ou résolues", tile: "from-emerald-400 to-teal-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      {kpis.map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="glass glass-hover p-4"
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-[0_8px_18px_-8px_rgba(70,40,110,0.5)] bg-gradient-to-br",
                k.tile
              )}
            >
              <k.icon size={16} />
            </span>
            <span className="text-[11px] leading-4 font-semibold text-slate-500">{k.label}</span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-ink">{k.valeur}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{k.note}</p>
        </motion.div>
      ))}
    </div>
  );
}
