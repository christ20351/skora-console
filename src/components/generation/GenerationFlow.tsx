"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Brain,
  Check,
  GraduationCap,
  Loader2,
  PenLine,
  Sparkles,
} from "lucide-react";
import { notionParId } from "@/data/notions";
import { genererContenu, libelleCalibrage } from "@/features/contenu/generation";
import { useStore } from "@/store";
import { Bouton, Modal } from "@/components/ui";
import { ContenuFiche } from "./ContenuFiche";
import type { ContenuGenere, Niveau } from "@/types";

const ETAPES = [
  { Icon: Brain, texte: "Lecture du profil : bulletin, tests, contexte des appels" },
  { Icon: Sparkles, texte: "Analyse de la lacune et de son niveau d'échec" },
  { Icon: GraduationCap, texte: "Calibrage des exercices sur le niveau détecté" },
  { Icon: PenLine, texte: "Rédaction de la fiche de renfort" },
  { Icon: BadgeCheck, texte: "Vérification pédagogique" },
];

/** Animation de génération IA puis affichage de la fiche produite */
export function GenerationFlow({
  ouvert,
  onClose,
  eleveId,
  notionId,
  niveauEchec,
  contexteUtilise,
  lacuneId,
}: {
  ouvert: boolean;
  onClose: () => void;
  eleveId: string;
  notionId: string;
  niveauEchec: Niveau;
  contexteUtilise?: string;
  lacuneId?: string;
}) {
  const { ajouterContenu } = useStore();
  const [etape, setEtape] = useState(0);
  const [contenu, setContenu] = useState<ContenuGenere | null>(null);
  const notion = notionParId(notionId);

  useEffect(() => {
    if (!ouvert) {
      setEtape(0);
      setContenu(null);
      return;
    }
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setEtape(i);
      if (i >= ETAPES.length) {
        clearInterval(timer);
        const c = genererContenu({ eleveId, notionId, lacuneId, niveauEchec, contexteUtilise });
        ajouterContenu(c);
        setContenu(c);
      }
    }, 700);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouvert]);

  if (contenu) {
    return (
      <Modal ouvert={ouvert} onClose={onClose} large>
        <div>
          <div className="flex items-center gap-2 border-b border-slate-100 bg-emerald-50/70 px-6 py-3">
            <BadgeCheck size={17} className="text-emerald-500" />
            <p className="text-sm font-semibold text-emerald-700">
              Fiche générée et ajoutée au suivi — la lacune passe « en renfort »
            </p>
          </div>
          <ContenuFiche contenu={contenu} />
          <div className="flex justify-end border-t border-slate-100 px-6 py-4">
            <Bouton onClick={onClose}>Terminé</Bouton>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal ouvert={ouvert} onClose={onClose}>
      <div className="p-8">
        <div className="mb-6 text-center">
          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white">
            <Sparkles size={26} />
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="animate-horizontal-scan absolute inset-y-0 w-1/3 bg-white/30 blur-md" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Génération du contenu personnalisé</h3>
          <p className="mt-1 text-sm text-slate-500">
            {notion.nom} · {libelleCalibrage(niveauEchec)}
          </p>
        </div>

        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${(Math.min(etape, ETAPES.length) / ETAPES.length) * 100}%` }}
          />
        </div>

        <ul className="space-y-3">
          {ETAPES.map((e, i) => {
            const fait = etape > i;
            const enCours = etape === i;
            return (
              <li
                key={i}
                className={`flex items-center gap-3 text-sm ${
                  fait ? "text-slate-800" : enCours ? "text-slate-700" : "text-slate-300"
                }`}
              >
                {fait ? (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check size={14} />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    {enCours ? (
                      <Loader2 size={13} className="animate-spin text-brand-500" />
                    ) : (
                      <e.Icon size={13} />
                    )}
                  </span>
                )}
                {e.texte}
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
