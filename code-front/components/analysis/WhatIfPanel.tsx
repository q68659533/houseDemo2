"use client";

import { useState, useRef, useCallback } from "react";
import { Line } from "react-chartjs-2";
import "@/components/chart-setup";
import {
  fetchWhatIf,
  type WhatIfResponse,
  type WhatIfParameter,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ParameterConfig {
  key: WhatIfParameter;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultStart: number;
  defaultEnd: number;
}

const PARAMETERS: ParameterConfig[] = [
  {
    key: "squareFootage",
    label: "面积",
    unit: "sq ft",
    min: 100,
    max: 50000,
    step: 100,
    defaultStart: 800,
    defaultEnd: 4000,
  },
  {
    key: "bedrooms",
    label: "卧室数量",
    unit: "间",
    min: 0,
    max: 20,
    step: 1,
    defaultStart: 1,
    defaultEnd: 6,
  },
  {
    key: "bathrooms",
    label: "卫生间数量",
    unit: "间",
    min: 0,
    max: 20,
    step: 1,
    defaultStart: 1,
    defaultEnd: 5,
  },
  {
    key: "yearBuilt",
    label: "建造年份",
    unit: "年",
    min: 1800,
    max: 2100,
    step: 1,
    defaultStart: 1950,
    defaultEnd: 2024,
  },
  {
    key: "lotSize",
    label: "地块大小",
    unit: "sq ft",
    min: 100,
    max: 500000,
    step: 100,
    defaultStart: 2000,
    defaultEnd: 15000,
  },
  {
    key: "distanceToCityCenter",
    label: "距市中心距离",
    unit: "英里",
    min: 0,
    max: 100,
    step: 0.5,
    defaultStart: 0.5,
    defaultEnd: 25,
  },
  {
    key: "schoolRating",
    label: "学校评分",
    unit: "分",
    min: 1,
    max: 10,
    step: 1,
    defaultStart: 1,
    defaultEnd: 10,
  },
];

const DEFAULT_PARAM: WhatIfParameter = "squareFootage";

function getDefaultConfig(key: WhatIfParameter): ParameterConfig {
  return PARAMETERS.find((p) => p.key === key) || PARAMETERS[0];
}

function formatPrice(value: number): string {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

// ── Chart Options ──────────────────────────────────────────────────────────

const chartOptions = {
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
      displayColors: false,
      callbacks: {
        title: (items: { label: string }[]) => `参数值: ${items[0]?.label ?? ""}`,
        label: (ctx: { parsed: { y: number | null } }) =>
          `预测价格: ${formatPrice(ctx.parsed.y ?? 0)}`,
      },
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
      ticks: {
        color: "#64748b",
        callback: (value: number | string) =>
          `$${(Number(value) / 1000).toFixed(0)}k`,
      },
      border: { display: false },
    },
  },
} as const;

// ── WhatIfPanel Component ──────────────────────────────────────────────────

