"use client";

import { Kpis } from "@/components/dashboard/Kpis";
import { NouveauxApprenants } from "@/components/dashboard/NouveauxApprenants";
import { RepartitionNiveaux } from "@/components/dashboard/RepartitionNiveaux";
import { AppelsCirculaire } from "@/components/dashboard/AppelsCirculaire";
import { RendezVousRecents } from "@/components/dashboard/RendezVousRecents";

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <Kpis />
      <div className="grid gap-5 xl:grid-cols-3">
        <RendezVousRecents />
        <div className="xl:col-span-2">
          <NouveauxApprenants />
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <RepartitionNiveaux />
        <div className="xl:col-span-2">
          <AppelsCirculaire />
        </div>
      </div>
    </div>
  );
}
