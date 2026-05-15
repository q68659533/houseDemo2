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
