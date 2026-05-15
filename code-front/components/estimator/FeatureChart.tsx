"use client";

import "@/components/chart-setup";
import { Bar } from "react-chartjs-2";

const featureLabels: Record<string, string> = {
  square_footage: "建筑面积",
  bedrooms: "卧室数量",
  bathrooms: "卫生间数量",
  year_built: "建造年份",
  lot_size: "地块面积",
  distance_to_city_center: "距市中心距离",
  school_rating: "学区评分",
};

interface FeatureChartProps {
  features: string[];
  coefficients: number[];
  featureValues: Record<string, number>;
}

function getFeatureValue(featureValues: Record<string, number>, name: string): number {
  return featureValues[name] ?? 0;
}

export function FeatureChart({ features, coefficients, featureValues }: FeatureChartProps) {
  const contributions = features.map((name, i) => {
    const coef = coefficients[i] ?? 0;
    const value = getFeatureValue(featureValues, name);
    return {
      name: featureLabels[name] || name,
      raw: coef * value,
      coef,
      value,
    };
  });

  const sorted = [...contributions].sort((a, b) => Math.abs(b.raw) - Math.abs(a.raw));

  const data = {
    labels: sorted.map((c) => c.name),
    datasets: [
      {
        label: "特征贡献",
        data: sorted.map((c) => c.raw),
        backgroundColor: sorted.map((c) =>
          c.raw >= 0 ? "rgba(59, 130, 246, 0.7)" : "rgba(244, 63, 94, 0.7)"
        ),
        borderColor: sorted.map((c) =>
          c.raw >= 0 ? "rgba(59, 130, 246, 1)" : "rgba(244, 63, 94, 1)"
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
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
        callbacks: {
          label: (ctx: { parsed: { x: number | null } }) => {
            const val = ctx.parsed.x ?? 0;
            return `贡献值: $${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(28, 40, 68, 0.4)" },
        ticks: {
          color: "#64748b",
          callback: (value: number | string) => `$${Number(value).toLocaleString()}`,
        },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#94a3b8" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="h-72">
      <Bar data={data} options={options} />
    </div>
  );
}
