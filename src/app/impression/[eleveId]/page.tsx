"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { CahierRenfort } from "@/components/impression/CahierRenfort";
import { EmptyState } from "@/components/ui";
import { useStore } from "@/store";

function ImpressionInterne() {
  const params = useParams<{ eleveId: string }>();
  const { eleves } = useStore();
  const eleve = eleves.find((e) => e.id === params.eleveId);
  if (!eleve) {
    return <EmptyState titre="Élève introuvable" description="Cet élève n'existe pas dans la démo." />;
  }
  return <CahierRenfort eleve={eleve} />;
}

/** Page d'impression : hors de la console (pas de sidebar), optimisée A4. */
export default function PageImpression() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 print:bg-white print:p-0">
      <Suspense>
        <ImpressionInterne />
      </Suspense>
    </div>
  );
}
