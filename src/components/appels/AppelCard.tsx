"use client";

import type { ReactNode } from "react";
import { CalendarPlus, MessageSquare } from "lucide-react";
import { SENTIMENT_LABEL, TYPE_APPEL_LABEL } from "@/types";
import type { Appel } from "@/types";
import { Badge, BadgeSentiment } from "@/components/ui";
import { formatDate } from "@/lib/utils";

/** Carte d'un appel réalisé (résumé, thèmes, déclarations, prochaine étape) */
export function AppelCard({ appel }: { appel: Appel }) {
  return (
    <div className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-slate-800">{formatDate(appel.date)}</span>
        <Badge>{TYPE_APPEL_LABEL[appel.type]}</Badge>
        <BadgeSentiment sentiment={appel.sentiment} />
        <span className="text-xs text-slate-400">
          {appel.dureeMin} min · {appel.animateur}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{appel.resume}</p>

      {appel.points.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {appel.points.map((p) => (
            <Badge key={p}>{p}</Badge>
          ))}
        </div>
      ) : null}

      {appel.declarations.length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2">
          <MessageSquare size={13} className="text-violet-500" />
          <span className="text-xs font-semibold text-violet-700">
            L'élève déclare ne pas comprendre :
          </span>
          {appel.declarations.map((d) => (
            <span key={d} className="text-xs font-medium text-violet-600">
              {d}
            </span>
          ))}
        </div>
      ) : null}

      {appel.prochaineEtape ? (
        <p className="mt-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Prochaine étape : </span>
          {appel.prochaineEtape}
        </p>
      ) : null}
    </div>
  );
}

/** Carte compacte d'un appel planifié */
export function AppelPlanifieCard({
  appel,
  eleveNom,
  lien,
}: {
  appel: Appel;
  eleveNom: string;
  lien?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-3.5">
      <span className="rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-bold text-brand-600">
        {formatDate(appel.date)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{eleveNom}</p>
        <p className="truncate text-xs text-slate-400">
          {TYPE_APPEL_LABEL[appel.type]} · {appel.motif} · avec {appel.animateur}
        </p>
      </div>
      {lien}
      <CalendarPlus size={15} className="shrink-0 text-slate-300" />
    </div>
  );
}
