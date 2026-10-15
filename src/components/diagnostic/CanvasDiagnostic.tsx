"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Maximize, MessageSquare, Minus, Move, Plus, X } from "lucide-react";
import { BadgeSeverite } from "@/components/ui";
import { cn } from "@/lib/utils";
import { STATUT_NOTION_LABEL } from "@/types";
import type {
  ArbreDiagnostic,
  ChapitreDiagnostic,
  NotionDiagnostic,
  StatutNotion,
} from "@/types";

/* ── Dimensions de la mise en page ───────────────────────────────────── */
const LARG = 224; // largeur d'une carte chapitre
const HAUT = 118; // hauteur d'une carte chapitre
const ESP_COL = 64; // écart horizontal entre colonnes de dépendances
const ESP_LIGNE = 22; // écart vertical entre chapitres d'une même colonne
const PAD_G = 26; // marge intérieure du cadre d'arbre
const ENTETE_H = 46; // place réservée au titre de l'arbre
const GAP_ARBRES_X = 300; // écart entre deux arbres voisins (jamais collés)
const GAP_ARBRES_Y = 170;

const STYLE_STATUT: Record<
  StatutNotion,
  { dot: string; chip: string; barre: string; arete: string }
> = {
  acquise: {
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    barre: "bg-emerald-500",
    arete: "stroke-slate-300",
  },
  "en-cours": {
    dot: "bg-violet-500",
    chip: "bg-violet-50 text-violet-700 ring-violet-200",
    barre: "bg-violet-500",
    arete: "stroke-violet-400",
  },
  fragile: {
    dot: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 ring-amber-200",
    barre: "bg-amber-500",
    arete: "stroke-amber-400",
  },
  critique: {
    dot: "bg-rose-500",
    chip: "bg-rose-50 text-rose-700 ring-rose-200",
    barre: "bg-rose-500",
    arete: "stroke-rose-400",
  },
  "non-evaluee": {
    dot: "bg-slate-300",
    chip: "bg-slate-100 text-slate-400 ring-slate-200",
    barre: "bg-slate-300",
    arete: "stroke-slate-200",
  },
};

const LEGENDE: StatutNotion[] = ["acquise", "en-cours", "fragile", "critique", "non-evaluee"];

