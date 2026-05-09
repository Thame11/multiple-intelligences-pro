"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-brand-900"
    >
      <Printer className="h-4 w-4" /> طباعة التقرير
    </button>
  );
}
