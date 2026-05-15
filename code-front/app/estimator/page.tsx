"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { estimatePrice, type EstimateResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from "@/components/ui/toast";
import { ResultPanel } from "@/components/estimator/ResultPanel";
import { HistoryPanel } from "@/components/estimator/HistoryPanel";

const formSchema = z.object({
  square_footage: z.coerce
    .number()
    .min(100, "面积至少 100 平方英尺")
    .max(50000, "面积最大 50,000 平方英尺"),
  bedrooms: z.coerce
    .number()
    .int("必须为整数")
    .min(0, "卧室数至少 0")
    .max(20, "卧室数最大 20"),
  bathrooms: z.coerce
    .number()
    .int("必须为整数")
    .min(0, "卫生间数至少 0")
    .max(20, "卫生间数最大 20"),
  year_built: z.coerce
    .number()
    .int("必须为整数")
    .min(1800, "建造年份至少 1800")
    .max(2100, "建造年份最大 2100"),
  lot_size: z.coerce
    .number()
    .min(0, "地块面积至少 0")
    .max(1000000, "地块面积最大 1,000,000 平方英尺"),
  distance_to_city_center: z.coerce
    .number()
    .min(0, "距离至少 0")
    .max(200, "距离最大 200 英里"),
  school_rating: z.coerce
    .number()
    .int("必须为整数")
    .min(1, "学区评分至少 1")
    .max(10, "学区评分最大 10"),
});

type FormData = z.infer<typeof formSchema>;

const fieldMeta: {
  name: keyof FormData;
  label: string;
  placeholder: string;
  unit?: string;
  step?: string;
}[] = [
  {
    name: "square_footage",
    label: "建筑面积",
    placeholder: "例如: 2500",
    unit: "sq ft",
    step: "1",
  },
  {
    name: "bedrooms",
    label: "卧室数量",
    placeholder: "例如: 3",
    step: "1",
  },
  {
    name: "bathrooms",
    label: "卫生间数量",
    placeholder: "例如: 2",
    step: "1",
  },
  {
    name: "year_built",
    label: "建造年份",
    placeholder: "例如: 2010",
    step: "1",
  },
  {
    name: "lot_size",
    label: "地块面积",
    placeholder: "例如: 8000",
    unit: "sq ft",
    step: "1",
  },
  {
    name: "distance_to_city_center",
    label: "距市中心距离",
    placeholder: "例如: 5.5",
    unit: "miles",
    step: "0.1",
  },
  {
    name: "school_rating",
    label: "学区评分",
    placeholder: "1 - 10",
    step: "1",
  },
];

export default function EstimatorPage() {
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);
  const { toasts, addToast, removeToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as Resolver<FormData>,
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await estimatePrice({
        square_footage: data.square_footage,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        year_built: data.year_built,
        lot_size: data.lot_size,
        distance_to_city_center: data.distance_to_city_center,
        school_rating: data.school_rating,
      });
      setResult(res);
      addToast("预测成功！", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "请求失败，请稍后重试";
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-ac-blue/20 bg-ac-blue/5 text-xs text-ac-blue font-medium">
          ML 驱动预测
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          房产价值估价器
        </h1>
        <p className="text-slate-500 max-w-xl leading-relaxed">
          填写房产详细信息，通过机器学习回归模型获取精准的价格预测。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-6 sm:p-8 animate-fade-in"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-ac-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              房产信息
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fieldMeta.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-slate-400"
                  >
                    {field.label}
                    {field.unit && (
                      <span className="text-slate-600 ml-1">({field.unit})</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      id={field.name}
                      type="number"
                      step={field.step}
                      placeholder={field.placeholder}
                      {...register(field.name)}
                      className={`w-full rounded-lg border bg-dk-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all duration-200 outline-none
                        ${
                          errors[field.name]
                            ? "border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            : "border-dk-500/50 focus:border-ac-blue focus:ring-2 focus:ring-ac-blue/20"
                        }`}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ac-blue to-ac-cyan px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-ac-blue/20 transition-all duration-200 hover:shadow-ac-blue/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    预测中...
                  </>
                ) : (
                  <>
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    获取价格预测
                  </>
                )}
              </button>
              <span className="text-xs text-slate-600">
                 powered by Scikit-learn 回归模型
              </span>
            </div>
          </form>
        </div>

        {/* Result preview */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-6 sm:p-8 animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-ac-cyan"
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
              预测结果
            </h2>

            {result ? (
              <ResultPanel result={result} onSave={() => setHistoryVersion(v => v + 1)} />
            ) : (
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
                      d="M9 7h6m0 3.666V2.5A2.5 2.5 0 006.5 0h0A2.5 2.5 0 004 2.5v14.768a2 2 0 001.508 1.94l4.284 1.07A2 2 0 0011.43 20.6l.568-2.843a2 2 0 011.962-1.607h.08a2 2 0 011.962 1.607l.568 2.843a2 2 0 001.64 1.678l4.284 1.07A2 2 0 0022 17.268V2.5a2.5 2.5 0 00-5 0v8.166M9 11h6M9 15h6"
                    />
                  </svg>
                </div>
                <p className="text-sm text-slate-500">
                  填写左侧表单并提交
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  预测结果将在此显示
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="mt-8">
        <HistoryPanel refreshKey={historyVersion} />
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
