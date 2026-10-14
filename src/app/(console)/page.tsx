"use client";

import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { Kpis } from "@/components/dashboard/Kpis";
import { Priorites } from "@/components/dashboard/Priorites";
import { AppelsAVenir, LacunesMatiere, Spotlight } from "@/components/dashboard/SideCards";
import { DerniersTests } from "@/components/dashboard/DerniersTests";
import { ANNEE_SCOLAIRE } from "@/lib/constantes";

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <div className="glass relative overflow-hidden px-6 py-5">
        <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-gradient-to-br from-brand-400/25 to-violet-500/25 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] text-brand-500 uppercase">
              Année scolaire {ANNEE_SCOLAIRE}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">
              Chaque élève comprend enfin où il bute.
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Diagnostic adaptatif · accompagnement humain · renfort personnalisé — la boucle complète, visible.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/diagnostics"
              className="btn-violet px-4 py-2.5"
            >
              <Sparkles size={15} /> Lancer un diagnostic
            </Link>
            <Link href="/bulletins?nouveau=1" className="glass-soft px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:bg-white/75">
              <Plus size={15} className="inline" /> Inscrire un élève
            </Link>
          </div>
        </div>
      </div>

      <Kpis />
      <div className="grid gap-5 xl:grid-cols-3">
        <Priorites />
        <div className="space-y-5">
          <Spotlight />
          <LacunesMatiere />
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <DerniersTests />
        <div className="xl:col-start-3">
          <AppelsAVenir />
        </div>
      </div>
    </div>
  );
}
