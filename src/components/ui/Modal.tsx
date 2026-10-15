"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

export function Modal({
  ouvert,
  onClose,
  children,
  large,
}: {
  ouvert: boolean;
  onClose: () => void;
  children: ReactNode;
  large?: boolean;
}) {
  useEffect(() => {
    if (!ouvert) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [ouvert, onClose]);

  return (
    <AnimatePresence>
      {ouvert ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={`relative max-h-[88vh] w-full overflow-y-auto rounded-3xl border border-slate-200/70 bg-white shadow-2xl ${
              large ? "max-w-3xl" : "max-w-lg"
            }`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-xl bg-white p-1.5 text-slate-400 ring-1 ring-slate-200/70 transition-colors hover:text-slate-700 print:hidden"
              aria-label="Fermer"
            >
              <X size={17} />
            </button>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
