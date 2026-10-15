import { cn } from "@/lib/utils";

export function Avatar({
  prenom,
  nom,
  taille = "md",
}: {
  prenom: string;
  nom: string;
  couleur?: string;
  taille?: "sm" | "md" | "lg";
}) {
  const tailles = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-slate-400 font-semibold text-white ring-2 ring-white/80 shadow-[0_5px_12px_-6px_rgba(15,23,42,0.3)]",
        tailles[taille]
      )}
    >
      {prenom[0]}
      {nom[0]}
    </div>
  );
}
