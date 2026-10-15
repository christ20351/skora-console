import type { ReactNode } from "react";
import {
  SENTIMENT_LABEL,
  SEVERITE_LABEL,
  STATUT_LACUNE_LABEL,
} from "@/types";
import type { LabelRisque, Severite, StatutLacune, Sentiment } from "@/types";
import { cn } from "@/lib/utils";

const RISQUE_STYLES: Record<LabelRisque, string> = {
  Critique: "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_4px_14px_-4px_rgba(220,53,69,0.5)]",
  "Élevé": "bg-orange-400/15 text-orange-600 ring-1 ring-orange-300/40",
  "Modéré": "bg-amber-400/15 text-amber-600 ring-1 ring-amber-300/40",
  Vigilance: "bg-emerald-400/15 text-emerald-600 ring-1 ring-emerald-300/40",
};

export function BadgeRisque({ label }: { label: LabelRisque }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        RISQUE_STYLES[label]
      )}
    >
      {label}
    </span>
  );
}

const SEVERITE_STYLES: Record<Severite, string> = {
  critique: "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-[0_4px_14px_-4px_rgba(220,53,69,0.5)]",
  elevee: "bg-orange-400/15 text-orange-600 ring-1 ring-orange-300/40",
  moderee: "bg-amber-400/15 text-amber-600 ring-1 ring-amber-300/40",
  legere: "bg-white/60 text-slate-500 ring-1 ring-slate-200/60",
};

export function BadgeSeverite({ severite }: { severite: Severite }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        SEVERITE_STYLES[severite]
      )}
    >
      {SEVERITE_LABEL[severite]}
    </span>
  );
}

const STATUT_STYLES: Record<StatutLacune, string> = {
  detectee: "bg-white/60 text-slate-600 ring-1 ring-slate-200/70",
  renfort: "bg-violet-400/15 text-violet-600 ring-1 ring-violet-300/40",
  amelioration: "bg-sky-400/15 text-sky-600 ring-1 ring-sky-300/40",
  resolue: "bg-emerald-400/15 text-emerald-600 ring-1 ring-emerald-300/40",
};

export function BadgeStatutLacune({ statut }: { statut: StatutLacune }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUT_STYLES[statut]
      )}
    >
      {STATUT_LACUNE_LABEL[statut]}
    </span>
  );
}

const SENTIMENT_STYLES: Record<Sentiment, string> = {
  positif: "bg-emerald-400/15 text-emerald-600 ring-1 ring-emerald-300/40",
  neutre: "bg-white/60 text-slate-600 ring-1 ring-slate-200/70",
  preoccupant: "bg-brand-400/15 text-brand-600 ring-1 ring-brand-300/40",
};

export function BadgeSentiment({ sentiment }: { sentiment: Sentiment }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        SENTIMENT_STYLES[sentiment]
      )}
    >
      {SENTIMENT_LABEL[sentiment]}
    </span>
  );
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200/70",
        className
      )}
    >
      {children}
    </span>
  );
}
