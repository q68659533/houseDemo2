"use client";

import { useMemo, useState } from "react";
import type { MarketProperty } from "@/lib/api";
import ExportButtons from "@/components/analysis/ExportButtons";

interface DataTableProps {
  properties: MarketProperty[];
}

type SortKey = keyof MarketProperty;
type SortDir = "asc" | "desc";

interface ColumnDef {
  key: SortKey;
  label: string;
  format: (p: MarketProperty) => string;
  align?: "left" | "right";
}

const PAGE_SIZE = 50;

const columns: ColumnDef[] = [
  {
    key: "squareFootage",
    label: "面积 (sq ft)",
    format: (p) => p.squareFootage.toLocaleString(),
    align: "right",
  },
  {
    key: "bedrooms",
    label: "卧室",
    format: (p) => String(p.bedrooms),
    align: "right",
  },
  {
    key: "bathrooms",
    label: "浴室",
    format: (p) => p.bathrooms.toFixed(1),
    align: "right",
  },
  {
    key: "yearBuilt",
    label: "建造年份",
    format: (p) => String(p.yearBuilt),
    align: "right",
  },
  {
    key: "lotSize",
    label: "占地面积",
    format: (p) => p.lotSize.toLocaleString(),
    align: "right",
  },
  {
    key: "distanceToCityCenter",
    label: "距市中心 (mi)",
    format: (p) => p.distanceToCityCenter.toFixed(1),
    align: "right",
  },
  {
    key: "schoolRating",
    label: "学校评分",
    format: (p) => String(p.schoolRating),
    align: "right",
  },
  {
    key: "predictedPrice",
    label: "预测价格",
    format: (p) => `$${p.predictedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    align: "right",
  },
];

function matchesSearch(p: MarketProperty, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return columns.some((col) => col.format(p).toLowerCase().includes(q));
}

function SortIcon({ dir }: { dir: SortDir | null }) {
  return (
    <span className="inline-flex flex-col ml-1 leading-none text-[0.55rem]">
      <span className={dir === "asc" ? "text-ac-blue" : "text-slate-600"}>▲</span>
      <span className={dir === "desc" ? "text-ac-blue" : "text-slate-600"}>▼</span>
    </span>
  );
}

export default function DataTable({ properties }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("predictedPrice");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return properties.filter((p) => matchesSearch(p, search));
  }, [properties, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const visible = sorted.slice(0, visibleCount);
  const hasMore = sorted.length > visible.length;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div
      className="rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-5 animate-fade-in"
      style={{ animationFillMode: "both" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-300">市场数据明细</h3>
          <p className="text-xs text-slate-500 mt-1">
            共 {properties.length} 条，筛选后 {sorted.length} 条
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <ExportButtons properties={sorted} />
          <div className="relative w-full sm:w-72">
            <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="搜索任意列..."
            className="w-full rounded-lg border border-dk-500/50 bg-dk-900/60 px-3 py-2 pl-9 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
      </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-dk-500/40">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="bg-dk-900/60 text-slate-400">
              {columns.map((col) => {
                const isActive = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    className={`px-3 py-3 font-medium text-xs uppercase tracking-wide select-none cursor-pointer transition-colors hover:text-white ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                    onClick={() => toggleSort(col.key)}
                  >
                    <span className="inline-flex items-center">
                      {col.label}
                      <SortIcon dir={isActive ? sortDir : null} />
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-8 text-center text-slate-500 text-sm"
                >
                  {properties.length === 0 ? "暂无数据" : "未找到匹配的房产"}
                </td>
              </tr>
            ) : (
              visible.map((p, idx) => (
                <tr
                  key={idx}
                  className="border-t border-dk-500/30 text-slate-300 transition-colors hover:bg-dk-700/30"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2.5 whitespace-nowrap ${
                        col.align === "right" ? "text-right" : "text-left"
                      } ${col.key === "predictedPrice" ? "font-semibold text-white" : ""}`}
                    >
                      {col.format(p)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="rounded-lg border border-dk-500/50 px-5 py-2 text-sm text-slate-300 transition-colors hover:text-white hover:border-ac-blue/50 hover:bg-ac-blue/5"
          >
            加载更多 ({sorted.length - visible.length} 剩余)
          </button>
        </div>
      )}
    </div>
  );
}
