"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { FicheEnTete } from "@/components/eleve/FicheEnTete";
import { OngletSynthese } from "@/components/eleve/OngletSynthese";
import { OngletLacunes } from "@/components/eleve/OngletLacunes";
import { OngletTests } from "@/components/eleve/OngletTests";
import { OngletAppels } from "@/components/eleve/OngletAppels";
import { OngletContenus } from "@/components/eleve/OngletContenus";
import { EmptyState } from "@/components/ui";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

const ONGLETS = [
  { cle: "synthese", label: "Synthèse" },
  { cle: "lacunes", label: "Lacunes" },
  { cle: "tests", label: "Tests" },
  { cle: "appels", label: "Appels" },
  { cle: "contenus", label: "Contenus" },
] as const;

type CleOnglet = (typeof ONGLETS)[number]["cle"];

export default function PageFicheEleve() {
  const params = useParams<{ id: string }>();
  const { eleves } = useStore();
  const [onglet, setOnglet] = useState<CleOnglet>("synthese");
  const eleve = eleves.find((e) => e.id === params.id);

  if (!eleve) {
    return (
      <EmptyState titre="Élève introuvable" description="Cet élève n'existe pas dans la démo." />
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/eleves"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
      >
        <ArrowLeft size={15} /> Tous les élèves
      </Link>

      <FicheEnTete eleve={eleve} />

      {/* Onglets animés */}
      <div className="glass-soft inline-flex gap-1 rounded-2xl p-1.5">
        {ONGLETS.map((o) => {
          const on = onglet === o.cle;
          return (
            <button
              key={o.cle}
              onClick={() => setOnglet(o.cle)}
              className={cn(
                "relative rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                on ? "text-brand-600" : "text-slate-500 hover:text-ink"
              )}
            >
              {on ? (
                <motion.span
                  layoutId="onglet-actif"
                  className="absolute inset-0 rounded-xl border border-white/70 bg-white/90 shadow-[0_6px_18px_-8px_rgba(90,60,120,0.3)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10">{o.label}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={onglet}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {onglet === "synthese" ? <OngletSynthese eleve={eleve} /> : null}
        {onglet === "lacunes" ? <OngletLacunes eleveId={eleve.id} /> : null}
        {onglet === "tests" ? <OngletTests eleveId={eleve.id} /> : null}
        {onglet === "appels" ? <OngletAppels eleveId={eleve.id} /> : null}
        {onglet === "contenus" ? <OngletContenus eleveId={eleve.id} /> : null}
      </motion.div>
    </div>
  );
}
