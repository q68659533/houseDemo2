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

function StepperInput({
  value,
  onChange,
  placeholder,
  step,
  stepMin,
  stepMax,
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  step: number;
  stepMin?: number;
  stepMax?: number;
  className?: string;
}) {
  const num = value === "" ? null : Number(value);

  const handleStep = (dir: number) => {
    if (num === null) {
      // 空值时，+ 从 stepMin 开始，- 从 stepMax 开始
      const fallback = dir > 0 ? stepMin ?? 0 : stepMax ?? 0;
      onChange(String(fallback));
      return;
    }
    const next = num + dir * step;
    if (stepMin !== undefined && next < stepMin) {
      onChange("");
      return;
    }
    if (stepMax !== undefined && next > stepMax) {
      return;
    }
    onChange(String(next));
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={() => handleStep(-1)}
        className="shrink-0 w-7 h-8 rounded-md border border-dk-500/50 bg-dk-900/60 text-slate-400 text-sm flex items-center justify-center transition-colors hover:text-white hover:border-dk-400/50"
        tabIndex={-1}
      >
        −
      </button>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 rounded-lg border border-dk-500/50 bg-dk-900/60 px-2 py-2 text-sm text-white placeholder-slate-600 transition-all outline-none focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20 text-center"
      />
      <button
        type="button"
        onClick={() => handleStep(1)}
        className="shrink-0 w-7 h-8 rounded-md border border-dk-500/50 bg-dk-900/60 text-slate-400 text-sm flex items-center justify-center transition-colors hover:text-white hover:border-dk-400/50"
        tabIndex={-1}
      >
        +
      </button>
    </div>
  );
}

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
            <StepperInput
              value={filters.yearMin}
              onChange={(v) => update("yearMin", v)}
              placeholder="最早"
              step={1}
              stepMin={2000}
              stepMax={2026}
            />
            <span className="text-slate-500 text-sm">—</span>
            <StepperInput
              value={filters.yearMax}
              onChange={(v) => update("yearMax", v)}
              placeholder="最晚"
              step={1}
              stepMin={2000}
              stepMax={2026}
            />
          </div>
        </div>

        {/* Area Range */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">面积范围 (sq ft)</label>
          <div className="flex items-center gap-2">
            <StepperInput
              value={filters.areaMin}
              onChange={(v) => update("areaMin", v)}
              placeholder="最小"
              step={100}
              stepMin={500}
              stepMax={50000}
            />
            <span className="text-slate-500 text-sm">—</span>
            <StepperInput
              value={filters.areaMax}
              onChange={(v) => update("areaMax", v)}
              placeholder="最大"
              step={100}
              stepMin={500}
              stepMax={50000}
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
