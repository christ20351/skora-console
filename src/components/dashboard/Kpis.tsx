"use client";

import { motion } from "framer-motion";
import { PhoneCall, Target, Users, Video } from "lucide-react";
import { reussitePct } from "@/features/risque";
import { useStore } from "@/store";
import { AUJOURDHUI } from "@/lib/constantes";
import { formatDateCourte } from "@/lib/utils";

export function Kpis() {
  const { eleves, tests, appels, meets } = useStore();

  const moisCourant = AUJOURDHUI.slice(0, 7);
  const reussite = Math.round(
    tests.reduce((s, t) => s + reussitePct(t), 0) / Math.max(1, tests.length)
  );
  const effectues = appels.filter((a) => a.statut === "effectue");
  const appelsCeMois = effectues.filter((a) => a.date.slice(0, 7) === moisCourant).length;
  const aVenir = meets
    .filter((m) => m.statut === "a-venir")
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
  const prochain = aVenir[0];
  const nouveauxCeMois = eleves.filter((e) => e.inscritLe.slice(0, 7) === moisCourant).length;

  const kpis = [
    { icon: Users, label: "Apprenants actifs", valeur: eleves.length, note: `+${nouveauxCeMois} ce mois-ci` },
    { icon: Target, label: "Réussite globale aux tests", valeur: `${reussite} %`, note: `moyenne sur ${tests.length} tests adaptatifs` },
    { icon: PhoneCall, label: "Appels réalisés", valeur: effectues.length, note: `${appelsCeMois} ce mois-ci` },
    { icon: Video, label: "RDV Meet à venir", valeur: aVenir.length, note: prochain ? `prochain : ${formatDateCourte(prochain.date)} à ${prochain.heure}` : "aucun planifié" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="glass glass-hover p-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 ring-1 ring-slate-200/70">
              <k.icon size={16} />
            </span>
            <span className="text-xs leading-4 font-semibold text-slate-500">{k.label}</span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-ink">{k.valeur}</p>
          <p className="mt-0.5 truncate text-xs text-slate-400">{k.note}</p>
        </motion.div>
      ))}
    </div>
  );
}
