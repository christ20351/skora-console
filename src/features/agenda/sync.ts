/** Synchronisation agenda ↔ Google Calendar (côté client, via les routes API) */

export type ModeSync = "google" | "demo";

export interface EtatSync {
  mode: ModeSync;
  /** id de l'agenda connecté (mode réel) */
  agenda: string | null;
}

export interface ResultatSync {
  ok: boolean;
  mode: ModeSync;
  erreur?: string;
}

export async function verifierSynchronisation(): Promise<EtatSync> {
  try {
    const rep = await fetch("/api/agenda/status", { cache: "no-store" });
    if (rep.ok) return (await rep.json()) as EtatSync;
  } catch {
    /* route indisponible → démo */
  }
  return { mode: "demo", agenda: null };
}

export async function synchroniserMeet(
  id: string,
  maj: { date?: string; heure?: string; dureeMin?: number; assigneA?: string }
): Promise<ResultatSync> {
  try {
    const rep = await fetch(`/api/agenda/events/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maj),
    });
    const json = (await rep.json()) as ResultatSync;
    return json;
  } catch {
    return { ok: false, mode: "demo", erreur: "Route de synchronisation injoignable" };
  }
}
