"use client";

import "@/components/chart-setup";
import { Bar, Scatter } from "react-chartjs-2";
import type { MarketProperty } from "@/lib/api";

interface MarketChartsProps {
  properties: MarketProperty[];
}

// ── Common dark theme chart options ──────────────────────────────────────

const chartContainerClass =
  "rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-5 animate-fade-in";

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
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
    x: {
      grid: { color: "rgba(28, 40, 68, 0.4)" },
      ticks: { color: "#64748b" },
      border: { display: false },
    },
    y: {
      grid: { color: "rgba(28, 40, 68, 0.4)" },
      ticks: { color: "#64748b" },
      border: { display: false },
    },
  },
} as const;

// ── 1. Price Distribution Bar Chart ──────────────────────────────────────

function PriceDistributionChart({ properties }: { properties: MarketProperty[] }) {
  if (properties.length === 0) {
    return (
      <div className={`${chartContainerClass} h-80 flex items-center justify-center`}>
        <p className="text-slate-500 text-sm">暂无数据</p>
      </div>
    );
  }

  const prices = properties.map((p) => p.predictedPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Create 6 buckets
  const bucketCount = 6;
  const bucketSize = (maxPrice - minPrice) / bucketCount || 1;
  const buckets: number[] = new Array(bucketCount).fill(0);

  prices.forEach((price) => {
    let idx = Math.floor((price - minPrice) / bucketSize);
    if (idx >= bucketCount) idx = bucketCount - 1;
    buckets[idx]++;
  });

  const labels = buckets.map((_, i) => {
    const low = minPrice + i * bucketSize;
    const high = minPrice + (i + 1) * bucketSize;
    return `$${(low / 1000).toFixed(0)}k - $${(high / 1000).toFixed(0)}k`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "房产数量",
        data: buckets,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: (ctx: { parsed: { y: number | null } }) =>
            `数量: ${ctx.parsed.y ?? 0}`,
        },
      },
    },
  };

  return (
    <div className={chartContainerClass} style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
      <h3 className="text-sm font-semibold text-slate-300 mb-4">价格分布</h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

// ── 2. Average Price by Bedroom Count ────────────────────────────────────

function AvgPriceByBedroomsChart({ properties }: { properties: MarketProperty[] }) {
  if (properties.length === 0) {
    return (
      <div className={`${chartContainerClass} h-80 flex items-center justify-center`}>
        <p className="text-slate-500 text-sm">暂无数据</p>
      </div>
    );
  }

  // Group by bedroom count and compute average price
  const groups = new Map<number, { total: number; count: number }>();
  properties.forEach((p) => {
    const existing = groups.get(p.bedrooms);
    if (existing) {
      existing.total += p.predictedPrice;
      existing.count += 1;
    } else {
      groups.set(p.bedrooms, { total: p.predictedPrice, count: 1 });
    }
  });

  const sorted = Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
  const labels = sorted.map(([beds]) => `${beds} 卧`);
  const avgPrices = sorted.map(([, data]) => data.total / data.count);

  const data = {
    labels,
    datasets: [
      {
        label: "平均价格",
        data: avgPrices,
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: (ctx: { parsed: { y: number | null } }) => {
            const val = ctx.parsed.y ?? 0;
            return `平均价格: $${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
          },
        },
      },
    },
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        ticks: {
          ...commonOptions.scales.y.ticks,
          callback: (value: number | string) =>
            `$${(Number(value) / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <div className={chartContainerClass} style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
      <h3 className="text-sm font-semibold text-slate-300 mb-4">按卧室数量平均价格</h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

// ── 3. Price vs Area Scatter Plot ────────────────────────────────────────

function PriceVsAreaChart({ properties }: { properties: MarketProperty[] }) {
  if (properties.length === 0) {
    return (
      <div className={`${chartContainerClass} h-80 flex items-center justify-center`}>
        <p className="text-slate-500 text-sm">暂无数据</p>
      </div>
    );
  }

  const points = properties.map((p) => ({
    x: p.squareFootage,
    y: p.predictedPrice,
  }));

  const data = {
    datasets: [
      {
        label: "房产",
        data: points,
        backgroundColor: "rgba(6, 182, 212, 0.6)",
        borderColor: "rgba(6, 182, 212, 0.8)",
        borderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: (ctx: { raw: { x: number; y: number } | unknown }) => {
            const raw = ctx.raw as { x: number; y: number };
            return `面积: ${raw.x.toLocaleString()} sq ft, 价格: $${raw.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        ...commonOptions.scales.x,
        title: {
          display: true,
          text: "面积 (sq ft)",
          color: "#64748b",
          font: { size: 12 },
        },
        ticks: {
          ...commonOptions.scales.x.ticks,
          callback: (value: number | string) =>
            `${(Number(value) / 1000).toFixed(0)}k`,
        },
      },
      y: {
        ...commonOptions.scales.y,
        title: {
          display: true,
          text: "预测价格",
          color: "#64748b",
          font: { size: 12 },
        },
        ticks: {
          ...commonOptions.scales.y.ticks,
          callback: (value: number | string) =>
            `$${(Number(value) / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <div className={chartContainerClass} style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
      <h3 className="text-sm font-semibold text-slate-300 mb-4">价格 vs 面积</h3>
      <div className="h-64">
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
}

// ── Exported MarketCharts Component ──────────────────────────────────────

export default function MarketCharts({ properties }: MarketChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PriceDistributionChart properties={properties} />
      <AvgPriceByBedroomsChart properties={properties} />
      <div className="lg:col-span-2">
        <PriceVsAreaChart properties={properties} />
      </div>
    </div>
  );
}
