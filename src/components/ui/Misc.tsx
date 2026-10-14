import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ProgressBar({
  valeur,
  couleur = "bg-brand-500",
  className,
}: {
  valeur: number;
  couleur?: string;
  className?: string;
}) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-white/60 ring-1 ring-white/70", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", couleur)}
        style={{ width: `${Math.min(100, Math.max(0, valeur))}%` }}
      />
    </div>
  );
}

export function EmptyState({
  titre,
  description,
  icon,
}: {
  titre: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      {icon ? <div className="text-slate-300">{icon}</div> : null}
      <p className="font-medium text-slate-600">{titre}</p>
      {description ? <p className="max-w-sm text-sm text-slate-400">{description}</p> : null}
    </div>
  );
}
