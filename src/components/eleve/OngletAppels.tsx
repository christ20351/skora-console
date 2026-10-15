"use client";

import { useState } from "react";
import { CalendarPlus, PhoneCall } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TYPE_APPEL_LABEL } from "@/types";
import type { TypeAppel } from "@/types";
import { useStore } from "@/store";
import { Bouton, Card, CardHeader, EmptyState, Modal } from "@/components/ui";
import { AppelCard } from "@/components/appels/AppelCard";

/** Onglet Appels : historique structuré + planification */
export function OngletAppels({ eleveId }: { eleveId: string }) {
  const { appels } = useStore();
  const [planifier, setPlanifier] = useState(false);
  const miens = appels
    .filter((a) => a.eleveId === eleveId)
    .sort((a, b) => b.date.localeCompare(a.date));
  const aVenir = miens.filter((a) => a.statut === "planifie");
  const passes = miens.filter((a) => a.statut === "effectue");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Appels d'accompagnement"
          subtitle="Comprendre avec du contexte pourquoi l'élève bute — et ce qu'il déclare lui-même"
          icon={<PhoneCall size={17} />}
          action={
            <Bouton taille="sm" onClick={() => setPlanifier(true)}>
              <CalendarPlus size={14} /> Planifier un appel
            </Bouton>
          }
        />
        {passes.length === 0 ? (
          <EmptyState
            titre="Aucun appel réalisé"
            description="L'appel de cadrage fait le lien entre les stats des tests et la réalité de l'élève."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {passes.map((a) => (
              <AppelCard key={a.id} appel={a} />
            ))}
          </div>
        )}
      </Card>

      {aVenir.length > 0 ? (
        <Card className="border-dashed">
          <CardHeader title="Appels planifiés" icon={<CalendarPlus size={17} />} />
          <div className="divide-y divide-slate-100">
            {aVenir.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">
                  {formatDate(a.date)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-700">{a.motif}</p>
                  <p className="text-xs text-slate-400">
                    {TYPE_APPEL_LABEL[a.type]} · avec {a.animateur}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <PlanifierModal ouvert={planifier} onClose={() => setPlanifier(false)} eleveId={eleveId} />
    </div>
  );
}

function PlanifierModal({
  ouvert,
  onClose,
  eleveId,
}: {
  ouvert: boolean;
  onClose: () => void;
  eleveId: string;
}) {
  const { planifierAppel, utilisateurs } = useStore();
  const [date, setDate] = useState("");
  const [type, setType] = useState<TypeAppel>("suivi-renfort");
  const [motif, setMotif] = useState("");
  const [animateur, setAnimateur] = useState(utilisateurs[0]?.nom ?? "");

  const valider = () => {
    if (!date || !motif.trim()) return;
    planifierAppel({ eleveId, date, type, motif: motif.trim(), animateur });
    setDate("");
    setMotif("");
    onClose();
  };

  return (
    <Modal ouvert={ouvert} onClose={onClose}>
      <div className="space-y-4 p-6">
        <h3 className="font-bold text-slate-900">Planifier un appel</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TypeAppel)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
            >
              {Object.entries(TYPE_APPEL_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Animateur</label>
          <select
            value={animateur}
            onChange={(e) => setAnimateur(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
          >
            {utilisateurs.map((u) => (
              <option key={u.id}>{u.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Motif</label>
          <textarea
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            rows={2}
            placeholder="Ex. : faire le point sur la fiche de renfort…"
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Bouton variant="secondaire" onClick={onClose}>
            Annuler
          </Bouton>
          <Bouton onClick={valider} disabled={!date || !motif.trim()}>
            Planifier
          </Bouton>
        </div>
      </div>
    </Modal>
  );
}
