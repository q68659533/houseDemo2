const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8001";
const JAVA_API_URL = process.env.NEXT_PUBLIC_JAVA_API_URL || "http://localhost:8080";

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRIES = 1;

// ── Shared types & errors ──────────────────────────────────────────────────

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface ApiErrorBody {
  detail: string;
  error?: string;
}

export type ApiErrorKind = "http" | "network" | "timeout";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(message: string, kind: ApiErrorKind, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

// ── Shared fetch wrapper ───────────────────────────────────────────────────

export interface ApiFetchOptions {
  timeoutMs?: number;
  retries?: number;
}

async function attempt<T>(
  url: string,
  init: RequestInit | undefined,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...init, signal: controller.signal });

    if (!res.ok) {
      const body: ApiErrorBody = await res
        .json()
        .catch(() => ({ detail: `HTTP ${res.status}` }));
      const message = body.detail || body.error || `HTTP ${res.status}`;
      throw new ApiError(message, "http", res.status);
    }

    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new ApiError("请求超时，请稍后重试", "timeout");
    }
    if (e instanceof TypeError) {
      throw new ApiError("网络连接失败，请检查网络后重试", "network");
    }
    throw new ApiError(
      e instanceof Error ? e.message : "未知错误",
      "network"
    );
  } finally {
    clearTimeout(timer);
  }
}

export async function apiFetch<T>(
  url: string,
  init?: RequestInit,
  options: ApiFetchOptions = {}
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retries = options.retries ?? DEFAULT_RETRIES;

  let lastErr: ApiError | undefined;
  for (let i = 0; i <= retries; i++) {
    try {
      return await attempt<T>(url, init, timeoutMs);
    } catch (e) {
      const err = e as ApiError;
      lastErr = err;
      const retriable =
        err.kind === "http" && err.status !== undefined && err.status >= 500;
      if (!retriable || i === retries) throw err;
    }
  }
  throw lastErr ?? new ApiError("请求失败", "network");
}

// ── Domain types ───────────────────────────────────────────────────────────

export interface PropertyFeatures {
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  distance_to_city_center: number;
  school_rating: number;
}

export interface ModelMetrics {
  r2: number;
  mse: number;
  mae: number;
}

export interface ModelMetadata {
  features: string[];
  coefficients: number[];
  intercept: number;
  metrics: ModelMetrics;
}

export interface EstimateResponse {
  prediction: number;
  features: PropertyFeatures;
  model: ModelMetadata;
  generated_at: string;
}

export interface MarketProperty {
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  lotSize: number;
  distanceToCityCenter: number;
  schoolRating: number;
  predictedPrice: number;
}

export interface MarketDataResponse {
  properties: MarketProperty[];
  count: number;
  generatedAt: string;
}

export interface MarketStats {
  averagePrice: number;
  medianPrice: number;
  count: number;
  pricePerSqft: number;
}

export interface WhatIfPoint {
  parameterValue: number;
  predictedPrice: number;
}

export interface WhatIfResponse {
  parameter: string;
  points: WhatIfPoint[];
}

export type WhatIfParameter =
  | "squareFootage"
  | "bedrooms"
  | "bathrooms"
  | "yearBuilt"
  | "lotSize"
  | "distanceToCityCenter"
  | "schoolRating";

// ── Endpoint wrappers ──────────────────────────────────────────────────────

export function estimatePrice(features: PropertyFeatures): Promise<EstimateResponse> {
  return apiFetch<EstimateResponse>(`${PYTHON_API_URL}/api/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features),
  });
}

export function fetchMarketData(): Promise<MarketDataResponse> {
  return apiFetch<MarketDataResponse>(`${JAVA_API_URL}/api/market/data`);
}

export function fetchWhatIf(
  parameter: WhatIfParameter,
  startValue: number,
  endValue: number,
  steps = 20
): Promise<WhatIfResponse> {
  const url = new URL(`${JAVA_API_URL}/api/market/whatif`);
  url.searchParams.set("parameter", parameter);
  url.searchParams.set("startValue", String(startValue));
  url.searchParams.set("endValue", String(endValue));
  url.searchParams.set("steps", String(steps));
  return apiFetch<WhatIfResponse>(url.toString());
}

// ── Pure helpers ───────────────────────────────────────────────────────────

export function computeMarketStats(properties: MarketProperty[]): MarketStats {
  if (properties.length === 0) {
    return { averagePrice: 0, medianPrice: 0, count: 0, pricePerSqft: 0 };
  }

  const prices = properties.map((p) => p.predictedPrice);
  prices.sort((a, b) => a - b);

  const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  const mid = Math.floor(prices.length / 2);
  const medianPrice =
    prices.length % 2 === 0
      ? (prices[mid - 1] + prices[mid]) / 2
      : prices[mid];

  const totalSqft = properties.reduce((sum, p) => sum + p.squareFootage, 0);
  const pricePerSqft = totalSqft > 0 ? averagePrice / totalSqft : 0;

  return {
    averagePrice,
    medianPrice,
    count: properties.length,
    pricePerSqft,
  };
}