interface Pos {
  x: number;
  y: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Colonnes d'un arbre : profondeur = plus longue chaîne de prérequis */
function layoutArbre(arbre: ArbreDiagnostic) {
  const prof: Record<string, number> = {};
  const calc = (id: string, chemin: Set<string>): number => {
    if (prof[id] !== undefined) return prof[id];
    if (chemin.has(id)) return 0;
    chemin.add(id);
    const c = arbre.chapitres.find((x) => x.id === id);
    const p =
      c && c.prerequis.length
        ? Math.max(...c.prerequis.map((r) => calc(r, chemin))) + 1
        : 0;
    prof[id] = p;
    return p;
  };
  arbre.chapitres.forEach((c) => calc(c.id, new Set()));

  const parCol = new Map<number, ChapitreDiagnostic[]>();
  arbre.chapitres.forEach((c) => {
    const d = prof[c.id] ?? 0;
    if (!parCol.has(d)) parCol.set(d, []);
    parCol.get(d)!.push(c);
  });

  const pos: Record<string, Pos> = {};
  let haut = 0;
  [...parCol.keys()].sort((a, b) => a - b).forEach((d, col) => {
    const col_ = parCol.get(d)!;
    const hTot = col_.length * HAUT + (col_.length - 1) * ESP_LIGNE;
    haut = Math.max(haut, hTot);
    col_.forEach((c, i) => {
      pos[c.id] = {
        x: col * (LARG + ESP_COL),
        y: -hTot / 2 + i * (HAUT + ESP_LIGNE) + haut / 2,
      };
    });
  });
  return {
    pos,
    larg: [...parCol.keys()].length * LARG + ([...parCol.keys()].length - 1) * ESP_COL,
    haut,
  };
}

const cheminsLies = (a: Pos, b: Pos) => {
  const dx = Math.max(Math.abs(b.x - a.x) / 2, 48);
  const s = b.x >= a.x ? 1 : -1;
  return `M ${a.x} ${a.y} C ${a.x + dx * s} ${a.y}, ${b.x - dx * s} ${b.y}, ${b.x} ${b.y}`;
};

interface Selection {
  matiere: string;
  chapitreId: string;
  notionIndex?: number;
}

/**
 * Canvas infini (navigable, zoomable) montrant un arbre de dépendances
 * par matière. Façon tableau des instances Railway : on déplace le fond
 * pour naviguer, la molette zoome, chaque arbre et chaque chapitre sont
 * déplaçables indépendamment.
 */
export function CanvasDiagnostic({ arbres }: { arbres: ArbreDiagnostic[] }) {
  const refCont = useRef<HTMLDivElement>(null);
  const [vue, setVue] = useState<Pos & { k: number }>({ x: 40, y: 40, k: 1 });
  const [anime, setAnime] = useState(false);
  const [deplArbre, setDeplArbre] = useState<Record<string, Pos>>({});
  const [deplChap, setDeplChap] = useState<Record<string, Pos>>({});
  const [selection, setSelection] = useState<Selection | null>(null);
  const [survol, setSurvol] = useState<string | null>(null);

  /* ── Placement des arbres : 2 par ligne, espacés (jamais collés) ── */
  const places = useMemo(() => {
    const lay = arbres.map((a) => ({ arbre: a, l: layoutArbre(a) }));
    const res: { arbre: ArbreDiagnostic; l: ReturnType<typeof layoutArbre>; origine: Pos }[] = [];
    let y = 0;
    let hLigne = 0;
    let lPrec = 0;
    for (let i = 0; i < lay.length; i++) {
      const t = lay[i];
      const lArbre = t.l.larg + PAD_G * 2;
      const hArbre = t.l.haut + PAD_G * 2 + ENTETE_H;
      const x = i % 2 === 0 ? 0 : lPrec + GAP_ARBRES_X;
      lPrec = lArbre;
      hLigne = Math.max(hLigne, hArbre);
      res.push({ ...t, origine: { x, y } });
      if (i % 2 === 1) y += hLigne + GAP_ARBRES_Y;
    }
    return res;
  }, [arbres]);

  /* ── Position finale d'un chapitre (arbre déplacé + chapitre déplacé) ── */
  const posFinale = useMemo(() => {
    const map: Record<string, Pos> = {};
    places.forEach((t) => {
      const dt = deplArbre[t.arbre.matiere] ?? { x: 0, y: 0 };
      t.arbre.chapitres.forEach((c) => {
        const dc = deplChap[c.id] ?? { x: 0, y: 0 };
        const p = t.l.pos[c.id];
        map[c.id] = { x: t.origine.x + dt.x + p.x + dc.x, y: t.origine.y + dt.y + p.y + dc.y };
      });
    });
    return map;
  }, [places, deplArbre, deplChap]);

  /* ── Cadres des arbres (bordure pointillée façon groupes Railway) ── */
  const cadres = useMemo(
    () =>
      places.map((t) => {
        const dt = deplArbre[t.arbre.matiere] ?? { x: 0, y: 0 };
        return {
          matiere: t.arbre.matiere,
          nbChapitres: t.arbre.chapitres.length,
          x: t.origine.x + dt.x - PAD_G,
          y: t.origine.y + dt.y - PAD_G - ENTETE_H,
          w: t.l.larg + PAD_G * 2,
          h: t.l.haut + PAD_G * 2 + ENTETE_H,
        };
      }),
    [places, deplArbre]
  );

  /* ── Enveloppe du contenu (pour l'ajustement de vue) ── */
  const bbox = useMemo(() => {
    const pts = Object.values(posFinale);
    if (!pts.length) return { x: 0, y: 0, w: 1, h: 1 };
    const minX = Math.min(...pts.map((p) => p.x));
    const minY = Math.min(...pts.map((p) => p.y));
    const maxX = Math.max(...pts.map((p) => p.x + LARG));
    const maxY = Math.max(...pts.map((p) => p.y + HAUT));
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  }, [posFinale]);

  const ajuster = () => {
    const el = refCont.current;
    if (!el) return;
    setAnime(true);
    const k = clamp(Math.min(el.clientWidth / (bbox.w + 90), el.clientHeight / (bbox.h + 90)), 0.15, 1.4);
    setVue({
      k,
      x: (el.clientWidth - bbox.w * k) / 2 - bbox.x * k,
      // réserve la place de la légende au-dessus du premier arbre
      y: (el.clientHeight - bbox.h * k) / 2 - bbox.y * k + 46,
    });
  };

  /* Vue ajustée au contenu au premier rendu */
  const dejamonte = useRef(false);
  useEffect(() => {
    if (!dejamonte.current) {
      dejamonte.current = true;
      requestAnimationFrame(ajuster);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Molette : zoom au curseur (maj = défilement horizontal) ── */
  useEffect(() => {
    const el = refCont.current;
    if (!el) return;
    const surMolette = (e: WheelEvent) => {
      e.preventDefault();
      setAnime(false);
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      setVue((v) => {
        if (e.shiftKey) return { ...v, x: v.x - e.deltaY - e.deltaX, y: v.y };
        const k2 = clamp(v.k * Math.exp(-e.deltaY * 0.0016), 0.15, 2);
        return { k: k2, x: px - ((px - v.x) * k2) / v.k, y: py - ((py - v.y) * k2) / v.k };
      });
    };
    el.addEventListener("wheel", surMolette, { passive: false });
    return () => el.removeEventListener("wheel", surMolette);
  }, []);

  /* ── Navigation : glisser le fond ── */
  const panRef = useRef<{ px: number; py: number; vx: number; vy: number } | null>(null);
  const [enPan, setEnPan] = useState(false);

  /* ── Déplacement des arbres et des chapitres ── */
  const dragRef = useRef<
    | {
        type: "arbre" | "chapitre";
        cle: string;
        sx: number;
        sy: number;
        base: Pos;
        bouge: boolean;
      }
    | null
  >(null);

  /* Zoom courant en ref : le drag d'une carte convertit les pixels
     écran en coordonnées contenu (sinon la carte ne suit pas le curseur) */
  const kRef = useRef(vue.k);
  useEffect(() => {
    kRef.current = vue.k;
  }, [vue.k]);

  const gestes = (
    type: "arbre" | "chapitre",
    cle: string,
    base: Pos,
    auClic?: () => void
  ) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setAnime(false);
      dragRef.current = { type, cle, sx: e.clientX, sy: e.clientY, base, bouge: false };
    },
    onPointerMove: (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = (e.clientX - d.sx) / kRef.current;
      const dy = (e.clientY - d.sy) / kRef.current;
      if (Math.abs(dx) + Math.abs(dy) > 2) d.bouge = true;
      if (!d.bouge) return;
      const n = { x: d.base.x + dx, y: d.base.y + dy };
      if (d.type === "arbre") setDeplArbre((m) => ({ ...m, [d.cle]: n }));
      else setDeplChap((m) => ({ ...m, [d.cle]: n }));
    },
    onPointerUp: () => {
      const d = dragRef.current;
      dragRef.current = null;
      if (d && !d.bouge) auClic?.();
    },
  });

  const zoomer = (f: number) => {
    const el = refCont.current;
    if (!el) return;
    setAnime(true);
    const cx = el.clientWidth / 2;
    const cy = el.clientHeight / 2;
    setVue((v) => {
      const k2 = clamp(v.k * f, 0.15, 2);
      return { k: k2, x: cx - ((cx - v.x) * k2) / v.k, y: cy - ((cy - v.y) * k2) / v.k };
    });
  };

  const centre = (id: string): Pos => {
    const p = posFinale[id];
    return p ? { x: p.x + LARG / 2, y: p.y + HAUT / 2 } : { x: 0, y: 0 };
  };

  const arbresParMatiere = useMemo(
    () => new Map(places.map((t) => [t.arbre.matiere, t])),
    [places]
  );

  const selectionChap = selection
    ? arbresParMatiere
        .get(selection.matiere)
        ?.arbre.chapitres.find((c) => c.id === selection.chapitreId)
    : undefined;

  return (
    <div
      ref={refCont}
      className={cn(
        "relative h-[600px] touch-none select-none overflow-hidden rounded-xl bg-slate-50",
        enPan ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{
        backgroundImage: "radial-gradient(circle, rgba(100,116,139,0.18) 1px, transparent 1px)",
        backgroundSize: `${22 * vue.k}px ${22 * vue.k}px`,
        backgroundPosition: `${vue.x}px ${vue.y}px`,
      }}
      aria-label="Arbre diagnostique — canvas navigable"
      onPointerDown={(e) => {
        // le fond lance le pan ; les cartes s'arrêtent avant
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        panRef.current = { px: e.clientX, py: e.clientY, vx: vue.x, vy: vue.y };
        setAnime(false);
        setEnPan(true);
      }}
      onPointerMove={(e) => {
        const p = panRef.current;
        if (!p) return;
        setVue((v) => ({ ...v, x: p.vx + (e.clientX - p.px), y: p.vy + (e.clientY - p.py) }));
      }}
      onPointerUp={() => {
        panRef.current = null;
        setEnPan(false);
      }}
      onPointerCancel={() => {
        panRef.current = null;
        setEnPan(false);
      }}
    >
      {/* ── Couche transformée (arêtes + arbres + cartes) ── */}
      <div
        className={cn("absolute left-0 top-0", anime && "transition-transform duration-200")}
        style={{ transform: `translate(${vue.x}px, ${vue.y}px) scale(${vue.k})`, transformOrigin: "0 0" }}
      >
        {/* Arêtes de dépendance (derrière les cartes) */}
        <svg
          className="pointer-events-none absolute overflow-visible"
          style={{ left: bbox.x - 500, top: bbox.y - 500, width: bbox.w + 1000, height: bbox.h + 1000 }}
        >
          <g transform={`translate(${-(bbox.x - 500)}, ${-(bbox.y - 500)})`}>
            {places.map(({ arbre }) =>
              arbre.chapitres.flatMap((c) =>
                c.prerequis
                  .filter((r) => arbre.chapitres.some((x) => x.id === r))
                  .map((r) => {
                    const a = centre(r);
                    const b = centre(c.id);
                    const actif = survol === r || survol === c.id;
                    return (
                      <path
                        key={`${r}->${c.id}`}
                        d={cheminsLies(a, b)}
                        fill="none"
                        strokeWidth={actif ? 2.5 : 1.75}
                        className={cn(
                          "transition-[stroke,stroke-width]",
                          actif ? "stroke-brand-500" : STYLE_STATUT[c.statut].arete
                        )}
                      />
                    );
                  })
              )
            )}
          </g>
        </svg>

        {/* Cadres d'arbres (décor) */}
        {cadres.map((c) => (
          <div
            key={c.matiere}
            className="pointer-events-none absolute rounded-2xl border-2 border-dashed border-slate-300/80 bg-white/40"
            style={{ left: c.x, top: c.y, width: c.w, height: c.h }}
          />
        ))}

        {/* Titres d'arbres : glisser déplace toute la matière */}
        {cadres.map((c) => (
          <div
            key={`t-${c.matiere}`}
            className="absolute flex cursor-grab touch-none items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200 active:cursor-grabbing"
            style={{ left: c.x + 14, top: c.y + 12 }}
            {...gestes("arbre", c.matiere, deplArbre[c.matiere] ?? { x: 0, y: 0 })}
          >
            <Move size={12} className="text-slate-400" />
            <span className="text-[13px] font-bold text-ink">{c.matiere}</span>
            <span className="text-[10px] font-semibold text-slate-400">
              {c.nbChapitres} chapitres
            </span>
          </div>
        ))}

        {/* Cartes chapitres */}
        {places.map(({ arbre }) =>
          arbre.chapitres.map((c) => {
            const p = posFinale[c.id];
            if (!p) return null;
            const statut = c.statut;
            const choisi = selection?.chapitreId === c.id;
            return (
              <div
                key={c.id}
                className={cn(
                  "absolute flex cursor-grab touch-none flex-col rounded-xl bg-white p-2.5 shadow-sm ring-1 transition-shadow active:cursor-grabbing",
                  choisi ? "ring-2 ring-brand-400" : "ring-slate-200 hover:shadow-md"
                )}
                style={{ left: p.x, top: p.y, width: LARG, height: HAUT }}
                onPointerEnter={() => setSurvol(c.id)}
                onPointerLeave={() => setSurvol((s) => (s === c.id ? null : s))}
                {...gestes("chapitre", c.id, deplChap[c.id] ?? { x: 0, y: 0 }, () =>
                  setSelection({ matiere: arbre.matiere, chapitreId: c.id })
                )}
              >
                <div className="flex items-start gap-1.5">
                  <span
                    className={cn("mt-[3px] h-2 w-2 shrink-0 rounded-full", STYLE_STATUT[statut].dot)}
                  />
                  <h4 className="line-clamp-2 flex-1 text-[13px] font-bold leading-tight text-ink">
                    {c.nom}
                  </h4>
                </div>
                <div className="mt-1.5 flex h-[42px] flex-wrap content-start gap-1 overflow-hidden">
                  {c.notions.slice(0, 3).map((n, i) => (
                    <span
                      key={`${c.id}-${i}`}
                      title={`${n.nom} · ${n.maitrisePct != null ? `${n.maitrisePct} %` : "non évaluée"}${n.estimee ? " (estimé bulletin)" : ""}`}
                      className={cn(
                        "max-w-full truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1",
                        STYLE_STATUT[n.statut].chip
                      )}
                    >
                      {n.nom}
                    </span>
                  ))}
                  {c.notions.length > 3 ? (
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                      +{c.notions.length - 3}
                    </span>
                  ) : null}
                </div>
                <div className="mt-auto flex items-center gap-1.5">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full", STYLE_STATUT[statut].barre)}
                      style={{ width: `${c.maitrisePct ?? 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {c.maitrisePct != null ? `${c.maitrisePct} %` : "—"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Légende ── */}
      <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-white/80 px-3 py-2 ring-1 ring-slate-200/70 backdrop-blur">
        {LEGENDE.map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <span className={cn("h-2 w-2 rounded-full", STYLE_STATUT[s].dot)} />
            {STATUT_NOTION_LABEL[s]}
          </span>
        ))}
      </div>

      {/* ── Contrôles de zoom ── */}
      <div className="absolute top-3 right-3 flex gap-1 rounded-xl bg-white/80 p-1 ring-1 ring-slate-200/70 backdrop-blur">
        <button
          onClick={() => zoomer(1.25)}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink"
          aria-label="Zoomer"
        >
          <Plus size={15} />
        </button>
        <button
          onClick={() => zoomer(0.8)}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink"
          aria-label="Dézoomer"
        >
          <Minus size={15} />
        </button>
        <button
          onClick={ajuster}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink"
          aria-label="Ajuster la vue"
        >
          <Maximize size={15} />
        </button>
      </div>

      {/* ── Aide ── */}
      <p className="pointer-events-none absolute right-3 bottom-3 rounded-lg bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 ring-1 ring-slate-200/70 backdrop-blur">
        Glissez le fond pour naviguer · molette pour zoomer · déplacez les arbres et les chapitres
      </p>

      {/* ── Panneau de détail du chapitre sélectionné ── */}
      {selectionChap ? (
        <div className="glass-strong absolute bottom-4 left-4 z-10 max-h-[70%] w-[340px] max-w-[calc(100%-2rem)] overflow-y-auto p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                {selection?.matiere}
              </p>
              <h4 className="mt-0.5 font-bold text-ink">{selectionChap.nom}</h4>
            </div>
            <button
              onClick={() => setSelection(null)}
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink"
              aria-label="Fermer le détail"
            >
              <X size={15} />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1",
                STYLE_STATUT[selectionChap.statut].chip
              )}
            >
              Chapitre {STATUT_NOTION_LABEL[selectionChap.statut].toLowerCase()}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Maîtrise moyenne :{" "}
              {selectionChap.maitrisePct != null ? `${selectionChap.maitrisePct} %` : "—"}
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {selectionChap.notions.map((n, i) => (
              <NotionDetail
                key={i}
                n={n}
                ouvert={selection?.notionIndex === i}
                onBasculer={() =>
                  setSelection((s) =>
                    s && s.chapitreId === selectionChap.id
                      ? s.notionIndex === i
                        ? { ...s, notionIndex: undefined }
                        : { ...s, notionIndex: i }
                      : s
                  )
                }
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Ligne de notion du panneau : statut, maîtrise, détail au clic */
function NotionDetail({
  n,
  ouvert,
  onBasculer,
}: {
  n: NotionDiagnostic;
  ouvert: boolean;
  onBasculer: () => void;
}) {
  return (
    <li className="rounded-xl bg-slate-50 ring-1 ring-slate-200/70">
      <button
        onClick={onBasculer}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
        aria-expanded={ouvert}
      >
        <span className={cn("h-2 w-2 shrink-0 rounded-full", STYLE_STATUT[n.statut].dot)} />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">
          {n.nom}
        </span>
        {n.severite ? <BadgeSeverite severite={n.severite} /> : null}
        <span className="shrink-0 text-xs font-bold text-slate-400">
          {n.maitrisePct != null ? `${n.maitrisePct} %` : "—"}
        </span>
      </button>
      {ouvert ? (
        <div className="space-y-2 px-3 pb-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/70">
            <div
              className={cn("h-full rounded-full", STYLE_STATUT[n.statut].barre)}
              style={{ width: `${n.maitrisePct ?? 0}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {STATUT_NOTION_LABEL[n.statut]}
            {n.estimee
              ? " · maîtrise estimée d'après le bulletin (pas encore testée)"
              : n.confirmeOral
                ? " · confirmée à l'oral par l'apprenant"
                : ""}
          </p>
          {n.pointsCles?.slice(0, 2).map((p, i) => (
            <p key={i} className="text-xs leading-snug text-slate-600">
              · {p}
            </p>
          ))}
          {n.piege ? (
            <p className="rounded-lg bg-rose-50/70 px-2.5 py-2 text-xs leading-snug text-rose-700 ring-1 ring-rose-100">
              <MessageSquare size={11} className="mr-1 inline" />
              Piège : {n.piege}
            </p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
