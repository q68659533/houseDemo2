"use client";

import type { MarketStats } from "@/lib/api";

interface KpiCardsProps {
  stats: MarketStats;
  loading?: boolean;
}

const kpiConfig: {
  key: keyof MarketStats;
  label: string;
  format: (v: number) => string;
  gradient: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "averagePrice",
    label: "平均价格",
    format: (v) => `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
    gradient: "from-ac-blue to-ac-cyan",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "medianPrice",
    label: "中位价格",
    format: (v) => `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
    gradient: "from-ac-purple to-ac-blue",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    key: "count",
    label: "房产数量",
    format: (v) => v.toLocaleString("en-US"),
    gradient: "from-ac-green to-ac-cyan",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    key: "pricePerSqft",
    label: "每平方英尺价格",
    format: (v) => `$${v.toFixed(2)}`,
    gradient: "from-ac-amber to-ac-rose",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
  },
];

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-6 animate-pulse"
        >
          <div className="h-1 w-16 rounded-full bg-dk-500 mb-4" />
          <div className="h-8 w-32 rounded bg-dk-500/50 mb-2" />
          <div className="h-4 w-20 rounded bg-dk-500/30" />
        </div>
      ))}
    </div>
  );
}

export default function KpiCards({ stats, loading }: KpiCardsProps) {
  if (loading) {
    return <KpiSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiConfig.map((kpi) => {
        const value = stats[kpi.key];
        return (
          <div
            key={kpi.key}
            className="rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm overflow-hidden animate-fade-in-up"
            style={{ animationFillMode: "both" }}
          >
            <div className={`h-1 bg-gradient-to-r ${kpi.gradient}`} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">{kpi.label}</span>
                <span className="text-slate-500">{kpi.icon}</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {kpi.format(value as number)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
