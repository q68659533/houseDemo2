"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchMarketData,
  computeMarketStats,
  type MarketProperty,
  type MarketStats,
} from "@/lib/api";
import KpiCards from "@/components/analysis/KpiCards";
import FilterBar, { defaultFilters, type FilterState } from "@/components/analysis/FilterBar";
import MarketCharts from "@/components/analysis/MarketCharts";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from "@/components/ui/toast";

function filtersFromParams(params: URLSearchParams): FilterState {
  return {
    bedrooms: params.get("bedrooms") || "all",
    yearMin: params.get("yearMin") || "",
    yearMax: params.get("yearMax") || "",
    areaMin: params.get("areaMin") || "",
    areaMax: params.get("areaMax") || "",
  };
}

function paramsFromFilters(filters: FilterState): Record<string, string> {
  const out: Record<string, string> = {};
  if (filters.bedrooms !== "all") out.bedrooms = filters.bedrooms;
  if (filters.yearMin) out.yearMin = filters.yearMin;
  if (filters.yearMax) out.yearMax = filters.yearMax;
  if (filters.areaMin) out.areaMin = filters.areaMin;
  if (filters.areaMax) out.areaMax = filters.areaMax;
  return out;
}

function applyFilters(properties: MarketProperty[], filters: FilterState): MarketProperty[] {
  return properties.filter((p) => {
    if (filters.bedrooms !== "all") {
      const b = Number(filters.bedrooms);
      if (b === 5) {
        if (p.bedrooms < 5) return false;
      } else if (p.bedrooms !== b) {
        return false;
      }
    }
    if (filters.yearMin && p.yearBuilt < Number(filters.yearMin)) return false;
    if (filters.yearMax && p.yearBuilt > Number(filters.yearMax)) return false;
    if (filters.areaMin && p.squareFootage < Number(filters.areaMin)) return false;
    if (filters.areaMax && p.squareFootage > Number(filters.areaMax)) return false;
    return true;
  });
}

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const { toasts, addToast, removeToast } = useToast();

  const [properties, setProperties] = useState<MarketProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(() =>
    filtersFromParams(new URLSearchParams(window.location.search))
  );
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);

  // Load data on mount
  useEffect(() => {
    let cancelled = false;
    fetchMarketData()
      .then((data) => {
        if (!cancelled) {
          setProperties(data.properties);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          addToast(err instanceof Error ? err.message : "加载市场数据失败", "error");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [addToast]);

  // Sync URL params on mount
  useEffect(() => {
    const params = filtersFromParams(searchParams);
    setFilters(params);
    setAppliedFilters(params);
  }, [searchParams]);

  const filtered = useMemo(
    () => applyFilters(properties, appliedFilters),
    [properties, appliedFilters]
  );

  const stats: MarketStats = useMemo(
    () => computeMarketStats(filtered),
    [filtered]
  );

  const handleApply = useCallback(() => {
    setAppliedFilters(filters);
    const params = new URLSearchParams();
    const p = paramsFromFilters(filters);
    Object.entries(p).forEach(([k, v]) => params.set(k, v));
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
  }, [filters]);

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-ac-green/20 bg-ac-green/5 text-xs text-ac-green font-medium">
          市场洞察
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          市场分析
        </h1>
        <p className="text-slate-500 max-w-xl leading-relaxed">
          基于 ML 模型生成的市场数据，查看价格分布、趋势与假设分析。
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8">
        <KpiCards stats={stats} loading={loading} />
      </div>

      {/* Filter Bar */}
      <div className="mb-8">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onApply={handleApply}
          onReset={handleReset}
        />
      </div>

      {/* Market Charts */}
      <MarketCharts properties={filtered} />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
