"use client";

export interface FilterState {
  bedrooms: string;
  yearMin: string;
  yearMax: string;
  areaMin: string;
  areaMax: string;
}

export const defaultFilters: FilterState = {
  bedrooms: "all",
  yearMin: "",
  yearMax: "",
  areaMin: "",
  areaMax: "",
};

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

const bedroomOptions = [
  { value: "all", label: "全部" },
  { value: "1", label: "1 间" },
  { value: "2", label: "2 间" },
  { value: "3", label: "3 间" },
  { value: "4", label: "4 间" },
  { value: "5", label: "5+ 间" },
];

export default function FilterBar({ filters, onChange, onApply, onReset }: FilterBarProps) {
  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-5 animate-fade-in" style={{ animationFillMode: "both" }}>
      <div className="flex flex-wrap items-end gap-4">
        {/* Bedrooms */}
        <div className="space-y-1.5 min-w-[120px]">
          <label className="block text-xs font-medium text-slate-400">卧室数量</label>
          <select
            value={filters.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
            className="w-full rounded-lg border border-dk-500/50 bg-dk-900/60 px-3 py-2 text-sm text-white transition-all outline-none focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20"
          >
            {bedroomOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Range */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">建造年份范围</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="最早"
              value={filters.yearMin}
              onChange={(e) => update("yearMin", e.target.value)}
              className="w-24 rounded-lg border border-dk-500/50 bg-dk-900/60 px-3 py-2 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20"
            />
            <span className="text-slate-500 text-sm">—</span>
            <input
              type="number"
              placeholder="最晚"
              value={filters.yearMax}
              onChange={(e) => update("yearMax", e.target.value)}
              className="w-24 rounded-lg border border-dk-500/50 bg-dk-900/60 px-3 py-2 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20"
            />
          </div>
        </div>

        {/* Area Range */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">面积范围 (sq ft)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="最小"
              value={filters.areaMin}
              onChange={(e) => update("areaMin", e.target.value)}
              className="w-24 rounded-lg border border-dk-500/50 bg-dk-900/60 px-3 py-2 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20"
            />
            <span className="text-slate-500 text-sm">—</span>
            <input
              type="number"
              placeholder="最大"
              value={filters.areaMax}
              onChange={(e) => update("areaMax", e.target.value)}
              className="w-24 rounded-lg border border-dk-500/50 bg-dk-900/60 px-3 py-2 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onReset}
            className="rounded-lg border border-dk-500/50 px-4 py-2 text-sm text-slate-400 transition-colors hover:text-white hover:border-dk-400/50"
          >
            重置
          </button>
          <button
            onClick={onApply}
            className="rounded-lg bg-gradient-to-r from-ac-blue to-ac-cyan px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-ac-blue/20 transition-all hover:shadow-ac-blue/30 hover:-translate-y-0.5"
          >
            应用筛选
          </button>
        </div>
      </div>
    </div>
  );
}