export default function WhatIfPanel() {
  const [parameter, setParameter] = useState<WhatIfParameter>(DEFAULT_PARAM);
  const config = getDefaultConfig(parameter);

  const [startValue, setStartValue] = useState(String(config.defaultStart));
  const [endValue, setEndValue] = useState(String(config.defaultEnd));

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhatIfResponse | null>(null);
  const { addToast } = useToast();

  // Track previous parameter to reset defaults when it changes
  const prevParamRef = useRef<WhatIfParameter>(DEFAULT_PARAM);

  const handleParamChange = useCallback(
    (newParam: WhatIfParameter) => {
      setParameter(newParam);
      const newConfig = getDefaultConfig(newParam);
      setStartValue(String(newConfig.defaultStart));
      setEndValue(String(newConfig.defaultEnd));
      setResult(null);
      prevParamRef.current = newParam;
    },
    []
  );

  const handleRun = useCallback(async () => {
    const start = Number(startValue);
    const end = Number(endValue);

    if (Number.isNaN(start) || Number.isNaN(end)) {
      addToast("请输入有效的起始值和结束值", "error");
      return;
    }

    if (start >= end) {
      addToast("起始值必须小于结束值", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchWhatIf(parameter, start, end, 20);
      setResult(data);
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "假设分析请求失败",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [parameter, startValue, endValue, addToast]);

  // Build chart data
  const chartData = result
    ? {
        labels: result.points.map((p) =>
          parameter === "distanceToCityCenter"
            ? p.parameterValue.toFixed(1)
            : String(Math.round(p.parameterValue))
        ),
        datasets: [
          {
            label: "预测价格",
            data: result.points.map((p) => p.predictedPrice),
            borderColor: "rgba(59, 130, 246, 1)",
            backgroundColor: (ctx: {
              chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } };
            }) => {
              const chart = ctx.chart;
              const { ctx: canvasCtx, chartArea } = chart;
              if (!chartArea) return "rgba(59, 130, 246, 0.1)";
              const gradient = canvasCtx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
              );
              gradient.addColorStop(0, "rgba(59, 130, 246, 0.4)");
              gradient.addColorStop(1, "rgba(59, 130, 246, 0.02)");
              return gradient;
            },
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            pointBorderColor: "rgba(7, 11, 20, 1)",
            pointBorderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  return (
    <div
      className="rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-5 animate-fade-in"
      style={{ animationFillMode: "both" }}
    >
      <h2 className="text-sm font-semibold text-slate-300 mb-4">假设分析</h2>
      <p className="text-xs text-slate-500 mb-5">
        选择一个参数，调整其范围，查看对预测价格的影响。
      </p>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        {/* Parameter Dropdown */}
        <div className="space-y-1.5 min-w-[160px]">
          <label className="block text-xs font-medium text-slate-400">分析参数</label>
          <select
            value={parameter}
            onChange={(e) => handleParamChange(e.target.value as WhatIfParameter)}
            className="w-full rounded-lg border border-dk-500/50 bg-dk-900/60 px-3 py-2 text-sm text-white transition-all outline-none focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20"
          >
            {PARAMETERS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Value */}
        <div className="space-y-1.5 min-w-[120px]">
          <label className="block text-xs font-medium text-slate-400">
            起始值
            <span className="text-slate-600 ml-1">({config.unit})</span>
          </label>
          <input
            type="number"
            value={startValue}
            onChange={(e) => setStartValue(e.target.value)}
            step={config.step}
            min={config.min}
            max={config.max}
            className="w-full rounded-lg border border-dk-500/50 bg-dk-900/60 px-3 py-2 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20"
          />
        </div>

        {/* End Value */}
        <div className="space-y-1.5 min-w-[120px]">
          <label className="block text-xs font-medium text-slate-400">
            结束值
            <span className="text-slate-600 ml-1">({config.unit})</span>
          </label>
          <input
            type="number"
            value={endValue}
            onChange={(e) => setEndValue(e.target.value)}
            step={config.step}
            min={config.min}
            max={config.max}
            className="w-full rounded-lg border border-dk-500/50 bg-dk-900/60 px-3 py-2 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20"
          />
        </div>

        {/* Run Button */}
        <div className="ml-auto">
          <button
            onClick={handleRun}
            disabled={loading}
            className="rounded-lg bg-gradient-to-r from-ac-blue to-ac-cyan px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-ac-blue/20 transition-all hover:shadow-ac-blue/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? "分析中..." : "运行分析"}
          </button>
        </div>
      </div>

      {/* Result Chart */}
      {chartData ? (
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center border border-dashed border-dk-500/30 rounded-xl bg-dk-900/20">
          <svg
            className="w-10 h-10 text-slate-600 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.147A11.948 11.948 0 0116.5 7.5"
            />
          </svg>
          <p className="text-slate-500 text-sm">
            设置参数范围并点击「运行分析」查看价格曲线
          </p>
        </div>
      )}
    </div>
  );
}
