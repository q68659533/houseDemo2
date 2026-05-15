const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8001";

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

export interface ApiError {
  detail: string;
  error?: string;
}

const JAVA_API_URL = process.env.NEXT_PUBLIC_JAVA_API_URL || "http://localhost:8080";

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

export async function fetchMarketData(): Promise<MarketDataResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${JAVA_API_URL}/api/market/data`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const err: ApiError = await res.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }

    return res.json();
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("请求超时，请稍后重试");
    }
    throw e;
  }
}

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

export async function fetchWhatIf(
  parameter: WhatIfParameter,
  startValue: number,
  endValue: number,
  steps = 20
): Promise<WhatIfResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const url = new URL(`${JAVA_API_URL}/api/market/whatif`);
  url.searchParams.set("parameter", parameter);
  url.searchParams.set("startValue", String(startValue));
  url.searchParams.set("endValue", String(endValue));
  url.searchParams.set("steps", String(steps));

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const err: ApiError = await res.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }

    return res.json();
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("请求超时，请稍后重试");
    }
    throw e;
  }
}

export async function estimatePrice(
  features: PropertyFeatures
): Promise<EstimateResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${PYTHON_API_URL}/api/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const err: ApiError = await res.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }

    return res.json();
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("请求超时，请稍后重试");
    }
    throw e;
  }
}
