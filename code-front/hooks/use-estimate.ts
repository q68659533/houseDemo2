"use client";

import {
  estimatePrice,
  type EstimateResponse,
  type PropertyFeatures,
} from "@/lib/api";
import { useApi, type UseApiOptions, type UseApiResult } from "@/hooks/use-api";

export interface UseEstimateResult
  extends Omit<UseApiResult<[PropertyFeatures], EstimateResponse>, "execute"> {
  estimate: (features: PropertyFeatures) => Promise<EstimateResponse | null>;
}

/**
 * Hook for the property price estimation endpoint.
 * Caller invokes `estimate(features)`; loading/error/data flow through the hook.
 */
export function useEstimate(options: UseApiOptions = {}): UseEstimateResult {
  const { data, loading, error, execute, reset } = useApi(estimatePrice, options);
  return { data, loading, error, estimate: execute, reset };
}
