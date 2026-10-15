import { Check, Minus } from "lucide-react";
import { PERMISSIONS, ROLE_LABEL } from "@/types";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

/** Matrice des droits par rôle — la colonne du rôle courant est surlignée */
export function MatricePermissions({ roleCourant }: { roleCourant: Role }) {
  const roles: Role[] = ["admin", "animateur"];
  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-400">Capacité</th>
          {roles.map((r) => (
            <th
              key={r}
              className={cn(
                "px-3 py-2.5 text-center text-xs font-bold",
                r === "admin" ? "text-brand-600" : "text-violet-600",
                r === roleCourant && "bg-brand-50/50"
              )}
            >
              {ROLE_LABEL[r]}
              {r === roleCourant ? (
                <span className="ml-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase">
                  Vous
                </span>
              ) : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-white/60">
        {PERMISSIONS.map((p) => (
          <tr key={p.label}>
            <td className="px-5 py-2.5 text-slate-600">{p.label}</td>
            {roles.map((r) => {
              const ok = p.roles.includes(r);
              return (
                <td
                  key={r}
                  className={cn("px-3 py-2.5 text-center", r === roleCourant && "bg-brand-50/50")}
                >
                  {ok ? (
                    <Check size={15} className="mx-auto text-emerald-500" />
                  ) : (
                    <Minus size={15} className="mx-auto text-slate-300" />
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
