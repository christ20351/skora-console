import { createSign } from "node:crypto";

/**
 * Synchronisation Google Calendar (côté serveur uniquement).
 *
 * Sans configuration (variables d'environnement absentes), la console reste
 * en « mode démo » : les déplacements sont conservés localement et la
 * synchronisation est simulée.
 *
 * Configuration attendue :
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL — e-mail du compte de service
 *   GOOGLE_PRIVATE_KEY           — clé privée PEM (\n échappés acceptés)
 *   GOOGLE_CALENDAR_ID           — agenda partagé avec le compte de service
 *   GOOGLE_IMPERSONATE_SUBJECT   — (optionnel) utilisateur à incarner (Workspace)
 *   GOOGLE_TIMEZONE              — (optionnel, défaut Africa/Abidjan)
 */

export interface ConfigGoogle {
  actif: boolean;
  email: string;
  clePrivee: string;
  agendaId: string;
  impersonate?: string;
  timezone: string;
}

export function configGoogle(): ConfigGoogle {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "";
  const cle = (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  const agendaId = process.env.GOOGLE_CALENDAR_ID ?? "";
  return {
    actif: Boolean(email && cle && agendaId),
    email,
    clePrivee: cle,
    agendaId,
    impersonate: process.env.GOOGLE_IMPERSONATE_SUBJECT || undefined,
    timezone: process.env.GOOGLE_TIMEZONE || "Africa/Abidjan",
  };
}

export function etatSynchronisation() {
  const c = configGoogle();
  return { mode: c.actif ? ("google" as const) : ("demo" as const), agenda: c.actif ? c.agendaId : null };
}

/* ── Jeton d'accès (JWT RS256 → OAuth2) ──────────────────────────────── */

let jeton: { valeur: string; expireLe: number } | null = null;

async function jetonAcces(cfg: ConfigGoogle): Promise<string> {
  const maintenant = Math.floor(Date.now() / 1000);
  if (jeton && jeton.expireLe - 60 > maintenant) return jeton.valeur;

  const entete = { alg: "RS256", typ: "JWT" };
  const revendications = {
    iss: cfg.email,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    exp: maintenant + 3600,
    iat: maintenant,
    ...(cfg.impersonate ? { sub: cfg.impersonate } : {}),
  };
  const b64 = (o: object) =>
    Buffer.from(JSON.stringify(o)).toString("base64url");
  const aSigner = `${b64(entete)}.${b64(revendications)}`;
  const signature = createSign("RSA-SHA256").update(aSigner).sign(cfg.clePrivee, "base64url");
  const assertion = `${aSigner}.${signature}`;

  const rep = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!rep.ok) {
    throw new Error(`Jeton Google refusé (${rep.status}) : ${await rep.text()}`);
  }
  const json = (await rep.json()) as { access_token: string; expires_in: number };
  jeton = { valeur: json.access_token, expireLe: maintenant + json.expires_in };
  return jeton.valeur;
}

/* ── Mise à jour d'un événement ──────────────────────────────────────── */

export interface MajEvenement {
  /** "YYYY-MM-DD" — heure de début, interprétée dans le fuseau de l'agenda */
  date?: string;
  /** "HH:mm" */
  heure?: string;
  dureeMin?: number;
  /** personne assignée, stockée dans les propriétés privées de l'événement */
  assigneA?: string;
}

/**
 * Met à jour l'événement Google Calendar correspondant à un rendez-vous.
 * `dateTime` est envoyé sans décalage : Google l'interprète dans `timeZone`.
 */
export async function modifierEvenement(
  eventId: string,
  maj: MajEvenement
): Promise<{ ok: boolean; erreur?: string }> {
  const cfg = configGoogle();
  if (!cfg.actif) return { ok: false, erreur: "Google Calendar non configuré" };

  try {
    const corps: Record<string, unknown> = {};
    if (maj.date && maj.heure) {
      const duree = maj.dureeMin ?? 30;
      const debutMinutes = Number(maj.heure.slice(0, 2)) * 60 + Number(maj.heure.slice(3, 5));
      const finH = Math.floor((debutMinutes + duree) / 60);
      const finM = (debutMinutes + duree) % 60;
      const p2 = (n: number) => String(n).padStart(2, "0");
      corps.start = { dateTime: `${maj.date}T${maj.heure}:00`, timeZone: cfg.timezone };
      corps.end = {
        dateTime: `${maj.date}T${p2(finH)}:${p2(finM)}:00`,
        timeZone: cfg.timezone,
      };
    }
    if (maj.assigneA !== undefined) {
      corps.extendedProperties = { private: { skoraAssignee: maj.assigneA } };
    }
    if (Object.keys(corps).length === 0) return { ok: true };

    const jeton_ = await jetonAcces(cfg);
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      cfg.agendaId
    )}/events/${encodeURIComponent(eventId)}`;
    const rep = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${jeton_}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(corps),
    });
    if (!rep.ok) {
      return { ok: false, erreur: `Google Calendar a répondu ${rep.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, erreur: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}
