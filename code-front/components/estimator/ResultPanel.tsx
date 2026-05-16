"use client";

import { useState, useEffect } from "react";
import { FeatureChart } from "./FeatureChart";
import { saveToHistory } from "@/lib/history";
import type { EstimateResponse } from "@/lib/api";

interface ResultPanelProps {
  result: EstimateResponse;
  onSave?: () => void;
}

const featureLabels: Record<string, string> = {
  square_footage: "建筑面积",
  bedrooms: "卧室数量",
  bathrooms: "卫生间数量",
  year_built: "建造年份",
  lot_size: "地块面积",
  distance_to_city_center: "距市中心距离",
  school_rating: "学区评分",
};

const featureUnits: Record<string, string> = {
  square_footage: "sq ft",
  lot_size: "sq ft",
  distance_to_city_center: "miles",
};

export function ResultPanel({ result, onSave }: ResultPanelProps) {
  const [saved, setSaved] = useState(false);

  // Auto-save on first render when result appears
  useEffect(() => {
    saveToHistory(result.features, result.prediction);
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), 2000);
    onSave?.();
    return () => clearTimeout(timer);
  }, [result]);

  const handleSave = () => {
    saveToHistory(result.features, result.prediction);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSave?.();
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Price Card */}
      <div className="relative rounded-xl p-[1px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ac-blue via-ac-cyan to-ac-blue opacity-60" />
        <div className="relative rounded-xl bg-dk-900/90 p-6 text-center">
          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">预测价格</p>
          <p className="text-4xl font-bold text-white">
            ${result.prediction.toLocaleString()}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            基于 {result.model.features.length} 个特征的线性回归模型
          </p>
        </div>
      </div>

      {/* Property Summary */}
      <div className="rounded-xl border border-dk-500/50 bg-dk-900/50 p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-ac-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          房产信息摘要
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(result.features).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{featureLabels[key] || key}</span>
              <span className="text-white font-medium">
                {value.toLocaleString()}
                {featureUnits[key] && <span className="text-slate-600 ml-1">{featureUnits[key]}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Model Confidence */}
      <div className="rounded-xl border border-dk-500/50 bg-dk-900/50 p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-ac-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          模型置信度
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-dk-500/40 bg-dk-800/50 p-3 text-center">
            <p className="text-xs text-slate-500 mb-0.5">R²</p>
            <p className="text-lg font-semibold text-white">{result.model.metrics.r2.toFixed(4)}</p>
          </div>
          <div className="rounded-lg border border-dk-500/40 bg-dk-800/50 p-3 text-center">
            <p className="text-xs text-slate-500 mb-0.5">MSE</p>
            <p className="text-lg font-semibold text-white">{result.model.metrics.mse.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-dk-500/40 bg-dk-800/50 p-3 text-center">
            <p className="text-xs text-slate-500 mb-0.5">MAE</p>
            <p className="text-lg font-semibold text-white">{result.model.metrics.mae.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Feature Contribution Chart */}
      <div className="rounded-xl border border-dk-500/50 bg-dk-900/50 p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-ac-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          特征贡献分析
        </h3>
        <FeatureChart
          features={result.model.features}
          coefficients={result.model.coefficients}
          featureValues={result.features as unknown as Record<string, number>}
        />
        <p className="text-xs text-slate-600 mt-3 text-center">
          正贡献（蓝色）推高价格，负贡献（红色）拉低价格
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleSave}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
            saved
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-dk-800/60 text-white border border-dk-500/50 hover:bg-dk-700/60 hover:border-dk-500/70"
          }`}
        >
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              已保存
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              保存到历史记录
            </>
          )}
        </button>
        <p className="text-xs text-slate-600">
          生成时间: {new Date(result.generated_at).toLocaleString("zh-CN")}
        </p>
      </div>
    </div>
  );
}
