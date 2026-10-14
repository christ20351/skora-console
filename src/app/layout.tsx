import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { instrumentSans } from "@/lib/fonts";
import { StoreProvider } from "@/store";

export const metadata: Metadata = {
  title: "Skora — Console d'accompagnement pédagogique",
  description:
    "Visualiser les lacunes de chaque élève, les comprendre, et leur offrir un renfort personnalisé.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${instrumentSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
