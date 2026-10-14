import { cn } from "@/lib/utils";

export function Avatar({
  prenom,
  nom,
  couleur,
  taille = "md",
}: {
  prenom: string;
  nom: string;
  couleur: string;
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
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-white/80 shadow-[0_6px_16px_-6px_rgba(70,40,90,0.4)]",
        couleur,
        tailles[taille]
      )}
    >
      {prenom[0]}
      {nom[0]}
    </div>
  );
}
