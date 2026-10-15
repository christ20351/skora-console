import { etatSynchronisation, modifierEvenement } from "@/lib/google-calendar";
import type { MajEvenement } from "@/lib/google-calendar";

/**
 * Propage une replanification / réassignation vers Google Calendar.
 * Corps attendu : { date?, heure?, dureeMin?, assigneA? }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const maj = (await request.json()) as MajEvenement;
  const { mode } = etatSynchronisation();

  // Mode démo : rien à propager, la synchronisation est simulée avec succès
  if (mode === "demo") {
    return Response.json({ ok: true, mode });
  }

  const resultat = await modifierEvenement(id, maj);
  return Response.json(
    { ok: resultat.ok, mode, erreur: resultat.erreur },
    { status: resultat.ok ? 200 : 502 }
  );
}
