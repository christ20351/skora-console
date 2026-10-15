"use client";

import { useState } from "react";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { MATIERES } from "@/types";
import type { BulletinLigne, Matiere } from "@/types";
import { useStore } from "@/store";
import { Bouton, Modal } from "@/components/ui";

const NIVEAUX = ["2nde", "1ère", "Tle"];
const inputCls =
  "w-full rounded-xl border-0 bg-white/70 px-3 py-2 text-sm outline-none ring-1 ring-white/80 focus:ring-2 focus:ring-brand-300/60";

/** Inscription d'un élève : identité + premier bulletin saisi à la main */
export function NouveauEleveModal({
  ouvert,
  onClose,
  onCree,
}: {
  ouvert: boolean;
  onClose: () => void;
  onCree?: (id: string) => void;
}) {
  const { ajouterEleve } = useStore();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState("2nde");
  const [ecole, setEcole] = useState("");
  const [age, setAge] = useState("");
  const [lignes, setLignes] = useState<BulletinLigne[]>([
    { matiere: "Mathématiques", note: 10, sur: 20 },
  ]);

  const majLigne = (i: number, patch: Partial<BulletinLigne>) =>
    setLignes((l) => l.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const valider = () => {
    if (!prenom.trim() || !nom.trim()) return;
    const eleve = ajouterEleve({
      prenom,
      nom,
      niveauScolaire: niveau,
      ecole: ecole || undefined,
      age: age ? Number(age) : undefined,
      lignes: lignes.filter((l) => l.note >= 0 && l.sur > 0),
    });
    setPrenom("");
    setNom("");
    setEcole("");
    setAge("");
    onClose();
    onCree?.(eleve.id);
  };

  return (
    <Modal ouvert={ouvert} onClose={onClose} large>
      <div className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="icon-tile">
            <UserPlus size={19} />
          </span>
          <div>
            <h3 className="text-lg font-bold text-ink">Inscrire un élève</h3>
            <p className="text-xs text-slate-500">
              On saisit son bulletin à la main — c'est ce qui déclenche la priorisation.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Champ label="Prénom *">
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} className={inputCls} placeholder="Aminata" />
          </Champ>
          <Champ label="Nom *">
            <input value={nom} onChange={(e) => setNom(e.target.value)} className={inputCls} placeholder="Diallo" />
          </Champ>
          <Champ label="Niveau">
            <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className={inputCls}>
              {NIVEAUX.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </Champ>
          <Champ label="École (informatif)">
            <input value={ecole} onChange={(e) => setEcole(e.target.value)} className={inputCls} placeholder="Lycée Moderne" />
          </Champ>
          <Champ label="Âge">
            <input type="number" min={10} max={30} value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} placeholder="17" />
          </Champ>
        </div>

        <p className="mt-5 mb-2 text-xs font-bold tracking-[0.12em] text-slate-400 uppercase">
          Bulletin — matières et notes
        </p>
        <div className="space-y-2">
          {lignes.map((l, i) => (
            <div key={i} className="glass-soft flex items-center gap-2 p-2">
              <select
                value={l.matiere}
                onChange={(e) => majLigne(i, { matiere: e.target.value as Matiere })}
                className="rounded-lg border-0 bg-white/70 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-300/50"
              >
                {MATIERES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  value={l.note}
                  onChange={(e) => majLigne(i, { note: Number(e.target.value) })}
                  className="w-16 rounded-lg border-0 bg-white/70 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-300/50"
                />
                <span className="text-xs text-slate-400">/</span>
                <input
                  type="number"
                  min={1}
                  value={l.sur}
                  onChange={(e) => majLigne(i, { sur: Number(e.target.value) || 20 })}
                  className="w-16 rounded-lg border-0 bg-white/70 px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-300/50"
                />
              </div>
              <button
                onClick={() => setLignes((x) => x.filter((_, j) => j !== i))}
                className="ml-auto rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-brand-400/10 hover:text-brand-500"
                aria-label="Retirer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setLignes((x) => [...x, { matiere: "Français", note: 10, sur: 20 }])}
          className="glass-soft mt-2 flex w-full items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white/75"
        >
          <Plus size={13} /> Ajouter une matière
        </button>

        <div className="mt-6 flex justify-end gap-2">
          <Bouton variant="secondaire" onClick={onClose}>
            Annuler
          </Bouton>
          <Bouton onClick={valider} disabled={!prenom.trim() || !nom.trim()}>
            <UserPlus size={15} /> Inscrire et prioriser
          </Bouton>
        </div>
      </div>
    </Modal>
  );
}

function Champ({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
  );
}
