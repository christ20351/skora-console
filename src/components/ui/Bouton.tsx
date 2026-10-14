import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Bouton({
  children,
  onClick,
  variant = "primaire",
  taille = "md",
  disabled,
  className,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primaire" | "secondaire" | "fantome";
  taille?: "sm" | "md";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
        taille === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        variant === "primaire" && "btn-gradient",
        variant === "secondaire" &&
          "glass-soft text-slate-700 hover:bg-white/75 hover:-translate-y-0.5",
        variant === "fantome" && "text-slate-600 hover:bg-white/60 hover:text-ink",
        className
      )}
    >
      {children}
    </button>
  );
}
