"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  Compass,
  LayoutDashboard,
  LineChart,
  PhoneCall,
  Plus,
  Search,
  Settings,
  Target,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { ANNEE_SCOLAIRE, AUJOURDHUI } from "@/lib/constantes";
import { cn, formatDate } from "@/lib/utils";

const NAV = [
  { section: "Pilotage", items: [
    { href: "/", label: "Vue d'ensemble", icon: LayoutDashboard },
    { href: "/eleves", label: "Élèves", icon: Users },
    { href: "/diagnostics", label: "Diagnostics", icon: Target, badge: "Live" },
  ] },
  { section: "Accompagnement", items: [
    { href: "/appels", label: "Appels", icon: PhoneCall },
    { href: "/agenda", label: "Agenda", icon: CalendarDays },
    { href: "/contenus", label: "Contenus", icon: BookOpenCheck },
    { href: "/bulletins", label: "Bulletins", icon: ClipboardList },
  ] },
  { section: "Général", items: [
    { href: "/impact", label: "Impact école", icon: LineChart },
    { href: "/parametres", label: "Paramètres", icon: Settings },
  ] },
];

const TITRES: Record<string, { titre: string; sousTitre: string }> = {
  "/": { titre: "Vue d'ensemble", sousTitre: "Le pouls de l'accompagnement, en un coup d'œil" },
  "/eleves": { titre: "Élèves", sousTitre: "Chaque élève, son diagnostic, son plan d'accompagnement" },
  "/diagnostics": { titre: "Diagnostics", sousTitre: "Tests adaptatifs : réussi → la difficulté monte, raté → elle descend" },
  "/appels": { titre: "Appels", sousTitre: "Le contexte humain derrière les statistiques" },
  "/agenda": { titre: "Agenda", sousTitre: "Ce qui attend une action cette semaine" },
  "/contenus": { titre: "Contenus", sousTitre: "Fiches de renfort calibrées sur chaque lacune" },
  "/bulletins": { titre: "Bulletins", sousTitre: "Saisie manuelle des bulletins et inscription des élèves" },
  "/impact": { titre: "Impact école", sousTitre: "Les résultats de l'accompagnement, en chiffres" },
  "/parametres": { titre: "Paramètres", sousTitre: "Console, équipe et présentation" },
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const estFiche = pathname.startsWith("/eleves/");
  const meta = estFiche
    ? { titre: "Fiche élève", sousTitre: "Diagnostic, lacunes et plan d'accompagnement" }
    : (TITRES[pathname] ?? { titre: "Skora", sousTitre: "" });
  const actif = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1680px] gap-5 p-4 lg:p-5">
      {/* ── Sidebar flottante ── */}
      <aside className="glass sticky top-5 hidden h-[calc(100vh-2.5rem)] w-64 shrink-0 flex-col overflow-hidden lg:flex">
        <Link href="/" className="flex items-center gap-3 px-5 pt-6 pb-5">
          <span className="relative flex h-11 w-11 items-center justify-center">
            <span className="animate-halo absolute inset-0 rounded-2xl opacity-80 blur-[6px]" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/85 shadow-inner">
              <Compass size={22} className="text-brand-500" />
            </span>
          </span>
          <span>
            <span className="block text-lg leading-5 font-bold tracking-tight text-ink">Skora</span>
            <span className="block text-[11px] leading-4 text-slate-500">Console d'accompagnement</span>
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
                        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        on ? "text-brand-600" : "text-slate-600 hover:text-ink"
                      )}
                    >
                      {on ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-xl border border-white/70 bg-white/85 shadow-[0_6px_20px_-8px_rgba(90,60,120,0.25)]"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      ) : null}
                      <item.icon size={17} className={cn("relative z-10", on ? "text-brand-500" : "text-slate-400")} />
                      <span className="relative z-10">{item.label}</span>
                      {item.badge ? (
                        <span className="relative z-10 ml-auto rounded-full bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mx-3 mb-4 rounded-2xl border border-white/60 bg-gradient-to-br from-brand-500/10 via-violet-500/10 to-amber-400/10 p-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white shadow-[0_6px_16px_-6px_rgba(220,53,69,0.6)]">
              FR
            </span>
            <div className="text-xs">
              <p className="font-bold text-ink">Ferot</p>
              <p className="text-slate-500">Accompagnement pédagogique</p>
            </div>
          </div>
          <p className="mt-2.5 rounded-lg bg-white/60 px-2 py-1 text-center text-[10px] font-bold tracking-wide text-brand-600 uppercase">
            Mode démo école
          </p>
        </div>
      </aside>

      {/* ── Contenu ── */}
      <div className="min-w-0 flex-1">
        <header className="glass sticky top-4 z-40 mb-5 flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
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
            <span className="hidden text-right text-[11px] text-slate-400 xl:block">
              <span className="block font-semibold text-slate-600">{formatDate(AUJOURDHUI)}</span>
              Année scolaire {ANNEE_SCOLAIRE}
            </span>
            <Link href="/bulletins?nouveau=1" className="btn-gradient px-3.5 py-2">
              <Plus size={15} /> Ajouter un élève
            </Link>
          </div>
        </header>

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pb-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
