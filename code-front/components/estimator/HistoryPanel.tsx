"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  type HistoryEntry,
} from "@/lib/history";
import { ComparisonPanel } from "./ComparisonPanel";

interface HistoryPanelProps {
  refreshKey?: number;
}

export function HistoryPanel({ refreshKey = 0 }: HistoryPanelProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const load = useCallback(() => {
    setEntries(getHistory());
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    load();
  };

  const handleClearAll = () => {
    clearHistory();
    setSelectedIds(new Set());
    load();
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedEntries = entries.filter((e) => selectedIds.has(e.id));
  const canSelectMore = selectedIds.size < 3;

  if (entries.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-6 sm:p-8 animate-fade-in"
        style={{ animationDelay: "0.3s", animationFillMode: "both" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-ac-amber"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            历史记录
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dk-900/60 border border-dk-500/30 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-500">暂无历史记录</p>
          <p className="text-xs text-slate-600 mt-1">
            保存的预测结果将显示在这里
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-6 sm:p-8 animate-fade-in"
        style={{ animationDelay: "0.3s", animationFillMode: "both" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-ac-amber"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            历史记录
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-dk-700/60 text-xs text-slate-400 font-normal">
              {entries.length}
            </span>
          </h2>
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            清空全部
          </button>
        </div>

        {/* Selection hint */}
        {selectedIds.size > 0 && selectedIds.size < 2 && (
          <div className="mb-4 rounded-lg border border-ac-blue/20 bg-ac-blue/5 px-4 py-2.5 text-sm text-ac-blue flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            已选择 {selectedIds.size} 项，请再选择至少 1 项进行对比（最多 3 项）
          </div>
        )}
        {selectedIds.size >= 3 && (
          <div className="mb-4 rounded-lg border border-ac-purple/20 bg-ac-purple/5 px-4 py-2.5 text-sm text-ac-purple flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            已选择 3 项，对比面板已就绪。取消选择以更换对比项。
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => {
            const isSelected = selectedIds.has(entry.id);
            const isDisabled = !isSelected && !canSelectMore;

            return (
              <div
                key={entry.id}
                className={`group relative rounded-xl border p-4 transition-colors ${
                  isSelected
                    ? "border-ac-blue/50 bg-dk-900/70"
                    : "border-dk-500/40 bg-dk-900/50 hover:border-dk-500/60"
                }`}
              >
                {/* Checkbox + Delete row */}
                <div className="flex items-center justify-between mb-3">
                  <label
                    className={`inline-flex items-center gap-2 cursor-pointer select-none ${
                      isDisabled ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => toggleSelection(entry.id)}
                      className="w-4 h-4 rounded border-dk-500/50 bg-dk-900/60 text-ac-blue focus:ring-2 focus:ring-ac-blue/20 focus:ring-offset-0 focus:ring-offset-transparent disabled:opacity-40"
                    />
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? "text-ac-blue" : "text-slate-500"
                      }`}
                    >
                      对比
                    </span>
                  </label>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="删除"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-0.5">预测价格</p>
                  <p className="text-xl font-bold text-white">
                    ${entry.prediction.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center rounded-lg bg-dk-800/50 py-2">
                    <p className="text-[10px] text-slate-500 mb-0.5">面积</p>
                    <p className="text-sm font-medium text-slate-300">
                      {entry.features.square_footage.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center rounded-lg bg-dk-800/50 py-2">
                    <p className="text-[10px] text-slate-500 mb-0.5">卧室</p>
                    <p className="text-sm font-medium text-slate-300">
                      {entry.features.bedrooms}
                    </p>
                  </div>
                  <div className="text-center rounded-lg bg-dk-800/50 py-2">
                    <p className="text-[10px] text-slate-500 mb-0.5">卫生间</p>
                    <p className="text-sm font-medium text-slate-300">
                      {entry.features.bathrooms}
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-600">
                  {new Date(entry.timestamp).toLocaleString("zh-CN")}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison panel */}
      {selectedEntries.length >= 2 && (
        <ComparisonPanel entries={selectedEntries} />
      )}
    </div>
  );
}
