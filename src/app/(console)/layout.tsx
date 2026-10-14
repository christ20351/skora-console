import { Suspense } from "react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
