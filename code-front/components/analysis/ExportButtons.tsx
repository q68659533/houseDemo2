"use client";

import type { MarketProperty } from "@/lib/api";
import { downloadCsv, printPdf } from "@/lib/export";

interface ExportButtonsProps {
  properties: MarketProperty[];
}

export default function ExportButtons({ properties }: ExportButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => downloadCsv(properties)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dk-500/50 bg-transparent px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white hover:border-ac-blue/50 hover:bg-ac-blue/5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        导出 CSV
      </button>
      <button
        onClick={() => printPdf(properties)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dk-500/50 bg-transparent px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white hover:border-ac-blue/50 hover:bg-ac-blue/5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        导出 PDF
      </button>
    </div>
  );
}
