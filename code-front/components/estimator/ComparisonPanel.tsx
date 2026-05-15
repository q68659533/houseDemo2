"use client";

import "@/components/chart-setup";
import { Radar } from "react-chartjs-2";
import type { HistoryEntry } from "@/lib/history";

interface ComparisonPanelProps {
  entries: HistoryEntry[];
}

const featureLabels: Record<string, string> = {
  square_footage: "建筑面积",
  bedrooms: "卧室",
  bathrooms: "卫生间",
  year_built: "建造年份",
  lot_size: "地块面积",
  distance_to_city_center: "距市中心",
  school_rating: "学区评分",
};

const featureRanges: Record<string, [number, number]> = {
  square_footage: [100, 50000],
  bedrooms: [0, 20],
  bathrooms: [0, 20],
  year_built: [1800, 2100],
  lot_size: [0, 1000000],
  distance_to_city_center: [0, 200],
  school_rating: [1, 10],
};

const featureKeys = [
  "square_footage",
  "bedrooms",
  "bathrooms",
  "year_built",
  "lot_size",
  "distance_to_city_center",
  "school_rating",
];

const colors = [
  { border: "rgba(59, 130, 246, 1)", bg: "rgba(59, 130, 246, 0.15)" },
  { border: "rgba(6, 182, 212, 1)", bg: "rgba(6, 182, 212, 0.15)" },
  { border: "rgba(139, 92, 246, 1)", bg: "rgba(139, 92, 246, 0.15)" },
];

function normalize(value: number, [min, max]: [number, number]): number {
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

export function ComparisonPanel({ entries }: ComparisonPanelProps) {
  const radarData = {
    labels: featureKeys.map((k) => featureLabels[k]),
    datasets: entries.map((entry, i) => {
      const color = colors[i % colors.length];
      return {
        label: `房产 #${i + 1} ($${entry.prediction.toLocaleString()})`,
        data: featureKeys.map((k) =>
          normalize(
            entry.features[k as keyof typeof entry.features],
            featureRanges[k]
          )
        ),
        borderColor: color.border,
        backgroundColor: color.bg,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: color.border,
      };
    }),
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#94a3b8", padding: 16 },
      },
      tooltip: {
        backgroundColor: "rgba(7, 11, 20, 0.95)",
        titleColor: "#94a3b8",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(28, 40, 68, 1)",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      r: {
        grid: { color: "rgba(28, 40, 68, 0.4)" },
        angleLines: { color: "rgba(28, 40, 68, 0.4)" },
        pointLabels: { color: "#94a3b8", font: { size: 12 } },
        ticks: { display: false, backdropColor: "transparent" },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div
      className="rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-6 sm:p-8 animate-fade-in"
      style={{ animationDelay: "0.1s", animationFillMode: "both" }}
    >
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-ac-purple"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        房产对比
        <span className="ml-1.5 px-2 py-0.5 rounded-full bg-dk-700/60 text-xs text-slate-400 font-normal">
          {entries.length} 项
        </span>
      </h2>

      {/* Comparison Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dk-500/40">
              <th className="text-left py-3 px-3 text-slate-500 font-medium whitespace-nowrap">
                特征
              </th>
              {entries.map((entry, i) => (
                <th
                  key={entry.id}
                  className="text-right py-3 px-3 font-semibold whitespace-nowrap"
                  style={{ color: colors[i % colors.length].border }}
                >
                  房产 #{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-dk-500/30 bg-dk-900/30">
              <td className="py-3 px-3 text-slate-400 font-medium whitespace-nowrap">
                预测价格
              </td>
              {entries.map((entry, i) => (
                <td
                  key={entry.id}
                  className="text-right py-3 px-3 font-bold whitespace-nowrap"
                  style={{ color: colors[i % colors.length].border }}
                >
                  ${entry.prediction.toLocaleString()}
                </td>
              ))}
            </tr>
            {featureKeys.map((key) => (
              <tr key={key} className="border-b border-dk-500/20">
                <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                  {featureLabels[key]}
                </td>
                {entries.map((entry) => (
                  <td
                    key={entry.id}
                    className="text-right py-3 px-3 text-slate-300 whitespace-nowrap"
                  >
                    {entry.features[
                      key as keyof typeof entry.features
                    ].toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Radar Chart */}
      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-4 text-center">
          特征归一化对比（0-100 标准化）
        </h3>
        <div className="h-80">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>
    </div>
  );
}
