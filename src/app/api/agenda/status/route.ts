import { etatSynchronisation } from "@/lib/google-calendar";

/** État de la synchronisation Google Calendar (mode réel ou démo) */
export async function GET() {
  return Response.json(etatSynchronisation());
}
