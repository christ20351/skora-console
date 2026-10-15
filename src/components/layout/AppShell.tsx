"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  CalendarDays,
  Compass,
  GraduationCap,
  LayoutDashboard,
  PhoneCall,
  Search,
  Users,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { ANNEE_SCOLAIRE, AUJOURDHUI } from "@/lib/constantes";
import { cn, formatDate } from "@/lib/utils";
import { useStore } from "@/store";
import { ROLE_LABEL } from "@/types";

const NAV = [
  { section: "Pilotage", items: [
    { href: "/", label: "Vue d'ensemble", icon: LayoutDashboard },
    { href: "/eleves", label: "Apprenants", icon: Users },
    { href: "/equipe", label: "Équipe", icon: UsersRound },
  ] },
  { section: "Accompagnement", items: [
    { href: "/appels", label: "Appels", icon: PhoneCall },
    { href: "/agenda", label: "Agenda", icon: CalendarDays },
    { href: "/contenus", label: "Contenus", icon: BookOpenCheck },
    { href: "/examens", label: "Examens", icon: GraduationCap },
  ] },
];

const TITRES: Record<string, { titre: string; sousTitre: string }> = {
  "/": { titre: "Vue d'ensemble", sousTitre: "Rendez-vous, inscriptions et résultats, en un coup d'œil" },
  "/eleves": { titre: "Apprenants", sousTitre: "Chaque apprenant, son diagnostic, son plan d'accompagnement" },
  "/diagnostics": { titre: "Diagnostics", sousTitre: "Tests adaptatifs : réussi → la difficulté monte, raté → elle descend" },
  "/equipe": { titre: "Équipe", sousTitre: "Invitez vos animateurs, ajustez les rôles, suivez la charge" },
  "/appels": { titre: "Appels", sousTitre: "Le contexte humain derrière les statistiques" },
  "/agenda": { titre: "Agenda", sousTitre: "Meets synchronisés Google Calendar — glissez pour replanifier" },
  "/contenus": { titre: "Contenus", sousTitre: "Fiches de renfort calibrées sur chaque lacune" },
  "/examens": { titre: "Examens", sousTitre: "Copies et sujets suivis par matière, lisibles en Markdown" },
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { utilisateur } = useStore();
  const estFiche = pathname.startsWith("/eleves/");
  const meta = estFiche
    ? { titre: "Fiche élève", sousTitre: "Diagnostic, lacunes et plan d'accompagnement" }
    : (TITRES[pathname] ?? { titre: "Skora", sousTitre: "" });
  const actif = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar collée au bord gauche ── */}
      <aside className="glass sticky top-0 hidden h-screen w-52 shrink-0 flex-col overflow-hidden rounded-none lg:flex">
        <Link href="/" className="flex items-center gap-3 px-4 pt-5 pb-4">
          <span className="relative flex h-10 w-10 items-center justify-center">
            <span className="logo-glow absolute inset-0 rounded-xl opacity-50 blur-[6px]" />
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/85 shadow-inner">
              <Compass size={20} className="text-slate-500" />
            </span>
          </span>
          <span>
            <span className="block text-base leading-5 font-bold tracking-tight text-ink">Skora</span>
            <span className="block text-[11px] leading-4 text-slate-500">Console d&apos;accompagnement</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {NAV.map((group) => (
            <div key={group.section}>
              <p className="px-3 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">
                {group.section}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const on = actif(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        on ? "text-ink" : "text-slate-600 hover:text-slate-700"
                      )}
                    >
                      {on ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-xl bg-slate-100 ring-1 ring-slate-200/70"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      ) : null}
                      <item.icon size={16} className={cn("relative z-10", on ? "text-slate-600" : "text-slate-400")} />
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mx-3 mb-4 rounded-2xl border border-slate-200/70 bg-slate-50 p-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-[11px] font-bold text-white shadow-[0_5px_12px_-6px_rgba(220,53,69,0.45)]">
              {utilisateur.nom.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 text-[12px]">
              <p className="truncate font-bold text-ink">{utilisateur.nom}</p>
              <p className="truncate text-[11px] text-slate-500">{utilisateur.fonction}</p>
            </div>
          </div>
          <p className="mt-2 rounded-lg bg-white px-2 py-1 text-center text-[10px] font-bold tracking-wide text-brand-600 uppercase ring-1 ring-slate-200/70">
            {ROLE_LABEL[utilisateur.role]}
          </p>
        </div>
      </aside>

      {/* ── Contenu ── */}
      <div className="min-w-0 flex-1">
        <header className="glass sticky top-0 z-40 mb-5 flex flex-wrap items-center justify-between gap-3 rounded-none px-5 py-3.5">
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-ink">{meta.titre}</h1>
            <p className="truncate text-xs text-slate-500">{meta.sousTitre}</p>
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="relative hidden md:block">
              <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Rechercher…"
                className="glass-soft w-48 rounded-xl py-2 pr-3 pl-8 text-sm outline-none placeholder:text-slate-400 focus:w-64 focus:bg-white/70 focus:ring-2 focus:ring-brand-300/50"
              />
            </div>
            <span className="hidden text-right text-xs text-slate-400 xl:block">
              <span className="block font-semibold text-slate-600">{formatDate(AUJOURDHUI)}</span>
              Année scolaire {ANNEE_SCOLAIRE}
            </span>
          </div>
        </header>

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="px-5 pb-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
